'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/Badge"
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import { matriculaRoutes } from '../routes'
import { MatriculaStatus, DocumentoStatus } from '../types/matricula'
import { updateMatriculaStatus } from '../actions/matricula-actions'
import { toast } from '@/components/ui/use-toast'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface MatriculaDetailsProps {
  matricula: any
}

export function MatriculaDetails({ matricula }: MatriculaDetailsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: MatriculaStatus) => {
    setIsLoading(true)
    try {
      const result = await updateMatriculaStatus({
        id: matricula.id,
        status: newStatus,
        observacoes: `Status alterado de ${matricula.status} para ${newStatus}`
      })

      if (result.success) {
        toast({
          title: 'Status atualizado',
          description: 'O status da matrícula foi atualizado com sucesso.',
        })
        router.refresh()
      } else {
        toast({
          title: 'Erro',
          description: result.error?.message || 'Ocorreu um erro ao atualizar o status.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadgeVariant = (status: string): "outline" | "secondary" | "destructive" | "default" | null | undefined => {
    const variants: Record<string, "outline" | "secondary" | "destructive" | "default" | null | undefined> = {
      [MatriculaStatus.PENDENTE]: 'outline',
      [MatriculaStatus.APROVADO]: 'secondary',
      [MatriculaStatus.REJEITADO]: 'destructive',
      [MatriculaStatus.ATIVO]: 'default',
      [MatriculaStatus.TRANCADO]: 'outline',
      [MatriculaStatus.CANCELADO]: 'destructive',
      [MatriculaStatus.CONCLUIDO]: 'outline',
    }
    return variants[status] || 'outline'
  }

  const getDocumentStatusBadgeVariant = (status: string): "outline" | "secondary" | "destructive" | "default" | null | undefined => {
    const variants: Record<string, "outline" | "secondary" | "destructive" | "default" | null | undefined> = {
      [DocumentoStatus.PENDENTE]: 'outline',
      [DocumentoStatus.APROVADO]: 'outline',
      [DocumentoStatus.REJEITADO]: 'destructive',
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
          <p className="text-muted-foreground">
            Aluno: {matricula.aluno?.name || 'N/A'} | Curso: {matricula.curso?.name || 'N/A'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant(matricula.status)}>
            {matricula.status}
          </Badge>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                Alterar Status
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Alterar Status da Matrícula</AlertDialogTitle>
                <AlertDialogDescription>
                  Selecione o novo status para esta matrícula. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid grid-cols-2 gap-2 py-4">
                {Object.values(MatriculaStatus).map((status) => (
                  <Button
                    key={status}
                    variant={status === matricula.status ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(status as MatriculaStatus)}
                    disabled={status === matricula.status || isLoading}
                    className="w-full"
                  >
                    {status}
                  </Button>
                ))}
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(matriculaRoutes.edit(matricula.id))}
          >
            Editar
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
                <h3 className="font-medium mb-2">Aluno</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-muted-foreground">Nome</h4>
                    <p>{matricula.aluno?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground">Email</h4>
                    <p>{matricula.aluno?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground">Telefone</h4>
                    <p>{matricula.aluno?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground">CPF</h4>
                    <p>{matricula.aluno?.cpf || 'N/A'}</p>
                  </div>
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
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push(matriculaRoutes.list)}>
                Voltar para Lista
              </Button>
              <Button onClick={() => router.push(matriculaRoutes.edit(matricula.id))}>
                Editar Matrícula
              </Button>
            </CardFooter>
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
                        <Badge variant={getDocumentStatusBadgeVariant(doc.status)}>
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
            <CardFooter>
              <Button onClick={() => router.push(matriculaRoutes.documents(matricula.id))}>
                Gerenciar Documentos
              </Button>
            </CardFooter>
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
            <CardFooter>
              <Button onClick={() => router.push(matriculaRoutes.contract(matricula.id))}>
                Gerenciar Contrato
              </Button>
            </CardFooter>
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
                              <Badge variant={pagamento.status === 'pago' ? 'outline' : pagamento.status === 'atrasado' ? 'outline' : 'outline'}>
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
            <CardFooter>
              <Button onClick={() => router.push(matriculaRoutes.payments(matricula.id))}>
                Gerenciar Pagamentos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
