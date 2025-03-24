'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast
} from "@edunexia/ui-components"
import { MatriculaStatus, FormaPagamento } from '@edunexia/types'
import { createMatricula, updateMatriculaStatus } from '../actions/matricula-actions'
import { useRouter } from 'next/navigation'
import { matriculaRoutes } from '../routes'
import { z } from 'zod'

// Schema for form validation
const matriculaSchema = z.object({
  aluno_id: z.string().uuid({ message: 'Selecione um aluno' }),
  curso_id: z.string().uuid({ message: 'Selecione um curso' }),
  data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data inválida' }),
  data_termino: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data inválida' }).optional(),
  valor_total: z.number().positive({ message: 'Valor deve ser positivo' }),
  forma_pagamento: z.nativeEnum(FormaPagamento, { 
    errorMap: () => ({ message: 'Selecione uma forma de pagamento' }) 
  }),
  parcelas: z.number().int().positive({ message: 'Número de parcelas deve ser positivo' }),
  status: z.nativeEnum(MatriculaStatus, { 
    errorMap: () => ({ message: 'Selecione um status' }) 
  }).optional(),
})

type MatriculaFormData = z.infer<typeof matriculaSchema>

interface MatriculaFormProps {
  initialData?: Partial<MatriculaFormData>
  cursos?: Array<{ id: string; nome: string }>
  alunos?: Array<{ id: string; nome: string }>
  descontos?: Array<{ id: string; nome: string; valor: number }>
  isEditing?: boolean
}

interface FieldProps {
  field: {
    onChange: (value: any) => void
    value: any
    name: string
  }
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

  const form = useForm<MatriculaFormData>({
    resolver: zodResolver(matriculaSchema),
    defaultValues: initialData || {
      aluno_id: '',
      curso_id: '',
      forma_pagamento: FormaPagamento.BOLETO,
      parcelas: 1,
      data_inicio: '',
      data_termino: '',
      valor_total: 0,
      status: isEditing ? initialData?.status : undefined,
    },
  })

  const onSubmit = async (data: MatriculaFormData) => {
    setIsLoading(true)
    try {
      if (isEditing && initialData?.id) {
        const result = await updateMatriculaStatus({
          matricula_id: initialData.id,
          status: data.status as MatriculaStatus,
        })
        
        if (result?.data) {
          toast({
            title: 'Matrícula atualizada',
            description: 'A matrícula foi atualizada com sucesso.',
          })
          router.push(matriculaRoutes.details(initialData.id))
        } else {
          toast({
            title: 'Erro',
            description: result?.serverError || 'Ocorreu um erro ao atualizar a matrícula.',
            variant: 'destructive',
          })
        }
      } else {
        const result = await createMatricula({
          aluno_id: data.aluno_id,
          curso_id: data.curso_id,
          data_inicio: data.data_inicio,
          data_termino: data.data_termino,
          valor_total: data.valor_total,
          forma_pagamento: data.forma_pagamento,
          parcelas: data.parcelas,
        })

        if (result?.data) {
          toast({
            title: 'Matrícula criada',
            description: 'A matrícula foi criada com sucesso.',
          })
          router.push(matriculaRoutes.details(result.data.id))
        } else {
          toast({
            title: 'Erro',
            description: result?.serverError || 'Ocorreu um erro ao criar a matrícula.',
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      console.error('Erro ao processar matrícula:', error)
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao processar a matrícula.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="aluno_id"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Aluno</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={field.value}
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
                        {aluno.nome}
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
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Curso</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={field.value}
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
                        {curso.nome}
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
            name="data_inicio"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Data de Início</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    type="date"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_termino"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Data de Término</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    type="date"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valor_total"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Valor Total</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="forma_pagamento"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Forma de Pagamento</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(FormaPagamento).map((forma) => (
                      <SelectItem key={forma} value={forma}>
                        {forma}
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
            name="parcelas"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Número de Parcelas</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEditing && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }: FieldProps) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(MatriculaStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex items-center gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
