'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../../../components/ui/card';
import { Badge } from '../../../../../components/ui/Badge';
import { assinarContrato, gerarContrato } from '../../../actions/matricula-actions';

interface ContractPageProps {
  params: {
    id: string;
  };
}

export default function ContractPage({ params }: ContractPageProps) {
  const { id } = params;
  const [isLoading, setIsLoading] = React.useState(false);
  const [contractGenerated, setContractGenerated] = React.useState(false);
  const [contractSigned, setContractSigned] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Mock data for demonstration
  const matricula = {
    id,
    aluno: { name: 'Aluno Exemplo' },
    curso: { name: 'Curso Exemplo' },
    valor_total: 1200,
    data_inicio: '2023-01-01',
    data_termino: '2023-12-31',
    status: 'pendente',
    contrato_url: contractGenerated ? `https://example.com/contracts/${id}` : null,
    contrato_assinado: contractSigned,
  };
  
  const handleGenerateContract = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await gerarContrato({ matricula_id: id });
      
      if (result.success) {
        setContractGenerated(true);
      } else {
        setError(result.error || 'Erro ao gerar contrato');
      }
    } catch (error) {
      setError('Erro ao gerar contrato');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignContract = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await assinarContrato({
        matricula_id: id,
        assinatura: 'assinatura-digital-exemplo',
      });
      
      if (result.success) {
        setContractSigned(true);
      } else {
        setError(result.error || 'Erro ao assinar contrato');
      }
    } catch (error) {
      setError('Erro ao assinar contrato');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contrato da Matrícula</h1>
          <p className="text-muted-foreground">
            Aluno: {matricula.aluno?.name || 'N/A'} | ID: {matricula.id.substring(0, 8)}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/matricula/${id}`}>Voltar para Matrícula</Link>
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Detalhes do Contrato</CardTitle>
                <Badge variant={contractSigned ? 'outline' : 'outline'}>
                  {contractSigned ? 'Assinado' : 'Pendente'}
                </Badge>
              </div>
              <CardDescription>
                Informações do contrato de matrícula
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Curso</p>
                  <p>{matricula.curso?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Valor Total</p>
                  <p>R$ {matricula.valor_total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Data de Início</p>
                  <p>{new Date(matricula.data_inicio).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Data de Término</p>
                  <p>{matricula.data_termino ? new Date(matricula.data_termino).toLocaleDateString('pt-BR') : 'N/A'}</p>
                </div>
              </div>
              
              {contractGenerated && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-neutral-500 mb-2">Contrato</p>
                  <div className="border rounded-md p-4 bg-neutral-50">
                    <div className="flex items-center justify-between">
                      <span>Contrato de Matrícula</span>
                      <Button variant="outline" size="sm" asChild>
                        <a href={matricula.contrato_url || '#'} target="_blank" rel="noopener noreferrer">
                          Visualizar PDF
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              {!contractGenerated && (
                <Button onClick={handleGenerateContract} disabled={isLoading}>
                  {isLoading ? 'Gerando...' : 'Gerar Contrato'}
                </Button>
              )}
              
              {contractGenerated && !contractSigned && (
                <Button onClick={handleSignContract} disabled={isLoading}>
                  {isLoading ? 'Assinando...' : 'Assinar Contrato'}
                </Button>
              )}
              
              {contractSigned && (
                <Button variant="outline" asChild>
                  <a href={matricula.contrato_url || '#'} target="_blank" rel="noopener noreferrer">
                    Baixar Contrato Assinado
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Informações Importantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                O contrato de matrícula é um documento legal que estabelece os termos e condições
                para a prestação de serviços educacionais.
              </p>
              <p className="text-sm">
                Após a geração do contrato, é necessário assiná-lo digitalmente para confirmar
                a matrícula.
              </p>
              <p className="text-sm">
                Uma vez assinado, o contrato não pode ser alterado. Caso seja necessário fazer
                alterações, entre em contato com a secretaria.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
