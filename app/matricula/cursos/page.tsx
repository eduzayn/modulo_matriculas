'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from '../../../components/ui/Button';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from '../../../app/components/ui/responsiveLayout';
import { NovoCursoDialog, CursoFormValues } from '../components/curso/novo-curso-dialog';

export default function CursosPage() {
  // Mock data for courses
  const mockCursos = [
    { id: 1, nome: 'Desenvolvimento Web', duracao: '6 meses', preco: 'R$ 2.500,00', vagas: 30, ocupadas: 25 },
    { id: 2, nome: 'Marketing Digital', duracao: '4 meses', preco: 'R$ 1.800,00', vagas: 25, ocupadas: 20 },
    { id: 3, nome: 'Design Gráfico', duracao: '5 meses', preco: 'R$ 2.200,00', vagas: 20, ocupadas: 15 },
    { id: 4, nome: 'Data Science', duracao: '8 meses', preco: 'R$ 3.500,00', vagas: 15, ocupadas: 12 },
    { id: 5, nome: 'UX/UI Design', duracao: '4 meses', preco: 'R$ 2.000,00', vagas: 20, ocupadas: 18 },
  ];
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cursos, setCursos] = useState(mockCursos);

  const handleAddCurso = (novoCurso: CursoFormValues) => {
    setCursos([...cursos, { ...novoCurso, id: cursos.length + 1, ocupadas: 0 }]);
    setIsDialogOpen(false);
  };

  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Cursos" 
          subtitle="Gerenciamento de cursos disponíveis"
          actions={
            <Button onClick={() => setIsDialogOpen(true)}>
              Novo Curso
            </Button>
          }
        />
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Cursos</CardTitle>
              <CardDescription>Visualize e gerencie os cursos disponíveis para matrícula</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Nome do Curso</th>
                      <th scope="col" className="px-6 py-3">Duração</th>
                      <th scope="col" className="px-6 py-3">Preço</th>
                      <th scope="col" className="px-6 py-3">Vagas</th>
                      <th scope="col" className="px-6 py-3">Ocupação</th>
                      <th scope="col" className="px-6 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cursos.map((curso) => (
                      <tr key={curso.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{curso.nome}</td>
                        <td className="px-6 py-4">{curso.duracao}</td>
                        <td className="px-6 py-4">{curso.preco}</td>
                        <td className="px-6 py-4">{curso.vagas}</td>
                        <td className="px-6 py-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${(curso.ocupadas / curso.vagas) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">
                            {curso.ocupadas}/{curso.vagas} ({Math.round((curso.ocupadas / curso.vagas) * 100)}%)
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
      <NovoCursoDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSave={handleAddCurso} 
      />
    </ResponsiveLayout>
  );
}
