'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from '../../../app/components/ui/responsiveLayout';
import { NovaCobrancaDialog, PagamentoFormValues } from '../components/pagamento/nova-cobranca-dialog';

export default function PagamentosPage() {
  // Mock data for payments
  const mockPagamentos = [
    { id: 1, aluno: 'João Silva', curso: 'Desenvolvimento Web', valor: 'R$ 800,00', vencimento: '10/03/2025', status: 'Pago', data_pagamento: '08/03/2025' },
    { id: 2, aluno: 'Maria Oliveira', curso: 'Design UX/UI', valor: 'R$ 900,00', vencimento: '15/03/2025', status: 'Pendente', data_pagamento: '-' },
    { id: 3, aluno: 'Pedro Santos', curso: 'Marketing Digital', valor: 'R$ 700,00', vencimento: '05/03/2025', status: 'Atrasado', data_pagamento: '-' },
    { id: 4, aluno: 'Ana Costa', curso: 'Data Science', valor: 'R$ 1.200,00', vencimento: '20/03/2025', status: 'Pago', data_pagamento: '18/03/2025' },
    { id: 5, aluno: 'Lucas Ferreira', curso: 'Desenvolvimento Mobile', valor: 'R$ 850,00', vencimento: '12/03/2025', status: 'Pendente', data_pagamento: '-' },
  ];

  // Mock data for students
  const mockAlunos = [
    { id: 1, nome: 'João Silva', email: 'joao@example.com', curso: 'Desenvolvimento Web' },
    { id: 2, nome: 'Maria Oliveira', email: 'maria@example.com', curso: 'Design UX/UI' },
    { id: 3, nome: 'Pedro Santos', email: 'pedro@example.com', curso: 'Marketing Digital' },
    { id: 4, nome: 'Ana Costa', email: 'ana@example.com', curso: 'Data Science' },
    { id: 5, nome: 'Lucas Ferreira', email: 'lucas@example.com', curso: 'Desenvolvimento Mobile' },
  ];

  // Função para adicionar um novo pagamento
  const handleAddPagamento = (data: PagamentoFormValues) => {
    console.log('Nova cobrança adicionada:', data);
    
    // Aqui seria implementada a lógica para adicionar a nova cobrança
    // Por exemplo, enviar para uma API ou adicionar ao estado local
    
    // Exemplo de como poderia ser a lógica para adicionar ao estado local:
    // const novoId = mockPagamentos.length + 1;
    // const aluno = mockAlunos.find(a => a.id === data.alunoId)?.nome || 'Aluno não encontrado';
    // const novoPagamento = {
    //   id: novoId,
    //   aluno,
    //   curso: data.curso,
    //   valor: `R$ ${data.valor.toFixed(2).replace('.', ',')}`,
    //   vencimento: new Date(data.dataVencimento).toLocaleDateString('pt-BR'),
    //   status: 'Pendente',
    //   data_pagamento: '-'
    // };
    // setMockPagamentos([...mockPagamentos, novoPagamento]);
  };

  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Pagamentos" 
          subtitle="Gerenciamento de pagamentos e cobranças"
        />
        
        <div className="mt-6 flex justify-end">
          <NovaCobrancaDialog 
            alunos={mockAlunos} 
            onAddPagamento={handleAddPagamento} 
          />
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Lista de Pagamentos</CardTitle>
            <CardDescription>Visualize e gerencie os pagamentos e cobranças</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Aluno</th>
                    <th scope="col" className="px-6 py-3">Curso</th>
                    <th scope="col" className="px-6 py-3">Valor</th>
                    <th scope="col" className="px-6 py-3">Vencimento</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Data Pagamento</th>
                    <th scope="col" className="px-6 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPagamentos.map((pagamento) => (
                    <tr key={pagamento.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{pagamento.aluno}</td>
                      <td className="px-6 py-4">{pagamento.curso}</td>
                      <td className="px-6 py-4">{pagamento.valor}</td>
                      <td className="px-6 py-4">{pagamento.vencimento}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          pagamento.status === 'Pago' ? 'bg-green-100 text-green-800' : 
                          pagamento.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {pagamento.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{pagamento.data_pagamento}</td>
                      <td className="px-6 py-4">
                        <button className="font-medium text-blue-600 hover:underline mr-3">Detalhes</button>
                        {pagamento.status !== 'Pago' && (
                          <button className="font-medium text-green-600 hover:underline">Registrar Pagamento</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    </ResponsiveLayout>
  );
}
