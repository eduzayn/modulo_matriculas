/**
 * Test script for financial module functionality
 * This script tests the financial module including split payments and Lytex integration
 */

const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

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
 * Create test data for financial module tests
 */
async function createTestData() {
  try {
    // Create a test student using RPC
    const studentId = uuidv4();
    const studentName = `Test Student ${generateUniqueId()}`;
    const studentEmail = `test${generateUniqueId()}@example.com`;
    
    const { error: studentError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO public.students (id, name, email, phone)
        VALUES ('${studentId}', '${studentName}', '${studentEmail}', '1234567890')
      `
    });
    
    if (studentError) {
      throw new Error(`Failed to create test student: ${studentError.message}`);
    }
    
    const student = {
      id: studentId,
      name: studentName,
      email: studentEmail,
      phone: '1234567890'
    };
    
    // Create a test course using RPC
    const courseId = uuidv4();
    const courseTitle = `Test Course ${generateUniqueId()}`;
    
    const { error: courseError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO public.courses (id, name, title, description, price)
        VALUES ('${courseId}', '${courseTitle}', '${courseTitle}', 'Test course description', 1000.00)
      `
    });
    
    if (courseError) {
      throw new Error(`Failed to create test course: ${courseError.message}`);
    }
    
    const course = {
      id: courseId,
      name: courseTitle,
      title: courseTitle,
      description: 'Test course description',
      price: 1000.00
    };
    
    // Create a test discount using RPC
    const discountId = uuidv4();
    const discountName = `Test Discount ${generateUniqueId()}`;
    
    const { error: discountError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO financial.discounts (id, nome, descricao, tipo, valor, data_inicio, ativo)
        VALUES ('${discountId}', '${discountName}', 'Test discount description', 'percentual', 10, '${new Date().toISOString()}', true)
      `
    });
    
    if (discountError) {
      throw new Error(`Failed to create test discount: ${discountError.message}`);
    }
    
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
 * Test database schema consistency
 */
async function testDatabaseSchema() {
  try {
    // Use RPC to check if financial schema exists
    const { data: schemaResult, error: schemaError } = await supabase.rpc('exec_sql', {
      sql: "SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'financial'"
    });
    
    if (schemaError) {
      throw new Error(`Failed to check financial schema: ${schemaError.message}`);
    }
    
    // Create financial schema if it doesn't exist
    const { error: createSchemaError } = await supabase.rpc('exec_sql', {
      sql: "CREATE SCHEMA IF NOT EXISTS financial"
    });
    
    if (createSchemaError) {
      throw new Error(`Failed to create financial schema: ${createSchemaError.message}`);
    }
    
    // Check if required tables exist and create them if they don't
    const requiredTables = [
      'payments',
      'discounts',
      'transactions',
      'split_payments',
      'lytex_integration'
    ];
    
    for (const table of requiredTables) {
      // Check if table exists
      const { data: tableResult, error: tableError } = await supabase.rpc('exec_sql', {
        sql: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'financial' AND table_name = '${table}'`
      });
      
      if (tableError) {
        console.warn(`Warning: Failed to check table ${table}: ${tableError.message}`);
      }
      
      // Create tables if they don't exist
      let createTableSql = '';
      
      switch (table) {
        case 'payments':
          createTableSql = `
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
            )
          `;
          break;
          
        case 'discounts':
          createTableSql = `
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
            )
          `;
          break;
          
        case 'transactions':
          createTableSql = `
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
            )
          `;
          break;
          
        case 'split_payments':
          createTableSql = `
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
            )
          `;
          break;
          
        case 'lytex_integration':
          createTableSql = `
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
            )
          `;
          break;
      }
      
      if (createTableSql) {
        const { error: createTableError } = await supabase.rpc('exec_sql', {
          sql: createTableSql
        });
        
        if (createTableError) {
          console.warn(`Warning: Failed to create table ${table}: ${createTableError.message}`);
        } else {
          console.log(`Created or verified table financial.${table}`);
        }
      }
    }
    
    console.log('All required financial schema tables exist or were created');
    return true;
  } catch (error) {
    console.error('Error in testDatabaseSchema:', error);
    throw error;
  }
}

