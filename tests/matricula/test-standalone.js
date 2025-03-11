// Standalone test script for matricula module
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

// Helper function to generate a unique ID
function generateUniqueId() {
  return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting standalone tests for matricula module...');
  
  // Test 1: Test matricula creation and status update
  await runTest('Matricula Creation and Status Update', async () => {
    // Create test student
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        name: `Test Student ${generateUniqueId()}`,
        email: `test${generateUniqueId()}@example.com`
      })
      .select('id')
      .single();
    
    if (studentError) throw new Error(`Failed to create student: ${studentError.message}`);
    console.log(`Created student with ID: ${student.id}`);
    
    // Create test course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        name: `Test Course ${generateUniqueId()}`,
        title: `Test Course ${generateUniqueId()}`,
        description: 'Test course description',
        price: 1000.00
      })
      .select('id')
      .single();
    
    if (courseError) throw new Error(`Failed to create course: ${courseError.message}`);
    console.log(`Created course with ID: ${course.id}`);
    
    // Create matricula
    const { data: matricula, error: matriculaError } = await supabase
      .from('matricula.registros')
      .insert({
        aluno_id: student.id,
        curso_id: course.id,
        status: 'pendente',
        forma_pagamento: 'cartao_credito',
        numero_parcelas: 12,
        metadata: { source: 'standalone_test' }
      })
      .select('id')
      .single();
    
    if (matriculaError) throw new Error(`Failed to create matricula: ${matriculaError.message}`);
    console.log(`Created matricula with ID: ${matricula.id}`);
    
    // Update matricula status
    const { data: updatedMatricula, error: updateError } = await supabase
      .from('matricula.registros')
      .update({
        status: 'aprovado',
        metadata: {
          source: 'standalone_test',
          status_history: [
            {
              from: 'pendente',
              to: 'aprovado',
              date: new Date().toISOString(),
              observacoes: 'Aprovado via teste automatizado'
            }
          ]
        }
      })
      .eq('id', matricula.id)
      .select('id, status')
      .single();
    
    if (updateError) throw new Error(`Failed to update matricula: ${updateError.message}`);
    if (updatedMatricula.status !== 'aprovado') throw new Error('Matricula status not updated correctly');
    console.log(`Updated matricula status to: ${updatedMatricula.status}`);
  });
  
  // Test 2: Test document management
  await runTest('Document Management', async () => {
    // Create test student
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        name: `Doc Test Student ${generateUniqueId()}`,
        email: `doctest${generateUniqueId()}@example.com`
      })
      .select('id')
      .single();
    
    if (studentError) throw new Error(`Failed to create student: ${studentError.message}`);
    
    // Create test course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        name: `Doc Test Course ${generateUniqueId()}`,
        description: 'Test course for document',
        price: 1000.00
      })
      .select('id')
      .single();
    
    if (courseError) throw new Error(`Failed to create course: ${courseError.message}`);
    
    // Create matricula
    const { data: matricula, error: matriculaError } = await supabase
      .from('matricula.registros')
      .insert({
        aluno_id: student.id,
        curso_id: course.id,
        status: 'pendente',
        forma_pagamento: 'cartao_credito',
        numero_parcelas: 12,
        metadata: { source: 'document_test' }
      })
      .select('id')
      .single();
    
    if (matriculaError) throw new Error(`Failed to create matricula: ${matriculaError.message}`);
    console.log(`Created matricula for document test: ${matricula.id}`);
    
    // Create document
    const { data: document, error: documentError } = await supabase
      .from('matricula_documentos')
      .insert({
        matricula_id: matricula.id,
        tipo: 'rg',
        nome: 'documento_teste.pdf',
        url: 'https://example.com/documento_teste.pdf',
        status: 'pendente'
      })
      .select('id')
      .single();
    
    if (documentError) throw new Error(`Failed to create document: ${documentError.message}`);
    console.log(`Created document with ID: ${document.id}`);
    
    // Update document status
    const { data: updatedDocument, error: updateError } = await supabase
      .from('matricula_documentos')
      .update({
        status: 'aprovado',
        observacoes: 'Documento aprovado via teste automatizado'
      })
      .eq('id', document.id)
      .select('id, status')
      .single();
    
    if (updateError) throw new Error(`Failed to update document: ${updateError.message}`);
    if (updatedDocument.status !== 'aprovado') throw new Error('Document status not updated correctly');
    console.log(`Updated document status to: ${updatedDocument.status}`);
  });
  
  // Test 3: Test contract management
  await runTest('Contract Management', async () => {
    // Create test student
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        name: `Contract Test Student ${generateUniqueId()}`,
        email: `contracttest${generateUniqueId()}@example.com`
      })
      .select('id')
      .single();
    
    if (studentError) throw new Error(`Failed to create student: ${studentError.message}`);
    
    // Create test course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        name: `Contract Test Course ${generateUniqueId()}`,
        description: 'Test course for contract',
        price: 1000.00
      })
      .select('id')
      .single();
    
    if (courseError) throw new Error(`Failed to create course: ${courseError.message}`);
    
    // Create matricula
    const { data: matricula, error: matriculaError } = await supabase
      .from('matricula.registros')
      .insert({
        aluno_id: student.id,
        curso_id: course.id,
        status: 'pendente',
        forma_pagamento: 'cartao_credito',
        numero_parcelas: 12,
        metadata: { source: 'contract_test' }
      })
      .select('id')
      .single();
    
    if (matriculaError) throw new Error(`Failed to create matricula: ${matriculaError.message}`);
    console.log(`Created matricula for contract test: ${matricula.id}`);
    
    // Create contract
    const { data: contract, error: contractError } = await supabase
      .from('matricula_contratos')
      .insert({
        matricula_id: matricula.id,
        titulo: 'Contrato de Teste',
        versao: '1.0',
        url: 'https://example.com/contrato_teste.pdf',
        status: 'pendente'
      })
      .select('id')
      .single();
    
    if (contractError) throw new Error(`Failed to create contract: ${contractError.message}`);
    console.log(`Created contract with ID: ${contract.id}`);
    
    // Update contract status
    const { data: updatedContract, error: updateError } = await supabase
      .from('matricula_contratos')
      .update({
        status: 'assinado'
      })
      .eq('id', contract.id)
      .select('id, status')
      .single();
    
    if (updateError) throw new Error(`Failed to update contract: ${updateError.message}`);
    if (updatedContract.status !== 'assinado') throw new Error('Contract status not updated correctly');
    console.log(`Updated contract status to: ${updatedContract.status}`);
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
    path.resolve(__dirname, 'standalone-test-results.json'),
    JSON.stringify(testReport, null, 2)
  );
  
  console.log('\nTest results saved to standalone-test-results.json');
}

// Run all tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});
