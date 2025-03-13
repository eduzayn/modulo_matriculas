import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '../components/ui/button';
import { ResponsiveLayout } from "@/app/components/ui/responsiveLayout";
import { ResponsiveContainer } from "@/app/components/ui/responsiveContainer"';
import { ResponsiveHeader } from "@/app/components/ui/responsiveHeader"';
import { Users, BookOpen, CreditCard, BarChart2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ResponsiveLayout maxWidth="xl" padding="lg">
        <ResponsiveContainer>
          <div className="py-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Módulo de Matrículas - Edunexia</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sistema de gerenciamento de matrículas para a plataforma Edunexia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className="mr-4 p-3 bg-blue-100 rounded-full">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Matrículas</CardTitle>
                    <CardDescription>Gerencie as matrículas dos alunos</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Acesse o sistema de matrículas para criar, visualizar e gerenciar matrículas de alunos em cursos.</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/matricula" className="w-full">Acessar Matrículas</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-green-500">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className="mr-4 p-3 bg-green-100 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Alunos</CardTitle>
                    <CardDescription>Gerencie os dados dos alunos</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Acesse o cadastro de alunos para visualizar e gerenciar informações dos estudantes.</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Link href="/aluno" className="w-full">Acessar Alunos</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Outros Módulos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-purple-500">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className="mr-4 p-2 bg-purple-100 rounded-full">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Cursos</CardTitle>
                    <CardDescription>Catálogo de cursos</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Visualize e gerencie o catálogo de cursos disponíveis.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-purple-500 text-purple-700 hover:bg-purple-50">
                  <Link href="/curso" className="w-full">Ver Cursos</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-amber-500">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className="mr-4 p-2 bg-amber-100 rounded-full">
                    <CreditCard className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle>Financeiro</CardTitle>
                    <CardDescription>Gestão financeira</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Acesse o módulo financeiro para gerenciar pagamentos e faturas.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-amber-500 text-amber-700 hover:bg-amber-50">
                  <Link href="/financeiro" className="w-full">Ver Financeiro</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-cyan-500">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className="mr-4 p-2 bg-cyan-100 rounded-full">
                    <BarChart2 className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <CardTitle>Relatórios</CardTitle>
                    <CardDescription>Análise de dados</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Gere relatórios e visualize estatísticas sobre matrículas e alunos.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-cyan-500 text-cyan-700 hover:bg-cyan-50">
                  <Link href="/relatorios" className="w-full">Ver Relatórios</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-12 text-center border-t pt-6 border-gray-200">
            <p className="text-sm text-gray-500">
              © 2025 Edunexia - Todos os direitos reservados
            </p>
          </div>
        </ResponsiveContainer>
      </ResponsiveLayout>
    </div>
  );
}
