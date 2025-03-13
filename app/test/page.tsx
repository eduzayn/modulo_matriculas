'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';

export default function TestPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Teste de Componentes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Formulário de Teste</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <Input placeholder="Digite seu nome" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input type="email" placeholder="Digite seu email" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Curso</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desenvolvimento-web">Desenvolvimento Web</SelectItem>
                  <SelectItem value="data-science">Ciência de Dados</SelectItem>
                  <SelectItem value="mobile">Desenvolvimento Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mensagem</label>
              <Textarea placeholder="Digite sua mensagem" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Enviar</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Status de Matrícula</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Status:</span>
              <Badge variant="success">Ativa</Badge>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Pagamento:</span>
              <Badge variant="warning">Pendente</Badge>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Documentos:</span>
              <Badge variant="destructive">Incompletos</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Cancelar Matrícula</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso cancelará permanentemente sua matrícula
                    e removerá seus dados do nosso servidor.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction>Continuar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
      
      <Button variant="outline" className="mr-2">Botão Outline</Button>
      <Button variant="secondary" className="mr-2">Botão Secundário</Button>
      <Button variant="destructive" className="mr-2">Botão Destrutivo</Button>
      <Button variant="ghost" className="mr-2">Botão Ghost</Button>
      <Button variant="link">Botão Link</Button>
    </div>
  );
}
