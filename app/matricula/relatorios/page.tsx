'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from '../../../app/components/ui/ResponsiveLayout';

export default function RelatoriosPage() {
  // Mock data for reports
  const mockRelatorios = [
    { id: 1, nome: 'Matrículas por Período', descricao: 'Relatório de matrículas por período', formato: 'PDF/Excel', ultimaGeracao: '01/03/2025' },
    { id: 2, nome: 'Pagamentos Mensais', descricao: 'Relatório de pagamentos mensais', formato: 'PDF/Excel', ultimaGeracao: '01/03/2025' },
    { id: 3, nome: 'Alunos por Curso', descricao: 'Distribuição de alunos por curso', formato: 'PDF/Excel', ultimaGeracao: '28/02/2025' },
    { id: 4, nome: 'Inadimplência', descricao: 'Relatório de inadimplência', formato: 'PDF/Excel', ultimaGeracao: '28/02/2025' },
    { id: 5, nome: 'Descontos Aplicados', descricao: 'Relatório de descontos aplicados', formato: 'PDF/Excel', ultimaGeracao: '25/02/2025' },
  ];

  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Relatórios" 
          subtitle="Geração e visualização de relatórios"
        />
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Disponíveis</CardTitle>
              <CardDescription>Gere e visualize relatórios do sistema de matrículas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Nome do Relatório</th>
                      <th scope="col" className="px-6 py-3">Descrição</th>
                      <th scope="col" className="px-6 py-3">Formato</th>
                      <th scope="col" className="px-6 py-3">Última Geração</th>
                      <th scope="col" className="px-6 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRelatorios.map((relatorio) => (
                      <tr key={relatorio.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{relatorio.nome}</td>
                        <td className="px-6 py-4">{relatorio.descricao}</td>
                        <td className="px-6 py-4">{relatorio.formato}</td>
                        <td className="px-6 py-4">{relatorio.ultimaGeracao}</td>
                        <td className="px-6 py-4">
                          <button className="font-medium text-blue-600 hover:underline mr-3">Gerar</button>
                          <button className="font-medium text-green-600 hover:underline">Visualizar</button>
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
