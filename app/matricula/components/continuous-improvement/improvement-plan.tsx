'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

interface Improvement {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: 'performance' | 'usability' | 'feature' | 'bug_fix' | 'security';
  estimatedCompletion?: string;
  feedbackIds?: string[];
}

export function ImprovementPlan() {
  const [improvements, setImprovements] = useState<Improvement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    // Simulação de carregamento de melhorias
    // Em produção, isso seria uma chamada de API
    setTimeout(() => {
      setImprovements([
        {
          id: '1',
          title: 'Otimização de consultas ao banco de dados',
          description: 'Melhorar a performance das consultas ao banco de dados para reduzir o tempo de resposta das APIs.',
          status: 'in_progress',
          priority: 'high',
          category: 'performance',
          estimatedCompletion: '2025-04-15'
        },
        {
          id: '2',
          title: 'Implementação de cache distribuído',
          description: 'Substituir o cache em memória por uma solução distribuída para melhorar a escalabilidade.',
          status: 'planned',
          priority: 'medium',
          category: 'performance',
          estimatedCompletion: '2025-05-10'
        },
        {
          id: '3',
          title: 'Melhorias na interface de negociação de dívidas',
          description: 'Simplificar o fluxo de negociação e adicionar mais opções de parcelamento.',
          status: 'planned',
          priority: 'medium',
          category: 'usability',
          estimatedCompletion: '2025-04-30',
          feedbackIds: ['feedback-123', 'feedback-456']
        },
        {
          id: '4',
          title: 'Integração com novos gateways de pagamento',
          description: 'Adicionar suporte para PagBank e Cielo como opções de pagamento.',
          status: 'planned',
          priority: 'low',
          category: 'feature',
          estimatedCompletion: '2025-06-15'
        },
        {
          id: '5',
          title: 'Correção de bug no cálculo de juros',
          description: 'Corrigir problema no cálculo de juros para pagamentos atrasados.',
          status: 'completed',
          priority: 'high',
          category: 'bug_fix'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Filtrar melhorias com base na aba ativa
  const filteredImprovements = improvements.filter(improvement => {
    if (activeTab === 'all') return true;
    if (activeTab === 'planned') return improvement.status === 'planned';
    if (activeTab === 'in_progress') return improvement.status === 'in_progress';
    if (activeTab === 'completed') return improvement.status === 'completed';
    return true;
  });
  
  // Renderizar status com cor apropriada
  const renderStatus = (status: string) => {
    switch (status) {
      case 'planned':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Planejado</span>;
      case 'in_progress':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Em Progresso</span>;
      case 'completed':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Concluído</span>;
      default:
        return <span>{status}</span>;
    }
  };
  
  // Renderizar prioridade com cor apropriada
  const renderPriority = (priority: string) => {
    switch (priority) {
      case 'low':
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Baixa</span>;
      case 'medium':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Média</span>;
      case 'high':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Alta</span>;
      default:
        return <span>{priority}</span>;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plano de Melhorias Contínuas</CardTitle>
        <CardDescription>
          Acompanhe as melhorias planejadas e em andamento no sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="planned">Planejados</TabsTrigger>
            <TabsTrigger value="in_progress">Em Progresso</TabsTrigger>
            <TabsTrigger value="completed">Concluídos</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-4">
          {filteredImprovements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma melhoria encontrada para os filtros selecionados.
            </div>
          ) : (
            filteredImprovements.map(improvement => (
              <Card key={improvement.id} className="overflow-hidden">
                <div className="p-4 border-l-4 border-primary">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{improvement.title}</h3>
                    <div className="flex space-x-2">
                      {renderStatus(improvement.status)}
                      {renderPriority(improvement.priority)}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{improvement.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium">Categoria:</span>{' '}
                      {improvement.category.replace('_', ' ').charAt(0).toUpperCase() + improvement.category.replace('_', ' ').slice(1)}
                    </div>
                    {improvement.estimatedCompletion && (
                      <div>
                        <span className="font-medium">Previsão:</span>{' '}
                        {new Date(improvement.estimatedCompletion).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button variant="outline" className="mr-2">
            Sugerir Melhoria
          </Button>
          <Button>
            Ver Todas as Melhorias
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ImprovementPlan;
