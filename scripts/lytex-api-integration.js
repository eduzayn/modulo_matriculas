/**
 * Lytex API Integration Service
 * 
 * This service handles integration with the Lytex payment gateway.
 * Documentation: https://docs-pay.lytex.com.br/documentacao/v2
 */

const LYTEX_API_URL = 'https://api.lytex.com.br/v2';
const LYTEX_CLIENT_ID = '67904aed85a041251706543f';
const LYTEX_CLIENT_SECRET = 'USsRK677Mw29XrWvByfZOWYdBZ1iBUicJ1NjJTOveQodxQ8lenvmW5wIqqjxb0mTow2cvI3u3lGJKVi35WeFut78QTmJqpEj43Sz4t9Yht4dmYNyWXgMsHQKyq3ZVNzgtJlYBvCQDlGH6rjtF0IeVYHoXGKQKdGq1SiY9Ln4WwFkwEqSMiJXO5pRkMjnnLkTrX1DaTCRTmkWOCiiDShsCM7bZ9ooaHOLwsZEDNySJRTWNhIpdWmZSINSSfWSNA2a';
const LYTEX_CLIENT_CALLBACK = 'DAzr2mZ4HSnbQtP3yLdWo6zpgdD0SpnAPadXSD8IlkxSihye53cRAvgCi9YnPdfCpe3FyF3bV8oikj3QXlZb91bhLNw3mmZqmQGUO5s3VfpQ5l3FGASj2qy1PYs4sEEgbJKAqFUZpWHd14hOX2x6uEAi1rM6gllhQ4PK7c7NVOd7CT8v7KtT0KjColSG3X685yOwJwFm1TJfiWdToKFw8W4wF3YcAoahTWN6q0HNyeAlvkX05SeYL64uSnbDlPVq';

/**
 * Required API Endpoints:
 * 
 * 1. Authentication
 *    - POST /auth/token - Get access token
 * 
 * 2. Payment Methods
 *    - GET /payment-methods - List available payment methods
 * 
 * 3. Charges
 *    - POST /charges - Create a new charge
 *    - GET /charges/{id} - Get charge details
 *    - DELETE /charges/{id} - Cancel a charge
 * 
 * 4. Payments
 *    - GET /payments - List payments
 *    - GET /payments/{id} - Get payment details
 *    - POST /payments/{id}/refund - Refund a payment
 * 
 * 5. Installments
 *    - POST /installments - Create installment plan
 *    - GET /installments/{id} - Get installment details
 * 
 * 6. Webhooks
 *    - POST /webhooks - Register webhook for payment notifications
 */

/**
 * Payment Methods to Support:
 * - Credit Card
 * - Boleto
 * - PIX
 * - Bank Transfer
 */

/**
 * Features to Implement:
 * - Payment generation
 * - Payment cancellation
 * - Payment status tracking
 * - Installment plans
 * - Split payments for partners and consultants
 * - Manual payment recording
 * - Payment link generation
 * - Financial reports
 */

/**
 * Webhook Events to Handle:
 * - payment.created
 * - payment.approved
 * - payment.failed
 * - payment.refunded
 * - payment.chargeback
 * - boleto.expired
 * - boleto.paid
 */

// Example authentication function
async function getLytexToken() {
  try {
    const response = await fetch(`${LYTEX_API_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: LYTEX_CLIENT_ID,
        client_secret: LYTEX_CLIENT_SECRET
      })
    });
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Lytex token:', error);
    throw new Error('Failed to authenticate with Lytex API');
  }
}

// Example function to create a charge
async function createCharge(paymentData) {
  try {
    const token = await getLytexToken();
    
    const response = await fetch(`${LYTEX_API_URL}/charges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating charge:', error);
    throw new Error('Failed to create charge with Lytex API');
  }
}

// Example function to get payment details
async function getPaymentDetails(paymentId) {
  try {
    const token = await getLytexToken();
    
    const response = await fetch(`${LYTEX_API_URL}/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting payment details:', error);
    throw new Error('Failed to get payment details from Lytex API');
  }
}

// Example function to register webhook
async function registerWebhook(url, events) {
  try {
    const token = await getLytexToken();
    
    const response = await fetch(`${LYTEX_API_URL}/webhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        url,
        events
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering webhook:', error);
    throw new Error('Failed to register webhook with Lytex API');
  }
}

module.exports = {
  getLytexToken,
  createCharge,
  getPaymentDetails,
  registerWebhook
};
