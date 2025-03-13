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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Schema for form validation
const descontoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }),
  percentual: z.string().min(1, { message: 'Percentual é obrigatório' }),
  aplicacao: z.string().min(1, { message: 'Aplicação é obrigatória' }),
  status: z.string().min(1, { message: 'Status é obrigatório' }),
  validade: z.string().min(1, { message: 'Data de validade é obrigatória' }),
});

export type DescontoFormValues = z.infer<typeof descontoSchema>;

interface NovoDescontoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DescontoFormValues) => void;
}

export function NovoDescontoDialog({ isOpen, onClose, onSave }: NovoDescontoDialogProps) {
  const form = useForm<DescontoFormValues>({
    resolver: zodResolver(descontoSchema),
    defaultValues: {
      nome: '',
      percentual: '',
      aplicacao: '',
      status: 'Ativo',
      validade: '',
    },
  });

  const onSubmit = (data: DescontoFormValues) => {
    onSave(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Desconto</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo desconto ou bolsa.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Desconto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Desconto Antecipado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="percentual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentual (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aplicacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aplicação</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Pagamento antecipado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="validade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Validade</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
