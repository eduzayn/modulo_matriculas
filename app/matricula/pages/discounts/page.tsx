import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { matriculaRoutes } from '@/app/matricula/routes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import React from 'react'
import { colors } from '@/app/styles/colors'

export default async function DiscountsPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // A autenticação e verificação de permissões agora são feitas pelo middleware

  // Buscar descontos
  const { data: descontos, error: descontosError } = await supabase
    .from('discounts')
    .select('*')
    .order('nome')

  if (descontosError) {
    console.error('Erro ao buscar descontos:', descontosError)
  }

  // Formatar valor do desconto
  const formatarValorDesconto = (tipo: string, valor: number) => {
    if (tipo === 'percentual') {
      return `${valor}%`
    } else {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(valor)
    }
  }

  return (
    <div className="container py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Descontos</h1>
          <p className="text-neutral-500">
            Configuração de descontos para matrículas
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" module="enrollment" asChild>
            <Link href={matriculaRoutes.dashboard}>Voltar para Dashboard</Link>
          </Button>
          <Button module="enrollment">
            Novo Desconto
          </Button>
        </div>
      </div>

      <Card variant="gradient" module="enrollment">
        <CardHeader>
          <CardTitle module="enrollment">Descontos Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table module="enrollment">
            <TableHeader module="enrollment">
              <TableRow>
                <TableHead module="enrollment">Nome</TableHead>
                <TableHead module="enrollment">Tipo</TableHead>
                <TableHead module="enrollment">Valor</TableHead>
                <TableHead module="enrollment">Status</TableHead>
                <TableHead module="enrollment" className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!descontos || descontos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhum desconto encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                descontos.map((desconto, index) => (
                  <TableRow key={desconto.id} isEven={index % 2 === 0}>
                    <TableCell className="font-medium">{desconto.nome}</TableCell>
                    <TableCell>
                      {desconto.tipo === 'percentual' ? 'Percentual' : 'Valor Fixo'}
                    </TableCell>
                    <TableCell>
                      {formatarValorDesconto(desconto.tipo, desconto.valor)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={desconto.ativo ? 'success' : 'primary'} 
                        module="enrollment"
                      >
                        {desconto.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" module="enrollment">
                          Editar
                        </Button>
                        <Button 
                          variant={desconto.ativo ? 'error' : 'success'} 
                          size="sm" 
                          module="enrollment"
                        >
                          {desconto.ativo ? 'Desativar' : 'Ativar'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card variant="gradient" module="enrollment">
        <CardHeader>
          <CardTitle module="enrollment">Estatísticas de Uso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <h3 className="font-medium mb-2" style={{ color: colors.primary.enrollment.main }}>
                Total de Descontos
              </h3>
              <p className="text-2xl font-bold">{descontos?.length || 0}</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <h3 className="font-medium mb-2" style={{ color: colors.primary.enrollment.main }}>
                Descontos Ativos
              </h3>
              <p className="text-2xl font-bold">{descontos?.filter(d => d.ativo).length || 0}</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <h3 className="font-medium mb-2" style={{ color: colors.primary.enrollment.main }}>
                Economia Gerada
              </h3>
              <p className="text-2xl font-bold">R$ 12.450,00</p>
            </div>
          </div>
          <p className="text-neutral-500">
            Estatísticas detalhadas de uso dos descontos serão exibidas aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
