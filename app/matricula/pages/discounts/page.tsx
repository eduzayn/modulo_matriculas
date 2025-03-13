'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../../components/ui/card';
import { Button } from "@/components/ui/button"';
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from "@/app/components/ui/responsiveLayout"';

export default function DiscountsPage() {
  // Mock data instead of using supabase
  const mockDiscounts = [
    { id: 1, name: 'Desconto Antecipado', value: '10%', description: 'Desconto para pagamentos antecipados' },
    { id: 2, name: 'Desconto Familiar', value: '15%', description: 'Desconto para familiares de alunos' },
    { id: 3, name: 'Desconto Convênio', value: '20%', description: 'Desconto para empresas conveniadas' },
  ];

  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Descontos" 
          subtitle="Gerenciamento de descontos para matrículas"
          actions={
            <Button>Novo Desconto</Button>
          }
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {mockDiscounts.map((discount) => (
            <Card key={discount.id}>
              <CardHeader>
                <CardTitle>{discount.name}</CardTitle>
                <CardDescription>Valor: {discount.value}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{discount.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ResponsiveContainer>
    </ResponsiveLayout>
  );
}
