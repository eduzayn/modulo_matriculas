'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '../../../components/ui/button';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from "@/app/components/ui/responsiveLayout";
import { Textarea } from '@/components/ui/textarea';

export default function SuportePage() {
  const [mensagem, setMensagem] = useState('');
  const [enviado, setEnviado] = useState(false);
  
  const handleEnviar = () => {
    // Simulação de envio de mensagem
    if (mensagem.trim() !== '') {
      setEnviado(true);
      setMensagem('');
      
      // Reset após 3 segundos
      setTimeout(() => {
        setEnviado(false);
      }, 3000);
    }
  };

  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Suporte" 
          subtitle="Entre em contato com nossa equipe de suporte"
        />
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Envie sua mensagem</CardTitle>
              <CardDescription>Nossa equipe responderá em até 24 horas úteis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Assunto</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Selecione um assunto</option>
                    <option value="duvida">Dúvida</option>
                    <option value="problema">Problema técnico</option>
                    <option value="sugestao">Sugestão</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Mensagem</label>
                  <Textarea 
                    placeholder="Descreva detalhadamente sua dúvida ou problema..." 
                    className="min-h-[150px]"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Anexos (opcional)</label>
                  <div className="border-dashed border-2 border-gray-300 p-4 rounded-md text-center">
                    <p className="text-sm text-gray-500">Arraste arquivos aqui ou</p>
                    <Button variant="outline" className="mt-2">Selecionar arquivos</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              {enviado ? (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md">
                  Mensagem enviada com sucesso!
                </div>
              ) : (
                <Button onClick={handleEnviar} disabled={mensagem.trim() === ''}>
                  Enviar mensagem
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Perguntas frequentes</CardTitle>
              <CardDescription>Respostas para as dúvidas mais comuns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Como posso cancelar uma matrícula?</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Para cancelar uma matrícula, acesse a página do aluno, selecione a matrícula desejada e clique no botão "Cancelar matrícula". Será necessário informar o motivo do cancelamento.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Como aplicar um desconto a um aluno específico?</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Acesse a página de Descontos, crie um novo desconto ou selecione um existente, e na opção "Aplicar a", escolha "Aluno específico" e selecione o aluno desejado.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Como gerar relatórios personalizados?</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Na página de Relatórios, utilize os filtros disponíveis para personalizar as informações que deseja incluir. Após configurar os filtros, clique em "Gerar relatório".
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Como vincular um aluno a múltiplos cursos?</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Na página de Alunos, selecione o aluno desejado e clique em "Vincular a curso". Você pode repetir esse processo para cada curso que deseja vincular ao aluno.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ResponsiveContainer>
    </ResponsiveLayout>
  );
}
