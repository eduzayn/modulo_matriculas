import { notFound } from 'next/navigation'
import { getMatriculaDetails } from '../../lib/services/aluno-service'
import { MatriculaAlunoDetails } from '../../components/matricula-aluno-details'

interface MatriculaDetailsPageProps {
  params: {
    id: string
  }
}

export default async function MatriculaDetailsPage({ params }: MatriculaDetailsPageProps) {
  const { id } = params
  
  // Authentication is now handled by the main site
  // TODO: Get user ID from main site's authentication system
  const userId = 'placeholder-user-id'
  
  // Obter detalhes da matrícula
  const matricula = await getMatriculaDetails(null, userId, id)
  
  if (!matricula) {
    notFound()
  }
  
  return (
    <div className="container py-10">
      <MatriculaAlunoDetails matricula={matricula} />
    </div>
  )
}
