import { SupabaseClient } from '@supabase/supabase-js'

export async function getAlunoMatriculas(supabase: SupabaseClient, userId: string) {
  if (!userId) return []
  
  // Obter aluno pelo user_id
  const { data: aluno } = await supabase
    .from('students')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (!aluno) return []
  
  // Obter matrículas do aluno
  const { data: matriculas } = await supabase
    .from('matricula.registros')
    .select(`
      *,
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
    .eq('aluno_id', aluno.id)
  
  return matriculas || []
}

export async function getMatriculaDetails(supabase: SupabaseClient, userId: string, matriculaId: string) {
  if (!userId || !matriculaId) return null
  
  // Obter aluno pelo user_id
  const { data: aluno } = await supabase
    .from('students')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (!aluno) return null
  
  // Obter matrícula específica do aluno
  const { data: matricula } = await supabase
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
    .eq('id', matriculaId)
    .eq('aluno_id', aluno.id)
    .single()
  
  return matricula
}
