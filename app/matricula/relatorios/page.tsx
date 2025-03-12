'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
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

  // Estado para os filtros de período
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // Função para aplicar filtros
  const aplicarFiltros = () => {
    console.log('Filtrando relatórios por período:', { dataInicio, dataFim });
    // Aqui seria implementada a lógica para filtrar os relatórios pelo período
  };

  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Relatórios" 
          subtitle="Geração e visualização de relatórios"
        />
        
        <div className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filtros de Período</CardTitle>
              <CardDescription>Selecione um período para filtrar os relatórios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 mb-1">
                    Data Início
                  </label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700 mb-1">
                    Data Fim
                  </label>
                  <Input
                    id="dataFim"
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={aplicarFiltros} className="mb-1">
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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
