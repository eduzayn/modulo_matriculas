'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function getContratoData(id: string) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    // For static generation, return mock data
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return {
        contrato: {
          id: id,
          status: 'Pendente',
          data_emissao: new Date().toISOString(),
          arquivo_url: '#'
        },
        matricula: {
          id: '123',
          curso_nome: 'Desenvolvimento Web Full Stack',
          valor_total: 12000,
          data_inicio: new Date().toISOString(),
          data_termino: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString()
        }
      };
    }
    
    // For runtime, fetch real data
    const { data: contrato, error: contratoError } = await supabase
      .from('contratos')
      .select('*')
      .eq('id', id)
      .single();
      
    if (contratoError) throw new Error(contratoError.message);
    
    const { data: matricula, error: matriculaError } = await supabase
      .from('matriculas')
      .select('*')
      .eq('id', contrato.matricula_id)
      .single();
      
    if (matriculaError) throw new Error(matriculaError.message);
    
    return { contrato, matricula };
  } catch (error) {
    console.error('Error fetching contrato data:', error);
    return { error: 'Failed to load contract data' };
  }
}
