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
  | 'INVALID_CLASS';

export class AppError extends Error {
  code: ErrorCode;

  constructor(message: string, code: ErrorCode) {
    super(message);
    this.code = code;
    this.name = 'AppError';
  }
}

export const appErrors = {
  UNEXPECTED_ERROR: new AppError('Ocorreu um erro inesperado', 'UNEXPECTED_ERROR'),
  NOT_FOUND: new AppError('Recurso não encontrado', 'NOT_FOUND'),
  UNAUTHORIZED: new AppError('Não autorizado', 'UNAUTHORIZED'),
  FORBIDDEN: new AppError('Acesso negado', 'FORBIDDEN'),
  VALIDATION_ERROR: new AppError('Erro de validação', 'VALIDATION_ERROR'),
};
