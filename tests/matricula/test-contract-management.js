/**
 * Test script for contract management functionality
 */

const { testDatabaseConnection } = require('./test-core-functionality');

// Test contract generation
async function testContractGeneration() {
  console.log('Testing contract generation...');
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
    
    // Mock contract data
    const testContract = {
      matricula_id: matriculas[0].id,
      titulo: 'Contrato de Teste',
      versao: '1.0',
      url: 'https://example.com/contrato_teste.pdf',
      status: 'pendente'
    };
    
    const response = await fetch('https://uasnyifizdjxogowijip.supabase.co/rest/v1/matricula_contratos', {
      method: 'POST',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testContract)
    });
    
    const data = await response.json();
    console.log('Contract generation result:', data);
    return data[0]?.id != null;
  } catch (error) {
    console.error('Contract generation error:', error);
    return false;
  }
}

// Test contract signing
async function testContractSigning() {
  console.log('Testing contract signing...');
  try {
    // First get a contract
    const contractResponse = await fetch('https://uasnyifizdjxogowijip.supabase.co/rest/v1/matricula_contratos?limit=1', {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });
    
    const contracts = await contractResponse.json();
    if (!contracts || contracts.length === 0) {
      console.error('No contracts found');
      return false;
    }
    
    const contractUpdate = {
      status: 'assinado'
    };
    
    const response = await fetch(`https://uasnyifizdjxogowijip.supabase.co/rest/v1/matricula_contratos?id=eq.${contracts[0].id}`, {
      method: 'PATCH',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(contractUpdate)
    });
    
    // Check if the update was successful
    const verifyResponse = await fetch(`https://uasnyifizdjxogowijip.supabase.co/rest/v1/matricula_contratos?id=eq.${contracts[0].id}`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });
    
    const updatedContract = await verifyResponse.json();
    console.log('Contract signing result:', updatedContract);
    return updatedContract[0]?.status === 'assinado';
  } catch (error) {
    console.error('Contract signing error:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('Starting contract management tests...');
  
  const dbConnected = await testDatabaseConnection();
  console.log('Database connection test:', dbConnected ? 'PASSED' : 'FAILED');
  
  if (!dbConnected) {
    console.error('Cannot continue tests without database connection');
    return;
  }
  
  const contractGenerated = await testContractGeneration();
  console.log('Contract generation test:', contractGenerated ? 'PASSED' : 'FAILED');
  
  const contractSigned = await testContractSigning();
  console.log('Contract signing test:', contractSigned ? 'PASSED' : 'FAILED');
  
  console.log('All contract management tests completed.');
}

// Export functions for use in other test scripts
module.exports = {
  testContractGeneration,
  testContractSigning,
  runTests
};

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}
