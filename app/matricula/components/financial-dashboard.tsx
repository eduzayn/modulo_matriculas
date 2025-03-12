'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Download, FileText, PieChart, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PaymentStatus } from '../types/financial';

// Componente de gráfico de barras
const BarChart = ({ data, title, description }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm text-muted-foreground">
                  {typeof item.value === 'number' ? item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : item.value}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div 
                  className="h-2 rounded-full bg-primary" 
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Componente de cartão de estatística
const StatCard = ({ title, value, icon, description, trend, color = 'bg-primary' }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`${color} p-2 rounded-full text-white`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : value}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
      {trend && (
        <CardFooter className="p-2">
          <p className={`text-xs ${trend.positive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
            <span className="ml-1">{trend.label}</span>
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

// Componente de seletor de data
const DateRangePicker = ({ dateRange, setDateRange }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  return (
    <div className="grid gap-2">
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[300px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })} -{' '}
                  {format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR })}
                </>
              ) : (
                format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange}
            onSelect={(range) => {
              setDateRange(range);
              if (range.from && range.to) {
                setIsCalendarOpen(false);
              }
            }}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Componente principal do dashboard financeiro
export function FinancialDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalReceived: 0,
    totalPending: 0,
    totalOverdue: 0,
    overdueCount: 0,
    pendingCount: 0,
    paidCount: 0,
    recentPayments: [],
    monthlyRevenue: [],
    paymentMethods: [],
    courseRevenue: []
  });
  
  // Função para carregar dados do dashboard
  const loadDashboardData = async () => {
    setLoading(true);
    
    try {
      const supabase = createClient();
      
      // Formatar datas para consulta
      const fromDate = dateRange.from.toISOString().split('T')[0];
      const toDate = dateRange.to.toISOString().split('T')[0];
      
      // Buscar pagamentos no período
      const { data: payments, error: paymentsError } = await supabase
        .from('financial.payments')
        .select(`
          id,
          matricula_id,
          valor,
          data_vencimento,
          data_pagamento,
          status,
          forma_pagamento,
          numero_parcela,
          total_parcelas,
          valor_desconto,
          valor_juros,
          valor_multa,
          valor_total,
          created_at,
          updated_at,
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
        .gte('data_vencimento', fromDate)
        .lte('data_vencimento', toDate)
        .order('data_vencimento', { ascending: false });
      
      if (paymentsError) {
        console.error('Erro ao carregar pagamentos:', paymentsError);
        return;
      }
      
      // Calcular estatísticas
      const totalReceived = payments
        .filter(p => p.status === PaymentStatus.PAGO)
        .reduce((sum, p) => sum + (p.valor_total || p.valor), 0);
      
      const totalPending = payments
        .filter(p => p.status === PaymentStatus.PENDENTE)
        .reduce((sum, p) => sum + p.valor, 0);
      
      const totalOverdue = payments
        .filter(p => p.status === PaymentStatus.ATRASADO || (p.status === PaymentStatus.PENDENTE && new Date(p.data_vencimento) < new Date()))
        .reduce((sum, p) => sum + p.valor, 0);
      
      const overdueCount = payments.filter(p => 
        p.status === PaymentStatus.ATRASADO || (p.status === PaymentStatus.PENDENTE && new Date(p.data_vencimento) < new Date())
      ).length;
      
      const pendingCount = payments.filter(p => p.status === PaymentStatus.PENDENTE).length;
      const paidCount = payments.filter(p => p.status === PaymentStatus.PAGO).length;
      
      // Formatar pagamentos recentes
      const recentPayments = payments
        .filter(p => p.status === PaymentStatus.PAGO)
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          student: p.matricula?.aluno?.nome || 'N/A',
          course: p.matricula?.curso?.nome || 'N/A',
          amount: p.valor_total || p.valor,
          date: new Date(p.data_pagamento || p.updated_at).toLocaleDateString('pt-BR'),
          method: p.forma_pagamento
        }));
      
      // Agrupar receita por mês
      const monthlyData = {};
      payments.forEach(p => {
        if (p.status === PaymentStatus.PAGO) {
          const month = p.data_pagamento?.substring(0, 7) || p.updated_at.substring(0, 7);
          if (!monthlyData[month]) {
            monthlyData[month] = 0;
          }
          monthlyData[month] += (p.valor_total || p.valor);
        }
      });
      
      const monthlyRevenue = Object.entries(monthlyData)
        .map(([month, value]) => ({
          label: `${month.substring(5, 7)}/${month.substring(0, 4)}`,
          value
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
      
      // Agrupar por método de pagamento
      const methodData = {};
      payments.forEach(p => {
        if (p.status === PaymentStatus.PAGO) {
          const method = p.forma_pagamento || 'Não especificado';
          if (!methodData[method]) {
            methodData[method] = 0;
          }
          methodData[method] += (p.valor_total || p.valor);
        }
      });
      
      const paymentMethods = Object.entries(methodData)
        .map(([method, value]) => ({
          label: method,
          value
        }))
        .sort((a, b) => b.value - a.value);
      
      // Agrupar por curso
      const courseData = {};
      payments.forEach(p => {
        if (p.status === PaymentStatus.PAGO) {
          const course = p.matricula?.curso?.nome || 'Não especificado';
          if (!courseData[course]) {
            courseData[course] = 0;
          }
          courseData[course] += (p.valor_total || p.valor);
        }
      });
      
      const courseRevenue = Object.entries(courseData)
        .map(([course, value]) => ({
          label: course,
          value
        }))
        .sort((a, b) => b.value - a.value);
      
      // Atualizar estado com dados calculados
      setDashboardData({
        totalReceived,
        totalPending,
        totalOverdue,
        overdueCount,
        pendingCount,
        paidCount,
        recentPayments,
        monthlyRevenue,
        paymentMethods,
        courseRevenue
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Carregar dados quando o componente montar ou o período mudar
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      loadDashboardData();
    }
  }, [dateRange]);
  
  // Função para gerar relatório
  const generateReport = async (reportType) => {
    try {
      const fromDate = dateRange.from.toISOString().split('T')[0];
      const toDate = dateRange.to.toISOString().split('T')[0];
      
      // Redirecionar para API de relatórios
      window.open(`/api/reports/financial?report_type=${reportType}&format=excel&start_date=${fromDate}&end_date=${toDate}`, '_blank');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Financeiro</h2>
        <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        {/* Aba de Visão Geral */}
        <TabsContent value="overview" className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                  title="Receita Total" 
                  value={dashboardData.totalReceived} 
                  icon={<CheckCircle className="h-4 w-4" />} 
                  description={`${dashboardData.paidCount} pagamentos recebidos`}
                  color="bg-green-500"
                />
                <StatCard 
                  title="Pagamentos Pendentes" 
                  value={dashboardData.totalPending} 
                  icon={<Clock className="h-4 w-4" />} 
                  description={`${dashboardData.pendingCount} pagamentos aguardando`}
                  color="bg-blue-500"
                />
                <StatCard 
                  title="Pagamentos Atrasados" 
                  value={dashboardData.totalOverdue} 
                  icon={<AlertTriangle className="h-4 w-4" />} 
                  description={`${dashboardData.overdueCount} pagamentos vencidos`}
                  color="bg-red-500"
                />
                <StatCard 
                  title="Taxa de Inadimplência" 
                  value={`${Math.round((dashboardData.overdueCount / (dashboardData.overdueCount + dashboardData.pendingCount + dashboardData.paidCount)) * 100 || 0)}%`} 
                  icon={<TrendingUp className="h-4 w-4" />} 
                  description="Baseado nos pagamentos vencidos"
                  color="bg-amber-500"
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <BarChart 
                  data={dashboardData.monthlyRevenue} 
                  title="Receita Mensal" 
                  description="Receita total por mês no período selecionado" 
                />
                <BarChart 
                  data={dashboardData.courseRevenue} 
                  title="Receita por Curso" 
                  description="Distribuição de receita por curso" 
                />
              </div>
            </>
          )}
        </TabsContent>
        
        {/* Aba de Pagamentos */}
        <TabsContent value="payments" className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Pagamentos Recentes</CardTitle>
                    <CardDescription>Últimos pagamentos recebidos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dashboardData.recentPayments.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardData.recentPayments.map((payment, index) => (
                          <div key={index} className="flex items-center justify-between border-b pb-2">
                            <div>
                              <p className="font-medium">{payment.student}</p>
                              <p className="text-sm text-muted-foreground">{payment.course}</p>
                              <p className="text-xs text-muted-foreground">{payment.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {payment.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </p>
                              <p className="text-xs text-muted-foreground">{payment.method}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        Nenhum pagamento recente encontrado
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Ver todos os pagamentos
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Métodos de Pagamento</CardTitle>
                    <CardDescription>Distribuição por forma de pagamento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarChart 
                      data={dashboardData.paymentMethods} 
                      title="" 
                      description="" 
                    />
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Pagamentos Atrasados</CardTitle>
                  <CardDescription>Pagamentos vencidos que precisam de atenção</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.overdueCount > 0 ? (
                    <div className="space-y-2">
                      <p className="text-red-500 font-medium">
                        {dashboardData.overdueCount} pagamentos atrasados totalizando {dashboardData.totalOverdue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                      <Button variant="destructive" className="mt-2">
                        Gerenciar Inadimplência
                      </Button>
                    </div>
                  ) : (
                    <p className="text-center text-green-500 py-4">
                      Não há pagamentos atrasados no período selecionado
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        {/* Aba de Análises */}
        <TabsContent value="analytics" className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Projeção de Receita</CardTitle>
                    <CardDescription>Projeção para os próximos 3 meses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <p className="text-muted-foreground">
                        Gráfico de projeção será implementado em breve
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Análise de Inadimplência</CardTitle>
                    <CardDescription>Tendências de inadimplência por período</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <p className="text-muted-foreground">
                        Gráfico de análise será implementado em breve
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Indicadores Financeiros</CardTitle>
                  <CardDescription>Principais métricas de desempenho financeiro</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium">Ticket Médio</h3>
                      <p className="text-2xl font-bold mt-2">
                        {dashboardData.paidCount > 0 
                          ? (dashboardData.totalReceived / dashboardData.paidCount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                          : 'R$ 0,00'
                        }
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium">Taxa de Conversão</h3>
                      <p className="text-2xl font-bold mt-2">
                        {Math.round((dashboardData.paidCount / (dashboardData.paidCount + dashboardData.pendingCount + dashboardData.overdueCount)) * 100 || 0)}%
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium">Receita por Aluno</h3>
                      <p className="text-2xl font-bold mt-2">
                        Calculando...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        {/* Aba de Relatórios */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Inadimplência</CardTitle>
                <CardDescription>Detalhes de pagamentos vencidos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-6">
                  <AlertTriangle className="h-12 w-12 text-red-500" />
                </div>
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Gere um relatório detalhado de todos os pagamentos vencidos no período selecionado.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => generateReport('overdue')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Fluxo de Caixa</CardTitle>
                <CardDescription>Entradas e saídas no período</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-6">
                  <TrendingUp className="h-12 w-12 text-green-500" />
                </div>
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Gere um relatório detalhado de todas as transações financeiras no período selecionado.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => generateReport('cash_flow')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Projeção</CardTitle>
                <CardDescription>Projeção financeira futura</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-6">
                  <PieChart className="h-12 w-12 text-blue-500" />
                </div>
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Gere um relatório com projeções financeiras para os próximos meses.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => generateReport('projection')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Personalizados</CardTitle>
              <CardDescription>Configure e agende relatórios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-6">
                <FileText className="h-12 w-12 text-primary" />
              </div>
              <p className="text-center text-sm text-muted-foreground mb-4">
                Configure relatórios personalizados e agende o envio automático por email.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Configurar Relatórios
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FinancialDashboard;
