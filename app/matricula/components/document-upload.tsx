'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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

const documentoSchema = z.object({
  tipo: z.string().min(1, { message: 'Selecione o tipo de documento' }),
  arquivo: z.any()
    .refine((file) => file?.length === 1, 'Selecione um arquivo')
    .refine(
      (file) => file?.[0]?.size <= 5000000,
      'O tamanho máximo do arquivo é 5MB'
    ),
});

export function DocumentUpload({ matriculaId }) {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(documentoSchema),
    defaultValues: {
      tipo: '',
      arquivo: undefined,
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('matriculaId', matriculaId);
      formData.append('tipo', data.tipo);
      formData.append('arquivo', data.arquivo[0]);
      
      const result = await uploadDocumento(formData);
      
      if (result.success) {
        toast({
          title: 'Documento enviado com sucesso',
          description: 'O documento foi adicionado à matrícula',
          variant: 'default',
        });
        form.reset();
        router.refresh();
      } else {
        throw new Error(result.error || 'Erro ao enviar documento');
      }
    } catch (error) {
      toast({
        title: 'Erro ao enviar documento',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Documento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de documento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="rg">RG</SelectItem>
                  <SelectItem value="cpf">CPF</SelectItem>
                  <SelectItem value="comprovante_residencia">Comprovante de Residência</SelectItem>
                  <SelectItem value="historico_escolar">Histórico Escolar</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
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
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Arquivo</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isUploading}>
          {isUploading ? 'Enviando...' : 'Enviar Documento'}
        </Button>
      </form>
    </Form>
  );
}
