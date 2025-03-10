'use server';

import { createSafeActionClient } from 'next-safe-action';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { AppError, appErrors } from '@/lib/errors';
import type { ActionResponse } from '@/types/actions';
import { FormaPagamento } from '@/app/(matricula)/types/matricula';

const action = createSafeActionClient();

// Schema para geração de pagamentos
const generatePaymentsSchema = z.object({
  matricula_id: z.string().uuid({ message: 'ID de matrícula inválido' }),
  valor_total: z.number().positive({ message: 'Valor total deve ser positivo' }),
  numero_parcelas: z.number().int().min(1, { message: 'Número de parcelas inválido' }),
  forma_pagamento: z.enum([
    FormaPagamento.CARTAO_CREDITO,
    FormaPagamento.BOLETO,
    FormaPagamento.PIX,
    FormaPagamento.TRANSFERENCIA
  ]),
  data_primeiro_vencimento: z.string().refine((data) => {
    const date = new Date(data);
    return !isNaN(date.getTime());
  }, { message: 'Data de vencimento inválida' }),
  desconto_id: z.string().uuid({ message: 'ID de desconto inválido' }).optional(),
});

// Gerar pagamentos para uma matrícula
export const generatePayments = action
  .schema(generatePaymentsSchema)
  .action(async (data): Promise<ActionResponse<{ success: boolean }>> => {
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);

      // Verificar se a matrícula existe
      const { data: matricula, error: matriculaError } = await supabase
        .from('matricula.registros')
        .select('id, status')
        .eq('id', data.matricula_id)
        .single();

      if (matriculaError) {
        console.error('Erro ao buscar matrícula:', matriculaError);
        throw new AppError('Matrícula não encontrada', 'NOT_FOUND');
      }

      // Verificar se já existem pagamentos para esta matrícula
      const { count, error: countError } = await supabase
        .from('matricula_pagamentos')
        .select('*', { count: 'exact' })
        .eq('matricula_id', data.matricula_id);

      if (countError) {
        console.error('Erro ao verificar pagamentos existentes:', countError);
        throw new AppError('Erro ao verificar pagamentos existentes', 'QUERY_ERROR');
      }

      if (count && count > 0) {
        throw new AppError('Esta matrícula já possui pagamentos gerados', 'ALREADY_EXISTS');
      }

      // Calcular valor das parcelas
      let valorTotal = data.valor_total;
      
      // Aplicar desconto, se houver
      if (data.desconto_id) {
        const { data: desconto, error: descontoError } = await supabase
          .from('discounts')
          .select('tipo, valor')
          .eq('id', data.desconto_id)
          .single();

        if (!descontoError && desconto) {
          if (desconto.tipo === 'percentual') {
            valorTotal = valorTotal * (1 - desconto.valor / 100);
          } else if (desconto.tipo === 'valor_fixo') {
            valorTotal = Math.max(0, valorTotal - desconto.valor);
          }
        }
      }

      const valorParcela = valorTotal / data.numero_parcelas;
      
      // Gerar datas de vencimento
      const dataInicial = new Date(data.data_primeiro_vencimento);
      const parcelas = [];

      for (let i = 0; i < data.numero_parcelas; i++) {
        const dataVencimento = new Date(dataInicial);
        dataVencimento.setMonth(dataInicial.getMonth() + i);
        
        parcelas.push({
          matricula_id: data.matricula_id,
          numero_parcela: i + 1,
          valor: valorParcela,
          data_vencimento: dataVencimento.toISOString(),
          status: 'pendente',
          forma_pagamento: data.forma_pagamento,
        });
      }

      // Inserir parcelas no banco de dados
      const { error: insertError } = await supabase
        .from('matricula_pagamentos')
        .insert(parcelas);

      if (insertError) {
        console.error('Erro ao gerar pagamentos:', insertError);
        throw new AppError('Erro ao gerar pagamentos', 'CREATION_FAILED');
      }

      // Atualizar matrícula com informações de pagamento
      const { error: updateError } = await supabase
        .from('matricula.registros')
        .update({
          forma_pagamento: data.forma_pagamento,
          numero_parcelas: data.numero_parcelas,
          valor_total: data.valor_total,
          valor_com_desconto: valorTotal,
          desconto_id: data.desconto_id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.matricula_id);

      if (updateError) {
        console.error('Erro ao atualizar matrícula:', updateError);
        throw new AppError('Erro ao atualizar matrícula', 'UPDATE_FAILED');
      }

      return {
        success: true,
        data: {
          success: true,
        },
      };
    } catch (error) {
      console.error('Erro ao gerar pagamentos:', error);
      return {
        success: false,
        error: error instanceof AppError ? error : appErrors.UNEXPECTED_ERROR,
      };
    }
  });

