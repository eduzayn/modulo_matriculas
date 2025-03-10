'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MatriculaStatus, FormaPagamento } from '../types/matricula'
import { matriculaSchema } from '../lib/schemas'
import { createMatricula, updateMatriculaStatus } from '../actions/matricula-actions'
import { useRouter } from 'next/navigation'
import { matriculaRoutes } from '../routes'
import { toast } from '@/components/ui/use-toast'
import { z } from 'zod'

interface MatriculaFormProps {
  initialData?: any
  cursos?: any[]
  alunos?: any[]
  descontos?: any[]
  isEditing?: boolean
}

export function MatriculaForm({
  initialData,
  cursos = [],
  alunos = [],
  descontos = [],
  isEditing = false,
}: MatriculaFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(matriculaSchema),
    defaultValues: initialData || {
      aluno_id: '',
      curso_id: '',
      formaPagamento: FormaPagamento.BOLETO,
      numeroParcelas: 1,
      status: MatriculaStatus.PENDENTE,
      metadata: {},
    },
  })

  const onSubmit = async (data: z.infer<typeof matriculaSchema>) => {
    setIsLoading(true)
    try {
      if (isEditing && initialData?.id) {
        const result = await updateMatriculaStatus({
          id: initialData.id,
          status: data.status,
          observacoes: 'Status atualizado via formulário'
        })
        
        if (result.success) {
          toast({
            title: 'Matrícula atualizada',
            description: 'A matrícula foi atualizada com sucesso.',
          })
          router.push(matriculaRoutes.details(initialData.id))
        } else {
          toast({
            title: 'Erro',
            description: result.error?.message || 'Ocorreu um erro ao atualizar a matrícula.',
            variant: 'destructive',
          })
        }
      } else {
        const result = await createMatricula(data)
        if (result.success) {
          toast({
            title: 'Matrícula criada',
            description: 'A matrícula foi criada com sucesso.',
          })
          router.push(matriculaRoutes.details(result.data.matricula_id))
        } else {
          toast({
            title: 'Erro',
            description: result.error?.message || 'Ocorreu um erro ao criar a matrícula.',
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="aluno_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aluno</FormLabel>
              <Select
                disabled={isLoading || isEditing}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {alunos.map((aluno) => (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      {aluno.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="curso_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Curso</FormLabel>
              <Select
                disabled={isLoading || isEditing}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cursos.map((curso) => (
                    <SelectItem key={curso.id} value={curso.id}>
                      {curso.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="formaPagamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Forma de Pagamento</FormLabel>
              <Select
                disabled={isLoading || isEditing}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma forma de pagamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={FormaPagamento.CARTAO_CREDITO}>Cartão de Crédito</SelectItem>
                  <SelectItem value={FormaPagamento.BOLETO}>Boleto Bancário</SelectItem>
                  <SelectItem value={FormaPagamento.PIX}>PIX</SelectItem>
                  <SelectItem value={FormaPagamento.TRANSFERENCIA}>Transferência Bancária</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numeroParcelas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Parcelas</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  disabled={isLoading || isEditing}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descontoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desconto</FormLabel>
              <Select
                disabled={isLoading || isEditing}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um desconto (opcional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {descontos.map((desconto) => (
                    <SelectItem key={desconto.id} value={desconto.id}>
                      {desconto.nome} - {desconto.tipo === 'percentual' ? `${desconto.valor}%` : `R$ ${desconto.valor}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditing && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={MatriculaStatus.PENDENTE}>Pendente</SelectItem>
                    <SelectItem value={MatriculaStatus.APROVADO}>Aprovado</SelectItem>
                    <SelectItem value={MatriculaStatus.REJEITADO}>Rejeitado</SelectItem>
                    <SelectItem value={MatriculaStatus.ATIVO}>Ativo</SelectItem>
                    <SelectItem value={MatriculaStatus.TRANCADO}>Trancado</SelectItem>
                    <SelectItem value={MatriculaStatus.CANCELADO}>Cancelado</SelectItem>
                    <SelectItem value={MatriculaStatus.CONCLUIDO}>Concluído</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
