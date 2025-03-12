import React from 'react'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import SignContractForm from '@/app/matricula/components/contract/sign-contract-form'

// Interfaces para componentes UI
interface ComponentBaseProps {
  children: React.ReactNode;
  className?: string;
}

interface ButtonProps extends ComponentBaseProps {
  variant?: 'default' | 'outline';
  asChild?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// UI Components
const Card: React.FC<ComponentBaseProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg border border-neutral-200 shadow-sm ${className}`}>
    {children}
  </div>
)

const CardHeader: React.FC<ComponentBaseProps> = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-neutral-200 ${className}`}>
    {children}
  </div>
)

const CardTitle: React.FC<ComponentBaseProps> = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold ${className}`}>
    {children}
  </h3>
)

const CardDescription: React.FC<ComponentBaseProps> = ({ children, className = '' }) => (
  <p className={`text-sm text-neutral-500 ${className}`}>
    {children}
  </p>
)

const CardContent: React.FC<ComponentBaseProps> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
)

const CardFooter: React.FC<ComponentBaseProps> = ({ children, className = '' }) => (
  <div className={`p-6 border-t border-neutral-200 ${className}`}>
    {children}
  </div>
)

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'default', 
  asChild, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variantStyles: Record<string, string> = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900'
  }
  
  const styles = `${baseStyles} ${variantStyles[variant]} ${className}`
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: styles,
      ...(props as any)
    })
  }
  
  return (
    <button className={styles} {...props}>
      {children}
    </button>
  )
}

interface ContratoDetailsPageProps {
  params: {
    id: string
  }
}

export default async function ContratoDetailsPage({ params }: ContratoDetailsPageProps) {
  const { id } = params
  // Authentication is now handled by the main site
  // TODO: Replace with main site authentication
  const userId = ''; // Get from main site auth
  const userRole = ''; // Get from main site auth
  
  // Get student data from API
  const aluno = null; // TODO: Fetch from main site API
  
  // Obter detalhes do contrato
  const { data: contrato, error } = await supabase
    .from('matricula_contratos')
    .select(`
      *,
      matricula:matricula_id(
        id,
        curso:courses(*)
      )
    `)
    .eq('id', id)
    .single()
  
  if (error || !contrato) {
    notFound()
  }
  
  // Verificar se o contrato pertence a uma matrícula do aluno
  const { data: matricula } = await supabase
    .from('matricula.registros')
    .select('id')
    .eq('id', contrato.matricula_id)
    .eq('aluno_id', aluno.id)
    .single()
  
  if (!matricula) {
    redirect('/aluno/contratos')
  }
  
  // Função para formatar data
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
          <h1 className="text-3xl font-bold tracking-tight">Detalhes do Contrato</h1>
          <p className="text-neutral-500">
            Visualize e assine seu contrato de matrícula
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/aluno/contratos">
            Voltar
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{contrato.titulo}</CardTitle>
          <CardDescription>Versão: {contrato.versao}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Curso</h3>
              <p>{(contrato.matricula as any)?.curso?.name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="font-medium">Status</h3>
              <p>{contrato.status === 'assinado' ? 'Assinado' : 'Pendente'}</p>
            </div>
            {contrato.status === 'assinado' && (
              <div>
                <h3 className="font-medium">Data de Assinatura</h3>
                <p>{formatDate(contrato.data_assinatura)}</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center mt-4">
            <iframe 
              src={contrato.url} 
              className="w-full h-[500px] border rounded-md"
              title="Visualização do Contrato"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4">
          {contrato.status !== 'assinado' ? (
            <div className="w-full">
              <SignContractForm contratoId={contrato.id} />
            </div>
          ) : (
            <div className="text-center w-full">
              <p className="text-green-600 font-medium">Este contrato já foi assinado em {formatDate(contrato.data_assinatura)}</p>
            </div>
          )}
          <Button variant="outline" className="w-full" asChild>
            <a href={contrato.url} download>Baixar Contrato</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
