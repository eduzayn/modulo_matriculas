export type ErrorCode =
  | 'UNEXPECTED_ERROR'
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'VALIDATION_ERROR'
  | 'CREATION_FAILED'
  | 'UPDATE_FAILED'
  | 'DELETION_FAILED'
  | 'QUERY_ERROR'
  | 'ALREADY_EXISTS'
  | 'INVALID_STATUS'
  | 'UPLOAD_FAILED'
  | 'ALREADY_ALLOCATED'
  | 'NO_VACANCIES'
  | 'ALREADY_SIGNED'
  | 'INVALID_CLASS'
  // Financial module error codes
  | 'PAYMENT_FAILED'
  | 'ALREADY_PAID'
  | 'ALREADY_CANCELLED'
  | 'INSUFFICIENT_FUNDS'
  | 'GATEWAY_ERROR'
  | 'INVALID_PAYMENT_METHOD'
  | 'INVALID_DISCOUNT'
  | 'INVALID_NEGOTIATION'
  | 'INVALID_INPUT'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const appErrors = {
  INVALID_INPUT: new AppError('INVALID_INPUT', 'Entrada inválida'),
  NOT_FOUND: new AppError('NOT_FOUND', 'Recurso não encontrado'),
  FORBIDDEN: new AppError('FORBIDDEN', 'Acesso negado'),
  VALIDATION_ERROR: new AppError('VALIDATION_ERROR', 'Erro de validação'),
  GATEWAY_ERROR: new AppError('GATEWAY_ERROR', 'Erro de comunicação com serviço externo'),
  INTERNAL_ERROR: new AppError('INTERNAL_ERROR', 'Erro interno do servidor'),
  UNEXPECTED_ERROR: new AppError('UNEXPECTED_ERROR', 'Erro inesperado'),
  CREATION_FAILED: new AppError('CREATION_FAILED', 'Falha na criação'),
  UPDATE_FAILED: new AppError('UPDATE_FAILED', 'Falha na atualização'),
  DELETION_FAILED: new AppError('DELETION_FAILED', 'Falha na exclusão'),
  QUERY_ERROR: new AppError('QUERY_ERROR', 'Erro na consulta'),
  ALREADY_EXISTS: new AppError('ALREADY_EXISTS', 'Recurso já existe'),
  INVALID_STATUS: new AppError('INVALID_STATUS', 'Status inválido'),
  UPLOAD_FAILED: new AppError('UPLOAD_FAILED', 'Falha no upload'),
  ALREADY_ALLOCATED: new AppError('ALREADY_ALLOCATED', 'Já alocado'),
  NO_VACANCIES: new AppError('NO_VACANCIES', 'Sem vagas disponíveis'),
  ALREADY_SIGNED: new AppError('ALREADY_SIGNED', 'Já assinado'),
  INVALID_CLASS: new AppError('INVALID_CLASS', 'Turma inválida'),
  PAYMENT_FAILED: new AppError('PAYMENT_FAILED', 'Falha no processamento do pagamento'),
  ALREADY_PAID: new AppError('ALREADY_PAID', 'Este pagamento já foi registrado'),
  ALREADY_CANCELLED: new AppError('ALREADY_CANCELLED', 'Este pagamento já foi cancelado'),
  INSUFFICIENT_FUNDS: new AppError('INSUFFICIENT_FUNDS', 'Saldo insuficiente'),
  INVALID_PAYMENT_METHOD: new AppError('INVALID_PAYMENT_METHOD', 'Método de pagamento inválido'),
  INVALID_DISCOUNT: new AppError('INVALID_DISCOUNT', 'Desconto inválido'),
  INVALID_NEGOTIATION: new AppError('INVALID_NEGOTIATION', 'Negociação inválida')
};
