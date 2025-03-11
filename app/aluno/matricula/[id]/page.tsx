import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
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
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  // Obter usuário atual
  const { data: { session } } = await supabase.auth.getSession()
  
  // Obter detalhes da matrícula
  const matricula = await getMatriculaDetails(supabase, session?.user.id, id)
  
  if (!matricula) {
    notFound()
  }
  
  return (
    <div className="container py-10">
      <MatriculaAlunoDetails matricula={matricula} />
    </div>
  )
}
