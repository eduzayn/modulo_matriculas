'use client'

import React, { useEffect, useState } from 'react'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import SignContractForm from '@/app/matricula/components/contract/sign-contract-form'
import { getContratoData } from './actions'

// Interfaces para componentes UI
interface ComponentBaseProps {
  children: React.ReactNode;
}

interface CardProps extends ComponentBaseProps {
  className?: string;
}

interface CardHeaderProps extends ComponentBaseProps {
  className?: string;
}

interface CardTitleProps extends ComponentBaseProps {
  className?: string;
}

interface CardDescriptionProps extends ComponentBaseProps {
  className?: string;
}

interface CardContentProps extends ComponentBaseProps {
  className?: string;
}

interface CardFooterProps extends ComponentBaseProps {
  className?: string;
}

// Componentes UI simplificados
const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`}>{children}</div>
);

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`p-6 flex flex-col space-y-1.5 ${className}`}>{children}</div>
);

const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '' }) => (
  <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
);

const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 flex items-center ${className}`}>{children}</div>
);

// Componente Button simplificado
const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  asChild?: boolean;
  onClick?: () => void;
}> = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className = '',
  onClick,
  asChild = false
}) => {
  const variantStyles = {
    default: 'bg-primary-500 text-white hover:bg-primary-600',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  const sizeStyles = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  return asChild ? (
    <div className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </div>
  ) : (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default function ContratoDetailsPage({ params }: { params: { id: string } }) {
  const [contratoData, setContratoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContratoData() {
      try {
        const data = await getContratoData(params.id);
        if (data.error) {
          setError(data.error);
        } else {
          setContratoData(data);
        }
      } catch (err) {
        setError('Failed to load contract data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadContratoData();
  }, [params.id]);

  if (loading) {
    return <div className="p-8 text-center">Carregando detalhes do contrato...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Erro: {error}</div>;
  }

  if (!contratoData?.contrato) {
    return notFound();
  }

  const { contrato, matricula } = contratoData;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detalhes do Contrato</h1>
        <Link href="/aluno/contratos" className="text-blue-500 hover:underline">
          Voltar para lista
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contrato #{contrato.id}</CardTitle>
              <CardDescription>
                Emitido em {formatDate(contrato.data_emissao)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Status</h3>
                  <p className={`mt-1 ${contrato.status === 'Assinado' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {contrato.status || 'Pendente'}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Matrícula</h3>
                  <p className="mt-1">#{matricula?.id || 'N/A'}</p>
                </div>

                <div>
                  <h3 className="font-medium">Curso</h3>
                  <p className="mt-1">{matricula?.curso_nome || 'N/A'}</p>
                </div>

                <div>
                  <h3 className="font-medium">Valor</h3>
                  <p className="mt-1">R$ {matricula?.valor_total?.toFixed(2) || '0.00'}</p>
                </div>

                <div>
                  <h3 className="font-medium">Data de Início</h3>
                  <p className="mt-1">{formatDate(matricula?.data_inicio)}</p>
                </div>

                <div>
                  <h3 className="font-medium">Data de Término</h3>
                  <p className="mt-1">{formatDate(matricula?.data_termino)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {contrato.status !== 'Assinado' && (
                <SignContractForm contratoId={contrato.id} />
              )}
              {contrato.status === 'Assinado' && (
                <Link href={contrato.arquivo_url || '#'} target="_blank" className="text-blue-500 hover:underline">
                  Visualizar Contrato Assinado
                </Link>
              )}
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  Este contrato estabelece os termos e condições para a prestação de serviços educacionais.
                </p>
                <p className="text-sm">
                  Após a assinatura, o contrato não pode ser alterado. Caso seja necessário fazer alterações,
                  entre em contato com a secretaria.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
