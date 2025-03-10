import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { MatriculaForm } from '@/app/(matricula)/components/matricula-form'
import { notFound } from 'next/navigation'

interface EditMatriculaPageProps {
  params: {
    id: string
  }
}

export default async function EditMatriculaPage({ params }: EditMatriculaPageProps) {
  const { id } = params
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Buscar detalhes da matrícula
  const { data: matricula, error } = await supabase
    .from('matricula.registros')
    .select(`
      *,
      aluno:students(id, name),
      curso:courses(id, name)
    `)
    .eq('id', id)
    .single()

  if (error || !matricula) {
    console.error('Erro ao buscar matrícula:', error)
    notFound()
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
        <h1 className="text-3xl font-bold tracking-tight">Editar Matrícula</h1>
        <p className="text-muted-foreground">
          Atualize os dados da matrícula
        </p>
      </div>

      <div className="border rounded-lg p-6">
        <MatriculaForm
          initialData={matricula}
          alunos={alunos || []}
          cursos={cursos || []}
          descontos={descontos || []}
          isEditing
        />
      </div>
    </div>
  )
}
