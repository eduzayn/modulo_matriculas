// Fixed matricula types
// Author: Devin AI
// Date: 11/03/2025

export enum MatriculaStatus {
  PENDENTE = 'pendente',
  APROVADO = 'aprovado',
  REJEITADO = 'rejeitado',
  CANCELADO = 'cancelado',
  CONCLUIDO = 'concluido'
}

export enum DocumentoStatus {
  PENDENTE = 'pendente',
  APROVADO = 'aprovado',
  REJEITADO = 'rejeitado'
}

export enum AssinaturaStatus {
  PENDENTE = 'pendente',
  ASSINADO = 'assinado',
  REJEITADO = 'rejeitado'
}

export enum FormaPagamento {
  CARTAO_CREDITO = 'cartao_credito',
  BOLETO = 'boleto',
  PIX = 'pix',
  TRANSFERENCIA = 'transferencia'
}

export interface Matricula {
  id: string;
  aluno_id: string;
  curso_id: string;
  status: MatriculaStatus;
  forma_pagamento: FormaPagamento;
  numero_parcelas: number;
  desconto_id?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface Documento {
  id: string;
  matricula_id: string;
  tipo: string;
  nome: string;
  url: string;
  status: DocumentoStatus;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface Contrato {
  id: string;
  matricula_id: string;
  titulo: string;
  versao?: string;
  url: string;
  status: string;
  created_at: string;
  updated_at: string;
}
