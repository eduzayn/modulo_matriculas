// Simplified payment verification service
import { notificationService } from './notification-service';

interface Payment {
  id: string;
  matricula_id: string;
  valor: number;
  data_vencimento: string;
  data_pagamento: string | null;
  status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
}

interface Student {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

interface Enrollment {
  id: string;
  aluno_id: string;
  aluno: Student;
  valor_total: number;
  status: string;
}

export const paymentVerificationService = {
  /**
   * Check for overdue payments and send notifications
   */
  checkOverduePayments: async (): Promise<number> => {
    try {
      // In a real implementation, this would query the database
      // For now, we'll use mock data
      const overduePayments: Array<Payment & { enrollment: Enrollment }> = [
        {
          id: '1',
          matricula_id: '101',
          valor: 250,
          data_vencimento: '2023-03-01',
          data_pagamento: null,
          status: 'atrasado',
          enrollment: {
            id: '101',
            aluno_id: '1001',
            aluno: {
              id: '1001',
              nome: 'João Silva',
              email: 'joao@example.com',
              telefone: '+5511999999999',
            },
            valor_total: 1000,
            status: 'ativa',
          },
        },
        {
          id: '2',
          matricula_id: '102',
          valor: 300,
          data_vencimento: '2023-03-05',
          data_pagamento: null,
          status: 'atrasado',
          enrollment: {
            id: '102',
            aluno_id: '1002',
            aluno: {
              id: '1002',
              nome: 'Maria Souza',
              email: 'maria@example.com',
              telefone: '+5511888888888',
            },
            valor_total: 1200,
            status: 'ativa',
          },
        },
      ];
      
      // Send notifications for each overdue payment
      let notificationsSent = 0;
      
      for (const payment of overduePayments) {
        const { enrollment, valor, data_vencimento } = payment;
        const { aluno } = enrollment;
        
        const notificationSent = await notificationService.sendPaymentReminder(
          aluno.email,
          aluno.telefone,
          aluno.nome,
          enrollment.id,
          valor,
          new Date(data_vencimento).toLocaleDateString('pt-BR')
        );
        
        if (notificationSent) {
          notificationsSent++;
        }
      }
      
      return notificationsSent;
    } catch (error) {
      console.error('Error checking overdue payments:', error);
      return 0;
    }
  },
  
  /**
   * Process a payment
   */
  processPayment: async (paymentId: string, amount: number): Promise<boolean> => {
    try {
      // In a real implementation, this would update the database
      // For now, we'll just log the payment
      console.log(`Processing payment ${paymentId} for R$ ${amount.toFixed(2)}`);
      
      // Simulate a successful payment
      return true;
    } catch (error) {
      console.error('Error processing payment:', error);
      return false;
    }
  },
};
