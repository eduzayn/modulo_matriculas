import { ReactNode } from "react"
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/providers/ThemeProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

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
      <body className={`${inter.variable} antialiased bg-neutral-50`}>
        <ThemeProvider module="enrollment">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
