import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { DollarSign, AlertTriangle, Clock } from 'lucide-react';

interface FinancialMetricsProps {
  data: {
    totalRevenue: string;
    pendingPayments: string;
    overduePayments: string;
    paidInvoices: number;
  };
}

export function FinancialMetrics({ data }: FinancialMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas Financeiras</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-full">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm font-medium">Receita Total</span>
            </div>
            <span className="text-2xl font-bold">{data.totalRevenue}</span>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <span className="text-sm font-medium">Pagamentos Pendentes</span>
            </div>
            <span className="text-2xl font-bold">{data.pendingPayments}</span>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <span className="text-sm font-medium">Pagamentos Atrasados</span>
            </div>
            <span className="text-2xl font-bold">{data.overduePayments}</span>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Faturas Pagas</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{data.paidInvoices}%</span>
              <div className="ml-2 w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${data.paidInvoices}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