// Schema para registro de pagamento
const registerPaymentSchema = z.object({
  pagamento_id: z.string().uuid({ message: 'ID de pagamento inválido' }),
  data_pagamento: z.string().refine((data) => {
    const date = new Date(data);
    return !isNaN(date.getTime());
  }, { message: 'Data de pagamento inválida' }),
  comprovante_url: z.string().url({ message: 'URL de comprovante inválida' }).optional(),
  observacoes: z.string().optional(),
});

// Registrar pagamento de uma parcela
export const registerPayment = action
  .schema(registerPaymentSchema)
  .action(async (data): Promise<ActionResponse<{ success: boolean }>> => {
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);

      // Verificar se o pagamento existe
      const { data: pagamento, error: pagamentoError } = await supabase
        .from('matricula_pagamentos')
        .select('id, matricula_id, status, valor')
        .eq('id', data.pagamento_id)
        .single();

      if (pagamentoError) {
        console.error('Erro ao buscar pagamento:', pagamentoError);
        throw new AppError('Pagamento não encontrado', 'NOT_FOUND');
      }

      if (pagamento.status === 'pago') {
        throw new AppError('Este pagamento já foi registrado', 'ALREADY_PAID');
      }

      // Atualizar status do pagamento
      const { error: updateError } = await supabase
        .from('matricula_pagamentos')
        .update({
          status: 'pago',
          data_pagamento: data.data_pagamento,
          comprovante_url: data.comprovante_url,
          observacoes: data.observacoes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.pagamento_id);

      if (updateError) {
        console.error('Erro ao registrar pagamento:', updateError);
        throw new AppError('Erro ao registrar pagamento', 'UPDATE_FAILED');
      }

      // Registrar transação financeira
      const { error: transactionError } = await supabase
        .from('financial.transactions')
        .insert({
          reference_id: data.pagamento_id,
          reference_type: 'matricula_pagamento',
          amount: pagamento.valor,
          type: 'income',
          status: 'completed',
          payment_method: pagamento.forma_pagamento,
          metadata: {
            matricula_id: pagamento.matricula_id,
            comprovante_url: data.comprovante_url,
            observacoes: data.observacoes,
          },
        });

      if (transactionError) {
        console.error('Erro ao registrar transação financeira:', transactionError);
        // Não falhar a operação se apenas o registro da transação falhar
      }

      return {
        success: true,
        data: {
          success: true,
        },
      };
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      return {
        success: false,
        error: error instanceof AppError ? error : appErrors.UNEXPECTED_ERROR,
      };
    }
  });

// Schema para cancelamento de pagamento
const cancelPaymentSchema = z.object({
  pagamento_id: z.string().uuid({ message: 'ID de pagamento inválido' }),
  motivo: z.string().min(3, { message: 'Motivo é obrigatório' }),
});

// Cancelar pagamento de uma parcela
export const cancelPayment = action
  .schema(cancelPaymentSchema)
  .action(async (data): Promise<ActionResponse<{ success: boolean }>> => {
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);

      // Verificar se o pagamento existe
      const { data: pagamento, error: pagamentoError } = await supabase
        .from('matricula_pagamentos')
        .select('id, matricula_id, status')
        .eq('id', data.pagamento_id)
        .single();

      if (pagamentoError) {
        console.error('Erro ao buscar pagamento:', pagamentoError);
        throw new AppError('Pagamento não encontrado', 'NOT_FOUND');
      }

      if (pagamento.status === 'cancelado') {
        throw new AppError('Este pagamento já foi cancelado', 'ALREADY_CANCELLED');
      }

      // Atualizar status do pagamento
      const { error: updateError } = await supabase
        .from('matricula_pagamentos')
        .update({
          status: 'cancelado',
          observacoes: data.motivo,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.pagamento_id);

      if (updateError) {
        console.error('Erro ao cancelar pagamento:', updateError);
        throw new AppError('Erro ao cancelar pagamento', 'UPDATE_FAILED');
      }

      return {
        success: true,
        data: {
          success: true,
        },
      };
    } catch (error) {
      console.error('Erro ao cancelar pagamento:', error);
      return {
        success: false,
        error: error instanceof AppError ? error : appErrors.UNEXPECTED_ERROR,
      };
    }
  });
