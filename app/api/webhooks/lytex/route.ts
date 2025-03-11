import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { webhookSchema, WebhookEventType } from '@/app/matricula/types/financial';

// Lytex webhook secret for signature verification
const LYTEX_WEBHOOK_SECRET = process.env.LYTEX_WEBHOOK_SECRET || '';

/**
 * Verify webhook signature from Lytex
 */
function verifySignature(payload: any, signature: string): boolean {
  // In a real implementation, this would use crypto to verify the signature
  // For now, we'll just check if the signature exists
  return !!signature;
}

/**
 * Handle payment.created event
 */
async function handlePaymentCreated(supabase: any, data: any) {
  try {
    // Log the payment creation
    await supabase.from('financial.lytex_integration').insert({
      payment_id: data.payment_id || null,
      lytex_id: data.id,
      status: 'created',
      payment_method: data.payment_method,
      payment_url: data.payment_url,
      payment_data: data,
    });

    return true;
  } catch (error) {
    console.error('Error handling payment.created:', error);
    return false;
  }
}

/**
 * Handle payment.approved event
 */
async function handlePaymentApproved(supabase: any, data: any) {
  try {
    // Find the payment in our system
    const { data: lytexIntegration, error: findError } = await supabase
      .from('financial.lytex_integration')
      .select('payment_id')
      .eq('lytex_id', data.id)
      .single();

    if (findError || !lytexIntegration) {
      console.error('Payment not found:', data.id);
      return false;
    }

    // Update the payment status
    if (lytexIntegration.payment_id) {
      await supabase
        .from('financial.payments')
        .update({
          status: 'pago',
          data_pagamento: new Date().toISOString(),
          gateway_data: data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lytexIntegration.payment_id);
    }

    // Update the Lytex integration record
    await supabase
      .from('financial.lytex_integration')
      .update({
        status: 'approved',
        callback_data: data,
        updated_at: new Date().toISOString(),
      })
      .eq('lytex_id', data.id);

    return true;
  } catch (error) {
    console.error('Error handling payment.approved:', error);
    return false;
  }
}

/**
 * Handle payment.failed event
 */
async function handlePaymentFailed(supabase: any, data: any) {
  try {
    // Find the payment in our system
    const { data: lytexIntegration, error: findError } = await supabase
      .from('financial.lytex_integration')
      .select('payment_id')
      .eq('lytex_id', data.id)
      .single();

    if (findError || !lytexIntegration) {
      console.error('Payment not found:', data.id);
      return false;
    }

    // Update the payment status
    if (lytexIntegration.payment_id) {
      await supabase
        .from('financial.payments')
        .update({
          status: 'pendente', // Keep as pending to allow retry
          gateway_data: data,
          observacoes: `Falha no pagamento: ${data.failure_reason || 'Motivo desconhecido'}`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lytexIntegration.payment_id);
    }

    // Update the Lytex integration record
    await supabase
      .from('financial.lytex_integration')
      .update({
        status: 'failed',
        callback_data: data,
        updated_at: new Date().toISOString(),
      })
      .eq('lytex_id', data.id);

    return true;
  } catch (error) {
    console.error('Error handling payment.failed:', error);
    return false;
  }
}

/**
 * Handle boleto.paid event
 */
async function handleBoletoPaid(supabase: any, data: any) {
  // Similar to payment.approved but specific to boleto
  return handlePaymentApproved(supabase, data);
}

/**
 * Handle boleto.expired event
 */
async function handleBoletoExpired(supabase: any, data: any) {
  try {
    // Find the payment in our system
    const { data: lytexIntegration, error: findError } = await supabase
      .from('financial.lytex_integration')
      .select('payment_id')
      .eq('lytex_id', data.id)
      .single();

    if (findError || !lytexIntegration) {
      console.error('Payment not found:', data.id);
      return false;
    }

    // Update the payment status
    if (lytexIntegration.payment_id) {
      await supabase
        .from('financial.payments')
        .update({
          status: 'atrasado',
          gateway_data: data,
          observacoes: 'Boleto expirado',
          updated_at: new Date().toISOString(),
        })
        .eq('id', lytexIntegration.payment_id);
    }

    // Update the Lytex integration record
    await supabase
      .from('financial.lytex_integration')
      .update({
        status: 'expired',
        callback_data: data,
        updated_at: new Date().toISOString(),
      })
      .eq('lytex_id', data.id);

    return true;
  } catch (error) {
    console.error('Error handling boleto.expired:', error);
    return false;
  }
}

/**
 * Handle payment.refunded event
 */
async function handlePaymentRefunded(supabase: any, data: any) {
  try {
    // Find the payment in our system
    const { data: lytexIntegration, error: findError } = await supabase
      .from('financial.lytex_integration')
      .select('payment_id')
      .eq('lytex_id', data.id)
      .single();

    if (findError || !lytexIntegration) {
      console.error('Payment not found:', data.id);
      return false;
    }

    // Update the payment status
    if (lytexIntegration.payment_id) {
      await supabase
        .from('financial.payments')
        .update({
          status: 'reembolsado',
          gateway_data: data,
          observacoes: `Reembolsado: ${data.refund_reason || ''}`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lytexIntegration.payment_id);
    }

    // Update the Lytex integration record
    await supabase
      .from('financial.lytex_integration')
      .update({
        status: 'refunded',
        callback_data: data,
        updated_at: new Date().toISOString(),
      })
      .eq('lytex_id', data.id);

    // Register the refund transaction
    if (lytexIntegration.payment_id) {
      await supabase.from('financial.transactions').insert({
        reference_id: lytexIntegration.payment_id,
        reference_type: 'payment_refund',
        amount: data.amount || 0,
        type: 'refund',
        status: 'completed',
        payment_method: data.payment_method,
        gateway_id: data.id,
        gateway_data: data,
        metadata: {
          refund_reason: data.refund_reason,
          refund_id: data.refund_id,
        },
      });
    }

    return true;
  } catch (error) {
    console.error('Error handling payment.refunded:', error);
    return false;
  }
}

/**
 * Handle payment.chargeback event
 */
async function handlePaymentChargeback(supabase: any, data: any) {
  try {
    // Find the payment in our system
    const { data: lytexIntegration, error: findError } = await supabase
      .from('financial.lytex_integration')
      .select('payment_id')
      .eq('lytex_id', data.id)
      .single();

    if (findError || !lytexIntegration) {
      console.error('Payment not found:', data.id);
      return false;
    }

    // Update the payment status
    if (lytexIntegration.payment_id) {
      await supabase
        .from('financial.payments')
        .update({
          status: 'cancelado',
          gateway_data: data,
          observacoes: `Chargeback: ${data.chargeback_reason || 'Motivo desconhecido'}`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lytexIntegration.payment_id);
    }

    // Update the Lytex integration record
    await supabase
      .from('financial.lytex_integration')
      .update({
        status: 'chargeback',
        callback_data: data,
        updated_at: new Date().toISOString(),
      })
      .eq('lytex_id', data.id);

    return true;
  } catch (error) {
    console.error('Error handling payment.chargeback:', error);
    return false;
  }
}

/**
 * POST handler for Lytex webhooks
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Get the request body
    const body = await request.json();
    
    // Get the signature from headers
    const signature = request.headers.get('x-lytex-signature') || '';
    
    // Verify the signature
    if (!verifySignature(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Validate the webhook payload
    const validationResult = webhookSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid webhook payload', details: validationResult.error },
        { status: 400 }
      );
    }
    
    const { event, data } = validationResult.data;
    
    // Handle different event types
    let success = false;
    
    switch (event) {
      case WebhookEventType.PAYMENT_CREATED:
        success = await handlePaymentCreated(supabase, data);
        break;
      
      case WebhookEventType.PAYMENT_APPROVED:
        success = await handlePaymentApproved(supabase, data);
        break;
      
      case WebhookEventType.PAYMENT_FAILED:
        success = await handlePaymentFailed(supabase, data);
        break;
      
      case WebhookEventType.PAYMENT_REFUNDED:
        success = await handlePaymentRefunded(supabase, data);
        break;
      
      case WebhookEventType.PAYMENT_CHARGEBACK:
        success = await handlePaymentChargeback(supabase, data);
        break;
      
      case WebhookEventType.BOLETO_EXPIRED:
        success = await handleBoletoExpired(supabase, data);
        break;
      
      case WebhookEventType.BOLETO_PAID:
        success = await handleBoletoPaid(supabase, data);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Unsupported event type' },
          { status: 400 }
        );
    }
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to process webhook' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
