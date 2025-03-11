'use server';

import { createSafeActionClient } from 'next-safe-action';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { AppError, appErrors } from '@/lib/errors';
import type { ActionResponse } from '@/types/actions';
import { matriculaSchema } from '../lib/schemas';
import { MatriculaStatus, DocumentoStatus } from '../types/matricula';
import { notificationService } from '../lib/services/notification-service';

const action = createSafeActionClient();

// Schema para criação de matrícula
export const createMatricula = action(matriculaSchema, async (data): Promise<ActionResponse<{ matricula_id: string }>> => {
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);

      // Verificar se o aluno existe
      const { data: aluno, error: alunoError } = await supabase
        .from('students')
        .select('id')
        .eq('id', data.aluno_id)
        .single();

      if (alunoError) {
        console.error('Erro ao buscar aluno:', alunoError);
        throw new AppError('Aluno não encontrado', 'NOT_FOUND');
      }

      // Verificar se o curso existe
      const { data: curso, error: cursoError } = await supabase
        .from('courses')
        .select('id')
        .eq('id', data.curso_id)
        .single();

      if (cursoError) {
        console.error('Erro ao buscar curso:', cursoError);
        throw new AppError('Curso não encontrado', 'NOT_FOUND');
      }

      // Criar matrícula
      const { data: matricula, error: matriculaError } = await supabase
        .from('matricula.registros')
        .insert({
          aluno_id: data.aluno_id,
          curso_id: data.curso_id,
          status: MatriculaStatus.PENDENTE,
          forma_pagamento: data.forma_pagamento,
          numero_parcelas: data.numero_parcelas,
          desconto_id: data.desconto_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: data.metadata || {},
        })
        .select('id')
        .single();

      if (matriculaError) {
        console.error('Erro ao criar matrícula:', matriculaError);
        throw new AppError('Erro ao criar matrícula', 'CREATION_FAILED');
      }

      // Enviar notificação de matrícula criada
      try {
        await notificationService.sendNotification({
          event: 'matricula_criada',
          recipient: {
            id: data.aluno_id,
            type: 'aluno',
          },
          data: {
            matricula_id: matricula.id,
            curso_id: data.curso_id,
          },
          channels: ['email'],
        });
      } catch (notificationError) {
        console.error('Erro ao enviar notificação:', notificationError);
        // Não falhar a operação se apenas a notificação falhar
      }

      return {
        success: true,
        data: {
          matricula_id: matricula.id,
        },
      };
    } catch (error) {
      console.error('Erro ao criar matrícula:', error);
      return {
        success: false,
        error: error instanceof AppError ? error : appErrors.UNEXPECTED_ERROR,
      };
    }
  });

// Schema para atualização de status de matrícula
const updateMatriculaStatusSchema = z.object({
  id: z.string().uuid({ message: 'ID de matrícula inválido' }),
  status: z.enum([
    MatriculaStatus.PENDENTE,
    MatriculaStatus.APROVADO,
    MatriculaStatus.REJEITADO,
    MatriculaStatus.ATIVO,
    MatriculaStatus.TRANCADO,
    MatriculaStatus.CANCELADO,
    MatriculaStatus.CONCLUIDO,
  ]),
  observacoes: z.string().optional(),
});

// Atualizar status de matrícula
export const updateMatriculaStatus = action(updateMatriculaStatusSchema, async (data): Promise<ActionResponse<{ success: boolean }>> => {
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);

      // Verificar se a matrícula existe
      const { data: matricula, error: matriculaError } = await supabase
        .from('matricula.registros')
        .select('id, aluno_id, status, metadata')
        .eq('id', data.id)
        .single();

      if (matriculaError) {
        console.error('Erro ao buscar matrícula:', matriculaError);
        throw new AppError('Matrícula não encontrada', 'NOT_FOUND');
      }

      // Atualizar status da matrícula
      const { error: updateError } = await supabase
        .from('matricula.registros')
        .update({
          status: data.status,
          updated_at: new Date().toISOString(),
          metadata: {
            ...((matricula as any).metadata || {}),
            status_history: [
              ...(((matricula as any).metadata?.status_history || []) as any[]),
              {
                from: matricula.status,
                to: data.status,
                date: new Date().toISOString(),
                observacoes: data.observacoes,
              },
            ],
          },
        })
        .eq('id', data.id);

      if (updateError) {
        console.error('Erro ao atualizar status da matrícula:', updateError);
        throw new AppError('Erro ao atualizar status da matrícula', 'UPDATE_FAILED');
      }

      // Enviar notificação de alteração de status
      try {
        const notificationEvent = 
          data.status === MatriculaStatus.APROVADO ? 'matricula_aprovada' :
          data.status === MatriculaStatus.REJEITADO ? 'matricula_rejeitada' :
          data.status === MatriculaStatus.ATIVO ? 'matricula_ativada' :
          data.status === MatriculaStatus.CANCELADO ? 'matricula_cancelada' :
          'matricula_status_alterado';

        await notificationService.sendNotification({
          event: notificationEvent,
          recipient: {
            id: matricula.aluno_id,
            type: 'aluno',
          },
          data: {
            matricula_id: data.id,
            status: data.status,
            observacoes: data.observacoes,
          },
          channels: ['email'],
        });
      } catch (notificationError) {
        console.error('Erro ao enviar notificação:', notificationError);
        // Não falhar a operação se apenas a notificação falhar
      }

      return {
        success: true,
        data: {
          success: true,
        },
      };
    } catch (error) {
      console.error('Erro ao atualizar status da matrícula:', error);
      return {
        success: false,
        error: error instanceof AppError ? error : appErrors.UNEXPECTED_ERROR,
      };
    }
  });

