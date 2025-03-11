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
    // Verificar autenticação (apenas administradores)
    const supabase = createClient(
      env.SUPABASE_URL || '',
      env.SUPABASE_ANON_KEY || ''
    );
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Verificar se o usuário é administrador
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();
    
    if (!userRole || userRole.role !== 'admin') {
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
