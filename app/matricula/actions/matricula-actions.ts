'use server';

import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { contractService } from '../lib/services/contract-service';
import { monitoringService } from '../lib/services/monitoring-service';

// Create a safe action client
const action = createSafeActionClient();

// Schema for creating a matricula
const createMatriculaSchema = z.object({
  aluno_id: z.string().uuid(),
  curso_id: z.string().uuid(),
  data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  data_termino: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  valor_total: z.number().positive(),
  forma_pagamento: z.enum(['boleto', 'cartao', 'pix', 'transferencia']),
  parcelas: z.number().int().positive(),
});

// Schema for updating matricula status
const updateMatriculaStatusSchema = z.object({
  matricula_id: z.string().uuid(),
  status: z.enum(['pendente', 'ativa', 'cancelada', 'concluida', 'trancada']),
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
export const createMatricula = action(
  createMatriculaSchema,
  async (data) => {
    try {
      monitoringService.incrementMetric('matricula:create');
      
      // TODO: Replace with main site's API call
      const { data: aluno, error: alunoError } = await fetch(process.env.MAIN_SITE_URL + '/api/students/' + data.aluno_id).then(res => res.json());

      if (alunoError) {
        console.error('Erro ao buscar aluno:', alunoError);
        return { success: false, error: 'Aluno não encontrado' };
      }

      // TODO: Replace with actual database call
      const matriculaId = Math.random().toString(36).substring(2, 15);
      
      return {
        success: true,
        data: {
          id: matriculaId,
          ...data,
          status: 'pendente',
          created_at: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Erro ao criar matrícula:', error);
      return { success: false, error: 'Erro ao criar matrícula' };
    }
  }
);

// Update matricula status
export const updateMatriculaStatus = action(
  updateMatriculaStatusSchema,
  async (data) => {
    try {
      monitoringService.incrementMetric('matricula:update:status');
      
      // TODO: Replace with actual database call
      
      return {
        success: true,
        data: {
          id: data.matricula_id,
          status: data.status,
          updated_at: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Erro ao atualizar status da matrícula:', error);
      return { success: false, error: 'Erro ao atualizar status da matrícula' };
    }
  }
);

// Upload a document
export const uploadDocumento = action(
  uploadDocumentoSchema,
  async (data) => {
    try {
      monitoringService.incrementMetric('documento:upload');
      
      // TODO: Replace with actual file upload and database call
      const documentoId = Math.random().toString(36).substring(2, 15);
      
      return {
        success: true,
        data: {
          id: documentoId,
          matricula_id: data.matricula_id,
          tipo: data.tipo,
          url: `https://example.com/documents/${documentoId}`,
          aprovado: null,
          created_at: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Erro ao fazer upload do documento:', error);
      return { success: false, error: 'Erro ao fazer upload do documento' };
    }
  }
);

// Evaluate a document
export const avaliarDocumento = action(
  avaliarDocumentoSchema,
  async (data) => {
    try {
      monitoringService.incrementMetric('documento:avaliar');
      
      // TODO: Replace with actual database call
      
      return {
        success: true,
        data: {
          id: data.documento_id,
          aprovado: data.aprovado,
          observacao: data.observacao,
          updated_at: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Erro ao avaliar documento:', error);
      return { success: false, error: 'Erro ao avaliar documento' };
    }
  }
);

// Generate a contract
export const gerarContrato = action(
  gerarContratoSchema,
  async (data) => {
    try {
      monitoringService.incrementMetric('contrato:gerar');
      
      // TODO: Replace with actual database call to get matricula data
      const matriculaData = {
        matriculaId: data.matricula_id,
        alunoNome: 'Nome do Aluno',
        cursoNome: 'Nome do Curso',
        valorTotal: 1000,
        dataInicio: '01/01/2023',
        dataTermino: '31/12/2023',
      };
      
      // Generate contract PDF
      const contractPdf = await contractService.generateContract(matriculaData);
      
      // TODO: Save the PDF to storage and update database
      
      return {
        success: true,
        data: {
          matricula_id: data.matricula_id,
          contrato_url: `https://example.com/contracts/${data.matricula_id}`,
          created_at: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Erro ao gerar contrato:', error);
      return { success: false, error: 'Erro ao gerar contrato' };
    }
  }
);

// Sign a contract
export const assinarContrato = action(
  assinarContratoSchema,
  async (data) => {
    try {
      monitoringService.incrementMetric('contrato:assinar');
      
      // TODO: Replace with actual database call to get contract PDF
      // const contractPdf = ...
      
      // TODO: Sign the contract
      // const signedPdf = await contractService.signContract(contractPdf, data.assinatura);
      
      // TODO: Save the signed PDF to storage and update database
      
      return {
        success: true,
        data: {
          matricula_id: data.matricula_id,
          contrato_assinado: true,
          assinatura_data: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Erro ao assinar contrato:', error);
      return { success: false, error: 'Erro ao assinar contrato' };
    }
  }
);