// Schema para upload de documento
const uploadDocumentoSchema = z.object({
  matricula_id: z.string().uuid({ message: 'ID de matrícula inválido' }),
  tipo: z.string().min(1, { message: 'Tipo de documento é obrigatório' }),
  arquivo: z.any().refine((file) => file?.size > 0, { message: 'Arquivo é obrigatório' }),
});

// Upload de documento
export const uploadDocumento = action(uploadDocumentoSchema, async (data): Promise<ActionResponse<{ documento_id: string }>> => {
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);

      // Verificar se a matrícula existe
      const { data: matricula, error: matriculaError } = await supabase
        .from('matricula.registros')
        .select('id, aluno_id')
        .eq('id', data.matricula_id)
        .single();

      if (matriculaError) {
        console.error('Erro ao buscar matrícula:', matriculaError);
        throw new AppError('Matrícula não encontrada', 'NOT_FOUND');
      }

      // Gerar nome do arquivo
      const fileName = `${data.matricula_id}/${data.tipo}_${Date.now()}.${data.arquivo.name.split('.').pop()}`;

      // Upload do arquivo para o storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('matricula_documentos')
        .upload(fileName, data.arquivo);

      if (uploadError) {
        console.error('Erro ao fazer upload do arquivo:', uploadError);
        throw new AppError('Erro ao fazer upload do arquivo', 'UPLOAD_FAILED');
      }

      // Obter URL pública do arquivo
      const { data: urlData } = await supabase.storage
        .from('matricula_documentos')
        .getPublicUrl(fileName);

      // Criar registro do documento
      const { data: documento, error: documentoError } = await supabase
        .from('matricula_documentos')
        .insert({
          matricula_id: data.matricula_id,
          tipo: data.tipo,
          nome: data.arquivo.name,
          url: urlData.publicUrl,
          status: DocumentoStatus.PENDENTE,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (documentoError) {
        console.error('Erro ao criar registro do documento:', documentoError);
        throw new AppError('Erro ao criar registro do documento', 'CREATION_FAILED');
      }

      // Enviar notificação de documento enviado
      try {
        await notificationService.sendNotification({
          event: 'documento_enviado',
          recipient: {
            id: matricula.aluno_id,
            type: 'aluno',
          },
          data: {
            matricula_id: data.matricula_id,
            documento_id: documento.id,
            tipo: data.tipo,
          },
          channels: ['email'],
        });

        // Notificar administradores sobre novo documento
        await notificationService.sendNotification({
          event: 'novo_documento_para_analise',
          recipient: {
            type: 'admin',
            role: 'secretaria',
          },
          data: {
            matricula_id: data.matricula_id,
            documento_id: documento.id,
            tipo: data.tipo,
          },
          channels: ['email'],
        });
      } catch (notificationError) {
        console.error('Erro ao enviar notificação:', notificationError);
        // Não falhar a operação se apenas a notificação falhar
      }

      return {
        success: true,
        data: {
          documento_id: documento.id,
        },
      };
    } catch (error) {
      console.error('Erro ao fazer upload de documento:', error);
      return {
        success: false,
        error: error instanceof AppError ? error : appErrors.UNEXPECTED_ERROR,
      };
    }
  });

