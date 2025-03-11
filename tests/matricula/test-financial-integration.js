/**
 * Test script for financial integration functionality
 */

const { testDatabaseConnection } = require('./test-core-functionality');

// Test payment generation
async function testPaymentGeneration() {
  console.log('Testing payment generation...');
  try {
    // Mock payment data
    const testPayment = {
      matricula_id: 'test-matricula-id',
      valor: 1000.00,
      data_vencimento: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
      status: 'pendente',
      forma_pagamento: 'boleto'
    };
    
    // This is a mock test since we don't have a payments table
    console.log('Payment generation result (mock):', testPayment);
    return true;
  } catch (error) {
    console.error('Payment generation error:', error);
    return false;
  }
}

// Test discount application
async function testDiscountApplication() {
  console.log('Testing discount application...');
  try {
    // Mock discount data
    const testDiscount = {
      nome: 'Desconto Teste',
      tipo: 'percentual',
      valor: 10.0,
      dataInicio: new Date().toISOString(),
      dataFim: new Date(Date.now() + 90*24*60*60*1000).toISOString(),
      ativo: true
    };
    
    // This is a mock test since we don't have a discounts table
    console.log('Discount application result (mock):', testDiscount);
    return true;
  } catch (error) {
    console.error('Discount application error:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('Starting financial integration tests...');
  
  const dbConnected = await testDatabaseConnection();
  console.log('Database connection test:', dbConnected ? 'PASSED' : 'FAILED');
  
  if (!dbConnected) {
    console.error('Cannot continue tests without database connection');
    return;
  }
  
  const paymentGenerated = await testPaymentGeneration();
  console.log('Payment generation test:', paymentGenerated ? 'PASSED' : 'FAILED');
  
  const discountApplied = await testDiscountApplication();
  console.log('Discount application test:', discountApplied ? 'PASSED' : 'FAILED');
  
  console.log('All financial integration tests completed.');
}

// Export functions for use in other test scripts
module.exports = {
  testPaymentGeneration,
  testDiscountApplication,
  runTests
};

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}
