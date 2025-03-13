'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '../../../components/ui/button';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from '../../../app/components/ui/responsiveLayout';
import { NovoAlunoDialog, AlunoFormValues } from '../../../app/matricula/components/aluno/novo-aluno-dialog';
import { VincularAlunoDialog } from '../../../app/matricula/components/aluno/vincular-aluno-dialog';

export default function AlunosPage() {
  // Mock data for students
  const mockAlunos = [
    { id: 1, nome: 'João Silva', email: 'joao@example.com', telefone: '(11) 98765-4321', curso: 'Desenvolvimento Web', status: 'Ativo' },
    { id: 2, nome: 'Maria Oliveira', email: 'maria@example.com', telefone: '(11) 91234-5678', curso: 'Design UX/UI', status: 'Ativo' },
    { id: 3, nome: 'Pedro Santos', email: 'pedro@example.com', telefone: '(11) 99876-5432', curso: 'Marketing Digital', status: 'Inativo' },
    { id: 4, nome: 'Ana Costa', email: 'ana@example.com', telefone: '(11) 92345-6789', curso: 'Data Science', status: 'Ativo' },
    { id: 5, nome: 'Lucas Ferreira', email: 'lucas@example.com', telefone: '(11) 98765-1234', curso: 'Desenvolvimento Mobile', status: 'Ativo' },
  ];

  // Função para adicionar um novo aluno
  const handleAddAluno = (data: AlunoFormValues) => {
    console.log('Novo aluno adicionado:', data);
  };

  const handleVincularAluno = (aluno: any) => {
    console.log('Aluno vinculado a curso:', aluno);
    // Aqui seria implementada a lógica para vincular o aluno ao curso
  };

  // Mock data for courses
  const mockCursos = [
    { id: 1, nome: 'Desenvolvimento Web', duracao: '6 meses', valor: 'R$ 4.800,00' },
    { id: 2, nome: 'Design UX/UI', duracao: '4 meses', valor: 'R$ 3.600,00' },
    { id: 3, nome: 'Marketing Digital', duracao: '3 meses', valor: 'R$ 2.800,00' },
    { id: 4, nome: 'Data Science', duracao: '8 meses', valor: 'R$ 6.400,00' },
    { id: 5, nome: 'Desenvolvimento Mobile', duracao: '5 meses', valor: 'R$ 4.200,00' },
  ];

  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Alunos" 
          subtitle="Gerenciamento de alunos"
        />
        
        <div className="mt-6 flex justify-end space-x-4">
          <VincularAlunoDialog 
            alunos={mockAlunos} 
            cursos={mockCursos} 
            onVincular={handleVincularAluno} 
          />
          <NovoAlunoDialog onAddAluno={handleAddAluno} />
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Lista de Alunos</CardTitle>
            <CardDescription>Visualize e gerencie os alunos cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Nome</th>
                    <th scope="col" className="px-6 py-3">Email</th>
                    <th scope="col" className="px-6 py-3">Telefone</th>
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
                      <td className="px-6 py-4">{aluno.telefone}</td>
                      <td className="px-6 py-4">{aluno.curso}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          aluno.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
      </ResponsiveContainer>
    </ResponsiveLayout>
  );
}
