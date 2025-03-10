import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { DocumentList } from '@/app/(matricula)/components/document-list'
import { DocumentUpload } from '@/app/(matricula)/components/document-upload'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { matriculaRoutes } from '@/app/(matricula)/routes'

interface DocumentsPageProps {
  params: {
    id: string
  }
}

export default async function DocumentsPage({ params }: DocumentsPageProps) {
  const { id } = params
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Verificar se a matrícula existe
  const { data: matricula, error: matriculaError } = await supabase
    .from('matricula.registros')
    .select('id, aluno:students(name)')
    .eq('id', id)
    .single()

  if (matriculaError || !matricula) {
    console.error('Erro ao buscar matrícula:', matriculaError)
    notFound()
  }

  // Buscar documentos da matrícula
  const { data: documentos, error: documentosError } = await supabase
    .from('matricula_documentos')
    .select('*')
    .eq('matricula_id', id)
    .order('created_at', { ascending: false })

  if (documentosError) {
    console.error('Erro ao buscar documentos:', documentosError)
  }

  // Verificar se o usuário é admin
  const { data: { session } } = await supabase.auth.getSession()
  const isAdmin = session?.user?.app_metadata?.role === 'admin'

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
