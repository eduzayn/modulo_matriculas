'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from '../../../app/components/ui/ResponsiveLayout';

export default function DescontosPage() {
  // Mock data for discounts
  const mockDescontos = [
    { id: 1, nome: 'Desconto Antecipado', percentual: 15, aplicacao: 'Pagamento antecipado', status: 'Ativo', validade: '31/12/2025' },
    { id: 2, nome: 'Desconto Familiar', percentual: 10, aplicacao: 'Parentes de alunos', status: 'Ativo', validade: '31/12/2025' },
    { id: 3, nome: 'Bolsa Mérito', percentual: 50, aplicacao: 'Alunos com excelência acadêmica', status: 'Ativo', validade: '31/12/2025' },
    { id: 4, nome: 'Desconto Funcionário', percentual: 25, aplicacao: 'Funcionários da instituição', status: 'Ativo', validade: '31/12/2025' },
    { id: 5, nome: 'Promoção Verão', percentual: 20, aplicacao: 'Matrículas no período de verão', status: 'Inativo', validade: '28/02/2025' },
  ];

  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Descontos" 
          subtitle="Gerenciamento de descontos e bolsas"
        />
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Descontos</CardTitle>
              <CardDescription>Visualize e gerencie os descontos disponíveis para matrículas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Nome</th>
                      <th scope="col" className="px-6 py-3">Percentual</th>
                      <th scope="col" className="px-6 py-3">Aplicação</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Validade</th>
                      <th scope="col" className="px-6 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDescontos.map((desconto) => (
                      <tr key={desconto.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{desconto.nome}</td>
                        <td className="px-6 py-4">{desconto.percentual}%</td>
                        <td className="px-6 py-4">{desconto.aplicacao}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            desconto.status === 'Ativo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {desconto.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{desconto.validade}</td>
                        <td className="px-6 py-4">
                          <button className="font-medium text-blue-600 hover:underline mr-3">Editar</button>
                          <button className="font-medium text-red-600 hover:underline">Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </ResponsiveContainer>
    </ResponsiveLayout>
  );
}