/**
 * Test payment generation
 */
async function testPaymentGeneration() {
  // Create test data
  const { student, course } = await createTestData();
  
  // Create a test matricula using RPC
  const matriculaId = uuidv4();
  
  const { error: matriculaError } = await supabase.rpc('exec_sql', {
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
  
  if (matriculaError) {
    throw new Error(`Failed to create test matricula: ${matriculaError.message}`);
  }
  
  const matricula = {
    id: matriculaId,
    aluno_id: student.id,
    curso_id: course.id,
    status: 'pendente',
    forma_pagamento: 'boleto',
    numero_parcelas: 3,
    valor_total: course.price
  };
  
  // Generate payments
  const dataVencimento = new Date();
  dataVencimento.setDate(dataVencimento.getDate() + 7);
  
  const { error: generateError } = await supabase.rpc('exec_sql', {
    sql: `
      DO $$
      DECLARE
        v_parcelas INTEGER := 3;
        v_valor_total DECIMAL := ${course.price};
        v_valor_parcela DECIMAL := v_valor_total / v_parcelas;
        v_data_vencimento DATE := '${dataVencimento.toISOString().split('T')[0]}';
        v_i INTEGER;
      BEGIN
        FOR v_i IN 1..v_parcelas LOOP
          INSERT INTO financial.payments (
            matricula_id,
            numero_parcela,
            valor,
            data_vencimento,
            status,
            forma_pagamento
          ) VALUES (
            '${matricula.id}',
            v_i,
            v_valor_parcela,
            v_data_vencimento + ((v_i - 1) * INTERVAL '1 month'),
            'pendente',
            'boleto'
          );
        END LOOP;
      END $$;
    `
  });
  
  if (generateError) {
    throw new Error(`Failed to generate payments: ${generateError.message}`);
  }
  
  // Verify payments were created
  const { data: payments, error: paymentsError } = await supabase
    .from('financial.payments')
    .select('*')
    .eq('matricula_id', matricula.id);
  
  if (paymentsError) {
    throw new Error(`Failed to fetch payments: ${paymentsError.message}`);
  }
  
  if (!payments || payments.length !== 3) {
    throw new Error(`Expected 3 payments, got ${payments ? payments.length : 0}`);
  }
  
  console.log(`Successfully generated ${payments.length} payments for matricula ${matricula.id}`);
  
  return { matricula, payments };
}

/**
 * Test discount application
 */
async function testDiscountApplication() {
  // Create test data
  const { student, course, discount } = await createTestData();
  
  // Create a test matricula with discount using RPC
  const matriculaId = uuidv4();
  
  const { error: matriculaError } = await supabase.rpc('exec_sql', {
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
  
  if (matriculaError) {
    throw new Error(`Failed to create test matricula with discount: ${matriculaError.message}`);
  }
  
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
  const dataVencimento = new Date();
  dataVencimento.setDate(dataVencimento.getDate() + 7);
  
  // Calculate discounted value
  const valorComDesconto = course.price * (1 - discount.valor / 100);
  const valorParcela = valorComDesconto / 3;
  
  const { error: generateError } = await supabase.rpc('exec_sql', {
    sql: `
      DO $$
      DECLARE
        v_parcelas INTEGER := 3;
        v_valor_total DECIMAL := ${valorComDesconto};
        v_valor_parcela DECIMAL := v_valor_total / v_parcelas;
        v_data_vencimento DATE := '${dataVencimento.toISOString().split('T')[0]}';
        v_i INTEGER;
      BEGIN
        FOR v_i IN 1..v_parcelas LOOP
          INSERT INTO financial.payments (
            matricula_id,
            numero_parcela,
            valor,
            data_vencimento,
            status,
            forma_pagamento
          ) VALUES (
            '${matricula.id}',
            v_i,
            v_valor_parcela,
            v_data_vencimento + ((v_i - 1) * INTERVAL '1 month'),
            'pendente',
            'boleto'
          );
        END LOOP;
      END $$;
    `
  });
  
  if (generateError) {
    throw new Error(`Failed to generate payments with discount: ${generateError.message}`);
  }
  
  // Verify payments were created with discount
  const { data: payments, error: paymentsError } = await supabase
    .from('financial.payments')
    .select('*')
    .eq('matricula_id', matricula.id);
  
  if (paymentsError) {
    throw new Error(`Failed to fetch payments with discount: ${paymentsError.message}`);
  }
  
  if (!payments || payments.length !== 3) {
    throw new Error(`Expected 3 payments with discount, got ${payments ? payments.length : 0}`);
  }
  
  // Verify discount was applied correctly
  const totalValue = payments.reduce((sum, payment) => sum + payment.valor, 0);
  const expectedValue = valorComDesconto;
  
  if (Math.abs(totalValue - expectedValue) > 0.01) {
    throw new Error(`Discount not applied correctly. Expected total: ${expectedValue}, got: ${totalValue}`);
  }
  
  console.log(`Successfully applied ${discount.valor}% discount to payments for matricula ${matricula.id}`);
  
  return { matricula, payments, discount };
}

/**
 * Test split payment functionality
 */
async function testSplitPayments() {
  // Create test data for split payments
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
      const amount = payment.valor * (recipient.percentage / 100);
      
      const { error: splitError } = await supabase
        .from('financial.split_payments')
        .insert({
          payment_id: payment.id,
          recipient_id: recipient.recipient_id,
          recipient_type: recipient.recipient_type,
          amount: amount,
          percentage: recipient.percentage,
          status: 'pendente'
        });
      
      if (splitError) {
        throw new Error(`Failed to create split payment: ${splitError.message}`);
      }
    }
  }
  
  // Verify split payments were created
  const { data: splits, error: splitsError } = await supabase
    .from('financial.split_payments')
    .select('*')
    .in('payment_id', payments.map(p => p.id));
  
  if (splitsError) {
    throw new Error(`Failed to fetch split payments: ${splitsError.message}`);
  }
  
  const expectedSplits = payments.length * recipients.length;
  if (!splits || splits.length !== expectedSplits) {
    throw new Error(`Expected ${expectedSplits} split payments, got ${splits ? splits.length : 0}`);
  }
  
  console.log(`Successfully created ${splits.length} split payments for ${payments.length} payments`);
  
  // Test updating split payment status when payment is registered
  const testPayment = payments[0];
  
  // Register payment
  const { error: registerError } = await supabase
    .from('financial.payments')
    .update({
      status: 'pago',
      data_pagamento: new Date().toISOString()
    })
    .eq('id', testPayment.id);
  
  if (registerError) {
    throw new Error(`Failed to register payment: ${registerError.message}`);
  }
  
  // Update split payments status
  const { error: updateSplitsError } = await supabase
    .from('financial.split_payments')
    .update({
      status: 'pago'
    })
    .eq('payment_id', testPayment.id);
  
  if (updateSplitsError) {
    throw new Error(`Failed to update split payments status: ${updateSplitsError.message}`);
  }
  
  // Verify split payments status was updated
  const { data: updatedSplits, error: updatedSplitsError } = await supabase
    .from('financial.split_payments')
    .select('*')
    .eq('payment_id', testPayment.id);
  
  if (updatedSplitsError) {
    throw new Error(`Failed to fetch updated split payments: ${updatedSplitsError.message}`);
  }
  
  const allPaid = updatedSplits.every(split => split.status === 'pago');
  if (!allPaid) {
    throw new Error('Not all split payments were updated to paid status');
  }
  
  console.log(`Successfully updated split payments status for payment ${testPayment.id}`);
  
  return { matricula, payments, splits };
}

/**
 * Test payment registration
 */
async function testPaymentRegistration() {
  // Create test data
  const { matricula, payments } = await testPaymentGeneration();
  
  // Register a payment
  const testPayment = payments[0];
  
  const { error: registerError } = await supabase
    .from('financial.payments')
    .update({
      status: 'pago',
      data_pagamento: new Date().toISOString(),
      comprovante_url: 'https://example.com/comprovante.pdf',
      observacoes: 'Pagamento de teste'
    })
    .eq('id', testPayment.id);
  
  if (registerError) {
    throw new Error(`Failed to register payment: ${registerError.message}`);
  }
  
  // Verify payment was registered
  const { data: updatedPayment, error: updatedPaymentError } = await supabase
    .from('financial.payments')
    .select('*')
    .eq('id', testPayment.id)
    .single();
  
  if (updatedPaymentError) {
    throw new Error(`Failed to fetch updated payment: ${updatedPaymentError.message}`);
  }
  
  if (updatedPayment.status !== 'pago') {
    throw new Error(`Payment status not updated correctly. Expected: pago, got: ${updatedPayment.status}`);
  }
  
  // Create transaction record
  const { error: transactionError } = await supabase
    .from('financial.transactions')
    .insert({
      reference_id: testPayment.id,
      reference_type: 'matricula_pagamento',
      amount: testPayment.valor,
      type: 'income',
      status: 'completed',
      payment_method: testPayment.forma_pagamento,
      metadata: {
        matricula_id: matricula.id,
        comprovante_url: 'https://example.com/comprovante.pdf',
        observacoes: 'Pagamento de teste'
      }
    });
  
  if (transactionError) {
    throw new Error(`Failed to create transaction record: ${transactionError.message}`);
  }
  
  // Verify transaction was created
  const { data: transactions, error: transactionsError } = await supabase
    .from('financial.transactions')
    .select('*')
    .eq('reference_id', testPayment.id);
  
  if (transactionsError) {
    throw new Error(`Failed to fetch transactions: ${transactionsError.message}`);
  }
  
  if (!transactions || transactions.length === 0) {
    throw new Error('Transaction record not created');
  }
  
  console.log(`Successfully registered payment ${testPayment.id} and created transaction record`);
  
  return { matricula, payment: updatedPayment, transaction: transactions[0] };
}

/**
 * Test payment cancellation
 */
async function testPaymentCancellation() {
  // Create test data
  const { matricula, payments } = await testPaymentGeneration();
  
  // Cancel a payment
  const testPayment = payments[1];
  
  const { error: cancelError } = await supabase
    .from('financial.payments')
    .update({
      status: 'cancelado',
      observacoes: 'Cancelamento de teste'
    })
    .eq('id', testPayment.id);
  
  if (cancelError) {
    throw new Error(`Failed to cancel payment: ${cancelError.message}`);
  }
  
  // Verify payment was cancelled
  const { data: updatedPayment, error: updatedPaymentError } = await supabase
    .from('financial.payments')
    .select('*')
    .eq('id', testPayment.id)
    .single();
  
  if (updatedPaymentError) {
    throw new Error(`Failed to fetch updated payment: ${updatedPaymentError.message}`);
  }
  
  if (updatedPayment.status !== 'cancelado') {
    throw new Error(`Payment status not updated correctly. Expected: cancelado, got: ${updatedPayment.status}`);
  }
  
  console.log(`Successfully cancelled payment ${testPayment.id}`);
  
  return { matricula, payment: updatedPayment };
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🚀 Starting financial module tests');
  
  // Test database schema
  await runTest('Database Schema Consistency', testDatabaseSchema);
  
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
  const fs = require('fs');
  fs.writeFileSync(
    './tests/matricula/financial-module-test-results.json',
    JSON.stringify(testResults, null, 2)
  );
  
  console.log('\n✨ Tests completed');
  
  return testResults;
}

// Run the tests if this script is executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}

// Export functions for use in other test scripts
module.exports = {
  testDatabaseSchema,
  testPaymentGeneration,
  testDiscountApplication,
  testSplitPayments,
  testPaymentRegistration,
  testPaymentCancellation,
  runTests
};
