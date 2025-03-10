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
          <p className="text-muted-foreground">
            Configuração de descontos para matrículas
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href={matriculaRoutes.dashboard}>Voltar para Dashboard</Link>
          </Button>
          <Button>
            Novo Desconto
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Descontos Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
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
                descontos.map((desconto) => (
                  <TableRow key={desconto.id}>
                    <TableCell className="font-medium">{desconto.nome}</TableCell>
                    <TableCell>
                      {desconto.tipo === 'percentual' ? 'Percentual' : 'Valor Fixo'}
                    </TableCell>
                    <TableCell>
                      {formatarValorDesconto(desconto.tipo, desconto.valor)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={desconto.ativo ? 'success' : 'outline'}>
                        {desconto.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
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

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Uso</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Estatísticas de uso dos descontos serão exibidas aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
