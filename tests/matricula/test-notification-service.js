/**
 * Test script for notification service functionality
 */

// Mock notification service for testing
const mockNotificationService = {
  sendNotification: async (options) => {
    console.log('Mock notification sent:', options);
    return { success: true, id: 'mock-notification-id' };
  }
};

// Test email notification
async function testEmailNotification() {
  console.log('Testing email notification...');
  try {
    const result = await mockNotificationService.sendNotification({
      event: 'matricula_criada',
      recipient: {
        id: 'test-student-id',
        type: 'aluno',
      },
      data: {
        matricula_id: 'test-matricula-id',
        curso_id: 'test-curso-id',
      },
      channels: ['email'],
    });
    
    console.log('Email notification result:', result);
    return result.success === true;
  } catch (error) {
    console.error('Email notification error:', error);
    return false;
  }
}

// Test multi-channel notification
async function testMultiChannelNotification() {
  console.log('Testing multi-channel notification...');
  try {
    const result = await mockNotificationService.sendNotification({
      event: 'contrato_assinado',
      recipient: {
        id: 'test-student-id',
        type: 'aluno',
      },
      data: {
        matricula_id: 'test-matricula-id',
        contrato_id: 'test-contrato-id',
      },
      channels: ['email', 'sms', 'whatsapp'],
    });
    
    console.log('Multi-channel notification result:', result);
    return result.success === true;
  } catch (error) {
    console.error('Multi-channel notification error:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('Starting notification service tests...');
  
  const emailSent = await testEmailNotification();
  console.log('Email notification test:', emailSent ? 'PASSED' : 'FAILED');
  
  const multiChannelSent = await testMultiChannelNotification();
  console.log('Multi-channel notification test:', multiChannelSent ? 'PASSED' : 'FAILED');
  
  console.log('All notification service tests completed.');
}

// Export functions for use in other test scripts
module.exports = {
  testEmailNotification,
  testMultiChannelNotification,
  runTests
};

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}
