'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button"';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from '../../components/ui/ResponsiveLayout';

export default function AlunoDashboardPage() {
  // Mock data instead of using supabase
  const mockCourses = [
    { id: 1, name: 'Desenvolvimento Web', progress: 75, nextClass: 'Amanhã, 14:00' },
    { id: 2, name: 'Design UX/UI', progress: 45, nextClass: 'Quinta, 10:00' },
    { id: 3, name: 'Marketing Digital', progress: 90, nextClass: 'Hoje, 19:00' },
  ];

  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Dashboard do Aluno" 
          subtitle="Visão geral dos seus cursos e progresso"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {mockCourses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>Progresso: {course.progress}%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-neutral-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-500 h-2.5 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="mt-4 text-sm">Próxima aula: {course.nextClass}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Continuar Curso</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Atividades</CardTitle>
              <CardDescription>Atividades pendentes dos seus cursos</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="p-2 bg-neutral-100 rounded-md">Entrega do Projeto Final - Desenvolvimento Web</li>
                <li className="p-2 bg-neutral-100 rounded-md">Quiz de Avaliação - Design UX/UI</li>
                <li className="p-2 bg-neutral-100 rounded-md">Apresentação de Campanha - Marketing Digital</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Desempenho</CardTitle>
              <CardDescription>Seu desempenho nos cursos</CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex items-center justify-center">
              <p className="text-neutral-500">Gráfico de Desempenho</p>
            </CardContent>
          </Card>
        </div>
      </ResponsiveContainer>
    </ResponsiveLayout>
  );
}
