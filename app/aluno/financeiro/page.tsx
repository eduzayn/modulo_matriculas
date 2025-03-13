'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from '../../components/ui/ResponsiveLayout';

export default function AlunoFinanceiroPage() {
  // Mock data instead of using supabase
  const mockInvoices = [
    { id: 1, description: 'Mensalidade - Desenvolvimento Web', value: 'R$ 399,00', dueDate: '10/03/2025', status: 'paid' },
    { id: 2, description: 'Mensalidade - Design UX/UI', value: 'R$ 349,00', dueDate: '15/03/2025', status: 'pending' },
    { id: 3, description: 'Mensalidade - Marketing Digital', value: 'R$ 299,00', dueDate: '20/03/2025', status: 'pending' },
    { id: 4, description: 'Taxa de Matrícula', value: 'R$ 150,00', dueDate: '01/03/2025', status: 'paid' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Pago</Badge>;
      case 'pending':
        return <Badge variant="outline">Pendente</Badge>;
      case 'overdue':
        return <Badge variant="outline">Atrasado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Financeiro" 
          subtitle="Gerenciamento financeiro do aluno"
        />
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
            <CardDescription>Visão geral da sua situação financeira</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-neutral-100 rounded-md">
                <p className="text-sm text-neutral-500">Total Pago</p>
                <p className="text-2xl font-bold">R$ 549,00</p>
              </div>
              <div className="p-4 bg-neutral-100 rounded-md">
                <p className="text-sm text-neutral-500">Pendente</p>
                <p className="text-2xl font-bold">R$ 648,00</p>
              </div>
              <div className="p-4 bg-neutral-100 rounded-md">
                <p className="text-sm text-neutral-500">Próximo Vencimento</p>
                <p className="text-2xl font-bold">15/03/2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Faturas</CardTitle>
            <CardDescription>Histórico de faturas e pagamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Descrição</th>
                    <th className="text-left p-2">Valor</th>
                    <th className="text-left p-2">Vencimento</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b">
                      <td className="p-2">{invoice.description}</td>
                      <td className="p-2">{invoice.value}</td>
                      <td className="p-2">{invoice.dueDate}</td>
                      <td className="p-2">{getStatusBadge(invoice.status)}</td>
                      <td className="p-2">
                        {invoice.status === 'pending' && (
                          <Button size="sm">Pagar</Button>
                        )}
                        {invoice.status === 'paid' && (
                          <Button size="sm" variant="outline">Recibo</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    </ResponsiveLayout>
  );
}
