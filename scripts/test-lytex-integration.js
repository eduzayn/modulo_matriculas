/**
 * Test script for Lytex payment gateway integration
 * This script tests the integration with Lytex payment gateway
 * including split payments and webhook handling
 */

const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const crypto = require('crypto');

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Lytex API configuration
const LYTEX_API_URL = 'https://api.lytex.com.br/v2';
const LYTEX_CLIENT_ID = process.env.LYTEX_CLIENT_ID;
const LYTEX_CLIENT_SECRET = process.env.LYTEX_CLIENT_SECRET;
const LYTEX_WEBHOOK_SECRET = process.env.LYTEX_WEBHOOK_SECRET;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Test results
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: []
};

/**
 * Run a test and record the result
 */
async function runTest(name, testFn) {
  testResults.total++;
  console.log(`\n🧪 Running test: ${name}`);
  
  try {
    await testFn();
    testResults.passed++;
    testResults.tests.push({ name, status: 'passed' });
    console.log(`✅ Test passed: ${name}`);
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({ name, status: 'failed', error: error.message });
    console.error(`❌ Test failed: ${name}`);
    console.error(error);
  }
}

/**
 * Get Lytex API token
 */
async function getLytexToken() {
  const response = await fetch(`${LYTEX_API_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: LYTEX_CLIENT_ID,
      client_secret: LYTEX_CLIENT_SECRET
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get token: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.access_token;
}

/**
 * Create a test payment in the database
 */
async function createTestPayment() {
  // Create a test student
  const { data: student, error: studentError } = await supabase
    .from('students')
    .insert({
      name: `Test Student ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      phone: '1234567890',
      document: `${Date.now()}`
    })
    .select()
    .single();
  
  if (studentError) {
    throw new Error(`Failed to create test student: ${studentError.message}`);
  }
  
  // Create a test course
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .insert({
      name: `Test Course ${Date.now()}`,
      title: `Test Course ${Date.now()}`,
      description: 'Test course description',
      price: 1000.00
    })
    .select()
    .single();
  
  if (courseError) {
    throw new Error(`Failed to create test course: ${courseError.message}`);
  }
  
  // Create a test matricula
  const { data: matricula, error: matriculaError } = await supabase
    .from('matricula.registros')
    .insert({
      aluno_id: student.id,
      curso_id: course.id,
      status: 'pendente',
      forma_pagamento: 'boleto',
      numero_parcelas: 3,
      valor_total: course.price
    })
    .select()
    .single();
  
  if (matriculaError) {
    throw new Error(`Failed to create test matricula: ${matriculaError.message}`);
  }
  
  // Create a test payment
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);
  
  const { data: payment, error: paymentError } = await supabase
    .from('financial.payments')
    .insert({
      matricula_id: matricula.id,
      numero_parcela: 1,
      valor: course.price / 3,
      data_vencimento: dueDate.toISOString(),
      status: 'pendente',
      forma_pagamento: 'boleto'
    })
    .select()
    .single();
  
  if (paymentError) {
    throw new Error(`Failed to create test payment: ${paymentError.message}`);
  }
  
  return {
    student,
    course,
    matricula,
    payment
  };
}

/**
 * Create a test split payment configuration
 */
async function createTestSplitConfig(paymentId) {
  // Create test recipients
  const recipients = [
    {
      recipient_id: `consultant_${Date.now()}`,
      recipient_type: 'consultant',
      percentage: 10
    },
    {
      recipient_id: `partner_${Date.now()}`,
      recipient_type: 'partner',
      percentage: 5
    }
  ];
  
  // Create split payment configuration
  const { data: splits, error: splitError } = await supabase
    .from('financial.split_payments')
    .insert(
      recipients.map(recipient => ({
        payment_id: paymentId,
        recipient_id: recipient.recipient_id,
        recipient_type: recipient.recipient_type,
        percentage: recipient.percentage,
        status: 'pendente'
      }))
    )
    .select();
  
  if (splitError) {
    throw new Error(`Failed to create test split configuration: ${splitError.message}`);
  }
  
  return splits;
}

/**
 * Create a webhook signature
 */
function createWebhookSignature(payload) {
  const { signature, ...payloadWithoutSignature } = payload;
  const stringToSign = JSON.stringify(payloadWithoutSignature);
  const hmac = crypto.createHmac('sha256', LYTEX_WEBHOOK_SECRET);
  hmac.update(stringToSign);
  return hmac.digest('hex');
}

/**
 * Create a test webhook payload
 */
