import { z } from 'zod';
import { ActionResponse } from '@/types/actions';

/**
 * Tipos para integração com sistemas de análise de crédito
 */
export enum CreditScoreLevel {
  BAIXO = 'baixo',
  MEDIO = 'medio',
  ALTO = 'alto'
}

export const creditScoreSchema = z.object({
  cpf: z.string().min(11).max(14),
  score: z.number().min(0).max(1000),
  level: z.nativeEnum(CreditScoreLevel),
  lastUpdate: z.string().datetime(),
  details: z.record(z.any()).optional()
});

export type CreditScoreResult = z.infer<typeof creditScoreSchema>;

/**
 * Tipos para integração com gateways de pagamento adicionais
 */
export enum PaymentGateway {
  LYTEX = 'lytex',
  PAGSEGURO = 'pagseguro',
  MERCADOPAGO = 'mercadopago',
  STRIPE = 'stripe',
  PAYPAL = 'paypal'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BOLETO = 'boleto',
  PIX = 'pix',
  TRANSFER = 'transfer',
  DIGITAL_WALLET = 'digital_wallet'
}

export enum DigitalWallet {
  GOOGLE_PAY = 'google_pay',
  APPLE_PAY = 'apple_pay',
  SAMSUNG_PAY = 'samsung_pay',
  MERCADOPAGO_WALLET = 'mercadopago_wallet',
  PICPAY = 'picpay',
  PAYPAL = 'paypal'
}

export const paymentRequestSchema = z.object({
  gateway: z.nativeEnum(PaymentGateway),
  method: z.nativeEnum(PaymentMethod),
  amount: z.number().positive(),
  description: z.string(),
  reference: z.string(),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    document: z.string(),
    phone: z.string().optional()
  }),
  digitalWallet: z.nativeEnum(DigitalWallet).optional(),
  installments: z.number().int().positive().optional(),
  dueDate: z.string().datetime().optional(),
  callbackUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional()
});

export type PaymentRequest = z.infer<typeof paymentRequestSchema>;

export const paymentResponseSchema = z.object({
  id: z.string(),
  gateway: z.nativeEnum(PaymentGateway),
  status: z.string(),
  amount: z.number(),
  paymentUrl: z.string().url().optional(),
  qrCode: z.string().optional(),
  barCode: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  gatewayResponse: z.record(z.any())
});

export type PaymentResponse = z.infer<typeof paymentResponseSchema>;

/**
 * Tipos para webhooks de gateways de pagamento
 */
export enum WebhookEventType {
  PAYMENT_CREATED = 'payment.created',
  PAYMENT_UPDATED = 'payment.updated',
  PAYMENT_SUCCEEDED = 'payment.succeeded',
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_REFUNDED = 'payment.refunded',
  PAYMENT_CHARGEBACK = 'payment.chargeback'
}

export const webhookPayloadSchema = z.object({
  gateway: z.nativeEnum(PaymentGateway),
  event: z.nativeEnum(WebhookEventType),
  data: z.record(z.any()),
  signature: z.string().optional()
});

export type WebhookPayload = z.infer<typeof webhookPayloadSchema>;
