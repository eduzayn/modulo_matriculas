import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

// Lytex API configuration
const LYTEX_API_URL = 'https://api.lytex.com.br/v2';
const LYTEX_CLIENT_ID = process.env.LYTEX_CLIENT_ID;
const LYTEX_CLIENT_SECRET = process.env.LYTEX_CLIENT_SECRET;

/**
 * Get Lytex API token
 */
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
    
    if (!response.ok) {
      throw new Error(`Failed to get token: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Lytex token:', error);
    throw new Error('Failed to authenticate with Lytex API');
  }
}

/**
 * Create a payment in Lytex
 */
async function createLytexPayment(token: string, paymentData: any) {
  try {
    const response = await fetch(`${LYTEX_API_URL}/charges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create payment: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating Lytex payment:', error);
    throw new Error('Failed to create payment with Lytex API');
  }
}

/**
 * Create a split payment in Lytex
 */
async function createLytexSplitPayment(token: string, chargeId: string, splitData: any) {
  try {
    const response = await fetch(`${LYTEX_API_URL}/charges/${chargeId}/split`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(splitData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create split payment: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating Lytex split payment:', error);
    throw new Error('Failed to create split payment with Lytex API');
  }
}

/**
 * GET handler for payment methods
 */
export async function GET(request: NextRequest) {
  try {
    // Get Lytex token
    const token = await getLytexToken();
    
    // Get payment methods from Lytex
    const response = await fetch(`${LYTEX_API_URL}/payment-methods`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get payment methods: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting payment methods:', error);
    return NextResponse.json(
      { error: 'Failed to get payment methods' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating payments
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication is now handled by the main site
    // TODO: Get user information from main site's authentication system
    const supabase = createServerSupabaseClient(); // Use a non-auth Supabase client for database operations
    
    // Get the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.payment_id || !body.customer || !body.amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get the payment from our database
    const { data: payment, error: paymentError } = await supabase
      .from('financial.payments')
      .select('*')
      .eq('id', body.payment_id)
      .single();
    
    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }
    
    // Get Lytex token
    const token = await getLytexToken();
    
    // Prepare payment data for Lytex
    const paymentData = {
      customer: body.customer,
      billing_type: payment.forma_pagamento,
      due_date: payment.data_vencimento,
      value: payment.valor,
      description: body.description || `Parcela ${payment.numero_parcela}`,
      external_reference: payment.id,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/lytex`,
      ...body.additional_data
    };
    
    // Create payment in Lytex
    const lytexPayment = await createLytexPayment(token, paymentData);
    
    // Process split payments if provided
    if (body.split_recipients && body.split_recipients.length > 0) {
      // Get split payments from database
      const { data: splitPayments, error: splitError } = await supabase
        .from('financial.split_payments')
        .select('*')
        .eq('payment_id', payment.id);
      
      if (!splitError && splitPayments && splitPayments.length > 0) {
        // Format split data for Lytex
        const splitData = {
          splits: splitPayments.map(split => ({
            recipient_id: split.recipient_id,
            amount: split.amount,
            percentage: split.percentage,
            description: `Split para ${split.recipient_type}`
          }))
        };
        
        // Create split payment in Lytex
        await createLytexSplitPayment(token, lytexPayment.id, splitData);
      }
    }
    
    // Save Lytex integration data
    await supabase.from('financial.lytex_integration').insert({
      payment_id: payment.id,
      lytex_id: lytexPayment.id,
      status: lytexPayment.status,
      payment_method: payment.forma_pagamento,
      payment_url: lytexPayment.payment_url,
      payment_data: lytexPayment
    });
    
    // Update payment with Lytex data
    await supabase
      .from('financial.payments')
      .update({
        gateway_id: lytexPayment.id,
        gateway_data: lytexPayment,
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.id);
    
    return NextResponse.json({
      success: true,
      payment: lytexPayment
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
