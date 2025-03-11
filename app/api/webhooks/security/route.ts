import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { TransactionLogger, TransactionStatus, TransactionType } from '@/app/matricula/lib/services/security/transaction-logger';
import { WebhookEventType, webhookPayloadSchema } from '@/app/matricula/types/payment-integrations';

/**
 * Verifica a assinatura do webhook para garantir autenticidade
 * @param payload Payload do webhook
 * @param signature Assinatura do webhook
 * @param secret Chave secreta para verificação
 * @returns Verdadeiro se a assinatura for válida
 */
function verifyWebhookSignature(payload: any, signature: string, secret: string): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    const calculatedSignature = hmac.update(JSON.stringify(payload)).digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(calculatedSignature),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error('Erro ao verificar assinatura do webhook:', error);
    return false;
  }
}

/**
 * Endpoint para receber webhooks de gateways de pagamento
 * Implementa verificação de assinatura para segurança
 * e registra logs detalhados de todas as transações
 */
export async function POST(request: NextRequest) {
  try {
    // Obter dados da requisição
    const body = await request.json();
    const signature = request.headers.get('x-webhook-signature') || '';
    const gatewayName = request.headers.get('x-webhook-source') || 'unknown';
    
    // Informações da requisição para log
    const requestInfo = {
      ip: request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };
    
    // Validar payload do webhook
    const validationResult = webhookPayloadSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Payload de webhook inválido:', validationResult.error);
      
      // Registrar tentativa inválida
      await TransactionLogger.logWebhook(
        { ...body, validation_error: validationResult.error.message },
        TransactionStatus.FAILURE,
        requestInfo
      );
      
      return NextResponse.json(
        { error: 'Payload inválido', details: validationResult.error.message },
        { status: 400 }
      );
    }
    
    // Obter chave secreta para o gateway
    const webhookSecret = getWebhookSecretForGateway(body.gateway);
    
    // Verificar assinatura do webhook
    if (!verifyWebhookSignature(body.data, signature, webhookSecret)) {
      console.error('Assinatura de webhook inválida');
      
      // Registrar tentativa com assinatura inválida
      await TransactionLogger.logWebhook(
        { ...body, signature_error: true },
        TransactionStatus.FAILURE,
        requestInfo
      );
      
      return NextResponse.json(
        { error: 'Assinatura inválida' },
        { status: 401 }
      );
    }
    
    // Registrar webhook válido
    await TransactionLogger.logWebhook(
      body,
      TransactionStatus.SUCCESS,
      requestInfo
    );
    
    // Processar webhook de acordo com o tipo de evento
    switch (body.event) {
      case WebhookEventType.PAYMENT_SUCCEEDED:
        // Processar pagamento bem-sucedido
        await processPaymentSucceeded(body.data);
        break;
      case WebhookEventType.PAYMENT_FAILED:
        // Processar falha de pagamento
        await processPaymentFailed(body.data);
        break;
      case WebhookEventType.PAYMENT_REFUNDED:
        // Processar reembolso
        await processPaymentRefunded(body.data);
        break;
      case WebhookEventType.PAYMENT_CHARGEBACK:
        // Processar chargeback
        await processPaymentChargeback(body.data);
        break;
      default:
        // Registrar evento desconhecido
        console.warn('Tipo de evento de webhook desconhecido:', body.event);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

/**
 * Obtém a chave secreta para verificação de assinatura do webhook
 * @param gateway Nome do gateway de pagamento
 * @returns Chave secreta
 */
function getWebhookSecretForGateway(gateway: string): string {
  const secrets: Record<string, string> = {
    lytex: process.env.LYTEX_WEBHOOK_SECRET || '',
    pagseguro: process.env.PAGSEGURO_WEBHOOK_SECRET || '',
    mercadopago: process.env.MERCADOPAGO_WEBHOOK_SECRET || '',
    stripe: process.env.STRIPE_WEBHOOK_SECRET || '',
    paypal: process.env.PAYPAL_WEBHOOK_SECRET || ''
  };
  
  return secrets[gateway.toLowerCase()] || '';
}

/**
 * Processa webhook de pagamento bem-sucedido
 * @param data Dados do pagamento
 */
async function processPaymentSucceeded(data: any): Promise<void> {
  // Implementação do processamento de pagamento bem-sucedido
  console.log('Processando pagamento bem-sucedido:', data.id);
  
  // Aqui seria implementada a lógica para atualizar o status do pagamento no banco de dados,
  // enviar notificações, etc.
}

/**
 * Processa webhook de falha de pagamento
 * @param data Dados do pagamento
 */
async function processPaymentFailed(data: any): Promise<void> {
  // Implementação do processamento de falha de pagamento
  console.log('Processando falha de pagamento:', data.id);
  
  // Aqui seria implementada a lógica para atualizar o status do pagamento no banco de dados,
  // enviar notificações, etc.
}

/**
 * Processa webhook de reembolso
 * @param data Dados do reembolso
 */
async function processPaymentRefunded(data: any): Promise<void> {
  // Implementação do processamento de reembolso
  console.log('Processando reembolso:', data.id);
  
  // Aqui seria implementada a lógica para atualizar o status do pagamento no banco de dados,
  // enviar notificações, etc.
}

/**
 * Processa webhook de chargeback
 * @param data Dados do chargeback
 */
async function processPaymentChargeback(data: any): Promise<void> {
  // Implementação do processamento de chargeback
  console.log('Processando chargeback:', data.id);
  
  // Aqui seria implementada a lógica para atualizar o status do pagamento no banco de dados,
  // enviar notificações, etc.
}
