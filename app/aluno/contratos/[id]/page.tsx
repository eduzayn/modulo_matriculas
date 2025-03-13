import React from 'react'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import SignContractForm from '@/app/matricula/components/contract/sign-contract-form'
import { getContratoData, getAlunoData } from './actions'

// Interfaces para componentes UI
interface ComponentBaseProps {
  className?: string;
  children?: React.ReactNode;
}

interface ContractPageProps {
  params: {
    id: string;
  };
}

export default async function ContratoPage({ params }: ContractPageProps) {
  const { id } = params;
  
  // Use server actions to fetch data instead of direct cookies access
  const contrato = await getContratoData(id);
  
  if (!contrato) {
    notFound();
  }
  
  const aluno = contrato.aluno_id ? await getAlunoData(contrato.aluno_id) : null;
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/aluno/contratos" className="text-blue-600 hover:underline">
          ← Voltar para Contratos
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Contrato #{id}</h1>
        
        {aluno && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Aluno</h2>
            <p>{aluno.nome}</p>
            <p>{aluno.email}</p>
          </div>
        )}
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Detalhes do Contrato</h2>
          <p>Status: {contrato.status || 'Pendente'}</p>
          <p>Data de Criação: {new Date(contrato.created_at || Date.now()).toLocaleDateString('pt-BR')}</p>
          {contrato.signed_at && (
            <p>Assinado em: {new Date(contrato.signed_at).toLocaleDateString('pt-BR')}</p>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Assinatura do Contrato</h2>
        <SignContractForm contratoId={id} />
      </div>
    </div>
  );
}
