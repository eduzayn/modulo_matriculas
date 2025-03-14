import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { TrendingUp, TrendingDown } from 'lucide-react';

interface FinancialSummaryProps {
  data: {
    currentMonth: string;
    lastMonth: string;
    percentageChange: number;
    trend: 'up' | 'down';
  };
}

export function FinancialSummary({ data }: FinancialSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo Financeiro</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium">Mês Atual</span>
            <span className="text-3xl font-bold">{data.currentMonth}</span>
          </div>
          
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium">Mês Anterior</span>
            <span className="text-xl font-medium text-gray-500">{data.lastMonth}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {data.trend === 'up' ? (
              <>
                <div className="p-1 bg-green-100 rounded-full">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-600">
                  +{data.percentageChange}% em relação ao mês anterior
                </span>
              </>
            ) : (
              <>
                <div className="p-1 bg-red-100 rounded-full">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-sm font-medium text-red-600">
                  -{data.percentageChange}% em relação ao mês anterior
                </span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
