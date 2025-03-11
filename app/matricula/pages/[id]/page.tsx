import { MatriculaDetails } from '@/app/matricula/components/matricula-details'
import { notFound } from 'next/navigation'

interface MatriculaDetailsPageProps {
  params: {
    id: string
  }
}

export default async function MatriculaDetailsPage({ params }: MatriculaDetailsPageProps) {
  const { id } = params

  // TODO: Fetch matricula details from main site API
  const response = await fetch(`${process.env.MAIN_SITE_URL}/api/matriculas/${id}`)
  const { data: matricula, error } = await response.json()

  if (error || !matricula) {
    console.error('Erro ao buscar matrícula:', error)
    notFound()
  }

  return (
    <div className="container py-10">
      <MatriculaDetails matricula={matricula} />
    </div>
  )
}
