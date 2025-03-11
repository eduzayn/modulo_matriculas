import { z } from 'zod';
import { 
  MatriculaStatus, 
  DocumentoStatus, 
  AssinaturaStatus, 
  FormaPagamento 
} from '../../../types/matricula';

// Schema para dados pessoais
export const personalDataSchema = z.object({
  nome: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  telefone: z.string().min(10, { message: 'Telefone inválido' }),
  cpf: z.string().length(11, { message: 'CPF deve ter 11 dígitos' }),
  rg: z.string().min(5, { message: 'RG inválido' }),
  dataNascimento: z.string().refine((data) => {
    const date = new Date(data);
    const hoje = new Date();
    return date < hoje && date > new Date(hoje.getFullYear() - 100, hoje.getMonth(), hoje.getDate());
  }, { message: 'Data de nascimento inválida' }),
  endereco: z.object({
    cep: z.string().length(8, { message: 'CEP deve ter 8 dígitos' }),
    logradouro: z.string().min(3, { message: 'Logradouro inválido' }),
    numero: z.string().min(1, { message: 'Número inválido' }),
    complemento: z.string().optional(),
    bairro: z.string().min(2, { message: 'Bairro inválido' }),
    cidade: z.string().min(2, { message: 'Cidade inválida' }),
    estado: z.string().length(2, { message: 'Estado deve ter 2 caracteres' }),
  }),
});

// Schema para documento
export const documentSchema = z.object({
  tipo: z.string().min(1, { message: 'Tipo de documento é obrigatório' }),
  arquivo: z.any().refine((file) => file?.size > 0, { message: 'Arquivo é obrigatório' }),
});

// Schema para seleção de curso
export const courseSelectionSchema = z.object({
  cursoId: z.string().uuid({ message: 'Curso inválido' }),
  turmaId: z.string().uuid({ message: 'Turma inválida' }).optional(),
  modalidade: z.enum(['presencial', 'online', 'hibrido'], { 
    errorMap: () => ({ message: 'Modalidade inválida' }) 
  }),
});

// Schema para pagamento
export const paymentSchema = z.object({
  forma_pagamento: z.enum([
    FormaPagamento.CARTAO_CREDITO,
    FormaPagamento.BOLETO,
    FormaPagamento.PIX,
    FormaPagamento.TRANSFERENCIA
  ], { 
    errorMap: () => ({ message: 'Forma de pagamento inválida' }) 
  }),
  numero_parcelas: z.number().int().min(1, { message: 'Número de parcelas inválido' }),
  desconto_id: z.string().uuid({ message: 'Desconto inválido' }).optional(),
});

// Schema para pré-matrícula
export const preMatriculaSchema = z.object({
  dadosPessoais: personalDataSchema,
  documentos: z.array(documentSchema).min(1, { message: 'Pelo menos um documento é obrigatório' }),
  curso: courseSelectionSchema,
});

// Schema para análise documental
export const analiseDocumentalSchema = z.object({
  documentoId: z.string().uuid({ message: 'Documento inválido' }),
  status: z.enum([
    DocumentoStatus.APROVADO,
    DocumentoStatus.PENDENTE,
    DocumentoStatus.REJEITADO
  ], { 
    errorMap: () => ({ message: 'Status inválido' }) 
  }),
  observacoes: z.string().optional(),
});

// Schema para contrato
export const contratoSchema = z.object({
  aceite: z.boolean().refine((val) => val === true, { message: 'É necessário aceitar os termos do contrato' }),
});

// Schema para criação de matrícula
export const matriculaSchema = z.object({
  aluno_id: z.string().uuid({ message: 'Aluno inválido' }),
  curso_id: z.string().uuid({ message: 'Curso inválido' }),
  status: z.enum([
    MatriculaStatus.PENDENTE,
    MatriculaStatus.APROVADO,
    MatriculaStatus.REJEITADO,
    MatriculaStatus.ATIVO,
    MatriculaStatus.TRANCADO,
    MatriculaStatus.CANCELADO,
    MatriculaStatus.CONCLUIDO
  ]).default(MatriculaStatus.PENDENTE),
  forma_pagamento: z.enum([
    FormaPagamento.CARTAO_CREDITO,
    FormaPagamento.BOLETO,
    FormaPagamento.PIX,
    FormaPagamento.TRANSFERENCIA
  ]),
  numero_parcelas: z.number().int().min(1, { message: 'Número de parcelas inválido' }),
  desconto_id: z.string().uuid({ message: 'Desconto inválido' }).optional(),
  metadata: z.record(z.any()).optional(),
});

// Schema para atualização de status da matrícula
export const updateMatriculaStatusSchema = z.object({
  id: z.string().uuid({ message: 'ID de matrícula inválido' }),
  status: z.enum([
    MatriculaStatus.PENDENTE,
    MatriculaStatus.APROVADO,
    MatriculaStatus.REJEITADO,
    MatriculaStatus.ATIVO,
    MatriculaStatus.TRANCADO,
    MatriculaStatus.CANCELADO,
    MatriculaStatus.CONCLUIDO
  ]),
  observacoes: z.string().optional(),
});

// Schema para upload de documento
export const uploadDocumentoSchema = z.object({
  matricula_id: z.string().uuid({ message: 'ID de matrícula inválido' }),
  tipo: z.string().min(1, { message: 'Tipo de documento é obrigatório' }),
  arquivo: z.any().refine((file) => file?.size > 0, { message: 'Arquivo é obrigatório' }),
});

// Schema para avaliação de documento
export const avaliacaoDocumentoSchema = z.object({
  documento_id: z.string().uuid({ message: 'ID de documento inválido' }),
  status: z.enum([
    DocumentoStatus.APROVADO,
    DocumentoStatus.PENDENTE,
    DocumentoStatus.REJEITADO
  ]),
  observacoes: z.string().optional(),
});
