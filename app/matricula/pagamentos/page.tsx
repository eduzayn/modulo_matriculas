'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from '../../../app/components/ui/ResponsiveLayout';

export default function PagamentosPage() {
  // Mock data for payments
  const mockPagamentos = [
    { id: 1, aluno: 'Ana Silva', valor: 'R$ 500,00', data: '05/03/2025', metodo: 'Cartão de Crédito', status: 'Pago' },
    { id: 2, aluno: 'Carlos Oliveira', valor: 'R$ 450,00', data: '10/03/2025', metodo: 'Boleto', status: 'Pendente' },
    { id: 3, aluno: 'Mariana Santos', valor: 'R$ 500,00', data: '15/02/2025', metodo: 'Pix', status: 'Pago' },
    { id: 4, aluno: 'Pedro Costa', valor: 'R$ 500,00', data: '20/02/2025', metodo: 'Cartão de Crédito', status: 'Pago' },
    { id: 5, aluno: 'Juliana Lima', valor: 'R$ 450,00', data: '25/02/2025', metodo: 'Boleto', status: 'Atrasado' },
  ];

  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Pagamentos" 
          subtitle="Gerenciamento de pagamentos de matrículas"
        />
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Pagamentos</CardTitle>
              <CardDescription>Visualize e gerencie os pagamentos de matrículas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Aluno</th>
                      <th scope="col" className="px-6 py-3">Valor</th>
                      <th scope="col" className="px-6 py-3">Data</th>
                      <th scope="col" className="px-6 py-3">Método</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPagamentos.map((pagamento) => (
                      <tr key={pagamento.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{pagamento.aluno}</td>
                        <td className="px-6 py-4">{pagamento.valor}</td>
                        <td className="px-6 py-4">{pagamento.data}</td>
                        <td className="px-6 py-4">{pagamento.metodo}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            pagamento.status === 'Pago' 
                              ? 'bg-green-100 text-green-800' 
                              : pagamento.status === 'Pendente' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {pagamento.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="font-medium text-blue-600 hover:underline mr-3">Detalhes</button>
                          <button className="font-medium text-green-600 hover:underline">Confirmar</button>
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
