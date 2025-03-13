'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '../../../components/ui/button';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from '../../../app/components/ui/responsiveLayout';

export default function ConfiguracoesPage() {
  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Configurações" 
          subtitle="Configurações do sistema de matrículas"
        />
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Configurações gerais do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Tema do Sistema</h3>
                  <div className="mt-2 flex space-x-2">
                    <Button variant="outline" size="sm">Claro</Button>
                    <Button variant="outline" size="sm">Escuro</Button>
                    <Button variant="default" size="sm">Sistema</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Idioma</h3>
                  <div className="mt-2 flex space-x-2">
                    <Button variant="default" size="sm">Português</Button>
                    <Button variant="outline" size="sm">English</Button>
                    <Button variant="outline" size="sm">Español</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Configurações de notificações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Email</h3>
                    <p className="text-sm text-gray-500">Receber notificações por email</p>
                  </div>
                  <Button variant="outline" size="sm">Ativado</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">SMS</h3>
                    <p className="text-sm text-gray-500">Receber notificações por SMS</p>
                  </div>
                  <Button variant="outline" size="sm">Desativado</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Push</h3>
                    <p className="text-sm text-gray-500">Receber notificações push</p>
                  </div>
                  <Button variant="outline" size="sm">Desativado</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Configurações de segurança</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Autenticação de dois fatores</h3>
                    <p className="text-sm text-gray-500">Aumenta a segurança da sua conta</p>
                  </div>
                  <Button variant="outline" size="sm">Ativar</Button>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Alterar senha</h3>
                  <p className="text-sm text-gray-500">Altere sua senha periodicamente</p>
                  <Button variant="outline" size="sm" className="mt-2">Alterar senha</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>Configurações de integrações com outros sistemas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">API</h3>
                    <p className="text-sm text-gray-500">Gerenciar chaves de API</p>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Webhooks</h3>
                    <p className="text-sm text-gray-500">Configurar webhooks</p>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Exportação de dados</h3>
                    <p className="text-sm text-gray-500">Configurar exportação automática</p>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ResponsiveContainer>
    </ResponsiveLayout>
  );
}
