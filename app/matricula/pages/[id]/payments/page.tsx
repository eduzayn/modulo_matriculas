import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { matriculaRoutes } from '@/app/matricula/routes'
// TODO: Import API client for main site authentication and data access
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
import { colors } from '@/app/styles/colors'

interface PaymentsPageProps {
  params: {
    id: string
  }
}

export default async function PaymentsPage({ params }: PaymentsPageProps) {
  const { id } = params
  // TODO: Use main site's API client to fetch data
  // Authentication is now handled by the main site
  const { data: matricula, error: matriculaError } = await fetch(`/api/matriculas/${id}`).then(res => res.json())
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
          <p className="text-neutral-500">
            Aluno: {matricula.aluno?.name || 'N/A'} | ID: {matricula.id.substring(0, 8)}
          </p>
        </div>
        <Button variant="outline" module="enrollment" asChild>
          <Link href={matriculaRoutes.details(id)}>Voltar para Matrícula</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="gradient" module="enrollment">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg" module="enrollment">Total Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPago)}</p>
          </CardContent>
        </Card>
        <Card variant="gradient" module="enrollment">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg" module="enrollment">Total Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalPendente)}</p>
          </CardContent>
        </Card>
        <Card variant="gradient" module="enrollment">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg" module="enrollment">Total Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalGeral)}</p>
          </CardContent>
        </Card>
      </div>

      <Card variant="default" module="enrollment" className="p-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: colors.primary.enrollment.dark }}>Detalhes do Pagamento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-medium" style={{ color: colors.primary.enrollment.main }}>Forma de Pagamento</h3>
            <p>{matricula.forma_pagamento || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-medium" style={{ color: colors.primary.enrollment.main }}>Número de Parcelas</h3>
            <p>{matricula.numero_parcelas || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-medium" style={{ color: colors.primary.enrollment.main }}>Desconto Aplicado</h3>
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
          <Table module="enrollment">
            <TableHeader module="enrollment">
              <TableRow>
                <TableHead module="enrollment">Parcela</TableHead>
                <TableHead module="enrollment">Vencimento</TableHead>
                <TableHead module="enrollment">Valor</TableHead>
                <TableHead module="enrollment">Status</TableHead>
                <TableHead module="enrollment">Data Pagamento</TableHead>
                <TableHead module="enrollment" className="text-right">Ações</TableHead>
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
                pagamentos.map((pagamento, index) => (
                  <TableRow key={pagamento.id} className={index % 2 === 0 ? 'bg-neutral-50' : ''}>
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
                        style={pagamento.status === 'pago' ? { backgroundColor: `${colors.semantic.success}20`, color: colors.semantic.success } : {}}
                      >
                        {pagamento.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(pagamento.data_pagamento) || '-'}</TableCell>
                    <TableCell className="text-right">
                      {pagamento.status !== 'pago' && (
                        <Button variant="outline" size="sm" style={{ borderColor: colors.primary.enrollment.main, color: colors.primary.enrollment.main }}>
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
      </Card>
    </div>
  )
}
