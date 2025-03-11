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
