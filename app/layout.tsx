import { Inter } from "next/font/google"
import { ReactNode } from "react" 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Módulo de Matrículas - Edunéxia',
  description: 'Sistema de gerenciamento de matrículas para instituições de ensino',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
