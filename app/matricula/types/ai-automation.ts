import { z } from 'zod';
import { DocumentoStatus } from './matricula';

// Enums
export enum OCRStatus {
  PENDENTE = 'pendente',
  EM_PROCESSAMENTO = 'em_processamento',
  CONCLUIDO = 'concluido',
  FALHA = 'falha',
}

export enum ChatbotIntent {
  MATRICULA = 'matricula',
  DOCUMENTOS = 'documentos',
  PAGAMENTOS = 'pagamentos',
  TURMAS = 'turmas',
  BOLSAS = 'bolsas',
  SUPORTE = 'suporte',
  OUTROS = 'outros',
}

export enum EvasionRisk {
  BAIXO = 'baixo',
  MEDIO = 'medio',
  ALTO = 'alto',
  MUITO_ALTO = 'muito_alto',
}

// Define schemas for various actions
export const verificacaoIdSchema = z.object({
  verificacao_id: z.string().uuid()
});

export const novaChatbotConversaSchema = z.object({
  aluno_id: z.string().uuid().optional(),
  intent: z.nativeEnum(ChatbotIntent).optional()
});

// Interfaces para verificação automática de documentos com OCR
export interface OCRVerificacao {
  id: string;
  documento_id: string;
  status: OCRStatus;
  data_processamento?: Date;
  resultado?: Record<string, any>;
  confianca?: number;
  texto_extraido?: string;
  campos_validados?: Record<string, any>;
  erros?: string[];
  created_at: string;
  updated_at: string;
}

export interface OCRModeloDocumento {
  id: string;
  tipo_documento: string;
  campos_obrigatorios: Record<string, boolean>;
  padroes_validacao?: Record<string, string>;
  exemplos?: string[];
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// Interfaces para chatbot de dúvidas frequentes
export interface ChatbotConversa {
  id: string;
  aluno_id?: string;
  sessao_id: string;
  data_inicio: Date;
  data_fim?: Date;
  intent?: ChatbotIntent;
  contexto?: Record<string, any>;
  feedback?: number;
  resolvido: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatbotMensagem {
  id: string;
  conversa_id: string;
  remetente: 'aluno' | 'bot' | 'atendente';
  mensagem: string;
  intent?: ChatbotIntent;
  entidades?: Record<string, any>;
  timestamp: Date;
  created_at: string;
}

export interface ChatbotIntentConfig {
  id: string;
  nome: string;
  tipo: ChatbotIntent;
  frases_treinamento: string[];
  respostas: string[];
  contexto_necessario?: Record<string, any>;
  acoes?: Record<string, any>;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// Interfaces para análise preditiva de evasão
export interface AnaliseEvasao {
  id: string;
  aluno_id: string;
  matricula_id: string;
  risco: EvasionRisk;
  score?: number;
  fatores?: Record<string, any>;
  ultima_analise: Date;
  acoes_recomendadas?: Record<string, any>;
  acoes_tomadas?: Record<string, any>;
  resultado?: string;
  created_at: string;
  updated_at: string;
}

export interface IndicadorEvasao {
  id: string;
  nome: string;
  descricao?: string;
  peso: number;
  formula?: string;
  parametros?: Record<string, any>;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// Interfaces para recomendação inteligente de turmas/horários
export interface RecomendacaoTurma {
  id: string;
  aluno_id: string;
  curso_id: string;
  turmas_recomendadas: string[];
  score_compatibilidade?: Record<string, any>;
  criterios_utilizados?: Record<string, any>;
  preferencias_aluno?: Record<string, any>;
  data_recomendacao: Date;
  aceita?: boolean;
  data_resposta?: Date;
  created_at: string;
  updated_at: string;
}

export interface PreferenciaAluno {
  id: string;
  aluno_id: string;
  horarios_preferidos?: Record<string, any>;
  modalidade_preferida?: 'presencial' | 'online' | 'hibrido';
  restricoes?: Record<string, any>;
  interesses?: string[];
  historico_academico?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Interface para métricas e logs de IA
export interface MetricaIA {
  id: string;
  tipo: 'ocr' | 'chatbot' | 'evasao' | 'recomendacao';
  data: Date;
  metricas: Record<string, any>;
  detalhes?: Record<string, any>;
  created_at: string;
}

// Interface para integração de IA no módulo de matrículas
export interface AIIntegration {
  ocr: {
    ativo: boolean;
    verificacao_automatica: boolean;
    confianca_minima: number;
    modelos: OCRModeloDocumento[];
  };
  
  chatbot: {
    ativo: boolean;
    intents: ChatbotIntent[];
    transferencia_atendente: boolean;
    feedback_automatico: boolean;
  };
  
  analise_evasao: {
    ativo: boolean;
    frequencia_analise: string;
    notificacao_risco: boolean;
    acoes_automaticas: boolean;
    indicadores: IndicadorEvasao[];
  };
  
  recomendacao_turmas: {
    ativo: boolean;
    criterios_personalizados: boolean;
    coleta_preferencias: boolean;
    notificacao_recomendacoes: boolean;
  };
  
  metricas: {
    coleta_ativa: boolean;
    dashboard_disponivel: boolean;
    alertas_desempenho: boolean;
  };
}

// Schemas Zod para validação
export const ocrVerificacaoSchema = z.object({
  documento_id: z.string().uuid(),
  status: z.nativeEnum(OCRStatus).optional().default(OCRStatus.PENDENTE),
  campos_validados: z.record(z.any()).optional(),
});

// Tipo para intents do chatbot para evitar conflito com o enum
export type ChatbotIntentType = ChatbotIntent;

export const chatbotMensagemSchema = z.object({
  conversa_id: z.string().uuid(),
  remetente: z.enum(['aluno', 'bot', 'atendente']),
  mensagem: z.string().min(1),
  intent: z.nativeEnum(ChatbotIntent).optional(),
  entidades: z.record(z.any()).optional(),
});

export const analiseEvasaoSchema = z.object({
  aluno_id: z.string().uuid(),
  matricula_id: z.string().uuid(),
  risco: z.nativeEnum(EvasionRisk).optional(),
  fatores: z.record(z.any()).optional(),
});

export const recomendacaoTurmaSchema = z.object({
  aluno_id: z.string().uuid(),
  curso_id: z.string().uuid(),
  turmas_recomendadas: z.array(z.string().uuid()),
  criterios_utilizados: z.record(z.any()).optional(),
  preferencias_aluno: z.record(z.any()).optional(),
});

export const preferenciaAlunoSchema = z.object({
  aluno_id: z.string().uuid(),
  horarios_preferidos: z.record(z.any()).optional(),
  modalidade_preferida: z.enum(['presencial', 'online', 'hibrido']).optional(),
  restricoes: z.record(z.any()).optional(),
  interesses: z.array(z.string()).optional(),
  historico_academico: z.record(z.any()).optional(),
});
