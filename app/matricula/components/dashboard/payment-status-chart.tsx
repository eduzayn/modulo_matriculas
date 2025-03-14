import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface PaymentStatusChartProps {
  data: {
    paid: number;
    pending: number;
    overdue: number;
  };
}

export function PaymentStatusChart({ data }: PaymentStatusChartProps) {
  const total = data.paid + data.pending + data.overdue;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status de Pagamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Paid segment */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#22c55e"
                strokeWidth="20"
                strokeDasharray={`${(data.paid / total) * 251.2} 251.2`}
                transform="rotate(-90 50 50)"
              />
              
              {/* Pending segment */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#eab308"
                strokeWidth="20"
                strokeDasharray={`${(data.pending / total) * 251.2} 251.2`}
                strokeDashoffset={`${-((data.paid / total) * 251.2)}`}
                transform="rotate(-90 50 50)"
              />
              
              {/* Overdue segment */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#ef4444"
                strokeWidth="20"
                strokeDasharray={`${(data.overdue / total) * 251.2} 251.2`}
                strokeDashoffset={`${-(((data.paid + data.pending) / total) * 251.2)}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Pagos ({data.paid}%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm">Pendentes ({data.pending}%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm">Atrasados ({data.overdue}%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
