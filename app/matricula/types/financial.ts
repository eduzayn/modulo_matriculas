// Financial module types
// Author: Devin AI
// Date: 11/03/2025

import { z } from 'zod';

/**
 * Enum for payment status
 */
export enum PaymentStatus {
  PENDENTE = 'pendente',
  PAGO = 'pago',
  ATRASADO = 'atrasado',
  CANCELADO = 'cancelado',
  REEMBOLSADO = 'reembolsado'
}

/**
 * Enum for payment methods
 */
export enum PaymentMethod {
  CARTAO_CREDITO = 'cartao_credito',
  BOLETO = 'boleto',
  PIX = 'pix',
  TRANSFERENCIA = 'transferencia'
}

/**
 * Enum for discount types
 */
export enum DiscountType {
  PERCENTUAL = 'percentual',
  VALOR_FIXO = 'valor_fixo'
}

/**
 * Enum for negotiation status
 */
export enum NegotiationStatus {
  PENDENTE = 'pendente',
  APROVADA = 'aprovada',
  REJEITADA = 'rejeitada',
  CANCELADA = 'cancelada',
  CONCLUIDA = 'concluida'
}

/**
 * Enum for transaction types
 */
export enum TransactionType {
  RECEITA = 'income',
  DESPESA = 'expense',
  REEMBOLSO = 'refund'
}

/**
 * Enum for transaction status
 */
export enum TransactionStatus {
  PENDENTE = 'pending',
  CONCLUIDA = 'completed',
  FALHA = 'failed',
  CANCELADA = 'cancelled'
}

/**
 * Enum for webhook event types
 */
export enum WebhookEventType {
  PAYMENT_CREATED = 'payment.created',
  PAYMENT_APPROVED = 'payment.approved',
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_REFUNDED = 'payment.refunded',
  PAYMENT_CHARGEBACK = 'payment.chargeback',
  BOLETO_EXPIRED = 'boleto.expired',
  BOLETO_PAID = 'boleto.paid'
}

/**
 * Interface for payment entity
 */
export interface Payment {
  id: string;
  matricula_id: string;
  numero_parcela: number;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: PaymentStatus;
  forma_pagamento: PaymentMethod;
  gateway_id?: string;
  gateway_data?: Record<string, any>;
  comprovante_url?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for discount entity
 */
export interface Discount {
  id: string;
  nome: string;
  descricao?: string;
  tipo: DiscountType;
  valor: number;
  data_inicio?: string;
  data_fim?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for transaction entity
 */
export interface Transaction {
  id: string;
  reference_id: string;
  reference_type: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  payment_method?: string;
  gateway_id?: string;
  gateway_data?: Record<string, any>;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for invoice entity
 */
export interface Invoice {
  id: string;
  matricula_id: string;
  aluno_id: string;
  numero: string;
  data_emissao: string;
  data_vencimento: string;
  valor_total: number;
  status: PaymentStatus;
  url?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  items?: InvoiceItem[];
}

/**
 * Interface for invoice item entity
 */
export interface InvoiceItem {
  id: string;
  invoice_id: string;
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for negotiation entity
 */
export interface Negotiation {
  id: string;
  aluno_id: string;
  responsavel_id?: string;
  status: NegotiationStatus;
  valor_original: number;
  valor_negociado: number;
  numero_parcelas: number;
  data_primeira_parcela: string;
  observacoes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  items?: NegotiationItem[];
}

/**
 * Interface for negotiation item entity
 */
export interface NegotiationItem {
  id: string;
  negotiation_id: string;
  payment_id: string;
  valor_original: number;
  valor_negociado: number;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for Lytex integration entity
 */
export interface LytexIntegration {
  id: string;
  payment_id: string;
  lytex_id: string;
  status: string;
  payment_method: string;
  payment_url?: string;
  payment_data?: Record<string, any>;
  callback_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/**
 * Zod schema for payment
 */
export const paymentSchema = z.object({
  matricula_id: z.string().uuid({ message: 'ID de matrícula inválido' }),
  numero_parcela: z.number().int().min(1, { message: 'Número de parcela inválido' }),
  valor: z.number().positive({ message: 'Valor deve ser positivo' }),
  data_vencimento: z.string().refine((data) => {
    const date = new Date(data);
    return !isNaN(date.getTime());
  }, { message: 'Data de vencimento inválida' }),
  status: z.nativeEnum(PaymentStatus).default(PaymentStatus.PENDENTE),
  forma_pagamento: z.nativeEnum(PaymentMethod),
  gateway_id: z.string().optional(),
  gateway_data: z.record(z.any()).optional(),
  comprovante_url: z.string().url({ message: 'URL de comprovante inválida' }).optional(),
  observacoes: z.string().optional(),
});

/**
 * Zod schema for discount
 */
export const discountSchema = z.object({
  nome: z.string().min(3, { message: 'Nome é obrigatório' }),
  descricao: z.string().optional(),
  tipo: z.nativeEnum(DiscountType),
  valor: z.number().positive({ message: 'Valor deve ser positivo' }),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  ativo: z.boolean().default(true),
});

/**
 * Zod schema for transaction
 */
export const transactionSchema = z.object({
  reference_id: z.string().uuid({ message: 'ID de referência inválido' }),
  reference_type: z.string().min(1, { message: 'Tipo de referência é obrigatório' }),
  amount: z.number().positive({ message: 'Valor deve ser positivo' }),
  type: z.nativeEnum(TransactionType),
  status: z.nativeEnum(TransactionStatus).default(TransactionStatus.PENDENTE),
  payment_method: z.string().optional(),
  gateway_id: z.string().optional(),
  gateway_data: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for invoice
 */
export const invoiceSchema = z.object({
  matricula_id: z.string().uuid({ message: 'ID de matrícula inválido' }),
  aluno_id: z.string().uuid({ message: 'ID de aluno inválido' }),
  numero: z.string().min(1, { message: 'Número é obrigatório' }),
  data_emissao: z.string().refine((data) => {
    const date = new Date(data);
    return !isNaN(date.getTime());
  }, { message: 'Data de emissão inválida' }),
  data_vencimento: z.string().refine((data) => {
    const date = new Date(data);
    return !isNaN(date.getTime());
  }, { message: 'Data de vencimento inválida' }),
  valor_total: z.number().positive({ message: 'Valor total deve ser positivo' }),
  status: z.nativeEnum(PaymentStatus).default(PaymentStatus.PENDENTE),
  url: z.string().url({ message: 'URL inválida' }).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for negotiation
 */
export const negotiationSchema = z.object({
  aluno_id: z.string().uuid({ message: 'ID de aluno inválido' }),
  responsavel_id: z.string().uuid({ message: 'ID de responsável inválido' }).optional(),
  status: z.nativeEnum(NegotiationStatus).default(NegotiationStatus.PENDENTE),
  valor_original: z.number().positive({ message: 'Valor original deve ser positivo' }),
  valor_negociado: z.number().positive({ message: 'Valor negociado deve ser positivo' }),
  numero_parcelas: z.number().int().min(1, { message: 'Número de parcelas inválido' }),
  data_primeira_parcela: z.string().refine((data) => {
    const date = new Date(data);
    return !isNaN(date.getTime());
  }, { message: 'Data da primeira parcela inválida' }),
  observacoes: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for Lytex webhook
 */
export const webhookSchema = z.object({
  event: z.nativeEnum(WebhookEventType),
  data: z.record(z.any()),
  timestamp: z.number(),
  signature: z.string(),
});
