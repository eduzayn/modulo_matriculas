'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/Card';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from '../../../app/components/ui/ResponsiveLayout';

export default function ConfiguracoesPage() {
  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Configurações" 
          subtitle="Configurações do módulo de matrículas"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Configurações gerais do sistema de matrículas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Instituição
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="Edunexia"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de Contato
                </label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="contato@edunexia.com.br"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Moeda
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="BRL">Real Brasileiro (R$)</option>
                  <option value="USD">Dólar Americano ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Salvar Alterações
              </button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Matrícula</CardTitle>
              <CardDescription>Configurações específicas para matrículas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Período de Matrícula
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    defaultValue="2025-01-15"
                  />
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    defaultValue="2025-03-15"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taxa de Matrícula
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="R$ 100,00"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="permitir-parcelamento"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="permitir-parcelamento" className="ml-2 block text-sm text-gray-700">
                  Permitir parcelamento de matrículas
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="enviar-email"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="enviar-email" className="ml-2 block text-sm text-gray-700">
                  Enviar email de confirmação após matrícula
                </label>
              </div>
            </CardContent>
            <CardFooter>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Salvar Alterações
              </button>
            </CardFooter>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>Configure integrações com outros sistemas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 border border-gray-200 rounded-md">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Sistema Financeiro</h3>
                    <p className="text-xs text-gray-500">Integração com o sistema financeiro</p>
                  </div>
                  <div className="ml-auto">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center p-4 border border-gray-200 rounded-md">
                  <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Portal do Aluno</h3>
                    <p className="text-xs text-gray-500">Integração com o portal do aluno</p>
                  </div>
                  <div className="ml-auto">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Salvar Integrações
              </button>
            </CardFooter>
          </Card>
        </div>
      </ResponsiveContainer>
    </ResponsiveLayout>
  );
}
