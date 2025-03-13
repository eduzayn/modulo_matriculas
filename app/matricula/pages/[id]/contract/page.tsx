'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { assinarContrato, gerarContrato } from '../../../actions/matricula-actions';

interface ContractPageProps {
  params: {
    id: string;
  };
}

export default function ContractPage({ params }: ContractPageProps) {
  const { id } = params;
  const [isLoading, setIsLoading] = React.useState(false);
  const [contrato, setContrato] = React.useState<any>({
    id: id,
    status: 'Pendente',
    dataEmissao: new Date().toISOString(),
    dataAssinatura: null,
    matriculaId: id,
    curso: 'Desenvolvimento Web Full Stack',
    valorTotal: 12000,
    parcelas: 12,
    valorParcela: 1000,
  });

  const handleGerarContrato = async () => {
    setIsLoading(true);
    try {
      const result = await gerarContrato(id);
      if (result.success) {
        setContrato({
          ...contrato,
          status: 'Gerado',
          url: result.url,
        });
      }
    } catch (error) {
      console.error('Erro ao gerar contrato:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssinarContrato = async () => {
    setIsLoading(true);
    try {
      const result = await assinarContrato(id);
      if (result.success) {
        setContrato({
          ...contrato,
          status: 'Assinado',
          dataAssinatura: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Erro ao assinar contrato:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href={`/matricula/pages/${id}`} className="text-blue-600 hover:underline">
          ← Voltar para Matrícula
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Contrato de Matrícula</CardTitle>
              <CardDescription>Matrícula #{id}</CardDescription>
            </div>
            <Badge variant={
              contrato.status === 'Assinado' ? 'success' : 
              contrato.status === 'Gerado' ? 'warning' : 'outline'
            }>
              {contrato.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-sm">Curso</h3>
            <p>{contrato.curso}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm">Valor Total</h3>
            <p>R$ {contrato.valorTotal.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm">Forma de Pagamento</h3>
            <p>{contrato.parcelas}x de R$ {contrato.valorParcela.toFixed(2)}</p>
          </div>
          {contrato.dataEmissao && (
            <div>
              <h3 className="font-medium text-sm">Data de Emissão</h3>
              <p>{new Date(contrato.dataEmissao).toLocaleDateString('pt-BR')}</p>
            </div>
          )}
          {contrato.dataAssinatura && (
            <div>
              <h3 className="font-medium text-sm">Data de Assinatura</h3>
              <p>{new Date(contrato.dataAssinatura).toLocaleDateString('pt-BR')}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {contrato.status === 'Pendente' && (
            <Button onClick={handleGerarContrato} disabled={isLoading}>
              {isLoading ? 'Gerando...' : 'Gerar Contrato'}
            </Button>
          )}
          {contrato.status === 'Gerado' && (
            <>
              <Button variant="outline" asChild>
                <Link href={contrato.url || '#'} target="_blank">Visualizar Contrato</Link>
              </Button>
              <Button onClick={handleAssinarContrato} disabled={isLoading}>
                {isLoading ? 'Assinando...' : 'Assinar Contrato'}
              </Button>
            </>
          )}
          {contrato.status === 'Assinado' && (
            <Button variant="outline" asChild>
              <Link href={contrato.url || '#'} target="_blank">Visualizar Contrato Assinado</Link>
            </Button>
          )}
        </CardFooter>
      </Card>

      {contrato.status === 'Assinado' && (
        <Card>
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Seu contrato foi assinado com sucesso! Agora você pode:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Acessar o ambiente de aprendizado</li>
              <li>Verificar o cronograma de aulas</li>
              <li>Conhecer seus professores</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/matricula/dashboard">Ir para Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