// Schema para avaliação de documento
const avaliarDocumentoSchema = z.object({
  documento_id: z.string().uuid({ message: 'ID de documento inválido' }),
  status: z.enum([
    DocumentoStatus.PENDENTE,
    DocumentoStatus.APROVADO,
    DocumentoStatus.REJEITADO,
  ]),
  observacoes: z.string().optional(),
});

// Avaliar documento
export const avaliarDocumento = action(avaliarDocumentoSchema, async (data): Promise<ActionResponse<{ success: boolean }>> => {
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);

      // Verificar se o documento existe
      const { data: documento, error: documentoError } = await supabase
        .from('matricula_documentos')
        .select('id, matricula_id, status')
        .eq('id', data.documento_id)
        .single();

      if (documentoError) {
        console.error('Erro ao buscar documento:', documentoError);
        throw new AppError('Documento não encontrado', 'NOT_FOUND');
      }

      // Atualizar status do documento
      const { error: updateError } = await supabase
        .from('matricula_documentos')
        .update({
          status: data.status,
          observacoes: data.observacoes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.documento_id);

      if (updateError) {
        console.error('Erro ao atualizar status do documento:', updateError);
        throw new AppError('Erro ao atualizar status do documento', 'UPDATE_FAILED');
      }

      // Buscar informações da matrícula e aluno
      const { data: matricula, error: matriculaError } = await supabase
        .from('matricula.registros')
        .select('aluno_id')
        .eq('id', documento.matricula_id)
        .single();

      if (matriculaError) {
        console.error('Erro ao buscar matrícula:', matriculaError);
        // Não falhar a operação se apenas a busca da matrícula falhar
      } else {
        // Enviar notificação de avaliação de documento
        try {
          const notificationEvent = 
            data.status === DocumentoStatus.APROVADO ? 'documento_aprovado' :
            data.status === DocumentoStatus.REJEITADO ? 'documento_rejeitado' :
            'documento_avaliado';

          await notificationService.sendNotification({
            event: notificationEvent,
            recipient: {
              id: matricula.aluno_id,
              type: 'aluno',
            },
            data: {
              matricula_id: documento.matricula_id,
              documento_id: data.documento_id,
              status: data.status,
              observacoes: data.observacoes,
            },
            channels: ['email'],
          });
        } catch (notificationError) {
          console.error('Erro ao enviar notificação:', notificationError);
          // Não falhar a operação se apenas a notificação falhar
        }
      }

      return {
        success: true,
        data: {
          success: true,
        },
      };
    } catch (error) {
      console.error('Erro ao avaliar documento:', error);
      return {
        success: false,
        error: error instanceof AppError ? error : appErrors.UNEXPECTED_ERROR,
      };
    }
  });

// Schema para geração de contrato
const gerarContratoSchema = z.object({
  matricula_id: z.string().uuid({ message: 'ID de matrícula inválido' }),
});

// Gerar contrato de matrícula
export const gerarContrato = action(gerarContratoSchema, async (data): Promise<ActionResponse<{ contrato_id: string; url: string }>> => {
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);

      // Verificar se a matrícula existe
      const { data: matricula, error: matriculaError } = await supabase
        .from('matricula.registros')
        .select(`
          id, 
          aluno_id, 
          curso_id,
          aluno:students(*),
          curso:courses(*)
        `)
        .eq('id', data.matricula_id)
        .single();

      if (matriculaError) {
        console.error('Erro ao buscar matrícula:', matriculaError);
        throw new AppError('Matrícula não encontrada', 'NOT_FOUND');
      }

      // Verificar se já existe um contrato para esta matrícula
      const { count, error: countError } = await supabase
        .from('matricula_contratos')
        .select('*', { count: 'exact' })
        .eq('matricula_id', data.matricula_id);

      if (countError) {
        console.error('Erro ao verificar contrato existente:', countError);
        throw new AppError('Erro ao verificar contrato existente', 'QUERY_ERROR');
      }

      if (count && count > 0) {
        throw new AppError('Esta matrícula já possui um contrato gerado', 'ALREADY_EXISTS');
      }

      // Gerar contrato (mock - em produção, geraria um PDF real)
      const contratoNome = `contrato_${data.matricula_id}_${Date.now()}.pdf`;
      const contratoUrl = `https://example.com/contratos/${contratoNome}`;

      // Criar registro do contrato
      const { data: contrato, error: contratoError } = await supabase
        .from('matricula_contratos')
        .insert({
          matricula_id: data.matricula_id,
          titulo: `Contrato de Matrícula - ${(matricula.curso as any)?.name || 'Curso'}`,
          versao: '1.0',
          url: contratoUrl,
          status: 'pendente',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (contratoError) {
        console.error('Erro ao criar registro do contrato:', contratoError);
        throw new AppError('Erro ao criar registro do contrato', 'CREATION_FAILED');
      }

      // Enviar notificação de contrato gerado
      try {
        await notificationService.sendNotification({
          event: 'contrato_gerado',
          recipient: {
            id: matricula.aluno_id,
            type: 'aluno',
          },
          data: {
            matricula_id: data.matricula_id,
            contrato_id: contrato.id,
            url: contratoUrl,
          },
          channels: ['email'],
        });
      } catch (notificationError) {
        console.error('Erro ao enviar notificação:', notificationError);
        // Não falhar a operação se apenas a notificação falhar
      }

      return {
        success: true,
        data: {
          contrato_id: contrato.id,
          url: contratoUrl,
        },
      };
    } catch (error) {
      console.error('Erro ao gerar contrato:', error);
      return {
        success: false,
        error: error instanceof AppError ? error : appErrors.UNEXPECTED_ERROR,
      };
    }
  });

