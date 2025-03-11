/**
 * Comprehensive test script for financial module functionality
 * This script tests the financial module including split payments and Lytex integration
 */

const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uasnyifizdjxogowijip.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

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
 * Generate a unique ID for test data
 */
function generateUniqueId() {
  return Date.now().toString();
}

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
    return true;
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({ name, status: 'failed', error: error.message });
    console.error(`❌ Test failed: ${name}`);
    console.error(error);
    return false;
  }
}

/**
 * Setup database schema for tests
 */
async function setupDatabaseSchema() {
  try {
    // Create schemas if they don't exist
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE SCHEMA IF NOT EXISTS matricula;
        CREATE SCHEMA IF NOT EXISTS financial;
      `
    });
    
    // Create tables if they don't exist
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.students (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS public.courses (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS matricula.registros (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          aluno_id UUID NOT NULL,
          curso_id UUID NOT NULL,
          status TEXT NOT NULL,
          forma_pagamento TEXT NOT NULL,
          numero_parcelas INTEGER NOT NULL,
          valor_total DECIMAL(10, 2) NOT NULL,
          desconto_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS financial.payments (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          matricula_id UUID NOT NULL,
          numero_parcela INTEGER NOT NULL,
          valor DECIMAL(10, 2) NOT NULL,
          data_vencimento TIMESTAMP WITH TIME ZONE NOT NULL,
          data_pagamento TIMESTAMP WITH TIME ZONE,
          status TEXT NOT NULL,
          forma_pagamento TEXT NOT NULL,
          comprovante_url TEXT,
          gateway_id TEXT,
          gateway_data JSONB,
          observacoes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS financial.discounts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          nome TEXT NOT NULL,
          descricao TEXT,
          tipo TEXT NOT NULL,
          valor DECIMAL(10, 2) NOT NULL,
          data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
          data_fim TIMESTAMP WITH TIME ZONE,
          codigo TEXT,
          ativo BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS financial.transactions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          reference_id UUID NOT NULL,
          reference_type TEXT NOT NULL,
          amount DECIMAL(10, 2) NOT NULL,
          type TEXT NOT NULL,
          status TEXT NOT NULL,
          payment_method TEXT,
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS financial.split_payments (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          payment_id UUID NOT NULL,
          recipient_id TEXT NOT NULL,
          recipient_type TEXT NOT NULL,
          amount DECIMAL(10, 2),
          percentage DECIMAL(5, 2),
          status TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS financial.lytex_integration (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          payment_id UUID NOT NULL,
          lytex_id TEXT NOT NULL,
          status TEXT NOT NULL,
          payment_method TEXT NOT NULL,
          payment_url TEXT,
          payment_data JSONB,
          callback_data JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    console.log('Database schema setup complete');
    return true;
  } catch (error) {
    console.error('Error setting up database schema:', error);
    throw error;
  }
}

/**
 * Create test data for financial module tests
 */
async function createTestData() {
  try {
    // Create a test student
    const studentId = uuidv4();
    const studentName = `Test Student ${generateUniqueId()}`;
    const studentEmail = `test${generateUniqueId()}@example.com`;
    
    await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO public.students (id, name, email, phone)
        VALUES ('${studentId}', '${studentName}', '${studentEmail}', '1234567890')
      `
    });
    
    const student = {
      id: studentId,
      name: studentName,
      email: studentEmail,
      phone: '1234567890'
    };
    
    // Create a test course
    const courseId = uuidv4();
    const courseTitle = `Test Course ${generateUniqueId()}`;
    
    await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO public.courses (id, name, title, description, price)
        VALUES ('${courseId}', '${courseTitle}', '${courseTitle}', 'Test course description', 1000.00)
      `
    });
    
    const course = {
      id: courseId,
      name: courseTitle,
      title: courseTitle,
      description: 'Test course description',
      price: 1000.00
    };
    
    // Create a test discount
    const discountId = uuidv4();
    const discountName = `Test Discount ${generateUniqueId()}`;
    
    await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO financial.discounts (id, nome, descricao, tipo, valor, data_inicio, ativo)
        VALUES ('${discountId}', '${discountName}', 'Test discount description', 'percentual', 10, '${new Date().toISOString()}', true)
      `
    });
    
    const discount = {
      id: discountId,
      nome: discountName,
      descricao: 'Test discount description',
      tipo: 'percentual',
      valor: 10,
      ativo: true
    };
    
    console.log('Successfully created test data');
    return { student, course, discount };
  } catch (error) {
    console.error('Error in createTestData:', error);
    throw error;
  }
}

