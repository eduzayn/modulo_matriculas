// Simple direct test script
// Author: Devin AI
// Date: 11/03/2025

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Test results
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to run a test
async function runTest(name, testFn) {
  results.total++;
  console.log(`\n🧪 Running test: ${name}`);
  try {
    await testFn();
    results.passed++;
    results.tests.push({ name, status: 'passed' });
    console.log(`✅ Test passed: ${name}`);
    return true;
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'failed', error: error.message });
    console.error(`❌ Test failed: ${name}`);
    console.error(`   Error: ${error.message}`);
    return false;
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting simple direct tests...');
  
  // Test variables
  let studentId, courseId, matriculaId, documentId, contractId;
  
  // Test 1: Create Student
  await runTest('Create Student', async () => {
    const { data, error } = await supabase
      .from('students')
      .insert({
        name: `Test Student ${Date.now()}`,
        email: `test.${Date.now()}@example.com`
      })
      .select('id')
      .single();
    
    if (error) throw new Error(`Failed to create student: ${error.message}`);
    studentId = data.id;
    console.log(`Created student with ID: ${studentId}`);
  });
  
  // Test 2: Create Course
  await runTest('Create Course', async () => {
    const { data, error } = await supabase
      .from('courses')
      .insert({
        name: `Test Course ${Date.now()}`,
        title: `Test Course ${Date.now()}`,
        description: 'Test course description',
        price: 1000.00
      })
      .select('id')
      .single();
    
    if (error) throw new Error(`Failed to create course: ${error.message}`);
    courseId = data.id;
    console.log(`Created course with ID: ${courseId}`);
  });
  
  // Test 3: Create Matricula
  await runTest('Create Matricula', async () => {
    const { data, error } = await supabase
      .from('matriculas')
      .insert({
        aluno_id: studentId,
        curso_id: courseId,
        status: 'pendente',
        forma_pagamento: 'cartao_credito',
        numero_parcelas: 12,
        metadata: { source: 'simple_direct_test' }
      })
      .select('id')
      .single();
    
    if (error) throw new Error(`Failed to create matricula: ${error.message}`);
    matriculaId = data.id;
    console.log(`Created matricula with ID: ${matriculaId}`);
  });
  
  // Test 4: Create Document
  await runTest('Create Document', async () => {
    const { data, error } = await supabase
      .from('documentos')
      .insert({
        matricula_id: matriculaId,
        tipo: 'rg',
        nome: 'documento_teste_simple.pdf',
        url: 'https://example.com/documento_teste_simple.pdf',
        status: 'pendente'
      })
      .select('id')
      .single();
    
    if (error) throw new Error(`Failed to create document: ${error.message}`);
    documentId = data.id;
    console.log(`Created document with ID: ${documentId}`);
  });
  
  // Test 5: Create Contract
  await runTest('Create Contract', async () => {
    const { data, error } = await supabase
      .from('contratos')
      .insert({
        matricula_id: matriculaId,
        titulo: 'Contrato de Teste Simple',
        versao: '1.0',
        url: 'https://example.com/contrato_teste_simple.pdf',
        status: 'pendente'
      })
      .select('id')
      .single();
    
    if (error) throw new Error(`Failed to create contract: ${error.message}`);
    contractId = data.id;
    console.log(`Created contract with ID: ${contractId}`);
  });
  
  // Print test summary
  console.log('\n📊 Test Summary:');
  console.log(`Total tests: ${results.total}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Success rate: ${Math.round((results.passed / results.total) * 100)}%`);
  
  // Save test results to file
  const testReport = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.total,
      passed: results.passed,
      failed: results.failed,
      successRate: Math.round((results.passed / results.total) * 100)
    },
    tests: results.tests
  };
  
  fs.writeFileSync(
    path.resolve(__dirname, 'simple-direct-test-results.json'),
    JSON.stringify(testReport, null, 2)
  );
  
  console.log('\nTest results saved to simple-direct-test-results.json');
}

// Run all tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});
