'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Schema for form validation
const cursoSchema = z.object({
  nome: z.string().min(3, { message: 'Nome do curso deve ter pelo menos 3 caracteres' }),
  duracao: z.string().min(1, { message: 'Duração é obrigatória' }),
  preco: z.string().min(1, { message: 'Preço é obrigatório' }),
  vagas: z.number().min(1, { message: 'Número de vagas deve ser pelo menos 1' }),
});

export type CursoFormValues = z.infer<typeof cursoSchema>;

interface NovoCursoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CursoFormValues) => void;
}

export function NovoCursoDialog({ isOpen, onClose, onSave }: NovoCursoDialogProps) {
  const form = useForm<CursoFormValues>({
    resolver: zodResolver(cursoSchema),
    defaultValues: {
      nome: '',
      duracao: '',
      preco: '',
      vagas: 0,
    },
  });

  const onSubmit = (data: CursoFormValues) => {
    onSave(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Curso</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo curso.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Curso</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Desenvolvimento Web" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duracao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 6 meses" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: R$ 2.500,00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vagas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vagas</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
