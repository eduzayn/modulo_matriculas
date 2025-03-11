import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getAlunoMatriculas } from '../lib/services/aluno-service'
import { Badge } from '@/components/ui/badge'

export default async function AlunoFinanceiroPage() {
  // Authentication is now handled by the main site
  // TODO: Get user information from the main site's authentication system
  const userId = 'placeholder' // Replace with actual user ID from main site
  
  // Obter matrículas do aluno
  const matriculas = await getAlunoMatriculas(null, userId)
  
  // Calcular totais financeiros
  const pagamentos = matriculas.flatMap(m => m.pagamentos || [])
  const totalPago = pagamentos
    .filter(p => p.status === 'pago')
    .reduce((sum, p) => sum + (p.valor || 0), 0)
  
  const totalPendente = pagamentos
    .filter(p => p.status === 'pendente' || p.status === 'atrasado')
    .reduce((sum, p) => sum + (p.valor || 0), 0)
  
  const proximosVencimentos = pagamentos
    .filter(p => p.status === 'pendente')
    .sort((a, b) => new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime())
    .slice(0, 3)
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }
  
  return (
    <div className="container py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-neutral-500">
            Gerencie seus pagamentos e informações financeiras
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPago)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalPendente)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Próximo Vencimento</CardTitle>
          </CardHeader>
          <CardContent>
            {proximosVencimentos.length > 0 ? (
              <div>
                <p className="text-2xl font-bold">{formatCurrency(proximosVencimentos[0].valor)}</p>
                <p className="text-sm text-neutral-500">Vence em: {formatDate(proximosVencimentos[0].data_vencimento)}</p>
              </div>
            ) : (
              <p className="text-2xl font-bold">Nenhum pagamento pendente</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">Histórico de Pagamentos</h2>
      
      {pagamentos.length === 0 ? (
        <p className="text-neutral-500">Você não possui pagamentos registrados.</p>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-medium">Matrícula</th>
                <th className="p-3 text-left font-medium">Parcela</th>
                <th className="p-3 text-left font-medium">Vencimento</th>
                <th className="p-3 text-left font-medium">Valor</th>
                <th className="p-3 text-left font-medium">Status</th>
                <th className="p-3 text-left font-medium">Pagamento</th>
                <th className="p-3 text-left font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.map((pagamento) => {
                const matricula = matriculas.find(m => 
                  m.pagamentos?.some(p => p.id === pagamento.id)
                )
                
                return (
                  <tr key={pagamento.id} className="border-b">
                    <td className="p-3">
                      <Link href={`/aluno/matricula/${matricula?.id}`} className="text-blue-600 hover:underline">
                        #{matricula?.id.substring(0, 8) || 'N/A'}
                      </Link>
                    </td>
                    <td className="p-3">{pagamento.numero_parcela}</td>
                    <td className="p-3">{formatDate(pagamento.data_vencimento)}</td>
                    <td className="p-3">{formatCurrency(pagamento.valor)}</td>
                    <td className="p-3">
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
                    </td>
                    <td className="p-3">{formatDate(pagamento.data_pagamento) || '-'}</td>
                    <td className="p-3">
                      {pagamento.status !== 'pago' && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/aluno/pagamento/${pagamento.id}`}>
                            Pagar
                          </Link>
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">Próximos Vencimentos</h2>
      
      {proximosVencimentos.length === 0 ? (
        <p className="text-neutral-500">Você não possui pagamentos pendentes.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proximosVencimentos.map((pagamento) => {
            const matricula = matriculas.find(m => 
              m.pagamentos?.some(p => p.id === pagamento.id)
            )
            
            return (
              <Card key={pagamento.id}>
                <CardHeader>
                  <CardTitle className="text-lg">Parcela {pagamento.numero_parcela}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Matrícula:</strong> #{matricula?.id.substring(0, 8) || 'N/A'}</p>
                  <p><strong>Curso:</strong> {matricula?.curso?.name || 'N/A'}</p>
                  <p><strong>Vencimento:</strong> {formatDate(pagamento.data_vencimento)}</p>
                  <p><strong>Valor:</strong> {formatCurrency(pagamento.valor)}</p>
                  <div className="flex justify-end mt-4">
                    <Button asChild>
                      <Link href={`/aluno/pagamento/${pagamento.id}`}>
                        Pagar Agora
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
