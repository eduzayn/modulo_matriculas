'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getContratoData } from './actions'

export default function ContratoDetailsClient({ params }: { params: { id: string } }) {
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
    return <div className="p-8 text-center">Contrato não encontrado</div>;
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
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 flex flex-col space-y-1.5">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Contrato #{contrato.id}</h3>
              <p className="text-sm text-muted-foreground">
                Emitido em {formatDate(contrato.data_emissao)}
              </p>
            </div>
            <div className="p-6 pt-0">
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
            </div>
            <div className="p-6 pt-0 flex items-center">
              {contrato.status !== 'Assinado' && (
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Assinar Contrato
                </button>
              )}
              {contrato.status === 'Assinado' && (
                <Link href={contrato.arquivo_url || '#'} target="_blank" className="text-blue-500 hover:underline">
                  Visualizar Contrato Assinado
                </Link>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 flex flex-col space-y-1.5">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Informações</h3>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-4">
                <p className="text-sm">
                  Este contrato estabelece os termos e condições para a prestação de serviços educacionais.
                </p>
                <p className="text-sm">
                  Após a assinatura, o contrato não pode ser alterado. Caso seja necessário fazer alterações,
                  entre em contato com a secretaria acadêmica.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
