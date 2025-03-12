import { MatriculaForm } from '@/app/matricula/components/matricula-form'
import { redirect } from 'next/navigation'
import { matriculaRoutes } from '@/app/matricula/routes'

export default async function CreateMatriculaPage() {
  // Authentication is now handled by the main site
  // TODO: Replace with API calls to the main site
  const alunos = []  // Fetch from main site API
  const cursos = []  // Fetch from main site API
  const descontos = []  // Fetch from main site API

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
