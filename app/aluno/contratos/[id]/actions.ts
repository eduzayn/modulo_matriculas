'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function getContratoData(id: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  // Fetch contract data from Supabase
  const { data, error } = await supabase
    .from('contratos')
    .select('*')
    .eq('id', id)
    .single()
    
  if (error) {
    console.error('Error fetching contract:', error)
    return null
  }
  
  return data
}

export async function getAlunoData(alunoId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  // Fetch student data from Supabase
  const { data, error } = await supabase
    .from('alunos')
    .select('*')
    .eq('id', alunoId)
    .single()
    
  if (error) {
    console.error('Error fetching student:', error)
    return null
  }
  
  return data
}
