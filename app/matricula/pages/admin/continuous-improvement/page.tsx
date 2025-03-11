import { Metadata } from 'next';
import { ImprovementPlan } from '@/app/matricula/components/continuous-improvement/improvement-plan';

export const metadata: Metadata = {
  title: 'Melhorias Contínuas | Sistema de Matrículas',
  description: 'Plano de melhorias contínuas do sistema de matrículas'
};

export default function ContinuousImprovementPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Melhorias Contínuas</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe o plano de melhorias contínuas do sistema com base no feedback dos usuários e métricas de desempenho.
          </p>
        </div>
        
        <ImprovementPlan />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Processo de Melhoria Contínua</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Coleta de feedback dos usuários</li>
              <li>Análise de métricas de desempenho</li>
              <li>Priorização de melhorias</li>
              <li>Implementação das melhorias</li>
              <li>Avaliação dos resultados</li>
            </ol>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Como Contribuir</h2>
            <p className="mb-4">
              Sua opinião é fundamental para melhorarmos continuamente o sistema.
              Você pode contribuir das seguintes formas:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Enviando feedback através do formulário</li>
              <li>Reportando bugs ou problemas encontrados</li>
              <li>Sugerindo novas funcionalidades</li>
              <li>Participando de pesquisas de satisfação</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
