'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { uploadDocumento } from '../actions/matricula-actions'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

const documentUploadSchema = z.object({
  tipo: z.string().min(1, { message: 'Tipo de documento é obrigatório' }),
  arquivo: z.any().refine((file) => file?.size > 0, { message: 'Arquivo é obrigatório' }),
})

interface DocumentUploadProps {
  matriculaId: string
  onSuccess?: () => void
}

export function DocumentUpload({ matriculaId, onSuccess }: DocumentUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      tipo: '',
      arquivo: null,
    },
  })

  const onSubmit = async (data: z.infer<typeof documentUploadSchema>) => {
    setIsLoading(true)
    try {
      const result = await uploadDocumento({
        matricula_id: matriculaId,
        tipo: data.tipo,
        arquivo: data.arquivo,
      })

      if (result.success) {
        toast({
          title: 'Documento enviado',
          description: 'O documento foi enviado com sucesso.',
        })
        form.reset()
        if (onSuccess) {
          onSuccess()
        }
        router.refresh()
      } else {
        toast({
          title: 'Erro',
          description: result.error?.message || 'Ocorreu um erro ao enviar o documento.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Erro ao enviar documento:', error)
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Documento</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de documento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="rg">RG</SelectItem>
                  <SelectItem value="cpf">CPF</SelectItem>
                  <SelectItem value="historico_escolar">Histórico Escolar</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="comprovante_residencia">Comprovante de Residência</SelectItem>
                  <SelectItem value="foto">Foto</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="arquivo"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Arquivo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  disabled={isLoading}
                  {...field}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      onChange(file)
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar Documento'}
        </Button>
      </form>
    </Form>
  )
}
