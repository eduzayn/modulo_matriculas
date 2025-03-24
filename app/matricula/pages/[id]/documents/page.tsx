'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../../../../../components/ui/Button';
import { matriculaRoutes } from '../../../../matricula/routes';

interface DocumentListProps {
  documents: any[];
  isAdmin: boolean;
}

function DocumentList({ documents, isAdmin }: DocumentListProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {documents.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-neutral-500">Nenhum documento enviado ainda.</p>
        </div>
      ) : (
        <div className="divide-y">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{doc.tipo}</p>
                <p className="text-sm text-neutral-500">
                  Enviado em: {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    Visualizar
                  </a>
                </Button>
                {isAdmin && (
                  <Button
                    variant={doc.aprovado ? "outline" : "default"}
                    size="sm"
                  >
                    {doc.aprovado ? "Aprovado" : "Aprovar"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface DocumentUploadProps {
  matriculaId: string;
}

function DocumentUpload({ matriculaId }: DocumentUploadProps) {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tipo de Documento</label>
        <select className="w-full rounded-md border border-neutral-300 p-2">
          <option value="">Selecione o tipo</option>
          <option value="rg">RG</option>
          <option value="cpf">CPF</option>
          <option value="comprovante_residencia">Comprovante de Residência</option>
          <option value="diploma">Diploma</option>
          <option value="historico">Histórico Escolar</option>
          <option value="outros">Outros</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Arquivo</label>
        <input
          type="file"
          className="w-full rounded-md border border-neutral-300 p-2"
        />
      </div>
      
      <Button type="submit">Enviar Documento</Button>
    </form>
  );
}

export default function DocumentsPage({ params }: { params: { id: string } }) {
  const id = params.id;
  
  // Mock data for demonstration
  const matricula = {
    id,
    aluno: { name: 'Aluno Exemplo' },
  };
  
  const documentos = [
    {
      id: '1',
      tipo: 'RG',
      url: '#',
      aprovado: true,
      created_at: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      tipo: 'CPF',
      url: '#',
      aprovado: false,
      created_at: '2023-01-02T00:00:00Z',
    },
  ];
  
  // Admin check
  const isAdmin = false;
  
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
  );
}
