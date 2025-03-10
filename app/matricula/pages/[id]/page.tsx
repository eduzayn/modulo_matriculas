import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { MatriculaDetails } from '@/app/matricula/components/matricula-details'
import { notFound } from 'next/navigation'

interface MatriculaDetailsPageProps {
  params: {
    id: string
  }
}

export default async function MatriculaDetailsPage({ params }: MatriculaDetailsPageProps) {
  const { id } = params
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Buscar detalhes da matrícula
  const { data: matricula, error } = await supabase
    .from('matricula.registros')
    .select(`
      *,
      aluno:students(*),
      curso:courses(*),
      documentos:matricula_documentos(
        id, 
        tipo, 
        nome, 
        url, 
        status, 
        observacoes, 
        created_at, 
        updated_at
      ),
      pagamentos:matricula_pagamentos(
        id, 
        numero_parcela, 
        data_vencimento, 
        valor, 
        status, 
        data_pagamento
      ),
      contrato:matricula_contratos(
        id,
        titulo,
        versao,
        url,
        status,
        data_assinatura
      )
    `)
    .eq('id', id)
    .single()

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
