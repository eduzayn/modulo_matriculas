import { ReactNode } from 'react'

interface MatriculaLayoutProps {
  children: ReactNode
}

export default function MatriculaLayout({ children }: MatriculaLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
    </div>
  )
}