// Schema para assinatura de contrato
const assinarContratoSchema = z.object({
  contrato_id: z.string().uuid({ message: 'ID de contrato inválido' }),
});

// Assinar contrato de matrícula
export const assinarContrato = action(assinarContratoSchema, async (data): Promise<ActionResponse<{ success: boolean }>> => {
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);

      // Verificar se o contrato existe
      const { data: contrato, error: contratoError } = await supabase
        .from('matricula_contratos')
        .select('id, matricula_id, status')
        .eq('id', data.contrato_id)
        .single();

      if (contratoError) {
        console.error('Erro ao buscar contrato:', contratoError);
        throw new AppError('Contrato não encontrado', 'NOT_FOUND');
      }

      if (contrato.status === 'assinado') {
        throw new AppError('Este contrato já foi assinado', 'ALREADY_SIGNED');
      }

      // Atualizar status do contrato
      const { error: updateError } = await supabase
        .from('matricula_contratos')
        .update({
          status: 'assinado',
          data_assinatura: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.contrato_id);

      if (updateError) {
        console.error('Erro ao atualizar status do contrato:', updateError);
        throw new AppError('Erro ao atualizar status do contrato', 'UPDATE_FAILED');
      }

      // Buscar informações da matrícula
      const { data: matricula, error: matriculaError } = await supabase
        .from('matricula.registros')
        .select('id, aluno_id, status')
        .eq('id', contrato.matricula_id)
        .single();

      if (matriculaError) {
        console.error('Erro ao buscar matrícula:', matriculaError);
        // Não falhar a operação se apenas a busca da matrícula falhar
      } else {
        // Atualizar status da matrícula se necessário
        if (matricula.status === MatriculaStatus.PENDENTE || matricula.status === MatriculaStatus.APROVADO) {
          const { error: matriculaUpdateError } = await supabase
            .from('matricula.registros')
            .update({
              status: MatriculaStatus.ATIVO,
              updated_at: new Date().toISOString(),
            })
            .eq('id', matricula.id);

          if (matriculaUpdateError) {
            console.error('Erro ao atualizar status da matrícula:', matriculaUpdateError);
            // Não falhar a operação se apenas a atualização da matrícula falhar
          }
        }

        // Enviar notificação de contrato assinado
        try {
          await notificationService.sendNotification({
            event: 'contrato_assinado',
            recipient: {
              id: matricula.aluno_id,
              type: 'aluno',
            },
            data: {
              matricula_id: matricula.id,
              contrato_id: data.contrato_id,
            },
            channels: ['email', 'sms'],
          });

          // Notificar administradores sobre contrato assinado
          await notificationService.sendNotification({
            event: 'contrato_assinado_admin',
            recipient: {
              type: 'admin',
              role: 'secretaria',
            },
            data: {
              matricula_id: matricula.id,
              contrato_id: data.contrato_id,
            },
            channels: ['email'],
          });
        } catch (notificationError) {
          console.error('Erro ao enviar notificação:', notificationError);
          // Não falhar a operação se apenas a notificação falhar
        }
      }

      return {
        success: true,
        data: {
          success: true,
        },
      };
    } catch (error) {
      console.error('Erro ao assinar contrato:', error);
      return {
        success: false,
        error: error instanceof AppError ? error : appErrors.UNEXPECTED_ERROR,
      };
    }
  });
