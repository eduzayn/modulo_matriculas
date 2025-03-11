'use server';

import { createSafeActionClient } from 'next-safe-action';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { AppError, appErrors } from '@/lib/errors';
import type { ActionResponse } from '@/types/actions';
import { PaymentStatus } from '@/app/matricula/types/financial';

const action = createSafeActionClient();

// Schema for creating split payment configuration
const createSplitConfigSchema = z.object({
  payment_id: z.string().uuid({ message: 'ID de pagamento inválido' }),
  recipients: z.array(z.object({
    recipient_id: z.string().min(1, { message: 'ID do destinatário é obrigatório' }),
    recipient_type: z.string().min(1, { message: 'Tipo do destinatário é obrigatório' }),
    amount: z.number().optional(),
    percentage: z.number().optional(),
  })).min(1, { message: 'Pelo menos um destinatário é obrigatório' }),
});

/**
 * Create split payment configuration for a payment
 */
export const createSplitConfig = action(createSplitConfigSchema, async (data): Promise<ActionResponse<{ success: boolean }>> => {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Verify that the payment exists
    const { data: payment, error: paymentError } = await supabase
      .from('financial.payments')
      .select('id, valor, status')
      .eq('id', data.payment_id)
      .single();

    if (paymentError) {
      console.error('Error fetching payment:', paymentError);
      throw new AppError('Pagamento não encontrado', 'NOT_FOUND');
    }

    // Verify that the payment is not already paid
    if (payment.status === PaymentStatus.PAGO) {
      throw new AppError('Não é possível configurar split para um pagamento já realizado', 'INVALID_STATUS');
    }

    // Validate that the total percentage or amount doesn't exceed 100% or the payment value
    let totalPercentage = 0;
    let totalAmount = 0;

    for (const recipient of data.recipients) {
      if (recipient.percentage) {
        totalPercentage += recipient.percentage;
      } else if (recipient.amount) {
        totalAmount += recipient.amount;
      } else {
        throw new AppError('Cada destinatário deve ter um percentual ou valor definido', 'VALIDATION_ERROR');
      }
    }

    if (totalPercentage > 100) {
      throw new AppError('O total de percentuais não pode exceder 100%', 'VALIDATION_ERROR');
    }

    if (totalAmount > payment.valor) {
      throw new AppError('O total de valores não pode exceder o valor do pagamento', 'VALIDATION_ERROR');
    }

    // Delete any existing split configurations for this payment
    await supabase
      .from('financial.split_payments')
      .delete()
      .eq('payment_id', data.payment_id);

    // Create split payment records
    const splitRecords = data.recipients.map(recipient => ({
      payment_id: data.payment_id,
      recipient_id: recipient.recipient_id,
      recipient_type: recipient.recipient_type,
      amount: recipient.amount || (recipient.percentage ? (payment.valor * recipient.percentage / 100) : 0),
      percentage: recipient.percentage,
      status: PaymentStatus.PENDENTE,
    }));

    const { error: insertError } = await supabase
      .from('financial.split_payments')
      .insert(splitRecords);

    if (insertError) {
      console.error('Error creating split payment configuration:', insertError);
      throw new AppError('Erro ao criar configuração de split', 'CREATION_FAILED');
    }

    return {
      success: true,
      data: {
        success: true,
      },
    };
  } catch (error) {
    console.error('Error creating split payment configuration:', error);
    return {
      success: false,
      error: error instanceof AppError ? error : appErrors.UNEXPECTED_ERROR,
    };
  }
});

// Schema for getting split payment configuration
const getSplitConfigSchema = z.object({
  payment_id: z.string().uuid({ message: 'ID de pagamento inválido' }),
});

/**
 * Get split payment configuration for a payment
 */
export const getSplitConfig = action(getSplitConfigSchema, async (data): Promise<ActionResponse<{ splits: any[] }>> => {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Get split payment configuration
    const { data: splits, error: splitsError } = await supabase
      .from('financial.split_payments')
      .select('*')
      .eq('payment_id', data.payment_id);

    if (splitsError) {
      console.error('Error fetching split payment configuration:', splitsError);
      throw new AppError('Erro ao buscar configuração de split', 'QUERY_ERROR');
    }

    return {
      success: true,
      data: {
        splits: splits || [],
      },
    };
  } catch (error) {
    console.error('Error fetching split payment configuration:', error);
    return {
      success: false,
      error: error instanceof AppError ? error : appErrors.UNEXPECTED_ERROR,
    };
  }
});
