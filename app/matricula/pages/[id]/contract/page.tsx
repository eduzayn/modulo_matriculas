import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { matriculaRoutes } from '@/app/matricula/routes'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { colors } from '@/app/styles/colors'

interface ContractPageProps {
  params: {
    id: string
  }
}

export default async function ContractPage({ params }: ContractPageProps) {
  const { id } = params
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Verificar se a matrícula existe
  const { data: matricula, error: matriculaError } = await supabase
    .from('matricula.registros')
    .select(`
      id, 
      aluno:students(name),
      curso:courses(name)
    `)
    .eq('id', id)
    .single()

  if (matriculaError || !matricula) {
    console.error('Erro ao buscar matrícula:', matriculaError)
    notFound()
  }

  // Buscar contrato da matrícula
  const { data: contrato, error: contratoError } = await supabase
    .from('matricula_contratos')
    .select('*')
    .eq('matricula_id', id)
    .maybeSingle()

  if (contratoError) {
    console.error('Erro ao buscar contrato:', contratoError)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="container py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contrato de Matrícula</h1>
          <p className="text-neutral-500">
            Aluno: {matricula.aluno?.name || 'N/A'} | Curso: {matricula.curso?.name || 'N/A'}
          </p>
        </div>
        <Button variant="outline" module="enrollment" asChild>
          <Link href={matriculaRoutes.details(id)}>Voltar para Matrícula</Link>
        </Button>
      </div>

      {contrato ? (
        <Card variant="gradient" module="enrollment">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle module="enrollment">{contrato.titulo}</CardTitle>
              <Badge
                variant={
                  contrato.status === 'assinado'
                    ? 'success'
                    : contrato.status === 'expirado'
                    ? 'error'
                    : 'primary'
                }
                module="enrollment"
              >
                {contrato.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium" style={{ color: colors.primary.enrollment.main }}>Versão</h3>
                <p>{contrato.versao}</p>
              </div>
              <div>
                <h3 className="font-medium" style={{ color: colors.primary.enrollment.main }}>Data de Geração</h3>
                <p>{formatDate(contrato.created_at)}</p>
              </div>
              {contrato.data_assinatura && (
                <div>
                  <h3 className="font-medium" style={{ color: colors.primary.enrollment.main }}>Data de Assinatura</h3>
                  <p>{formatDate(contrato.data_assinatura)}</p>
                </div>
              )}
            </div>

            <div className="border rounded-md p-4 mt-4 bg-neutral-50">
              <h3 className="font-medium mb-2" style={{ color: colors.primary.enrollment.main }}>Visualização do Contrato</h3>
              <div className="flex justify-center">
                <Button variant="outline" module="enrollment" asChild>
                  <a href={contrato.url} target="_blank" rel="noopener noreferrer">
                    Abrir Contrato
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {contrato.status !== 'assinado' && (
              <Button module="enrollment">Assinar Contrato</Button>
            )}
            <Button variant="outline" module="enrollment">Baixar Contrato</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card variant="gradient" module="enrollment">
          <CardHeader>
            <CardTitle module="enrollment">Nenhum Contrato Gerado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-500">
              Ainda não há um contrato gerado para esta matrícula.
            </p>
          </CardContent>
          <CardFooter>
            <Button module="enrollment">Gerar Contrato</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
