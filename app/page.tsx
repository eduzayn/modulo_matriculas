import { ReactNode } from "react"
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col">
        <h1 className="text-4xl font-bold mb-8">Módulo de Matrículas - Edunéxia</h1>
        <p className="text-xl mb-8 text-center max-w-2xl">
          Sistema de gerenciamento de matrículas para instituições de ensino, 
          responsável por todo o processo de inscrição, gestão e acompanhamento 
          das matrículas dos alunos.
        </p>
        <div className="flex gap-4">
          <Link 
            href="/matricula/pages/list" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Ver Matrículas
          </Link>
          <Link 
            href="/matricula/pages/create" 
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Nova Matrícula
          </Link>
        </div>
      </div>
    </main>
  )
}
