import { MatriculaForm } from '@/app/matricula/components/matricula-form'
import { notFound } from 'next/navigation'

interface EditMatriculaPageProps {
  params: {
    id: string
  }
}

export default async function EditMatriculaPage({ params }: EditMatriculaPageProps) {
  const { id } = params

  // TODO: Fetch data from main site API
  // Authentication is now handled by the main site
  const response = await fetch(`${process.env.MAIN_SITE_URL}/api/matriculas/${id}`)
  if (!response.ok) {
    console.error('Erro ao buscar matrícula')
    notFound()
  }
  
  const matricula = await response.json()

  // Fetch related data from main site API
  const [alunosRes, cursosRes, descontosRes] = await Promise.all([
    fetch(`${process.env.MAIN_SITE_URL}/api/alunos`),
    fetch(`${process.env.MAIN_SITE_URL}/api/cursos`),
    fetch(`${process.env.MAIN_SITE_URL}/api/descontos`)
  ])

  const alunos = alunosRes.ok ? await alunosRes.json() : []
  const cursos = cursosRes.ok ? await cursosRes.json() : []
  const descontos = descontosRes.ok ? await descontosRes.json() : []

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
