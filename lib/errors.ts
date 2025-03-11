export type ErrorCode =
  | 'UNEXPECTED_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
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
  | 'INVALID_NEGOTIATION';

export class AppError extends Error {
  code: ErrorCode;

  constructor(message: string, code: ErrorCode) {
    super(message);
    this.code = code;
    this.name = 'AppError';
  }
}

export const appErrors: Record<ErrorCode, AppError> = {
  UNEXPECTED_ERROR: new AppError('Ocorreu um erro inesperado', 'UNEXPECTED_ERROR'),
  NOT_FOUND: new AppError('Recurso não encontrado', 'NOT_FOUND'),
  UNAUTHORIZED: new AppError('Não autorizado', 'UNAUTHORIZED'),
  FORBIDDEN: new AppError('Acesso negado', 'FORBIDDEN'),
  VALIDATION_ERROR: new AppError('Erro de validação', 'VALIDATION_ERROR'),
  CREATION_FAILED: new AppError('Falha na criação', 'CREATION_FAILED'),
  UPDATE_FAILED: new AppError('Falha na atualização', 'UPDATE_FAILED'),
  DELETION_FAILED: new AppError('Falha na exclusão', 'DELETION_FAILED'),
  QUERY_ERROR: new AppError('Erro na consulta', 'QUERY_ERROR'),
  ALREADY_EXISTS: new AppError('Recurso já existe', 'ALREADY_EXISTS'),
  INVALID_STATUS: new AppError('Status inválido', 'INVALID_STATUS'),
  UPLOAD_FAILED: new AppError('Falha no upload', 'UPLOAD_FAILED'),
  ALREADY_ALLOCATED: new AppError('Já alocado', 'ALREADY_ALLOCATED'),
  NO_VACANCIES: new AppError('Sem vagas disponíveis', 'NO_VACANCIES'),
  ALREADY_SIGNED: new AppError('Já assinado', 'ALREADY_SIGNED'),
  INVALID_CLASS: new AppError('Turma inválida', 'INVALID_CLASS'),
  // Financial module error messages
  PAYMENT_FAILED: new AppError('Falha no processamento do pagamento', 'PAYMENT_FAILED'),
  ALREADY_PAID: new AppError('Este pagamento já foi registrado', 'ALREADY_PAID'),
  ALREADY_CANCELLED: new AppError('Este pagamento já foi cancelado', 'ALREADY_CANCELLED'),
  INSUFFICIENT_FUNDS: new AppError('Saldo insuficiente', 'INSUFFICIENT_FUNDS'),
  GATEWAY_ERROR: new AppError('Erro no gateway de pagamento', 'GATEWAY_ERROR'),
  INVALID_PAYMENT_METHOD: new AppError('Método de pagamento inválido', 'INVALID_PAYMENT_METHOD'),
  INVALID_DISCOUNT: new AppError('Desconto inválido', 'INVALID_DISCOUNT'),
  INVALID_NEGOTIATION: new AppError('Negociação inválida', 'INVALID_NEGOTIATION')
};
