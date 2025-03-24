'use server';

import { z } from 'zod';
import { ApiClient, Matricula } from '@edunexia/api-client';
import { contractService } from '../lib/services/contract-service';
import { monitoringService } from '../lib/services/monitoring-service';
import { action, ActionError } from '../../lib/safe-action';
import { 
  MatriculaStatus, 
  FormaPagamento, 
  StatusDocumento, 
  AssinaturaStatus 
} from '@edunexia/types';

// Initialize API client
const api = new ApiClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Schema for creating a matricula
const createMatriculaSchema = z.object({
  aluno_id: z.string().uuid(),
  curso_id: z.string().uuid(),
  data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  data_termino: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  valor_total: z.number().positive(),
  forma_pagamento: z.nativeEnum(FormaPagamento),
  parcelas: z.number().int().positive(),
});

// Schema for updating matricula status
const updateMatriculaStatusSchema = z.object({
  matricula_id: z.string().uuid(),
  status: z.nativeEnum(MatriculaStatus),
});

// Schema for uploading a document
const uploadDocumentoSchema = z.object({
  matricula_id: z.string().uuid(),
  tipo: z.enum(['rg', 'cpf', 'comprovante_residencia', 'diploma', 'historico', 'contrato', 'outros']),
  file: z.any(), // This would be a File in the browser
});

// Schema for evaluating a document
const avaliarDocumentoSchema = z.object({
  documento_id: z.string().uuid(),
  aprovado: z.boolean(),
  observacao: z.string().optional(),
});

// Schema for generating a contract
const gerarContratoSchema = z.object({
  matricula_id: z.string().uuid(),
});

// Schema for signing a contract
const assinarContratoSchema = z.object({
  matricula_id: z.string().uuid(),
  assinatura: z.string(),
});

// Create a new matricula
export const createMatricula = action
  .schema(createMatriculaSchema)
  .action(async ({ parsedInput }) => {
    try {
      monitoringService.incrementMetric('matricula:create');
      
      const { data: matricula, error } = await api.createMatricula({
        aluno_id: parsedInput.aluno_id,
        curso_id: parsedInput.curso_id,
        data_inicio: parsedInput.data_inicio,
        data_fim: parsedInput.data_termino,
        valor_total: parsedInput.valor_total,
        valor_parcela: parsedInput.valor_total / parsedInput.parcelas,
        numero_parcelas: parsedInput.parcelas,
        documentos: [],
        status: MatriculaStatus.PENDENTE,
        data_matricula: new Date().toISOString()
      });

      if (error) {
        throw new ActionError(error.message);
      }

      return matricula;
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      console.error('Erro ao criar matrícula:', error);
      throw new ActionError('Erro ao criar matrícula');
    }
  });

// Update matricula status
export const updateMatriculaStatus = action
  .schema(updateMatriculaStatusSchema)
  .action(async ({ parsedInput }) => {
    try {
      monitoringService.incrementMetric('matricula:update:status');
      
      const { data: matricula, error } = await api.updateMatricula(parsedInput.matricula_id, {
        status: parsedInput.status
      });

      if (error) {
        throw new ActionError(error.message);
      }

      return matricula;
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      console.error('Erro ao atualizar status da matrícula:', error);
      throw new ActionError('Erro ao atualizar status da matrícula');
    }
  });

// Upload a document
export const uploadDocumento = action
  .schema(uploadDocumentoSchema)
  .action(async ({ parsedInput }) => {
    try {
      monitoringService.incrementMetric('documento:upload');
      
      // TODO: Implement file upload to Supabase Storage
      const documentoId = Math.random().toString(36).substring(2, 15);
      
      const { data: matricula, error } = await api.updateMatricula(parsedInput.matricula_id, {
        documentos: [`https://example.com/documents/${documentoId}`]
      });

      if (error) {
        throw new ActionError(error.message);
      }

      return {
        id: documentoId,
        matricula_id: parsedInput.matricula_id,
        tipo: parsedInput.tipo,
        url: `https://example.com/documents/${documentoId}`,
        status: StatusDocumento.PENDENTE,
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      console.error('Erro ao fazer upload do documento:', error);
      throw new ActionError('Erro ao fazer upload do documento');
    }
  });

// Evaluate a document
export const avaliarDocumento = action
  .schema(avaliarDocumentoSchema)
  .action(async ({ parsedInput }) => {
    try {
      monitoringService.incrementMetric('documento:avaliar');
      
      // TODO: Implement document evaluation in Supabase
      
      return {
        id: parsedInput.documento_id,
        aprovado: parsedInput.aprovado,
        status: parsedInput.aprovado ? StatusDocumento.APROVADO : StatusDocumento.REJEITADO,
        observacao: parsedInput.observacao,
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      console.error('Erro ao avaliar documento:', error);
      throw new ActionError('Erro ao avaliar documento');
    }
  });

// Generate a contract
export const gerarContrato = action
  .schema(gerarContratoSchema)
  .action(async ({ parsedInput }) => {
    try {
      monitoringService.incrementMetric('contrato:gerar');
      
      const { data: matricula, error } = await api.getMatriculaById(parsedInput.matricula_id);

      if (error || !matricula) {
        throw new ActionError(error?.message || 'Matrícula não encontrada');
      }

      // TODO: Implement contract generation with actual data
      const contractPdf = await contractService.generateContract({
        matriculaId: parsedInput.matricula_id,
        alunoNome: 'Nome do Aluno', // TODO: Get from aluno data
        cursoNome: 'Nome do Curso', // TODO: Get from curso data
        valorTotal: matricula.valor_total,
        dataInicio: matricula.data_inicio,
        dataTermino: matricula.data_fim,
      });
      
      // TODO: Save the PDF to Supabase Storage and update database
      
      return {
        matricula_id: parsedInput.matricula_id,
        contrato_url: `https://example.com/contracts/${parsedInput.matricula_id}`,
        status: AssinaturaStatus.PENDENTE,
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      console.error('Erro ao gerar contrato:', error);
      throw new ActionError('Erro ao gerar contrato');
    }
  });

// Sign a contract
export const assinarContrato = action
  .schema(assinarContratoSchema)
  .action(async ({ parsedInput }) => {
    try {
      monitoringService.incrementMetric('contrato:assinar');
      
      // TODO: Implement contract signing in Supabase
      
      return {
        matricula_id: parsedInput.matricula_id,
        contrato_assinado: true,
        status: AssinaturaStatus.ASSINADO,
        assinatura_data: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      console.error('Erro ao assinar contrato:', error);
      throw new ActionError('Erro ao assinar contrato');
    }
  });
