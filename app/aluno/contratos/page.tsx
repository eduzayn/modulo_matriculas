import React from 'react'
import Link from 'next/link'
import { getAlunoContratos } from '../lib/services/aluno-service'

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

interface BadgeProps extends ComponentBaseProps {
  variant?: 'default' | 'outline' | 'success';
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

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variantStyles: Record<string, string> = {
    default: 'bg-neutral-100 text-neutral-800',
    outline: 'border border-neutral-200 text-neutral-800',
    success: 'bg-green-100 text-green-800'
  }
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}

export default async function AlunoContratosPage() {
  // Authentication is now handled by the main site
  // TODO: Get user ID from main site authentication
  const userId = '' // This will come from the main site's auth
  
  // Obter contratos do aluno
  const contratos = await getAlunoContratos(null, userId)
  
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
          <h1 className="text-3xl font-bold tracking-tight">Meus Contratos</h1>
          <p className="text-neutral-500">
            Visualize e assine seus contratos de matrícula
          </p>
        </div>
      </div>
      
      {contratos.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-neutral-500">Você não possui contratos disponíveis.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contratos.map((contrato) => (
            <Card key={contrato.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">{contrato.titulo}</CardTitle>
                <CardDescription>Versão: {contrato.versao}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Curso</p>
                  <p className="text-neutral-600">{contrato.curso_nome}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge 
                    variant={contrato.status === 'assinado' ? 'success' : 'outline'}
                  >
                    {contrato.status === 'assinado' ? 'Assinado' : 'Pendente'}
                  </Badge>
                </div>
                {contrato.status === 'assinado' && (
                  <div>
                    <p className="text-sm font-medium">Data de Assinatura</p>
                    <p className="text-neutral-600">{formatDate(contrato.data_assinatura)}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <a href={contrato.url} target="_blank" rel="noopener noreferrer">
                    Visualizar
                  </a>
                </Button>
                {contrato.status !== 'assinado' && (
                  <Button asChild>
                    <Link href={`/aluno/contratos/${contrato.id}`}>
                      Assinar
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
