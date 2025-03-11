import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { matriculaRoutes } from '@/app/matricula/routes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { colors } from '@/app/styles/colors'

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // A autenticação e verificação de permissões agora são feitas pelo middleware

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
          <p className="text-neutral-500">
            Visão geral do sistema de matrículas
          </p>
        </div>
        <Button style={{ background: colors.primary.enrollment.gradient }}>
          <Link href={matriculaRoutes.list} className="text-white">Ver Todas as Matrículas</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-t-4" style={{ borderTopColor: colors.primary.enrollment.main }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Matrículas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.ativas}</p>
            <p className="text-neutral-500 text-sm">
              {stats.total > 0 ? Math.round((stats.ativas / stats.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
        <Card className="border-t-4" style={{ borderTopColor: colors.primary.enrollment.main }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Matrículas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.pendentes}</p>
            <p className="text-neutral-500 text-sm">
              {stats.total > 0 ? Math.round((stats.pendentes / stats.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
        <Card className="border-t-4" style={{ borderTopColor: colors.primary.enrollment.main }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Matrículas Canceladas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.canceladas}</p>
            <p className="text-neutral-500 text-sm">
              {stats.total > 0 ? Math.round((stats.canceladas / stats.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
        <Card className="border-t-4" style={{ borderTopColor: colors.primary.enrollment.main }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Matrículas Trancadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.trancadas}</p>
            <p className="text-neutral-500 text-sm">
              {stats.total > 0 ? Math.round((stats.trancadas / stats.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-t-4" style={{ borderTopColor: colors.primary.enrollment.main }}>
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span>Pendentes</span>
                </span>
                <span className="font-medium">{docStats.pendentes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span>Aprovados</span>
                </span>
                <span className="font-medium">{docStats.aprovados}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span>Rejeitados</span>
                </span>
                <span className="font-medium">{docStats.rejeitados}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="font-medium">Total</span>
                <span className="font-medium">{docStats.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4" style={{ borderTopColor: colors.primary.enrollment.main }}>
          <CardHeader>
            <CardTitle>Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span>Pendentes</span>
                </span>
                <span className="font-medium">{payStats.pendentes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span>Pagos</span>
                </span>
                <span className="font-medium">{payStats.pagos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span>Atrasados</span>
                </span>
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
        <Card className="border-t-4" style={{ borderTopColor: colors.primary.enrollment.main }}>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button style={{ background: colors.primary.enrollment.gradient }}>
                <Link href={matriculaRoutes.create} className="text-white">Nova Matrícula</Link>
              </Button>
              <Button variant="outline" style={{ borderColor: colors.primary.enrollment.main, color: colors.primary.enrollment.main }}>
                <Link href={matriculaRoutes.reports}>Relatórios</Link>
              </Button>
              <Button variant="outline" style={{ borderColor: colors.primary.enrollment.main, color: colors.primary.enrollment.main }}>
                <Link href={matriculaRoutes.discounts}>Gerenciar Descontos</Link>
              </Button>
              <Button variant="outline" style={{ borderColor: colors.primary.enrollment.main, color: colors.primary.enrollment.main }}>
                <Link href={matriculaRoutes.support}>Suporte</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
