import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { MainLayout } from '@/app/components/layout/MainLayout'

interface AlunoLayoutProps {
  children: ReactNode
}

export default async function AlunoLayout({ children }: AlunoLayoutProps) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  // Verificar se o usuário está autenticado
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/login?callbackUrl=/aluno/dashboard')
  }
  
  // Verificar se o usuário é um aluno
  const { data: aluno } = await supabase
    .from('students')
    .select('*')
    .eq('user_id', session.user.id)
    .single()
  
  if (!aluno) {
    redirect('/auth/login?error=unauthorized')
  }
  
  return (
    <MainLayout module="student">
      {children}
    </MainLayout>
  )
}
