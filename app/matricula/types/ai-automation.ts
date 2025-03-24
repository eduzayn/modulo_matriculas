import { z } from 'zod';
import { OCRStatus, ChatbotIntent, EvasionRisk } from '@edunexia/types';

// Schema para verificação OCR
export const ocrVerificacaoSchema = z.object({
  documento_id: z.string(),
  campos_validados: z.record(z.any()).optional()
});

// Schema para mensagem do chatbot
export const chatbotMensagemSchema = z.object({
  conversa_id: z.string(),
  remetente: z.enum(['aluno', 'bot']),
  mensagem: z.string(),
  intent: z.nativeEnum(ChatbotIntent).optional(),
  entidades: z.record(z.any()).optional()
});

// Schema para análise de evasão
export const analiseEvasaoSchema = z.object({
  aluno_id: z.string(),
  matricula_id: z.string(),
  fatores: z.record(z.number()).optional()
});

// Schema para nova conversa do chatbot
export const novaChatbotConversaSchema = z.object({
  aluno_id: z.string().optional(),
  intent: z.nativeEnum(ChatbotIntent).optional()
});

// Schema para recomendação de turmas
export const recomendacaoTurmaSchema = z.object({
  aluno_id: z.string(),
  curso_id: z.string(),
  turmas_recomendadas: z.array(z.string()),
  criterios_utilizados: z.record(z.boolean()).optional(),
  preferencias_aluno: z.record(z.any()).optional()
});

// Schema para preferências do aluno
export const preferenciaAlunoSchema = z.object({
  aluno_id: z.string(),
  horarios_preferidos: z.array(z.string()),
  modalidade_preferida: z.string(),
  restricoes: z.array(z.string()).optional(),
  interesses: z.array(z.string()).optional(),
  historico_academico: z.record(z.any()).optional()
});

// Schema para verificação de ID
export const verificacaoIdSchema = z.object({
  verificacao_id: z.string()
}); 