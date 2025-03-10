import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { matriculaRoutes } from '@/app/matricula/routes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Verificar autenticação
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/auth/login?callbackUrl=/matricula/dashboard')
  }

  // Verificar se o usuário é admin
  const isAdmin = session?.user?.app_metadata?.role === 'admin'
  if (!isAdmin) {
    redirect('/matricula/list')
  }

  // Buscar estatísticas de matrículas
  const { data: matriculasStats, error: matriculasError } = await supabase
    .from('matricula.registros')
    .select('status', { count: 'exact' })
    .in('status', ['pendente', 'ativa', 'cancelada', 'trancada'])
    .order('status')

  if (matriculasError) {
    console.error('Erro ao buscar estatísticas de matrículas:', matriculasError)
  }

  // Agrupar estatísticas por status
  const stats = {
    pendentes: 0,
    ativas: 0,
    canceladas: 0,
    trancadas: 0,
    total: 0
  }

  matriculasStats?.forEach((item) => {
    if (item.status === 'pendente') stats.pendentes += 1
    if (item.status === 'ativa') stats.ativas += 1
    if (item.status === 'cancelada') stats.canceladas += 1
    if (item.status === 'trancada') stats.trancadas += 1
    stats.total += 1
  })

  // Buscar estatísticas de documentos
  const { data: documentosStats, error: documentosError } = await supabase
    .from('matricula_documentos')
    .select('status', { count: 'exact' })
    .in('status', ['pendente', 'aprovado', 'rejeitado'])
    .order('status')

  if (documentosError) {
    console.error('Erro ao buscar estatísticas de documentos:', documentosError)
  }

  // Agrupar estatísticas de documentos por status
  const docStats = {
    pendentes: 0,
    aprovados: 0,
    rejeitados: 0,
    total: 0
  }

  documentosStats?.forEach((item) => {
    if (item.status === 'pendente') docStats.pendentes += 1
    if (item.status === 'aprovado') docStats.aprovados += 1
    if (item.status === 'rejeitado') docStats.rejeitados += 1
    docStats.total += 1
  })

  // Buscar estatísticas de pagamentos
  const { data: pagamentosStats, error: pagamentosError } = await supabase
    .from('matricula_pagamentos')
    .select('status', { count: 'exact' })
    .in('status', ['pendente', 'pago', 'atrasado'])
    .order('status')

  if (pagamentosError) {
    console.error('Erro ao buscar estatísticas de pagamentos:', pagamentosError)
  }

  // Agrupar estatísticas de pagamentos por status
  const payStats = {
    pendentes: 0,
    pagos: 0,
    atrasados: 0,
    total: 0
  }

  pagamentosStats?.forEach((item) => {
    if (item.status === 'pendente') payStats.pendentes += 1
    if (item.status === 'pago') payStats.pagos += 1
    if (item.status === 'atrasado') payStats.atrasados += 1
    payStats.total += 1
  })

  return (
    <div className="container py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Matrículas</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema de matrículas
          </p>
        </div>
        <Button asChild>
          <Link href={matriculaRoutes.list}>Ver Todas as Matrículas</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Matrículas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.ativas}</p>
            <p className="text-muted-foreground text-sm">
              {stats.total > 0 ? Math.round((stats.ativas / stats.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Matrículas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.pendentes}</p>
            <p className="text-muted-foreground text-sm">
              {stats.total > 0 ? Math.round((stats.pendentes / stats.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Matrículas Canceladas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.canceladas}</p>
            <p className="text-muted-foreground text-sm">
              {stats.total > 0 ? Math.round((stats.canceladas / stats.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Matrículas Trancadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.trancadas}</p>
            <p className="text-muted-foreground text-sm">
              {stats.total > 0 ? Math.round((stats.trancadas / stats.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Pendentes</span>
                <span className="font-medium">{docStats.pendentes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Aprovados</span>
                <span className="font-medium">{docStats.aprovados}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Rejeitados</span>
                <span className="font-medium">{docStats.rejeitados}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="font-medium">Total</span>
                <span className="font-medium">{docStats.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Pendentes</span>
                <span className="font-medium">{payStats.pendentes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pagos</span>
                <span className="font-medium">{payStats.pagos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Atrasados</span>
                <span className="font-medium">{payStats.atrasados}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="font-medium">Total</span>
                <span className="font-medium">{payStats.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href={matriculaRoutes.create}>Nova Matrícula</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={matriculaRoutes.reports}>Relatórios</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={matriculaRoutes.discounts}>Gerenciar Descontos</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={matriculaRoutes.support}>Suporte</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
