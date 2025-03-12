import { ReactNode } from 'react'
import { MainLayout } from '../components/layout/MainLayout'

interface MatriculaLayoutProps {
  children: ReactNode
}

export default function MatriculaLayout({ children }: MatriculaLayoutProps) {
  return (
    <MainLayout module="enrollment">
      {children}
    </MainLayout>
  )
}
