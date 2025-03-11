import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from 'process';

/**
 * API para obter alertas de monitoramento
 * 
 * @route GET /api/monitoring/alerts
 */
export async function GET(request: NextRequest) {
  try {
    // Authentication is now handled by the main site
    // TODO: Implement authentication check using main site's auth system
    // Example:
    // const session = await mainSiteAuth.getSession(request);
    // if (!session.isAuthenticated) {
    //   return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    // }
    // if (!session.isAdmin) {
    //   return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    // }
    
    // For now, we'll assume the request is authenticated and authorized
    const userId = 'placeholder-user-id';
    
    // Obter parâmetros da requisição
    const searchParams = request.nextUrl.searchParams;
    const severity = searchParams.get('severity');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    // Construir consulta
    let query = supabase
      .from('monitoring_alerts')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (severity) {
      query = query.eq('severity', severity);
    }
    
    if (startDate) {
      query = query.gte('timestamp', new Date(startDate).toISOString());
    }
    
    if (endDate) {
      query = query.lte('timestamp', new Date(endDate).toISOString());
    }
    
    // Executar consulta
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      data: data.map(alert => ({
        ...alert,
        metadata: alert.metadata ? JSON.parse(alert.metadata) : {}
      }))
    });
  } catch (error) {
    console.error('Erro ao processar requisição de alertas:', error);
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
