import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { MatriculaForm } from '@/app/matricula/components/matricula-form'
import { redirect } from 'next/navigation'
import { matriculaRoutes } from '@/app/matricula/routes'

export default async function CreateMatriculaPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Verificar se o usuário está autenticado
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/auth/login')
  }

  // Buscar alunos
  const { data: alunos, error: alunosError } = await supabase
    .from('students')
    .select('id, name')
    .order('name')

  if (alunosError) {
    console.error('Erro ao buscar alunos:', alunosError)
  }

  // Buscar cursos
  const { data: cursos, error: cursosError } = await supabase
    .from('courses')
    .select('id, name')
    .order('name')

  if (cursosError) {
    console.error('Erro ao buscar cursos:', cursosError)
  }

  // Buscar descontos
  const { data: descontos, error: descontosError } = await supabase
    .from('discounts')
    .select('id, nome, tipo, valor')
    .eq('ativo', true)
    .order('nome')

  if (descontosError) {
    console.error('Erro ao buscar descontos:', descontosError)
  }

  return (
    <div className="container py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Matrícula</h1>
        <p className="text-muted-foreground">
          Preencha os dados para criar uma nova matrícula
        </p>
      </div>

      <div className="border rounded-lg p-6">
        <MatriculaForm
          alunos={alunos || []}
          cursos={cursos || []}
          descontos={descontos || []}
        />
      </div>
    </div>
  )
}
