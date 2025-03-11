// Test Lytex API integration
const fetch = require('node-fetch');

async function testLytexAPI() {
  const clientId = '67904aed85a041251706543f';
  const clientSecret = 'USsRK677Mw29XrWvByfZOWYdBZ1iBUicJ1NjJTOveQodxQ8lenvmW5wIqqjxb0mTow2cvI3u3lGJKVi35WeFut78QTmJqpEj43Sz4t9Yht4dmYNyWXgMsHQKyq3ZVNzgtJlYBvCQDlGH6rjtF0IeVYHoXGKQKdGq1SiY9Ln4WwFkwEqSMiJXO5pRkMjnnLkTrX1DaTCRTmkWOCiiDShsCM7bZ9ooaHOLwsZEDNySJRTWNhIpdWmZSINSSfWSNA2a';
  
  try {
    // Test authentication
    const authResponse = await fetch('https://api.lytex.com.br/v2/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret
      })
    });
    
    const authData = await authResponse.json();
    console.log('Authentication response:', authData);
    
    if (authData.access_token) {
      // Test getting payment methods
      const paymentMethodsResponse = await fetch('https://api.lytex.com.br/v2/payment-methods', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authData.access_token}`
        }
      });
      
      const paymentMethodsData = await paymentMethodsResponse.json();
      console.log('Payment methods:', paymentMethodsData);
    }
  } catch (error) {
    console.error('Error testing Lytex API:', error);
  }
}

testLytexAPI();
