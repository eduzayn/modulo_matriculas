/**
 * Payment Verification Service
 * 
 * Este serviço é responsável por verificar pagamentos vencidos e enviar notificações
 * para os alunos com pagamentos em atraso.
 */

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { PaymentStatus } from '@/app/matricula/types/financial';
import { NotificationService } from './notification-service';

export class PaymentVerificationService {
  /**
   * Verifica pagamentos vencidos e envia notificações
   */
  static async checkOverduePayments() {
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      const today = new Date().toISOString().split('T')[0];
      
      // Buscar pagamentos vencidos e não pagos
      const { data: overduePayments, error } = await supabase
        .from('financial.payments')
        .select(`
          id,
          matricula_id,
          valor,
          data_vencimento,
          numero_parcela,
          matricula:matricula_id (
            aluno_id,
            aluno:aluno_id (
              nome,
              email,
              telefone
            )
          )
        `)
        .eq('status', PaymentStatus.PENDENTE)
        .lt('data_vencimento', today);
      
      if (error) {
        console.error('Erro ao verificar pagamentos vencidos:', error);
        return { success: false, error };
      }
      
      // Enviar notificações para cada pagamento vencido
      const notificationResults = [];
      
      for (const payment of overduePayments || []) {
        const student = payment.matricula?.aluno;
        
        if (student) {
          try {
            // Calcular dias de atraso
            const vencimento = new Date(payment.data_vencimento);
            const hoje = new Date();
            const diasAtraso = Math.floor((hoje.getTime() - vencimento.getTime()) / (1000 * 60 * 60 * 24));
            
            // Enviar notificação
            const notificationResult = await NotificationService.sendNotification({
              event: 'payment_overdue',
              recipient: {
                id: student.id,
                type: 'aluno',
              },
              data: {
                email: student.email,
                phone: student.telefone,
                subject: `Pagamento vencido - Parcela ${payment.numero_parcela}`,
                body: `Olá ${student.nome},\n\nSua parcela ${payment.numero_parcela} no valor de R$ ${payment.valor.toFixed(2)} venceu em ${vencimento.toLocaleDateString('pt-BR')} (há ${diasAtraso} dias).\n\nPor favor, regularize seu pagamento o mais breve possível para evitar juros e multas.\n\nAtenciosamente,\nEquipe Edunexia`,
                message: `Edunexia: Sua parcela ${payment.numero_parcela} no valor de R$ ${payment.valor.toFixed(2)} está vencida há ${diasAtraso} dias. Acesse a plataforma para regularizar.`,
                template: 'payment_overdue',
                templateData: {
                  student_name: student.nome,
                  payment_number: payment.numero_parcela,
                  payment_value: payment.valor.toFixed(2),
                  due_date: vencimento.toLocaleDateString('pt-BR'),
                  days_overdue: diasAtraso
                }
              },
              channels: ['email', 'sms', 'whatsapp']
            });
            
            // Registrar notificação no banco de dados
            await supabase.from('financial.payment_notifications').insert({
              payment_id: payment.id,
              student_id: student.id,
              notification_type: 'overdue_payment',
              channels: ['email', 'sms', 'whatsapp'],
              sent_at: new Date().toISOString(),
              status: notificationResult.success ? 'success' : 'failed',
              days_overdue: diasAtraso
            });
            
            notificationResults.push({
              payment_id: payment.id,
              student_id: student.id,
              success: notificationResult.success,
              notification_id: notificationResult.id
            });
          } catch (notificationError) {
            console.error('Erro ao enviar notificação para pagamento:', payment.id, notificationError);
            notificationResults.push({
              payment_id: payment.id,
              student_id: student.id,
              success: false,
              error: notificationError instanceof Error ? notificationError.message : 'Erro desconhecido'
            });
          }
        }
      }
      
      return {
        success: true,
        data: {
          processed: overduePayments?.length || 0,
          notifications: notificationResults
        }
      };
    } catch (error) {
      console.error('Erro ao verificar pagamentos vencidos:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
  
  /**
   * Verifica pagamentos próximos do vencimento e envia lembretes
   */
  static async checkUpcomingPayments(daysBeforeDue = 3) {
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      
      // Calcular data para verificação (hoje + dias antes do vencimento)
      const today = new Date();
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + daysBeforeDue);
      const targetDateStr = targetDate.toISOString().split('T')[0];
      
      // Buscar pagamentos que vencem na data alvo
      const { data: upcomingPayments, error } = await supabase
        .from('financial.payments')
        .select(`
          id,
          matricula_id,
          valor,
          data_vencimento,
          numero_parcela,
          forma_pagamento,
          matricula:matricula_id (
            aluno_id,
            aluno:aluno_id (
              nome,
              email,
              telefone
            )
          )
        `)
        .eq('status', PaymentStatus.PENDENTE)
        .eq('data_vencimento', targetDateStr);
      
      if (error) {
        console.error('Erro ao verificar pagamentos próximos do vencimento:', error);
        return { success: false, error };
      }
      
      // Enviar lembretes para cada pagamento próximo do vencimento
      const reminderResults = [];
      
      for (const payment of upcomingPayments || []) {
        const student = payment.matricula?.aluno;
        
        if (student) {
          try {
            // Enviar lembrete
            const notificationResult = await NotificationService.sendNotification({
              event: 'payment_reminder',
              recipient: {
                id: student.id,
                type: 'aluno',
              },
              data: {
                email: student.email,
                phone: student.telefone,
                subject: `Lembrete de pagamento - Parcela ${payment.numero_parcela}`,
                body: `Olá ${student.nome},\n\nLembramos que sua parcela ${payment.numero_parcela} no valor de R$ ${payment.valor.toFixed(2)} vence em ${daysBeforeDue} dias (${new Date(payment.data_vencimento).toLocaleDateString('pt-BR')}).\n\nRealize o pagamento até a data de vencimento para evitar juros e multas.\n\nAtenciosamente,\nEquipe Edunexia`,
                message: `Edunexia: Sua parcela ${payment.numero_parcela} no valor de R$ ${payment.valor.toFixed(2)} vence em ${daysBeforeDue} dias. Evite juros realizando o pagamento até o vencimento.`,
                template: 'payment_reminder',
                templateData: {
                  student_name: student.nome,
                  payment_number: payment.numero_parcela,
                  payment_value: payment.valor.toFixed(2),
                  due_date: new Date(payment.data_vencimento).toLocaleDateString('pt-BR'),
                  days_until_due: daysBeforeDue,
                  payment_method: payment.forma_pagamento
                }
              },
              channels: ['email', 'whatsapp']
            });
            
            // Registrar lembrete no banco de dados
            await supabase.from('financial.payment_notifications').insert({
              payment_id: payment.id,
              student_id: student.id,
              notification_type: 'payment_reminder',
              channels: ['email', 'whatsapp'],
              sent_at: new Date().toISOString(),
              status: notificationResult.success ? 'success' : 'failed',
              days_before_due: daysBeforeDue
            });
            
            reminderResults.push({
              payment_id: payment.id,
              student_id: student.id,
              success: notificationResult.success,
              notification_id: notificationResult.id
            });
          } catch (notificationError) {
            console.error('Erro ao enviar lembrete para pagamento:', payment.id, notificationError);
            reminderResults.push({
              payment_id: payment.id,
              student_id: student.id,
              success: false,
              error: notificationError instanceof Error ? notificationError.message : 'Erro desconhecido'
            });
          }
        }
      }
      
      return {
        success: true,
        data: {
          processed: upcomingPayments?.length || 0,
          reminders: reminderResults
        }
      };
    } catch (error) {
      console.error('Erro ao verificar pagamentos próximos do vencimento:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
}

export default PaymentVerificationService;
