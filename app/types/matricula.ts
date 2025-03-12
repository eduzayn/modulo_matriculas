export interface Matricula {
  id: string;
  aluno_id: string;
  curso_id: string;
  data_matricula: string;
  data_inicio: string;
  data_termino: string | null;
  status: MatriculaStatus;
  valor_total: number;
  valor_pago: number;
  forma_pagamento: FormaPagamento;
  parcelas: number;
  documentos: Documento[];
  contrato_url?: string;
  contrato_assinado: boolean;
  created_at: string;
  updated_at: string;
}

export enum MatriculaStatus {
  PENDENTE = 'pendente',
  ATIVA = 'ativa',
  CANCELADA = 'cancelada',
  CONCLUIDA = 'concluida',
  TRANCADA = 'trancada',
}

export enum FormaPagamento {
  BOLETO = 'boleto',
  CARTAO = 'cartao',
  PIX = 'pix',
  TRANSFERENCIA = 'transferencia',
}

export interface Documento {
  id: string;
  matricula_id: string;
  tipo: TipoDocumento;
  url: string;
  aprovado: boolean | null;
  observacao?: string;
  created_at: string;
  updated_at: string;
}

export enum TipoDocumento {
  RG = 'rg',
  CPF = 'cpf',
  COMPROVANTE_RESIDENCIA = 'comprovante_residencia',
  DIPLOMA = 'diploma',
  HISTORICO = 'historico',
  CONTRATO = 'contrato',
  OUTROS = 'outros',
}

export interface CreateMatriculaInput {
  aluno_id: string;
  curso_id: string;
  data_inicio: string;
  data_termino?: string;
  valor_total: number;
  forma_pagamento: FormaPagamento;
  parcelas: number;
}

export interface UpdateMatriculaStatusInput {
  matricula_id: string;
  status: MatriculaStatus;
  observacao?: string;
}

export interface UploadDocumentoInput {
  matricula_id: string;
  tipo: TipoDocumento;
  file: File;
}

export interface AvaliarDocumentoInput {
  documento_id: string;
  aprovado: boolean;
  observacao?: string;
}

export interface GerarContratoInput {
  matricula_id: string;
}

export interface AssinarContratoInput {
  matricula_id: string;
  assinatura: string;
}
