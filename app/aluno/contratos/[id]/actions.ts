'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function getContratoData(id: string) {
  const supabase = createClient(cookies())
  
  try {
    const { data: contrato, error } = await supabase
      .from('contratos')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching contrato:', error)
      return { contrato: null, error: error.message }
    }
    
    const { data: matricula, error: matriculaError } = await supabase
      .from('matriculas')
      .select('*')
      .eq('id', contrato?.matricula_id || '')
      .single()
    
    if (matriculaError) {
      console.error('Error fetching matricula:', matriculaError)
      return { contrato, matricula: null, error: matriculaError.message }
    }
    
    return { contrato, matricula, error: null }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { contrato: null, matricula: null, error: 'Unexpected error occurred' }
  }
}
