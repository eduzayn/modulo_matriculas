'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"';
import { Button } from '../../../components/ui/Button';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from '../../../app/components/ui/ResponsiveLayout';
import { NovoAlunoDialog, AlunoFormValues } from '../../../app/matricula/components/aluno/novo-aluno-dialog';
import { VincularAlunoDialog } from '../../../app/matricula/components/aluno/vincular-aluno-dialog';

export default function AlunosPage() {
  // Mock data for students
  const mockAlunos = [
    { id: 1, nome: 'Ana Silva', email: 'ana.silva@exemplo.com', curso: 'Desenvolvimento Web', status: 'Ativo' },
    { id: 2, nome: 'Carlos Oliveira', email: 'carlos.oliveira@exemplo.com', curso: 'Marketing Digital', status: 'Ativo' },
    { id: 3, nome: 'Mariana Santos', email: 'mariana.santos@exemplo.com', curso: 'Design Gráfico', status: 'Inativo' },
    { id: 4, nome: 'Pedro Costa', email: 'pedro.costa@exemplo.com', curso: 'Desenvolvimento Web', status: 'Ativo' },
    { id: 5, nome: 'Juliana Lima', email: 'juliana.lima@exemplo.com', curso: 'Marketing Digital', status: 'Pendente' },
  ];
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVincularDialogOpen, setIsVincularDialogOpen] = useState(false);
  const [alunos, setAlunos] = useState(mockAlunos);

  const handleAddAluno = (novoAluno: AlunoFormValues) => {
    setAlunos([...alunos, { ...novoAluno, id: alunos.length + 1, curso: '' }]);
    setIsDialogOpen(false);
  };
  
  const handleVincularAluno = (alunoId: number, cursoNome: string) => {
    setAlunos(alunos.map(aluno => 
      aluno.id === alunoId ? { ...aluno, curso: cursoNome } : aluno
    ));
    setIsVincularDialogOpen(false);
  };
  
  // Mock data for courses
  const mockCursos = [
    { id: 1, nome: 'Desenvolvimento Web' },
    { id: 2, nome: 'Marketing Digital' },
    { id: 3, nome: 'Design Gráfico' },
    { id: 4, nome: 'Data Science' },
    { id: 5, nome: 'UX/UI Design' },
  ];

  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Alunos" 
          subtitle="Gerenciamento de alunos matriculados"
          actions={
            <div className="flex space-x-2">
              <Button onClick={() => setIsDialogOpen(true)}>
                Novo Aluno
              </Button>
              <Button variant="outline" onClick={() => setIsVincularDialogOpen(true)}>
                Vincular ao Curso
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
                      <th scope="col" className="px-6 py-3">Curso</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunos.map((aluno) => (
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
      <NovoAlunoDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSave={handleAddAluno} 
      />
      <VincularAlunoDialog 
        isOpen={isVincularDialogOpen} 
        onClose={() => setIsVincularDialogOpen(false)} 
        onSave={handleVincularAluno}
        alunos={alunos}
        cursos={mockCursos}
      />
    </ResponsiveLayout>
  );
}
