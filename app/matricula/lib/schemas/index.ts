import { z } from 'zod';

// Schema for creating a matricula
export const matriculaSchema = z.object({
  aluno_id: z.string().uuid(),
  curso_id: z.string().uuid(),
  data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  data_termino: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  valor_total: z.number().positive(),
  forma_pagamento: z.enum(['boleto', 'cartao', 'pix', 'transferencia']),
  parcelas: z.number().int().positive(),
});

// Schema for updating matricula status
export const updateMatriculaStatusSchema = z.object({
  matricula_id: z.string().uuid(),
  status: z.enum(['pendente', 'ativa', 'cancelada', 'concluida', 'trancada']),
});

// Schema for uploading a document
export const uploadDocumentoSchema = z.object({
  matricula_id: z.string().uuid(),
  tipo: z.enum(['rg', 'cpf', 'comprovante_residencia', 'diploma', 'historico', 'contrato', 'outros']),
  file: z.any(), // This would be a File in the browser
});

// Schema for evaluating a document
export const avaliarDocumentoSchema = z.object({
  documento_id: z.string().uuid(),
  aprovado: z.boolean(),
  observacao: z.string().optional(),
});

// Schema for generating a contract
export const gerarContratoSchema = z.object({
  matricula_id: z.string().uuid(),
});

// Schema for signing a contract
export const assinarContratoSchema = z.object({
  matricula_id: z.string().uuid(),
  assinatura: z.string(),
});

// Schema for payment
export const paymentSchema = z.object({
  matricula_id: z.string().uuid(),
  valor: z.number().positive(),
  data_vencimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  forma_pagamento: z.enum(['boleto', 'cartao', 'pix', 'transferencia']),
});

// Schema for discount
export const discountSchema = z.object({
  nome: z.string().min(3),
  codigo: z.string().min(3),
  tipo: z.enum(['percentual', 'valor_fixo']),
  valor: z.number().positive(),
  data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  data_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cursos_aplicaveis: z.array(z.string().uuid()).optional(),
  limite_usos: z.number().int().positive().optional(),
});

// Schema for feedback
export const feedbackSchema = z.object({
  matricula_id: z.string().uuid().optional(),
  aluno_id: z.string().uuid(),
  tipo: z.enum(['sugestao', 'elogio', 'reclamacao', 'duvida']),
  assunto: z.string().min(3),
  mensagem: z.string().min(10),
  avaliacao: z.number().int().min(1).max(5).optional(),
});

// Schema for report generation
export const reportSchema = z.object({
  tipo: z.enum(['financeiro', 'matriculas', 'alunos', 'cursos']),
  periodo: z.object({
    inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  filtros: z.record(z.string(), z.any()).optional(),
  formato: z.enum(['excel', 'pdf', 'csv']).default('excel'),
});
