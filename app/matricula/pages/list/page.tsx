import { MatriculaList } from '@/app/matricula/components/matricula-list'
import { Button } from "@/components/ui/button"'
import { matriculaRoutes } from '@/app/matricula/routes'
import Link from 'next/link'

interface ListMatriculasPageProps {
  searchParams: {
    page?: string
    pageSize?: string
    search?: string
    status?: string
  }
}

export default async function ListMatriculasPage({ searchParams }: ListMatriculasPageProps) {
  const page = Number(searchParams.page) || 1
  const pageSize = Number(searchParams.pageSize) || 10
  const search = searchParams.search || ''
  const status = searchParams.status || ''

  // TODO: Fetch matriculas data from main site API
  // Authentication and data fetching is now handled by the main site
  const response = await fetch(`${process.env.MAIN_SITE_URL}/api/matriculas?page=${page}&pageSize=${pageSize}&search=${search}&status=${status}`)
  const { data: matriculas, count, error } = await response.json()

  if (error) {
    console.error('Erro ao buscar matrículas:', error)
  }

  const totalCount = count || 0

  return (
    <div className="container py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matrículas</h1>
          <p className="text-muted-foreground">
            Gerencie as matrículas dos alunos
          </p>
        </div>
        <Button asChild>
          <Link href={matriculaRoutes.create}>Nova Matrícula</Link>
        </Button>
      </div>

      <MatriculaList
        matriculas={matriculas || []}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={(newPage: number) => {
          // Esta função será implementada no cliente
        }}
        onFilterChange={(filters: Record<string, any>) => {
          // Esta função será implementada no cliente
        }}
      />
    </div>
  )
}
