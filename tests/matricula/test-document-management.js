/**
 * Test script for document management functionality
 */

const { testDatabaseConnection } = require('./test-core-functionality');

// Test document upload
async function testDocumentUpload() {
  console.log('Testing document upload...');
  try {
    // First get a matricula
    const matriculaResponse = await fetch('https://uasnyifizdjxogowijip.supabase.co/rest/v1/matricula.registros?limit=1', {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });
    
    const matriculas = await matriculaResponse.json();
    if (!matriculas || matriculas.length === 0) {
      console.error('No matriculas found');
      return false;
    }
    
    // Mock document data (in a real test, we would use FormData and a real file)
    const testDocument = {
      matricula_id: matriculas[0].id,
      tipo: 'rg',
      nome: 'documento_teste.pdf',
      url: 'https://example.com/documento_teste.pdf',
      status: 'pendente'
    };
    
    const response = await fetch('https://uasnyifizdjxogowijip.supabase.co/rest/v1/matricula_documentos', {
      method: 'POST',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testDocument)
    });
    
    const data = await response.json();
    console.log('Document upload result:', data);
    return data[0]?.id != null;
  } catch (error) {
    console.error('Document upload error:', error);
    return false;
  }
}

// Test document approval
async function testDocumentApproval() {
  console.log('Testing document approval...');
  try {
    // First get a document
    const documentResponse = await fetch('https://uasnyifizdjxogowijip.supabase.co/rest/v1/matricula_documentos?limit=1', {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });
    
    const documents = await documentResponse.json();
    if (!documents || documents.length === 0) {
      console.error('No documents found');
      return false;
    }
    
    const documentUpdate = {
      status: 'aprovado',
      observacoes: 'Documento aprovado pelo teste automatizado'
    };
    
    const response = await fetch(`https://uasnyifizdjxogowijip.supabase.co/rest/v1/matricula_documentos?id=eq.${documents[0].id}`, {
      method: 'PATCH',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(documentUpdate)
    });
    
    // Check if the update was successful
    const verifyResponse = await fetch(`https://uasnyifizdjxogowijip.supabase.co/rest/v1/matricula_documentos?id=eq.${documents[0].id}`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });
    
    const updatedDocument = await verifyResponse.json();
    console.log('Document approval result:', updatedDocument);
    return updatedDocument[0]?.status === 'aprovado';
  } catch (error) {
    console.error('Document approval error:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('Starting document management tests...');
  
  const dbConnected = await testDatabaseConnection();
  console.log('Database connection test:', dbConnected ? 'PASSED' : 'FAILED');
  
  if (!dbConnected) {
    console.error('Cannot continue tests without database connection');
    return;
  }
  
  const documentUploaded = await testDocumentUpload();
  console.log('Document upload test:', documentUploaded ? 'PASSED' : 'FAILED');
  
  const documentApproved = await testDocumentApproval();
  console.log('Document approval test:', documentApproved ? 'PASSED' : 'FAILED');
  
  console.log('All document management tests completed.');
}

// Export functions for use in other test scripts
module.exports = {
  testDocumentUpload,
  testDocumentApproval,
  runTests
};

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}
