/**
 * Main test runner for all matricula module tests
 */

const coreTests = require('./test-core-functionality');
const documentTests = require('./test-document-management');
const contractTests = require('./test-contract-management');

async function runAllTests() {
  console.log('=== STARTING ALL MATRICULA MODULE TESTS ===');
  console.log('');
  
  console.log('=== CORE FUNCTIONALITY TESTS ===');
  await coreTests.runTests();
  console.log('');
  
  console.log('=== DOCUMENT MANAGEMENT TESTS ===');
  await documentTests.runTests();
  console.log('');
  
  console.log('=== CONTRACT MANAGEMENT TESTS ===');
  await contractTests.runTests();
  console.log('');
  
  console.log('=== ALL TESTS COMPLETED ===');
}

runAllTests();
