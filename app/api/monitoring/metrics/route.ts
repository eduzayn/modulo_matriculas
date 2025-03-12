import { NextRequest, NextResponse } from 'next/server';
import { monitoringService, MetricType } from '@/app/matricula/lib/services/monitoring-service';
import { createClient } from '@supabase/supabase-js';
import { env } from 'process';

/**
 * API para obter métricas de monitoramento
 * 
 * @route GET /api/monitoring/metrics
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Verificar autenticação através do site principal
    // A autenticação e verificação de permissões agora é feita pelo site principal
    // Exemplo de como obter informações do usuário:
    // const session = await mainSiteAuth.getSession(request);
    // const userRole = await mainSiteAuth.getUserRole(session.userId);
    
    if (!process.env.MAIN_SITE_URL) {
      throw new Error('MAIN_SITE_URL environment variable is not set');
    }
    
    // Placeholder: Verificar autenticação e permissões através do site principal
    // Por enquanto, permitir acesso para testes
    const isAuthenticated = true;
    const isAdmin = true;
    
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }
    
    // Obter parâmetros da requisição
    const searchParams = request.nextUrl.searchParams;
    const metricType = searchParams.get('type') as MetricType | null;
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const endpoint = searchParams.get('endpoint');
    
    if (!metricType || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos. Informe type, start_date e end_date.' },
        { status: 400 }
      );
    }
    
    // Converter datas
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    // Obter estatísticas de métricas
    const stats = await monitoringService.getMetricStats(
      metricType,
      startDateObj,
      endDateObj,
      endpoint || undefined
    );
    
    if (!stats) {
      return NextResponse.json(
        { error: 'Erro ao obter métricas' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Erro ao processar requisição de métricas:', error);
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
