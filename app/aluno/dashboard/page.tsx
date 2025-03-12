import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { getAlunoMatriculas } from '../lib/services/aluno-service'

export default async function AlunoDashboardPage() {
  // Authentication is now handled by the main site
  // TODO: Get user ID from main site's authentication
  const userId = 'placeholder-user-id'
  
  // Obter matrículas do aluno
  const matriculas = await getAlunoMatriculas(null, userId)
  
  return (
    <div className="container py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portal do Aluno</h1>
          <p className="text-neutral-500">
            Bem-vindo ao seu portal acadêmico
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Matrículas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{matriculas.filter(m => m.status === 'ativo').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Documentos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{matriculas.reduce((acc, m) => 
              acc + (m.documentos?.filter(d => d.status === 'pendente').length || 0), 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pagamentos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{matriculas.reduce((acc, m) => 
              acc + (m.pagamentos?.filter(p => p.status === 'pendente' || p.status === 'atrasado').length || 0), 0)}</p>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">Suas Matrículas</h2>
      
      {matriculas.length === 0 ? (
        <p className="text-neutral-500">Você não possui matrículas ativas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matriculas.map((matricula) => (
            <Card key={matricula.id}>
              <CardHeader>
                <CardTitle>{matricula.curso?.name || 'Curso'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Status:</strong> {matricula.status}</p>
                <p><strong>Data de Matrícula:</strong> {new Date(matricula.created_at).toLocaleDateString('pt-BR')}</p>
                <div className="flex justify-end mt-4">
                  <Button asChild>
                    <Link href={`/aluno/matricula/${matricula.id}`}>Ver Detalhes</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
