import { NextRequest, NextResponse } from 'next/server';
import { PaymentVerificationService } from '@/app/matricula/lib/services/payment-verification-service';

// Chave de segurança para proteger o endpoint de cron
const CRON_SECRET = process.env.CRON_SECRET || 'default-secret-key';

/**
 * Endpoint para verificação de pagamentos vencidos
 * Este endpoint é chamado por um cron job para verificar pagamentos vencidos
 * e enviar notificações para os alunos.
 * 
 * Requer autenticação via token no header Authorization
 */
export async function GET(request: NextRequest) {
  // Verificar autenticação do cron job
  const authHeader = request.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  
  try {
    // Executar verificação de pagamentos vencidos
    const result = await PaymentVerificationService.checkOverduePayments();
    
    if (!result.success) {
      return NextResponse.json({ error: 'Falha ao verificar pagamentos vencidos', details: result.error }, { status: 500 });
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Erro ao processar verificação de pagamentos vencidos:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

/**
 * Endpoint para envio de lembretes de pagamentos próximos do vencimento
 * Este endpoint é chamado por um cron job para verificar pagamentos que estão
 * próximos do vencimento e enviar lembretes para os alunos.
 * 
 * Requer autenticação via token no header Authorization
 */
export async function POST(request: NextRequest) {
  // Verificar autenticação do cron job
  const authHeader = request.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  
  try {
    // Obter parâmetros da requisição
    const body = await request.json();
    const daysBeforeDue = body.daysBeforeDue || 3; // Padrão: 3 dias antes
    
    // Executar verificação de pagamentos próximos do vencimento
    const result = await PaymentVerificationService.checkUpcomingPayments(daysBeforeDue);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Falha ao verificar pagamentos próximos do vencimento', details: result.error }, { status: 500 });
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Erro ao processar verificação de pagamentos próximos do vencimento:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