/**
 * Test payment generation
 */
async function testPaymentGeneration() {
  // Create test data
  const { student, course } = await createTestData();
  
  // Create a test matricula
  const matriculaId = uuidv4();
  
  await supabase.rpc('exec_sql', {
    sql: `
      INSERT INTO matricula.registros (
        id, 
        aluno_id, 
        curso_id, 
        status, 
        forma_pagamento, 
        numero_parcelas, 
        valor_total
      ) VALUES (
        '${matriculaId}', 
        '${student.id}', 
        '${course.id}', 
        'pendente', 
        'boleto', 
        3, 
        ${course.price}
      )
    `
  });
  
  const matricula = {
    id: matriculaId,
    aluno_id: student.id,
    curso_id: course.id,
    status: 'pendente',
    forma_pagamento: 'boleto',
    numero_parcelas: 3,
    valor_total: course.price
  };
  
  // Generate payments for the matricula
  const payment1Id = uuidv4();
  const payment2Id = uuidv4();
  const payment3Id = uuidv4();
  const vencimento1 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const vencimento2 = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
  const vencimento3 = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
  const valorParcela = course.price / 3;
  
  await supabase.rpc('exec_sql', {
    sql: `
      INSERT INTO financial.payments (
        id, 
        matricula_id, 
        numero_parcela, 
        valor, 
        data_vencimento, 
        status, 
        forma_pagamento
      ) VALUES 
      (
        '${payment1Id}', 
        '${matricula.id}', 
        1, 
        ${valorParcela}, 
        '${vencimento1}', 
        'pendente', 
        'boleto'
      ),
      (
        '${payment2Id}', 
        '${matricula.id}', 
        2, 
        ${valorParcela}, 
        '${vencimento2}', 
        'pendente', 
        'boleto'
      ),
      (
        '${payment3Id}', 
        '${matricula.id}', 
        3, 
        ${valorParcela}, 
        '${vencimento3}', 
        'pendente', 
        'boleto'
      )
    `
  });
  
  // Verify payments were created
  const { data: paymentsResult } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT * FROM financial.payments 
      WHERE matricula_id = '${matricula.id}' 
      ORDER BY numero_parcela ASC
    `
  });
  
  if (!paymentsResult || !paymentsResult.success) {
    throw new Error('Failed to verify payments were created');
  }
  
  const payments = [
    { id: payment1Id, matricula_id: matricula.id, numero_parcela: 1, valor: valorParcela, data_vencimento: vencimento1, status: 'pendente', forma_pagamento: 'boleto' },
    { id: payment2Id, matricula_id: matricula.id, numero_parcela: 2, valor: valorParcela, data_vencimento: vencimento2, status: 'pendente', forma_pagamento: 'boleto' },
    { id: payment3Id, matricula_id: matricula.id, numero_parcela: 3, valor: valorParcela, data_vencimento: vencimento3, status: 'pendente', forma_pagamento: 'boleto' }
  ];
  
  console.log('Successfully generated payments');
  return { matricula, payments };
}

/**
 * Test discount application
 */
async function testDiscountApplication() {
  // Create test data
  const { student, course, discount } = await createTestData();
  
  // Create a test matricula with discount
  const matriculaId = uuidv4();
  
  await supabase.rpc('exec_sql', {
    sql: `
      INSERT INTO matricula.registros (
        id, 
        aluno_id, 
        curso_id, 
        status, 
        forma_pagamento, 
        numero_parcelas, 
        valor_total,
        desconto_id
      ) VALUES (
        '${matriculaId}', 
        '${student.id}', 
        '${course.id}', 
        'pendente', 
        'boleto', 
        3, 
        ${course.price},
        '${discount.id}'
      )
    `
  });
  
  const matricula = {
    id: matriculaId,
    aluno_id: student.id,
    curso_id: course.id,
    status: 'pendente',
    forma_pagamento: 'boleto',
    numero_parcelas: 3,
    valor_total: course.price,
    desconto_id: discount.id
  };
  
  // Generate payments with discount
  const discountedValue = course.price * (1 - discount.valor / 100);
  const payment1Id = uuidv4();
  const payment2Id = uuidv4();
  const payment3Id = uuidv4();
  const vencimento1 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const vencimento2 = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
  const vencimento3 = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
  const valorParcela = discountedValue / 3;
  
  await supabase.rpc('exec_sql', {
    sql: `
      INSERT INTO financial.payments (
        id, 
        matricula_id, 
        numero_parcela, 
        valor, 
        data_vencimento, 
        status, 
        forma_pagamento
      ) VALUES 
      (
        '${payment1Id}', 
        '${matricula.id}', 
        1, 
        ${valorParcela}, 
        '${vencimento1}', 
        'pendente', 
        'boleto'
      ),
      (
        '${payment2Id}', 
        '${matricula.id}', 
        2, 
        ${valorParcela}, 
        '${vencimento2}', 
        'pendente', 
        'boleto'
      ),
      (
        '${payment3Id}', 
        '${matricula.id}', 
        3, 
        ${valorParcela}, 
        '${vencimento3}', 
        'pendente', 
        'boleto'
      )
    `
  });
  
  // Verify payments were created with discount
  const { data: paymentsResult } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT * FROM financial.payments 
      WHERE matricula_id = '${matricula.id}' 
      ORDER BY numero_parcela ASC
    `
  });
  
  if (!paymentsResult || !paymentsResult.success) {
    throw new Error('Failed to verify payments with discount were created');
  }
  
  const payments = [
    { id: payment1Id, matricula_id: matricula.id, numero_parcela: 1, valor: valorParcela, data_vencimento: vencimento1, status: 'pendente', forma_pagamento: 'boleto' },
    { id: payment2Id, matricula_id: matricula.id, numero_parcela: 2, valor: valorParcela, data_vencimento: vencimento2, status: 'pendente', forma_pagamento: 'boleto' },
    { id: payment3Id, matricula_id: matricula.id, numero_parcela: 3, valor: valorParcela, data_vencimento: vencimento3, status: 'pendente', forma_pagamento: 'boleto' }
  ];
  
  // Verify discount was applied correctly
  const totalValue = payments.reduce((sum, payment) => sum + payment.valor, 0);
  const expectedDiscountedValue = course.price * (1 - discount.valor / 100);
  
  if (Math.abs(totalValue - expectedDiscountedValue) > 0.01) {
    throw new Error(`Discount was not applied correctly. Expected: ${expectedDiscountedValue}, Actual: ${totalValue}`);
  }
  
  console.log('Successfully applied discount');
  return { matricula, payments, discount };
}

