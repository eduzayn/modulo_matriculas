import { NextRequest, NextResponse } from 'next/server';
import { PaymentStatus } from '@/app/matricula/types/financial';

/**
 * API para obter dados do dashboard financeiro
 * Retorna dados de receitas, pagamentos pendentes e atrasados
 * dos últimos 6 meses para visualização no dashboard
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Authentication is now handled by the main site
    // Get user session from main site authentication system
    const mainSiteSession = await fetch(process.env.MAIN_SITE_URL + '/api/auth/session', {
      headers: { cookie: request.headers.get('cookie') || '' }
    }).then(res => res.json());

    if (!mainSiteSession?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Replace with database client initialization that doesn't depend on Supabase auth
    const supabase = null; // Temporary placeholder - needs to be replaced with new database client
    
    // Obter dados dos últimos 6 meses
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 5);
    
    const months = [];
    for (let i = 0; i < 6; i++) {
      const month = new Date(sixMonthsAgo);
      month.setMonth(sixMonthsAgo.getMonth() + i);
      months.push({
        month: month.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        firstDay: new Date(month.getFullYear(), month.getMonth(), 1).toISOString(),
        lastDay: new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString()
      });
    }
    
    const result = [];
    
    for (const monthData of months) {
      // Receitas (pagamentos realizados no mês)
      const { data: paidPayments, error: paidError } = await supabase
        .from('financial.payments')
        .select('valor, valor_total')
        .eq('status', PaymentStatus.PAGO)
        .gte('data_pagamento', monthData.firstDay)
        .lte('data_pagamento', monthData.lastDay);
      
      if (paidError) {
        console.error('Erro ao buscar pagamentos realizados:', paidError);
      }
      
      // Pendentes (pagamentos com vencimento no mês e status pendente)
      const { data: pendingPayments, error: pendingError } = await supabase
        .from('financial.payments')
        .select('valor')
        .eq('status', PaymentStatus.PENDENTE)
        .gte('data_vencimento', monthData.firstDay)
        .lte('data_vencimento', monthData.lastDay);
      
      if (pendingError) {
        console.error('Erro ao buscar pagamentos pendentes:', pendingError);
      }
      
      // Atrasados (pagamentos com vencimento no mês e status atrasado ou pendentes vencidos)
      const { data: overduePayments, error: overdueError } = await supabase
        .from('financial.payments')
        .select('valor')
        .eq('status', PaymentStatus.ATRASADO)
        .gte('data_vencimento', monthData.firstDay)
        .lte('data_vencimento', monthData.lastDay);
      
      if (overdueError) {
        console.error('Erro ao buscar pagamentos atrasados:', overdueError);
      }
      
      // Pendentes vencidos (pagamentos com status pendente mas data de vencimento já passou)
      const { data: overduePendingPayments, error: overduePendingError } = await supabase
        .from('financial.payments')
        .select('valor')
        .eq('status', PaymentStatus.PENDENTE)
        .lt('data_vencimento', today.toISOString())
        .gte('data_vencimento', monthData.firstDay)
        .lte('data_vencimento', monthData.lastDay);
      
      if (overduePendingError) {
        console.error('Erro ao buscar pagamentos pendentes vencidos:', overduePendingError);
      }
      
      const receitas = paidPayments?.reduce((sum, item) => sum + (item.valor_total || item.valor), 0) || 0;
      const pendentes = pendingPayments?.reduce((sum, item) => sum + item.valor, 0) || 0;
      const atrasados = (overduePayments?.reduce((sum, item) => sum + item.valor, 0) || 0) + 
                        (overduePendingPayments?.reduce((sum, item) => sum + item.valor, 0) || 0);
      
      result.push({
        month: monthData.month,
        receitas,
        pendentes,
        atrasados,
        total: receitas + pendentes + atrasados
      });
    }
    
    // Obter métricas adicionais
    
    // Total de pagamentos por status
    const { data: paymentStatusCount, error: statusError } = await supabase
      .from('financial.payments')
      .select('status, count')
      .select('status')
      .gte('data_vencimento', sixMonthsAgo.toISOString())
      .group('status');
    
    if (statusError) {
      console.error('Erro ao buscar contagem de status:', statusError);
    }
    
    // Pagamentos recentes
    const { data: recentPayments, error: recentError } = await supabase
      .from('financial.payments')
      .select(`
        id,
        valor,
        valor_total,
        data_pagamento,
        forma_pagamento,
        matricula:matricula_id (
          aluno_id,
          curso_id,
          aluno:aluno_id (
            nome
          ),
          curso:curso_id (
            nome
          )
        )
      `)
      .eq('status', PaymentStatus.PAGO)
      .order('data_pagamento', { ascending: false })
      .limit(5);
    
    if (recentError) {
      console.error('Erro ao buscar pagamentos recentes:', recentError);
    }
    
    // Formatar pagamentos recentes
    const formattedRecentPayments = recentPayments?.map(payment => ({
      id: payment.id,
      valor: payment.valor_total || payment.valor,
      data: payment.data_pagamento ? new Date(payment.data_pagamento).toLocaleDateString('pt-BR') : 'N/A',
      forma_pagamento: payment.forma_pagamento,
      aluno: payment.matricula?.aluno?.nome || 'N/A',
      curso: payment.matricula?.curso?.nome || 'N/A'
    })) || [];
    
    // Calcular métricas gerais
    const totalReceitas = result.reduce((sum, item) => sum + item.receitas, 0);
    const totalPendentes = result.reduce((sum, item) => sum + item.pendentes, 0);
    const totalAtrasados = result.reduce((sum, item) => sum + item.atrasados, 0);
    
    // Calcular taxa de inadimplência
    const totalPagamentos = totalReceitas + totalPendentes + totalAtrasados;
    const taxaInadimplencia = totalPagamentos > 0 ? (totalAtrasados / totalPagamentos) * 100 : 0;
    
    return NextResponse.json({
      success: true,
      data: {
        monthlyData: result,
        metrics: {
          totalReceitas,
          totalPendentes,
          totalAtrasados,
          taxaInadimplencia: Math.round(taxaInadimplencia * 100) / 100
        },
        recentPayments: formattedRecentPayments
      }
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
