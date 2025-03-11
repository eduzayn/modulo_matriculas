'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/dashboard/financial-summary');
        if (!response.ok) {
          throw new Error('Erro ao carregar transações recentes');
        }
        const result = await response.json();
        setTransactions(result.data.recentPayments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  if (loading) return <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>;
  
  if (error) return <div className="p-4 text-red-500">Erro: {error}</div>;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{transaction.aluno}</p>
                  <p className="text-sm text-muted-foreground">{transaction.curso}</p>
                  <p className="text-xs text-muted-foreground">{transaction.data}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {transaction.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                  <p className="text-xs text-muted-foreground">{transaction.forma_pagamento}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            Nenhuma transação recente encontrada
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentTransactions;