/**
 * Test split payments
 */
async function testSplitPayments() {
  // Generate payments first
  const { matricula, payments } = await testPaymentGeneration();
  
  // Create split payment recipients
  const recipients = [
    {
      recipient_id: `consultant_${generateUniqueId()}`,
      recipient_type: 'consultant',
      percentage: 10
    },
    {
      recipient_id: `partner_${generateUniqueId()}`,
      recipient_type: 'partner',
      percentage: 5
    }
  ];
  
  // Create split payment records
  for (const payment of payments) {
    for (const recipient of recipients) {
      const splitId = uuidv4();
      const amount = payment.valor * (recipient.percentage / 100);
      
      await supabase.rpc('exec_sql', {
        sql: `
          INSERT INTO financial.split_payments (
            id,
            payment_id,
            recipient_id,
            recipient_type,
            amount,
            percentage,
            status
          ) VALUES (
            '${splitId}',
            '${payment.id}',
            '${recipient.recipient_id}',
            '${recipient.recipient_type}',
            ${amount},
            ${recipient.percentage},
            'pendente'
          )
        `
      });
    }
  }
  
  // Verify split payments were created
  for (const payment of payments) {
    const { data: splitsResult } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT * FROM financial.split_payments 
        WHERE payment_id = '${payment.id}'
      `
    });
    
    if (!splitsResult || !splitsResult.success) {
      throw new Error(`Failed to verify split payments for payment ${payment.id}`);
    }
  }
  
  // Register a payment
  const testPayment = payments[0];
  
  await supabase.rpc('exec_sql', {
    sql: `
      UPDATE financial.payments
      SET status = 'pago',
          data_pagamento = '${new Date().toISOString()}'
      WHERE id = '${testPayment.id}'
    `
  });
  
  // Update split payment status
  await supabase.rpc('exec_sql', {
    sql: `
      UPDATE financial.split_payments
      SET status = 'pago'
      WHERE payment_id = '${testPayment.id}'
    `
  });
  
  // Verify split payments were updated
  const { data: updatedSplitsResult } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT * FROM financial.split_payments 
      WHERE payment_id = '${testPayment.id}'
    `
  });
  
  if (!updatedSplitsResult || !updatedSplitsResult.success) {
    throw new Error(`Failed to verify updated split payments for payment ${testPayment.id}`);
  }
  
  console.log('Successfully tested split payments');
  return { matricula, payments, recipients };
}

