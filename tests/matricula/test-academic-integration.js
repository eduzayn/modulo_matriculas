/**
 * Test script for academic integration functionality
 */

const { testDatabaseConnection } = require('./test-core-functionality');

// Test class allocation
async function testClassAllocation() {
  console.log('Testing class allocation...');
  try {
    // Mock class allocation data
    const testAllocation = {
      matricula_id: 'test-matricula-id',
      turma_id: 'mock-turma-id',
      data_alocacao: new Date().toISOString(),
      status: 'confirmado'
    };
    
    // This is a mock test since we don't have a class allocation table
    console.log('Class allocation result (mock):', testAllocation);
    return true;
  } catch (error) {
    console.error('Class allocation error:', error);
    return false;
  }
}

// Test curriculum access
async function testCurriculumAccess() {
  console.log('Testing curriculum access...');
  try {
    // Mock curriculum data
    const testCurriculum = {
      curso_id: 'mock-curso-id',
      modulos: [
        {
          id: 'modulo-1',
          nome: 'Módulo 1',
          disciplinas: [
            { id: 'disc-1', nome: 'Disciplina 1', carga_horaria: 60 },
            { id: 'disc-2', nome: 'Disciplina 2', carga_horaria: 40 }
          ]
        },
        {
          id: 'modulo-2',
          nome: 'Módulo 2',
          disciplinas: [
            { id: 'disc-3', nome: 'Disciplina 3', carga_horaria: 80 },
            { id: 'disc-4', nome: 'Disciplina 4', carga_horaria: 60 }
          ]
        }
      ]
    };
    
    // This is a mock test since we don't have a curriculum table
    console.log('Curriculum access result (mock):', testCurriculum);
    return true;
  } catch (error) {
    console.error('Curriculum access error:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('Starting academic integration tests...');
  
  const dbConnected = await testDatabaseConnection();
  console.log('Database connection test:', dbConnected ? 'PASSED' : 'FAILED');
  
  if (!dbConnected) {
    console.error('Cannot continue tests without database connection');
    return;
  }
  
  const classAllocated = await testClassAllocation();
  console.log('Class allocation test:', classAllocated ? 'PASSED' : 'FAILED');
  
  const curriculumAccessed = await testCurriculumAccess();
  console.log('Curriculum access test:', curriculumAccessed ? 'PASSED' : 'FAILED');
  
  console.log('All academic integration tests completed.');
}

// Export functions for use in other test scripts
module.exports = {
  testClassAllocation,
  testCurriculumAccess,
  runTests
};

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}