function createTestWebhookPayload(event, data) {
  const payload = {
    event,
    data,
    timestamp: Date.now()
  };
  
  payload.signature = createWebhookSignature(payload);
  return payload;
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🚀 Starting Lytex integration tests');
  
  // Test Lytex API token
  await runTest('Get Lytex API token', async () => {
    const token = await getLytexToken();
    if (!token) {
      throw new Error('Failed to get Lytex API token');
    }
  });
  
  // Test creating a payment
  let testData;
  await runTest('Create test payment', async () => {
    testData = await createTestPayment();
    if (!testData.payment) {
      throw new Error('Failed to create test payment');
    }
  });
  
  // Test creating split payment configuration
  await runTest('Create split payment configuration', async () => {
    const splits = await createTestSplitConfig(testData.payment.id);
    if (!splits || splits.length !== 2) {
      throw new Error('Failed to create split payment configuration');
    }
  });
  
  // Test webhook signature verification
  await runTest('Verify webhook signature', async () => {
    const payload = createTestWebhookPayload('payment.created', {
      id: 'test_payment_id',
      external_reference: testData.payment.id,
      status: 'pending'
    });
    
    const originalSignature = payload.signature;
    payload.signature = 'invalid_signature';
    
    const invalidSignature = payload.signature !== originalSignature;
    if (!invalidSignature) {
      throw new Error('Webhook signature verification failed');
    }
    
    payload.signature = originalSignature;
    const validSignature = payload.signature === originalSignature;
    if (!validSignature) {
      throw new Error('Webhook signature verification failed');
    }
  });
  
  // Test webhook handler for payment.created event
  await runTest('Handle payment.created webhook', async () => {
    const payload = createTestWebhookPayload('payment.created', {
      id: 'test_payment_id',
      external_reference: testData.payment.id,
      status: 'pending'
    });
    
    // Create Lytex integration record
    const { error: integrationError } = await supabase
      .from('financial.lytex_integration')
      .insert({
        payment_id: testData.payment.id,
        lytex_id: 'test_payment_id',
        status: 'pending',
        payment_method: 'boleto'
      });
    
    if (integrationError) {
      throw new Error(`Failed to create Lytex integration record: ${integrationError.message}`);
    }
    
    // Simulate webhook call
    const { data: integration, error: getError } = await supabase
      .from('financial.lytex_integration')
      .select('*')
      .eq('lytex_id', 'test_payment_id')
      .single();
    
    if (getError || !integration) {
      throw new Error('Failed to get Lytex integration record');
    }
  });
  
  // Test webhook handler for payment.approved event
  await runTest('Handle payment.approved webhook', async () => {
    const payload = createTestWebhookPayload('payment.approved', {
      id: 'test_payment_id',
      external_reference: testData.payment.id,
      status: 'paid'
    });
    
    // Update payment status
    const { error: updateError } = await supabase
      .from('financial.payments')
      .update({
        status: 'pago',
        data_pagamento: new Date().toISOString()
      })
      .eq('id', testData.payment.id);
    
    if (updateError) {
      throw new Error(`Failed to update payment status: ${updateError.message}`);
    }
    
    // Update Lytex integration record
    const { error: integrationError } = await supabase
      .from('financial.lytex_integration')
      .update({
        status: 'paid',
        callback_data: payload.data
      })
      .eq('lytex_id', 'test_payment_id');
    
    if (integrationError) {
      throw new Error(`Failed to update Lytex integration record: ${integrationError.message}`);
    }
    
    // Update split payments status
    const { error: splitError } = await supabase
      .from('financial.split_payments')
      .update({
        status: 'pago'
      })
      .eq('payment_id', testData.payment.id);
    
    if (splitError) {
      throw new Error(`Failed to update split payments status: ${splitError.message}`);
    }
    
    // Verify payment status
    const { data: payment, error: getError } = await supabase
      .from('financial.payments')
      .select('*')
      .eq('id', testData.payment.id)
      .single();
    
    if (getError || !payment) {
      throw new Error('Failed to get payment');
    }
    
    if (payment.status !== 'pago') {
      throw new Error(`Payment status not updated correctly: ${payment.status}`);
    }
  });
  
  // Print test results
  console.log('\n📊 Test Results:');
  console.log(`Total: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  
  // Save test results to file
  const fs = require('fs');
  fs.writeFileSync(
    './tests/matricula/lytex-integration-test-results.json',
    JSON.stringify(testResults, null, 2)
  );
  
  console.log('\n✨ Tests completed');
}

// Run the tests
runTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
