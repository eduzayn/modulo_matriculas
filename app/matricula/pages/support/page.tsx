import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { matriculaRoutes } from '@/app/matricula/routes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import { Textarea } from '@/components/ui/Textarea'
import React from 'react'

export default async function SupportPage() {
  // Authentication is now handled by the main site through middleware

  return (
    <div className="container py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suporte</h1>
          <p className="text-muted-foreground">
            Central de ajuda para o módulo de matrículas
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={matriculaRoutes.dashboard}>Voltar para Dashboard</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enviar Mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Assunto
                  </label>
                  <select
                    id="subject"
                    className="w-full p-2 border rounded-md"
                    defaultValue=""
                  >
                    <option value="" disabled>Selecione um assunto</option>
                    <option value="matricula">Problema com Matrícula</option>
                    <option value="documentos">Documentação</option>
                    <option value="pagamentos">Pagamentos</option>
                    <option value="sistema">Problema no Sistema</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Mensagem
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Descreva seu problema ou dúvida em detalhes..."
                    className="min-h-[150px]"
                  />
                </div>
                <div className="pt-2">
                  <Button>Enviar Mensagem</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Chamados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground text-center py-4">
                  Você não possui chamados anteriores.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Como adicionar um novo documento?</h3>
                <p className="text-sm text-muted-foreground">
                  Acesse a página de detalhes da matrícula e clique na aba "Documentos". Em seguida, 
                  clique no botão "Adicionar Documento".
                </p>
              </div>
              <div>
                <h3 className="font-medium">Como gerar um contrato?</h3>
                <p className="text-sm text-muted-foreground">
                  Na página de detalhes da matrícula, acesse a aba "Contrato" e clique em "Gerar Contrato".
                </p>
              </div>
              <div>
                <h3 className="font-medium">Como registrar um pagamento?</h3>
                <p className="text-sm text-muted-foreground">
                  Acesse a página de pagamentos da matrícula e clique em "Registrar Pagamento" ao lado 
                  da parcela desejada.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Como cancelar uma matrícula?</h3>
                <p className="text-sm text-muted-foreground">
                  Na página de detalhes da matrícula, clique no botão "Cancelar Matrícula" e confirme a ação.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contatos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Suporte Técnico</h3>
                <p className="text-sm text-muted-foreground">
                  suporte@edunexia.com.br<br />
                  (11) 1234-5678
                </p>
              </div>
              <div>
                <h3 className="font-medium">Financeiro</h3>
                <p className="text-sm text-muted-foreground">
                  financeiro@edunexia.com.br<br />
                  (11) 1234-5679
                </p>
              </div>
              <div>
                <h3 className="font-medium">Secretaria Acadêmica</h3>
                <p className="text-sm text-muted-foreground">
                  secretaria@edunexia.com.br<br />
                  (11) 1234-5680
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
