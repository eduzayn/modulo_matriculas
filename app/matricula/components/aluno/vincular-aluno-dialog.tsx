'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../../components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/Select';

// Schema for form validation
const vincularSchema = z.object({
  alunoId: z.string().min(1, { message: 'Selecione um aluno' }),
  cursoNome: z.string().min(1, { message: 'Selecione um curso' }),
});

export type VincularFormValues = z.infer<typeof vincularSchema>;

interface VincularAlunoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (alunoId: number, cursoNome: string) => void;
  alunos: Array<{ id: number; nome: string; email: string; curso?: string; status: string }>;
  cursos: Array<{ id: number; nome: string }>;
}

export function VincularAlunoDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  alunos, 
  cursos 
}: VincularAlunoDialogProps) {
  const form = useForm<VincularFormValues>({
    resolver: zodResolver(vincularSchema),
    defaultValues: {
      alunoId: '',
      cursoNome: '',
    },
  });

  const onSubmit = (data: VincularFormValues) => {
    onSave(parseInt(data.alunoId), data.cursoNome);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Vincular Aluno ao Curso</DialogTitle>
          <DialogDescription>
            Selecione um aluno e um curso para realizar a vinculação.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="alunoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aluno</FormLabel>
                  <Select
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
                        <SelectItem key={aluno.id} value={aluno.id.toString()}>
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
              name="cursoNome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curso</FormLabel>
                  <Select
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
                        <SelectItem key={curso.id} value={curso.nome}>
                          {curso.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Vincular</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
