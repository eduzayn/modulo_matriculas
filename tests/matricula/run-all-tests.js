/**
 * Main test runner for all matricula module tests
 */

const fs = require('fs');
const path = require('path');
const coreTests = require('./test-core-functionality');
const documentTests = require('./test-document-management');
const contractTests = require('./test-contract-management');
const financialTests = require('./test-financial-integration');
const academicTests = require('./test-academic-integration');
const notificationTests = require('./test-notification-system');

// Store test results
const testResults = {
  core: { passed: 0, failed: 0, total: 0 },
  document: { passed: 0, failed: 0, total: 0 },
  contract: { passed: 0, failed: 0, total: 0 },
  financial: { passed: 0, failed: 0, total: 0 },
  academic: { passed: 0, failed: 0, total: 0 },
  notification: { passed: 0, failed: 0, total: 0 },
};

// Custom console.log to capture test results
const originalLog = console.log;
console.log = function() {
  const args = Array.from(arguments).join(' ');
  
  // Capture test results
  if (args.includes('test:')) {
    const category = getCurrentCategory();
    if (args.includes('PASSED')) {
      testResults[category].passed++;
      testResults[category].total++;
    } else if (args.includes('FAILED')) {
      testResults[category].failed++;
      testResults[category].total++;
    }
  }
  
  originalLog.apply(console, arguments);
};

// Get current test category
let currentCategory = 'core';
function getCurrentCategory() {
  return currentCategory;
}

// Generate test summary
function generateTestSummary() {
  let summary = '# Test Summary\n\n';
  
  summary += '| Category | Passed | Failed | Total | Success Rate |\n';
  summary += '|----------|--------|--------|-------|-------------|\n';
  
  let totalPassed = 0;
  let totalFailed = 0;
  let totalTests = 0;
  
  for (const [category, results] of Object.entries(testResults)) {
    const successRate = results.total > 0 ? Math.round((results.passed / results.total) * 100) : 0;
    summary += `| ${category.charAt(0).toUpperCase() + category.slice(1)} | ${results.passed} | ${results.failed} | ${results.total} | ${successRate}% |\n`;
    
    totalPassed += results.passed;
    totalFailed += results.failed;
    totalTests += results.total;
  }
  
  const overallSuccessRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
  summary += `| **Total** | **${totalPassed}** | **${totalFailed}** | **${totalTests}** | **${overallSuccessRate}%** |\n`;
  
  return summary;
}

async function runAllTests() {
  console.log('=== STARTING ALL MATRICULA MODULE TESTS ===');
  console.log('');
  
  console.log('=== CORE FUNCTIONALITY TESTS ===');
  currentCategory = 'core';
  await coreTests.runTests();
  console.log('');
  
  console.log('=== DOCUMENT MANAGEMENT TESTS ===');
  currentCategory = 'document';
  await documentTests.runTests();
  console.log('');
  
  console.log('=== CONTRACT MANAGEMENT TESTS ===');
  currentCategory = 'contract';
  await contractTests.runTests();
  console.log('');
  
  console.log('=== FINANCIAL INTEGRATION TESTS ===');
  currentCategory = 'financial';
  await financialTests.runTests();
  console.log('');
  
  console.log('=== ACADEMIC INTEGRATION TESTS ===');
  currentCategory = 'academic';
  await academicTests.runTests();
  console.log('');
  
  console.log('=== NOTIFICATION SYSTEM TESTS ===');
  currentCategory = 'notification';
  await notificationTests.runTests();
  console.log('');
  
  console.log('=== ALL TESTS COMPLETED ===');
  
  // Generate and save test summary
  const summary = generateTestSummary();
  console.log(summary);
  
  // Save summary to file
  fs.writeFileSync(path.join(__dirname, 'test-summary.md'), summary);
}

runAllTests();
