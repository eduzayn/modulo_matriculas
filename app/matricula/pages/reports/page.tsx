'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from '../../../components/ui/ResponsiveLayout';

export default function ReportsPage() {
  // Mock data instead of using supabase
  const mockReports = [
    { id: 1, name: 'Matrículas por Curso', description: 'Relatório de matrículas agrupadas por curso' },
    { id: 2, name: 'Pagamentos Pendentes', description: 'Relatório de pagamentos pendentes' },
    { id: 3, name: 'Alunos Ativos', description: 'Relatório de alunos ativos no sistema' },
    { id: 4, name: 'Desempenho por Curso', description: 'Relatório de desempenho dos alunos por curso' },
  ];

  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Relatórios" 
          subtitle="Geração de relatórios do sistema de matrículas"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {mockReports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <CardTitle>{report.name}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-500">Clique no botão abaixo para gerar o relatório.</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Gerar Relatório</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ResponsiveContainer>
    </ResponsiveLayout>
  );
}
