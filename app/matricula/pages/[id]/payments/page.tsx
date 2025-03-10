import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { matriculaRoutes } from '@/app/matricula/routes'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PaymentsPageProps {
  params: {
    id: string
  }
}

export default async function PaymentsPage({ params }: PaymentsPageProps) {
  const { id } = params
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Verificar se a matrícula existe
  const { data: matricula, error: matriculaError } = await supabase
    .from('matricula.registros')
    .select(`
      id, 
      aluno:students(name),
      forma_pagamento,
      numero_parcelas,
      desconto_id,
      desconto:discounts(id, nome, tipo, valor)
    `)
    .eq('id', id)
    .single()

  if (matriculaError || !matricula) {
    console.error('Erro ao buscar matrícula:', matriculaError)
    notFound()
  }

  // Buscar pagamentos da matrícula
  const { data: pagamentos, error: pagamentosError } = await supabase
    .from('matricula_pagamentos')
    .select('*')
    .eq('matricula_id', id)
    .order('numero_parcela', { ascending: true })

  if (pagamentosError) {
    console.error('Erro ao buscar pagamentos:', pagamentosError)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatCurrency = (value: number) => {
    if (value === undefined || value === null) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // Calcular totais
  const totalPago = pagamentos
    ? pagamentos
        .filter((p) => p.status === 'pago')
        .reduce((sum, p) => sum + (p.valor || 0), 0)
    : 0

  const totalPendente = pagamentos
    ? pagamentos
        .filter((p) => p.status === 'pendente' || p.status === 'atrasado')
        .reduce((sum, p) => sum + (p.valor || 0), 0)
    : 0

  const totalGeral = pagamentos
    ? pagamentos.reduce((sum, p) => sum + (p.valor || 0), 0)
    : 0

  return (
    <div className="container py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pagamentos da Matrícula</h1>
          <p className="text-muted-foreground">
            Aluno: {matricula.aluno?.name || 'N/A'} | ID: {matricula.id.substring(0, 8)}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={matriculaRoutes.details(id)}>Voltar para Matrícula</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalPago)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalPendente)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalGeral)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Detalhes do Pagamento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-medium">Forma de Pagamento</h3>
            <p>{matricula.forma_pagamento || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-medium">Número de Parcelas</h3>
            <p>{matricula.numero_parcelas || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-medium">Desconto Aplicado</h3>
            <p>
              {matricula.desconto
                ? `${matricula.desconto.nome} (${
                    matricula.desconto.tipo === 'percentual'
                      ? `${matricula.desconto.valor}%`
                      : formatCurrency(matricula.desconto.valor)
                  })`
                : 'Nenhum'}
            </p>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parcela</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Pagamento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!pagamentos || pagamentos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum pagamento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                pagamentos.map((pagamento) => (
                  <TableRow key={pagamento.id}>
                    <TableCell>{pagamento.numero_parcela}</TableCell>
                    <TableCell>{formatDate(pagamento.data_vencimento)}</TableCell>
                    <TableCell>{formatCurrency(pagamento.valor)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          pagamento.status === 'pago'
                            ? 'success'
                            : pagamento.status === 'atrasado'
                            ? 'destructive'
                            : 'outline'
                        }
                      >
                        {pagamento.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(pagamento.data_pagamento) || '-'}</TableCell>
                    <TableCell className="text-right">
                      {pagamento.status !== 'pago' && (
                        <Button variant="outline" size="sm">
                          Registrar Pagamento
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
