import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ResponsiveLayout } from '../components/ui/ResponsiveLayout';
import { ResponsiveContainer } from '../components/ui/ResponsiveContainer';
import { ResponsiveHeader } from '../components/ui/ResponsiveHeader';

export default function Home() {
  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Módulo de Matrículas - Edunexia" 
          subtitle="Sistema de gerenciamento de matrículas para a plataforma Edunexia"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Matrículas</CardTitle>
              <CardDescription>Gerencie as matrículas dos alunos</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Acesse o sistema de matrículas para criar, visualizar e gerenciar matrículas de alunos em cursos.</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Link href="/matricula" className="w-full">Acessar Matrículas</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Alunos</CardTitle>
              <CardDescription>Gerencie os dados dos alunos</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Acesse o cadastro de alunos para visualizar e gerenciar informações dos estudantes.</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Link href="/aluno" className="w-full">Acessar Alunos</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cursos</CardTitle>
              <CardDescription>Catálogo de cursos</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Visualize e gerencie o catálogo de cursos disponíveis.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Link href="/curso" className="w-full">Ver Cursos</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Financeiro</CardTitle>
              <CardDescription>Gestão financeira</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Acesse o módulo financeiro para gerenciar pagamentos e faturas.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Link href="/financeiro" className="w-full">Ver Financeiro</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Relatórios</CardTitle>
              <CardDescription>Análise de dados</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Gere relatórios e visualize estatísticas sobre matrículas e alunos.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Link href="/relatorios" className="w-full">Ver Relatórios</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-neutral-500">
            Acesse também o <Link href="/test-responsive" className="text-primary-500 hover:underline">Teste de Componentes Responsivos</Link>
          </p>
        </div>
      </ResponsiveContainer>
    </ResponsiveLayout>
  );
}
