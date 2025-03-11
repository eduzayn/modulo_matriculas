import { DocumentList } from '@/app/matricula/components/document-list'
import { DocumentUpload } from '@/app/matricula/components/document-upload'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { matriculaRoutes } from '@/app/matricula/routes'

interface DocumentsPageProps {
  params: {
    id: string
  }
}

export default async function DocumentsPage({ params }: DocumentsPageProps) {
  const { id } = params

  // TODO: Replace with main site's data fetching
  const matricula = {
    id,
    aluno: {
      name: 'Nome do Aluno' // This will come from the main site
    }
  }

  // TODO: Replace with main site's data fetching
  const documentos = [] // This will come from the main site's API

  if (!matricula) {
    notFound()
  }
  }

  // Authentication and role checks are now handled by the main site
  // TODO: Get isAdmin from main site authentication
  const isAdmin = false // Temporary default until main site integration

  return (
    <div className="container py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentos da Matrícula</h1>
          <p className="text-muted-foreground">
            Aluno: {matricula.aluno?.name || 'N/A'} | ID: {matricula.id.substring(0, 8)}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={matriculaRoutes.details(id)}>Voltar para Matrícula</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Documentos Enviados</h2>
          <DocumentList documents={documentos || []} isAdmin={isAdmin} />
        </div>
        <div>
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Enviar Novo Documento</h2>
            <DocumentUpload matriculaId={id} />
          </div>
        </div>
      </div>
    </div>
  )
}
