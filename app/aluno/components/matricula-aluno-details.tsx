'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"'
import { Badge } from "@/components/ui/badge"'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

interface MatriculaAlunoDetailsProps {
  matricula: any
}

export function MatriculaAlunoDetails({ matricula }: MatriculaAlunoDetailsProps) {
  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, string> = {
      'pendente': 'outline',
      'aprovado': 'secondary',
      'rejeitado': 'destructive',
      'ativo': 'default',
      'trancado': 'warning',
      'cancelado': 'destructive',
      'concluido': 'success',
    }
    return variants[status] || 'outline'
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Matrícula #{matricula.id.substring(0, 8)}</h1>
          <p className="text-neutral-500">
            Curso: {matricula.curso?.name || 'N/A'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant(matricula.status)}>
            {matricula.status}
          </Badge>
          <Button variant="outline" size="sm" asChild>
            <Link href="/aluno/dashboard">Voltar</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="contract">Contrato</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Matrícula</CardTitle>
              <CardDescription>Detalhes gerais sobre a matrícula</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Status</h3>
                  <p>{matricula.status}</p>
                </div>
                <div>
                  <h3 className="font-medium">Data de Criação</h3>
                  <p>{formatDate(matricula.created_at)}</p>
                </div>
                <div>
                  <h3 className="font-medium">Última Atualização</h3>
                  <p>{formatDate(matricula.updated_at)}</p>
                </div>
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
                  <p>{matricula.desconto?.nome || 'Nenhum'}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Curso</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-muted-foreground">Nome</h4>
                    <p>{matricula.curso?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground">Modalidade</h4>
                    <p>{matricula.curso?.modality || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground">Duração</h4>
                    <p>{matricula.curso?.duration || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground">Carga Horária</h4>
                    <p>{matricula.curso?.workload || 'N/A'} horas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>Documentos enviados para esta matrícula</CardDescription>
            </CardHeader>
            <CardContent>
              {matricula.documentos && matricula.documentos.length > 0 ? (
                <div className="space-y-4">
                  {matricula.documentos.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <h3 className="font-medium">{doc.tipo}</h3>
                        <p className="text-sm text-muted-foreground">
                          Enviado em: {formatDate(doc.created_at)}
                        </p>
                        {doc.observacoes && (
                          <p className="text-sm mt-1">{doc.observacoes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(doc.status)}>
                          {doc.status}
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            Visualizar
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum documento enviado ainda.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contract" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contrato</CardTitle>
              <CardDescription>Detalhes do contrato de matrícula</CardDescription>
            </CardHeader>
            <CardContent>
              {matricula.contrato ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Título</h3>
                      <p>{matricula.contrato.titulo || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Versão</h3>
                      <p>{matricula.contrato.versao || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Status</h3>
                      <p>{matricula.contrato.status || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Data de Assinatura</h3>
                      <p>{formatDate(matricula.contrato.data_assinatura) || 'Não assinado'}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" asChild>
                      <a href={matricula.contrato.url} target="_blank" rel="noopener noreferrer">
                        Visualizar Contrato
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum contrato gerado ainda.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pagamentos</CardTitle>
              <CardDescription>Parcelas e pagamentos da matrícula</CardDescription>
            </CardHeader>
            <CardContent>
              {matricula.pagamentos && matricula.pagamentos.length > 0 ? (
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-2 text-left font-medium">Parcela</th>
                          <th className="p-2 text-left font-medium">Vencimento</th>
                          <th className="p-2 text-left font-medium">Valor</th>
                          <th className="p-2 text-left font-medium">Status</th>
                          <th className="p-2 text-left font-medium">Pagamento</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matricula.pagamentos.map((pagamento: any) => (
                          <tr key={pagamento.id} className="border-b">
                            <td className="p-2">{pagamento.numero_parcela}</td>
                            <td className="p-2">{formatDate(pagamento.data_vencimento)}</td>
                            <td className="p-2">{formatCurrency(pagamento.valor)}</td>
                            <td className="p-2">
                              <Badge variant={pagamento.status === 'pago' ? 'success' : pagamento.status === 'atrasado' ? 'destructive' : 'outline'}>
                                {pagamento.status}
                              </Badge>
                            </td>
                            <td className="p-2">{formatDate(pagamento.data_pagamento) || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum pagamento gerado ainda.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
