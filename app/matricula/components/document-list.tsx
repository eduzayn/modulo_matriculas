'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { StatusDocumento } from '@edunexia/types'
import { avaliarDocumento } from '../actions/matricula-actions'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

interface DocumentListProps {
  documents: any[]
  isAdmin?: boolean
}

export function DocumentList({ documents, isAdmin = false }: DocumentListProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [status, setStatus] = useState<StatusDocumento>(StatusDocumento.PENDENTE)
  const [observacoes, setObservacoes] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const handleAvaliarDocumento = async () => {
    if (!selectedDocument) return

    setIsLoading(true)
    try {
      const result = await avaliarDocumento({
        documento_id: selectedDocument.id,
        status,
        observacoes,
      })

      if (result.success) {
        toast({
          title: 'Documento avaliado',
          description: 'O documento foi avaliado com sucesso.',
        })
        setIsDialogOpen(false)
        router.refresh()
      } else {
        toast({
          title: 'Erro',
          description: result.error?.message || 'Ocorreu um erro ao avaliar o documento.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Erro ao avaliar documento:', error)
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openAvaliacaoDialog = (document: any) => {
    setSelectedDocument(document)
    setStatus(document.status || StatusDocumento.PENDENTE)
    setObservacoes(document.observacoes || '')
    setIsDialogOpen(true)
  }

  const getStatusBadgeVariant = (status: StatusDocumento): "outline" | "secondary" | "destructive" | "default" | null | undefined => {
    const variants: Record<StatusDocumento, "outline" | "secondary" | "destructive" | "default" | null | undefined> = {
      [StatusDocumento.PENDENTE]: 'outline',
      [StatusDocumento.APROVADO]: 'outline',
      [StatusDocumento.REJEITADO]: 'destructive',
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

  if (!documents || documents.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Nenhum documento encontrado.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <Card key={document.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{document.tipo}</CardTitle>
              <Badge variant={getStatusBadgeVariant(document.status as StatusDocumento)}>
                {document.status}
              </Badge>
            </div>
            <CardDescription>
              Enviado em: {formatDate(document.created_at)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {document.observacoes && (
              <div className="mb-4">
                <h4 className="text-sm font-medium">Observações:</h4>
                <p className="text-sm text-muted-foreground">{document.observacoes}</p>
              </div>
            )}
            <div className="flex items-center justify-center">
              <Button variant="outline" asChild>
                <a href={document.url} target="_blank" rel="noopener noreferrer">
                  Visualizar Documento
                </a>
              </Button>
            </div>
          </CardContent>
          {isAdmin && (
            <CardFooter>
              <Button 
                onClick={() => openAvaliacaoDialog(document)}
                variant="outline"
                className="w-full"
              >
                Avaliar Documento
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avaliar Documento</DialogTitle>
            <DialogDescription>
              Avalie o documento enviado pelo aluno.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Tipo de Documento</h4>
              <p>{selectedDocument?.tipo}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Status</h4>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as StatusDocumento)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={StatusDocumento.PENDENTE}>Pendente</SelectItem>
                  <SelectItem value={StatusDocumento.APROVADO}>Aprovado</SelectItem>
                  <SelectItem value={StatusDocumento.REJEITADO}>Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Observações</h4>
              <Textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Adicione observações sobre o documento"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleAvaliarDocumento} disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Avaliação'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