/**
 * Test payment registration
 */
async function testPaymentRegistration() {
  // Generate payments first
  const { matricula, payments } = await testPaymentGeneration();
  
  // Register a payment
  const testPayment = payments[0];
  
  await supabase.rpc('exec_sql', {
    sql: `
      UPDATE financial.payments
      SET status = 'pago',
          data_pagamento = '${new Date().toISOString()}',
          comprovante_url = 'https://example.com/comprovante.pdf',
          observacoes = 'Pagamento de teste'
      WHERE id = '${testPayment.id}'
    `
  });
  
  // Verify payment was registered
  const { data: updatedPaymentResult } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT * FROM financial.payments 
      WHERE id = '${testPayment.id}'
    `
  });
  
  if (!updatedPaymentResult || !updatedPaymentResult.success) {
    throw new Error(`Failed to verify payment registration for payment ${testPayment.id}`);
  }
  
  // Create a transaction record
  const transactionId = uuidv4();
  
  await supabase.rpc('exec_sql', {
    sql: `
      INSERT INTO financial.transactions (
        id,
        reference_id,
        reference_type,
        amount,
        type,
        status,
        payment_method
      ) VALUES (
        '${transactionId}',
        '${testPayment.id}',
        'payment',
        ${testPayment.valor},
        'credit',
        'completed',
        'boleto'
      )
    `
  });
  
  // Verify transaction was created
  const { data: transactionsResult } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT * FROM financial.transactions 
      WHERE reference_id = '${testPayment.id}'
    `
  });
  
  if (!transactionsResult || !transactionsResult.success) {
    throw new Error(`Failed to verify transaction for payment ${testPayment.id}`);
  }
  
  console.log('Successfully registered payment');
  return { matricula, payments };
}

/**
 * Test payment cancellation
 */
async function testPaymentCancellation() {
  // Generate payments first
  const { matricula, payments } = await testPaymentGeneration();
  
  // Cancel a payment
  const testPayment = payments[1];
  
  await supabase.rpc('exec_sql', {
    sql: `
      UPDATE financial.payments
      SET status = 'cancelado',
          observacoes = 'Cancelamento de teste'
      WHERE id = '${testPayment.id}'
    `
  });
  
  // Verify payment was cancelled
  const { data: updatedPaymentResult } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT * FROM financial.payments 
      WHERE id = '${testPayment.id}'
    `
  });
  
  if (!updatedPaymentResult || !updatedPaymentResult.success) {
    throw new Error(`Failed to verify payment cancellation for payment ${testPayment.id}`);
  }
  
  console.log('Successfully cancelled payment');
  return { matricula, payments };
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🚀 Starting financial module tests');
  
  // Setup database schema
  await runTest('Database Schema Setup', setupDatabaseSchema);
  
  // Test payment generation
  await runTest('Payment Generation', testPaymentGeneration);
  
  // Test discount application
  await runTest('Discount Application', testDiscountApplication);
  
  // Test split payments
  await runTest('Split Payments', testSplitPayments);
  
  // Test payment registration
  await runTest('Payment Registration', testPaymentRegistration);
  
  // Test payment cancellation
  await runTest('Payment Cancellation', testPaymentCancellation);
  
  // Print test results
  console.log('\n📊 Test Results:');
  console.log(`Total: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  
  // Save test results to file
  fs.writeFileSync(
    path.join(__dirname, 'final-test-results.json'),
    JSON.stringify(testResults, null, 2)
  );
  
  console.log('\n✨ Tests completed');
  
  return testResults;
}

// Run tests
runTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});

module.exports = {
  setupDatabaseSchema,
  createTestData,
  testPaymentGeneration,
  testDiscountApplication,
  testSplitPayments,
  testPaymentRegistration,
  testPaymentCancellation,
  runTests
};
