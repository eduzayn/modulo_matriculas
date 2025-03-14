import { NextResponse } from 'next/server';

// Force static generation
export const dynamic = 'force-static';

export async function GET() {
  // Mock data for monitoring alerts
  const mockAlertData = {
    alerts: [
      { id: 1, type: 'payment_overdue', message: 'Pagamento atrasado: Aluno João Silva', severity: 'high', created_at: new Date().toISOString() },
      { id: 2, type: 'document_pending', message: 'Documento pendente: Aluna Maria Oliveira', severity: 'medium', created_at: new Date().toISOString() },
      { id: 3, type: 'contract_expiring', message: 'Contrato expirando: Aluno Pedro Santos', severity: 'low', created_at: new Date().toISOString() },
      { id: 4, type: 'system_notification', message: 'Manutenção programada: 15/04/2025', severity: 'info', created_at: new Date().toISOString() }
    ],
    stats: {
      total: 4,
      high: 1,
      medium: 1,
      low: 1,
      info: 1
    }
  };

  return NextResponse.json({
    success: true,
    data: mockAlertData
  });
}
