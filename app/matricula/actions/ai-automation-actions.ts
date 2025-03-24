'use server';

import { action } from '@/lib/safe-action';
import { z } from 'zod';
import { AppError, appErrors } from '@/lib/errors';
import { 
  ActionResponse,
  OCRStatus,
  ChatbotIntent,
  ChatbotIntentConfig,
  ChatbotIntentType,
  EvasionRisk
} from '@edunexia/types';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { 
  ocrVerificacaoSchema, 
  chatbotMensagemSchema, 
  analiseEvasaoSchema,
  novaChatbotConversaSchema,
  recomendacaoTurmaSchema,
  preferenciaAlunoSchema,
  verificacaoIdSchema
} from '../types/ai-automation';

// Use imported action from safe-action

// OCR Document Verification Actions
export const processarDocumentoOCR = action(
  ocrVerificacaoSchema as any,
  async (data: z.infer<typeof ocrVerificacaoSchema>): Promise<ActionResponse<{ verificacao_id: string }>> => {
    try {
      const supabase = createClient(cookies());
      
      // Verificar se o documento existe
      const { data: documento, error: documentoError } = await supabase
        .from('documentos')
        .select('*')
        .eq('id', data.documento_id)
        .single();
      
      if (documentoError || !documento) {
        throw new AppError(
          'Documento não encontrado',
          'NOT_FOUND'
        );
      }
      
      // Criar registro de verificação OCR
      const { data: verificacao, error: verificacaoError } = await supabase
        .from('ocr_verificacoes')
        .insert({
          documento_id: data.documento_id,
          status: OCRStatus.EM_PROCESSAMENTO,
          campos_validados: data.campos_validados || {}
        })
        .select('id')
        .single();
      
      if (verificacaoError) {
        throw new AppError(
          'Erro ao criar verificação OCR',
          'UNEXPECTED_ERROR'
        );
      }
      
      // Aqui seria chamado o serviço de OCR externo (assíncrono)
      // Simulação: Em produção, isso seria feito por um worker
      
      return {
        success: true,
        data: {
          verificacao_id: verificacao.id
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        return {
          success: false,
          error
        };
      }
      
      return {
        success: false,
        error: new AppError(
          'Erro ao processar documento com OCR',
          'UNEXPECTED_ERROR'
        )
      };
    }
  }
);

export const obterResultadoOCR = action(
  verificacaoIdSchema as any,
  async (data: { verificacao_id: string }): Promise<ActionResponse<{ verificacao: any }>> => {
    try {
      const supabase = createClient(cookies());
      
      const { data: verificacao, error } = await supabase
        .from('ocr_verificacoes')
        .select('*')
        .eq('id', data.verificacao_id)
        .single();
      
      if (error || !verificacao) {
        throw new AppError(
          'Verificação OCR não encontrada',
          'NOT_FOUND'
        );
      }
      
      return {
        success: true,
        data: {
          verificacao
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        return {
          success: false,
          error
        };
      }
      
      return {
        success: false,
        error: new AppError(
          'Erro ao obter resultado da verificação OCR',
          'UNEXPECTED_ERROR'
        )
      };
    }
  }
);

// Chatbot Actions
export const enviarMensagemChatbot = action(
  chatbotMensagemSchema as any,
  async (data: z.infer<typeof chatbotMensagemSchema>): Promise<ActionResponse<{ mensagem: any, resposta?: any }>> => {
    try {
      const supabase = createClient(cookies());
      
      // Verificar se a conversa existe
      const { data: conversa, error: conversaError } = await supabase
        .from('chatbot_conversas')
        .select('*')
        .eq('id', data.conversa_id)
        .single();
      
      if (conversaError || !conversa) {
        throw new AppError(
          'Conversa não encontrada',
          'NOT_FOUND'
        );
      }
      
      // Inserir mensagem do usuário
      const { data: mensagem, error: mensagemError } = await supabase
        .from('chatbot_mensagens')
        .insert({
          conversa_id: data.conversa_id,
          remetente: data.remetente,
          mensagem: data.mensagem,
          intent: data.intent,
          entidades: data.entidades
        })
        .select('*')
        .single();
      
      if (mensagemError) {
        throw new AppError(
          'Erro ao enviar mensagem',
          'UNEXPECTED_ERROR'
        );
      }
      
      // Aqui seria processada a resposta do chatbot
      // Simulação: Em produção, isso seria feito por um serviço de NLP
      
      // Gerar resposta automática (simulação)
      let resposta = null;
      if (data.remetente === 'aluno') {
        const { data: respostaBot, error: respostaError } = await supabase
          .from('chatbot_mensagens')
          .insert({
            conversa_id: data.conversa_id,
            remetente: 'bot',
            mensagem: 'Estou processando sua solicitação. Como posso ajudar com sua matrícula?',
            intent: data.intent
          })
          .select('*')
          .single();
          
        if (!respostaError) {
          resposta = respostaBot;
        }
      }
      
      return {
        success: true,
        data: {
          mensagem,
          resposta
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        return {
          success: false,
          error
        };
      }
      
      return {
        success: false,
        error: new AppError(
          'Erro ao processar mensagem do chatbot',
          'UNEXPECTED_ERROR'
        )
      };
    }
  }
);

export const criarNovaConversa = action(
  novaChatbotConversaSchema as any,
  async (data: { aluno_id?: string; intent?: ChatbotIntent }): Promise<ActionResponse<{ conversa: any }>> => {
    try {
      const supabase = createClient(cookies());
      
      const { data: conversa, error } = await supabase
        .from('chatbot_conversas')
        .insert({
          aluno_id: data.aluno_id,
          sessao_id: `session_${Date.now()}`,
          intent: data.intent,
          resolvido: false
        })
        .select('*')
        .single();
      
      if (error) {
        throw new AppError(
          'Erro ao criar nova conversa',
          'UNEXPECTED_ERROR'
        );
      }
      
      return {
        success: true,
        data: {
          conversa
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        return {
          success: false,
          error
        };
      }
      
      return {
        success: false,
        error: new AppError(
          'Erro ao criar nova conversa',
          'UNEXPECTED_ERROR'
        )
      };
    }
  }
);

// Análise de Evasão Actions
export const analisarRiscoEvasao = action(
  analiseEvasaoSchema as any,
  async (data: z.infer<typeof analiseEvasaoSchema>): Promise<ActionResponse<{ analise: any }>> => {
    try {
      const supabase = createClient(cookies());
      
      // Verificar se a matrícula existe
      const { data: matricula, error: matriculaError } = await supabase
        .from('matriculas')
        .select('*')
        .eq('id', data.matricula_id)
        .single();
      
      if (matriculaError || !matricula) {
        throw new AppError(
          'Matrícula não encontrada',
          'NOT_FOUND'
        );
      }
      
      // Verificar se já existe análise para esta matrícula
      const { data: analiseExistente, error: analiseError } = await supabase
        .from('analise_evasao')
        .select('*')
        .eq('matricula_id', data.matricula_id)
        .maybeSingle();
      
      // Fatores de risco (simulação)
      const fatores = data.fatores || {
        frequencia_acesso: 0.7,
        pagamentos_atrasados: 0.3,
        desempenho_academico: 0.5,
        interacao_conteudo: 0.6
      };
      
      // Cálculo do score (simulação)
      const score = Object.values(fatores as Record<string, number>).reduce((acc: number, val: number) => acc + val, 0) / 
        Object.values(fatores as Record<string, number>).length;
      
      // Determinação do risco
      let risco = EvasionRisk.BAIXO;
      if (score > 0.7) {
        risco = EvasionRisk.MUITO_ALTO;
      } else if (score > 0.5) {
        risco = EvasionRisk.ALTO;
      } else if (score > 0.3) {
        risco = EvasionRisk.MEDIO;
      }
      
      let analise;
      if (analiseExistente) {
        // Atualizar análise existente
        const { data: analiseAtualizada, error: updateError } = await supabase
          .from('analise_evasao')
          .update({
            risco,
            score,
            fatores,
            ultima_analise: new Date().toISOString()
          })
          .eq('id', analiseExistente.id)
          .select('*')
          .single();
          
        if (updateError) {
          throw new AppError(
            'Erro ao atualizar análise de evasão',
            'UNEXPECTED_ERROR'
          );
        }
        
        analise = analiseAtualizada;
      } else {
        // Criar nova análise
        const { data: novaAnalise, error: insertError } = await supabase
          .from('analise_evasao')
          .insert({
            aluno_id: data.aluno_id,
            matricula_id: data.matricula_id,
            risco,
            score,
            fatores,
            ultima_analise: new Date().toISOString()
          })
          .select('*')
          .single();
          
        if (insertError) {
          throw new AppError(
            'Erro ao criar análise de evasão',
            'UNEXPECTED_ERROR'
          );
        }
        
        analise = novaAnalise;
      }
      
      return {
        success: true,
        data: {
          analise
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        return {
          success: false,
          error
        };
      }
      
      return {
        success: false,
        error: new AppError(
          'Erro ao analisar risco de evasão',
          'UNEXPECTED_ERROR'
        )
      };
    }
  }
);

// Recomendação de Turmas Actions
export const gerarRecomendacoesTurmas = action(
  recomendacaoTurmaSchema as any,
  async (data: z.infer<typeof recomendacaoTurmaSchema>): Promise<ActionResponse<{ recomendacao: any }>> => {
    try {
      const supabase = createClient(cookies());
      
      // Verificar se o curso existe
      const { data: curso, error: cursoError } = await supabase
        .from('cursos')
        .select('*')
        .eq('id', data.curso_id)
        .single();
      
      if (cursoError || !curso) {
        throw new AppError(
          'Curso não encontrado',
          'NOT_FOUND'
        );
      }
      
      // Obter preferências do aluno (se existirem)
      const { data: preferencias } = await supabase
        .from('preferencias_alunos')
        .select('*')
        .eq('aluno_id', data.aluno_id)
        .maybeSingle();
      
      // Criar recomendação
      const { data: recomendacao, error } = await supabase
        .from('recomendacoes_turmas')
        .insert({
          aluno_id: data.aluno_id,
          curso_id: data.curso_id,
          turmas_recomendadas: data.turmas_recomendadas,
          score_compatibilidade: {
            horario: 0.8,
            modalidade: 0.9,
            disponibilidade: 1.0
          },
          criterios_utilizados: data.criterios_utilizados || {
            preferencia_horario: true,
            preferencia_modalidade: true,
            historico_academico: false
          },
          preferencias_aluno: preferencias || data.preferencias_aluno,
          data_recomendacao: new Date().toISOString()
        })
        .select('*')
        .single();
      
      if (error) {
        throw new AppError(
          'Erro ao gerar recomendações de turmas',
          'UNEXPECTED_ERROR'
        );
      }
      
      return {
        success: true,
        data: {
          recomendacao
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        return {
          success: false,
          error
        };
      }
      
      return {
        success: false,
        error: new AppError(
          'Erro ao gerar recomendações de turmas',
          'UNEXPECTED_ERROR'
        )
      };
    }
  }
);

export const salvarPreferenciasAluno = action(
  preferenciaAlunoSchema as any,
  async (data: z.infer<typeof preferenciaAlunoSchema>): Promise<ActionResponse<{ preferencias: any }>> => {
    try {
      const supabase = createClient(cookies());
      
      // Verificar se já existem preferências para este aluno
      const { data: preferenciasExistentes } = await supabase
        .from('preferencias_alunos')
        .select('*')
        .eq('aluno_id', data.aluno_id)
        .maybeSingle();
      
      let preferencias;
      if (preferenciasExistentes) {
        // Atualizar preferências existentes
        const { data: preferenciasAtualizadas, error } = await supabase
          .from('preferencias_alunos')
          .update({
            horarios_preferidos: data.horarios_preferidos,
            modalidade_preferida: data.modalidade_preferida,
            restricoes: data.restricoes,
            interesses: data.interesses,
            historico_academico: data.historico_academico
          })
          .eq('id', preferenciasExistentes.id)
          .select('*')
          .single();
          
        if (error) {
          throw new AppError(
            'Erro ao atualizar preferências do aluno',
            'UNEXPECTED_ERROR'
          );
        }
        
        preferencias = preferenciasAtualizadas;
      } else {
        // Criar novas preferências
        const { data: novasPreferencias, error } = await supabase
          .from('preferencias_alunos')
          .insert({
            aluno_id: data.aluno_id,
            horarios_preferidos: data.horarios_preferidos,
            modalidade_preferida: data.modalidade_preferida,
            restricoes: data.restricoes,
            interesses: data.interesses,
            historico_academico: data.historico_academico
          })
          .select('*')
          .single();
          
        if (error) {
          throw new AppError(
            'Erro ao salvar preferências do aluno',
            'UNEXPECTED_ERROR'
          );
        }
        
        preferencias = novasPreferencias;
      }
      
      return {
        success: true,
        data: {
          preferencias
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        return {
          success: false,
          error
        };
      }
      
      return {
        success: false,
        error: new AppError(
          'Erro ao salvar preferências do aluno',
          'UNEXPECTED_ERROR'
        )
      };
    }
  }
);
