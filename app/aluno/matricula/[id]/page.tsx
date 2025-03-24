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
  
  // Obter detalhes da matrícula
  const matricula = await getMatriculaDetails(null, null, id)
  
  if (!matricula) {
    notFound()
  }
  
  return (
    <div className="container py-10">
      <MatriculaAlunoDetails matricula={matricula} />
    </div>
  )
}
