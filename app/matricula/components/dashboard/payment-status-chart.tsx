'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export function PaymentStatusChart() {
  const [data, setData] = useState<Array<{name: string, value: number}>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const COLORS = ['#4CAF50', '#FFC107', '#F44336'];
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/dashboard/financial-summary');
        if (!response.ok) {
          throw new Error('Erro ao carregar dados financeiros');
        }
        const result = await response.json();
        
        // Transformar dados para o gráfico de pizza
        const { totalReceitas, totalPendentes, totalAtrasados } = result.data.metrics;
        
        setData([
          { name: 'Pagos', value: totalReceitas },
          { name: 'Pendentes', value: totalPendentes },
          { name: 'Atrasados', value: totalAtrasados }
        ]);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados financeiros');
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
        <CardTitle>Status de Pagamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default PaymentStatusChart;
