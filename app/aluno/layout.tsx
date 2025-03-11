import { ReactNode } from 'react'
import { MainLayout } from '@/app/components/layout/MainLayout'

interface AlunoLayoutProps {
  children: ReactNode
}

export default function AlunoLayout({ children }: AlunoLayoutProps) {
  // Authentication is now handled by the main site
  return (
    <MainLayout module="student">
      {children}
    </MainLayout>
  )
}
