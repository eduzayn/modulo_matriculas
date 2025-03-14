'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from "@/components/ui/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { MatriculaStatus } from '../types/matricula';
import { matriculaRoutes } from '../routes';

interface MatriculaListProps {
  matriculas: any[]
  totalCount: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onFilterChange: (filters: Record<string, any>) => void
}

export function MatriculaList({
  matriculas,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onFilterChange,
}: MatriculaListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const totalPages = Math.ceil(totalCount / pageSize)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange({ search: searchTerm })
  }

  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    onFilterChange({ status })
  }

  const handleRowClick = (id: string) => {
    router.push(matriculaRoutes.details(id))
  }

  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, string> = {
      [MatriculaStatus.PENDENTE]: 'outline',
      [MatriculaStatus.APROVADO]: 'secondary',
      [MatriculaStatus.REJEITADO]: 'destructive',
      [MatriculaStatus.ATIVO]: 'default',
      [MatriculaStatus.TRANCADO]: 'warning',
      [MatriculaStatus.CANCELADO]: 'destructive',
      [MatriculaStatus.CONCLUIDO]: 'success',
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-end justify-between">
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Buscar por nome ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-[300px]"
          />
          <Button type="submit">Buscar</Button>
        </form>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {Object.values(MatriculaStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => router.push(matriculaRoutes.create)}>
            Nova Matrícula
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Aluno</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matriculas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhuma matrícula encontrada.
                </TableCell>
              </TableRow>
            ) : (
              matriculas.map((matricula) => (
                <TableRow
                  key={matricula.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(matricula.id)}
                >
                  <TableCell className="font-medium">
                    {matricula.id.substring(0, 8)}
                  </TableCell>
                  <TableCell>{matricula.aluno?.name || 'N/A'}</TableCell>
                  <TableCell>{matricula.curso?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(matricula.status) as any}>
                      {matricula.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(matricula.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(matriculaRoutes.edit(matricula.id))
                      }}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            Anterior
          </Button>
          <div className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  )
}
