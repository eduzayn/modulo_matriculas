'use client';

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function MatriculaAlunoDetails({ matricula }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Matrícula #{matricula.id}</CardTitle>
            <CardDescription>Detalhes da matrícula do aluno</CardDescription>
          </div>
          <Badge variant={matricula.status === 'Ativa' ? 'success' : 'destructive'}>
            {matricula.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-4 mt-4">
            <div>
              <h3 className="font-medium text-sm">Curso</h3>
              <p>{matricula.curso}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium text-sm">Data de Início</h3>
              <p>{new Date(matricula.dataInicio).toLocaleDateString('pt-BR')}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium text-sm">Data de Término</h3>
              <p>{new Date(matricula.dataTermino).toLocaleDateString('pt-BR')}</p>
            </div>
          </TabsContent>
          <TabsContent value="financeiro" className="space-y-4 mt-4">
            <div>
              <h3 className="font-medium text-sm">Valor Total</h3>
              <p>R$ {matricula.valorTotal.toFixed(2)}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium text-sm">Forma de Pagamento</h3>
              <p>{matricula.formaPagamento}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium text-sm">Parcelas</h3>
              <p>{matricula.parcelas}x de R$ {(matricula.valorTotal / matricula.parcelas).toFixed(2)}</p>
            </div>
            <div className="mt-4">
              <Link href={`/aluno/financeiro?matricula=${matricula.id}`} className="text-blue-600 hover:underline">
                Ver detalhes financeiros
              </Link>
            </div>
          </TabsContent>
          <TabsContent value="documentos" className="space-y-4 mt-4">
            {matricula.documentos && matricula.documentos.length > 0 ? (
              <ul className="space-y-2">
                {matricula.documentos.map((doc, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{doc.nome}</span>
                    <Link href={doc.url} className="text-blue-600 hover:underline" target="_blank">
                      Visualizar
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Nenhum documento disponível</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href="/aluno/dashboard" className="text-sm text-muted-foreground hover:underline">
          Voltar para Dashboard
        </Link>
        <Link href={`/aluno/contratos/${matricula.contratoId}`} className="text-blue-600 hover:underline">
          Ver Contrato
        </Link>
      </CardFooter>
    </Card>
  );
}
