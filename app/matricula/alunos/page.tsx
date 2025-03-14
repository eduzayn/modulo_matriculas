'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from '../../../app/components/ui/ResponsiveLayout';
import { NovoAlunoDialog, AlunoFormValues } from '../components/aluno/novo-aluno-dialog';
import { VincularAlunoDialog, VinculoFormValues } from '../components/aluno/vincular-aluno-dialog';

export default function AlunosPage() {
  // Mock data for students
  const mockAlunos = [
    { id: 1, nome: 'Ana Silva', email: 'ana.silva@email.com', telefone: '(11) 98765-4321', status: 'Ativo' },
    { id: 2, nome: 'Carlos Oliveira', email: 'carlos.oliveira@email.com', telefone: '(11) 91234-5678', status: 'Ativo' },
    { id: 3, nome: 'Mariana Santos', email: 'mariana.santos@email.com', telefone: '(11) 99876-5432', status: 'Inativo' },
    { id: 4, nome: 'Pedro Costa', email: 'pedro.costa@email.com', telefone: '(11) 95678-1234', status: 'Ativo' },
    { id: 5, nome: 'Juliana Lima', email: 'juliana.lima@email.com', telefone: '(11) 92345-6789', status: 'Ativo' },
  ];

  // Mock data for courses
  const mockCursos = [
    { id: 1, nome: 'Desenvolvimento Web' },
    { id: 2, nome: 'Marketing Digital' },
    { id: 3, nome: 'Design Gráfico' },
    { id: 4, nome: 'Data Science' },
    { id: 5, nome: 'UX/UI Design' },
  ];
  
  const [isNovoAlunoDialogOpen, setIsNovoAlunoDialogOpen] = useState(false);
  const [isVincularAlunoDialogOpen, setIsVincularAlunoDialogOpen] = useState(false);
  const [alunos, setAlunos] = useState(mockAlunos);

  const handleAddAluno = (novoAluno: AlunoFormValues) => {
    setAlunos([...alunos, { ...novoAluno, id: alunos.length + 1, status: 'Ativo' }]);
    setIsNovoAlunoDialogOpen(false);
  };

  const handleVincularAluno = (vinculo: VinculoFormValues) => {
    // In a real application, this would update the database
    console.log('Aluno vinculado ao curso:', vinculo);
    setIsVincularAlunoDialogOpen(false);
  };

  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Alunos" 
          subtitle="Gerenciamento de alunos matriculados"
          actions={
            <div className="flex space-x-2">
              <Button onClick={() => setIsVincularAlunoDialogOpen(true)}>
                Vincular Aluno
              </Button>
              <Button onClick={() => setIsNovoAlunoDialogOpen(true)}>
                Novo Aluno
              </Button>
            </div>
          }
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
                      <th scope="col" className="px-6 py-3">Telefone</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunos.map((aluno) => (
                      <tr key={aluno.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{aluno.nome}</td>
                        <td className="px-6 py-4">{aluno.email}</td>
                        <td className="px-6 py-4">{aluno.telefone}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            aluno.status === 'Ativo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
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
      <NovoAlunoDialog 
        isOpen={isNovoAlunoDialogOpen} 
        onClose={() => setIsNovoAlunoDialogOpen(false)} 
        onSave={handleAddAluno} 
      />
      <VincularAlunoDialog 
        isOpen={isVincularAlunoDialogOpen} 
        onClose={() => setIsVincularAlunoDialogOpen(false)} 
        onSave={handleVincularAluno}
        alunos={mockAlunos}
        cursos={mockCursos}
      />
    </ResponsiveLayout>
  );
}
