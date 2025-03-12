'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from '../../../app/components/ui/ResponsiveLayout';

export default function AlunosPage() {
  // Mock data for students
  const mockAlunos = [
    { id: 1, nome: 'Ana Silva', email: 'ana.silva@exemplo.com', curso: 'Desenvolvimento Web', status: 'Ativo' },
    { id: 2, nome: 'Carlos Oliveira', email: 'carlos.oliveira@exemplo.com', curso: 'Marketing Digital', status: 'Ativo' },
    { id: 3, nome: 'Mariana Santos', email: 'mariana.santos@exemplo.com', curso: 'Design Gráfico', status: 'Inativo' },
    { id: 4, nome: 'Pedro Costa', email: 'pedro.costa@exemplo.com', curso: 'Desenvolvimento Web', status: 'Ativo' },
    { id: 5, nome: 'Juliana Lima', email: 'juliana.lima@exemplo.com', curso: 'Marketing Digital', status: 'Pendente' },
  ];

  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Alunos" 
          subtitle="Gerenciamento de alunos matriculados"
        />
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Alunos</CardTitle>
              <CardDescription>Visualize e gerencie os alunos matriculados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Nome</th>
                      <th scope="col" className="px-6 py-3">Email</th>
                      <th scope="col" className="px-6 py-3">Curso</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAlunos.map((aluno) => (
                      <tr key={aluno.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{aluno.nome}</td>
                        <td className="px-6 py-4">{aluno.email}</td>
                        <td className="px-6 py-4">{aluno.curso}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            aluno.status === 'Ativo' 
                              ? 'bg-green-100 text-green-800' 
                              : aluno.status === 'Inativo' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {aluno.status}
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
        </div>
      </ResponsiveContainer>
    </ResponsiveLayout>
  );
}
