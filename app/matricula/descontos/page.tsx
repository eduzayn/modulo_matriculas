'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '../../../components/ui/button';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from '../../../app/components/ui/responsivelayout';
import { NovoDescontoDialog, DescontoFormValues } from '../components/desconto/novo-desconto-dialog';

export default function DescontosPage() {
  // Mock data for discounts
  const [mockDescontos, setMockDescontos] = useState([
    { id: 1, nome: 'Desconto Família', percentual: 15, descricao: 'Desconto para familiares de alunos', status: 'Ativo' },
    { id: 2, nome: 'Desconto Antecipação', percentual: 10, descricao: 'Desconto para pagamento antecipado', status: 'Ativo' },
    { id: 3, nome: 'Desconto Funcionário', percentual: 50, descricao: 'Desconto para funcionários', status: 'Ativo' },
    { id: 4, nome: 'Desconto Convênio', percentual: 20, descricao: 'Desconto para empresas conveniadas', status: 'Inativo' },
    { id: 5, nome: 'Desconto Indicação', percentual: 5, descricao: 'Desconto para alunos que indicaram novos alunos', status: 'Ativo' },
  ]);

  // Função para adicionar um novo desconto
  const handleAddDesconto = (data: DescontoFormValues) => {
    console.log('Novo desconto adicionado:', data);
    // Adicionar o novo desconto à lista
    const novoDesconto = {
      id: mockDescontos.length + 1,
      nome: data.nome,
      percentual: data.percentual,
      descricao: data.descricao,
      status: 'Ativo'
    };
    
    setMockDescontos([...mockDescontos, novoDesconto]);
  };

  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Descontos" 
          subtitle="Gerenciamento de descontos"
        />
        
        <div className="mt-6 flex justify-end">
          <NovoDescontoDialog onAddDesconto={handleAddDesconto} />
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Lista de Descontos</CardTitle>
            <CardDescription>Visualize e gerencie os descontos disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Nome</th>
                    <th scope="col" className="px-6 py-3">Percentual</th>
                    <th scope="col" className="px-6 py-3">Descrição</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDescontos.map((desconto) => (
                    <tr key={desconto.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{desconto.nome}</td>
                      <td className="px-6 py-4">{desconto.percentual}%</td>
                      <td className="px-6 py-4">{desconto.descricao}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          desconto.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {desconto.status}
                        </span>
                      </td>
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
      </ResponsiveContainer>
    </ResponsiveLayout>
  );
}
