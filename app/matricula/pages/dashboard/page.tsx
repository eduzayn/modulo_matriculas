'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../../components/ui/card';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from "@/app/components/ui/responsiveLayout";

export default function DashboardPage() {
  // Mock data instead of using supabase
  const mockStats = [
    { id: 1, title: 'Total de Matrículas', value: '1,245', change: '+12%', description: 'Comparado ao mês anterior' },
    { id: 2, title: 'Matrículas Ativas', value: '987', change: '+5%', description: 'Comparado ao mês anterior' },
    { id: 3, title: 'Receita Mensal', value: 'R$ 124.500,00', change: '+8%', description: 'Comparado ao mês anterior' },
    { id: 4, title: 'Novos Alunos', value: '78', change: '+15%', description: 'Comparado ao mês anterior' },
  ];

  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Dashboard" 
          subtitle="Visão geral do sistema de matrículas"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {mockStats.map((stat) => (
            <Card key={stat.id}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.title}</CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Matrículas por Curso</CardTitle>
              <CardDescription>Distribuição de matrículas por curso</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-neutral-500">Gráfico de Matrículas por Curso</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Receita Mensal</CardTitle>
              <CardDescription>Receita mensal dos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-neutral-500">Gráfico de Receita Mensal</p>
            </CardContent>
          </Card>
        </div>
      </ResponsiveContainer>
    </ResponsiveLayout>
  );
}
