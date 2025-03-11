# Lytex API Integration Requirements

## Authentication
- Client ID: 67904aed85a041251706543f
- Client Secret: USsRK677Mw29XrWvByfZOWYdBZ1iBUicJ1NjJTOveQodxQ8lenvmW5wIqqjxb0mTow2cvI3u3lGJKVi35WeFut78QTmJqpEj43Sz4t9Yht4dmYNyWXgMsHQKyq3ZVNzgtJlYBvCQDlGH6rjtF0IeVYHoXGKQKdGq1SiY9Ln4WwFkwEqSMiJXO5pRkMjnnLkTrX1DaTCRTmkWOCiiDShsCM7bZ9ooaHOLwsZEDNySJRTWNhIpdWmZSINSSfWSNA2a
- Client Callback: DAzr2mZ4HSnbQtP3yLdWo6zpgdD0SpnAPadXSD8IlkxSihye53cRAvgCi9YnPdfCpe3FyF3bV8oikj3QXlZb91bhLNw3mmZqmQGUO5s3VfpQ5l3FGASj2qy1PYs4sEEgbJKAqFUZpWHd14hOX2x6uEAi1rM6gllhQ4PK7c7NVOd7CT8v7KtT0KjColSG3X685yOwJwFm1TJfiWdToKFw8W4wF3YcAoahTWN6q0HNyeAlvkX05SeYL64uSnbDlPVq

## Required API Endpoints
1. Authentication
   - POST /auth/token - Get access token

2. Payment Methods
   - GET /payment-methods - List available payment methods

3. Charges
   - POST /charges - Create a new charge
   - GET /charges/{id} - Get charge details
   - DELETE /charges/{id} - Cancel a charge

4. Payments
   - GET /payments - List payments
   - GET /payments/{id} - Get payment details
   - POST /payments/{id}/refund - Refund a payment

5. Installments
   - POST /installments - Create installment plan
   - GET /installments/{id} - Get installment details

6. Webhooks
   - POST /webhooks - Register webhook for payment notifications

## Payment Methods to Support
- Credit Card
- Boleto
- PIX
- Bank Transfer

## Features to Implement
- Payment generation
- Payment cancellation
- Payment status tracking
- Installment plans
- Split payments for partners and consultants
- Manual payment recording
- Payment link generation
- Financial reports

## Webhook Events to Handle
- payment.created
- payment.approved
- payment.failed
- payment.refunded
- payment.chargeback
- boleto.expired
- boleto.paid
