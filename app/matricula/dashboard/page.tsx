'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from "@/app/components/ui/responsiveLayout";
import { FinancialMetrics } from '../components/dashboard/financial-metrics';
import { FinancialSummary } from '../components/dashboard/financial-summary';
import { PaymentStatusChart } from '../components/dashboard/payment-status-chart';
import { RecentTransactions } from '../components/dashboard/recent-transactions';

export default function DashboardPage() {
  // Mock data for financial metrics
  const financialMetrics = {
    totalRevenue: 'R$ 125.000,00',
    pendingPayments: 'R$ 15.000,00',
    overduePayments: 'R$ 5.000,00',
    paidInvoices: 85,
  };

  // Mock data for financial summary
  const financialSummary = {
    currentMonth: 'R$ 25.000,00',
    lastMonth: 'R$ 22.500,00',
    percentageChange: 11.1,
    trend: 'up',
  };

  // Mock data for payment status
  const paymentStatus = {
    paid: 65,
    pending: 25,
    overdue: 10,
  };

  // Mock data for recent transactions
  const recentTransactions = [
    { id: 1, student: 'Ana Silva', amount: 'R$ 500,00', date: '05/03/2025', status: 'Pago' },
    { id: 2, student: 'Carlos Oliveira', amount: 'R$ 450,00', date: '10/03/2025', status: 'Pendente' },
    { id: 3, student: 'Mariana Santos', amount: 'R$ 500,00', date: '15/02/2025', status: 'Pago' },
    { id: 4, student: 'Pedro Costa', amount: 'R$ 500,00', date: '20/02/2025', status: 'Pago' },
    { id: 5, student: 'Juliana Lima', amount: 'R$ 450,00', date: '25/02/2025', status: 'Atrasado' },
  ];

  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Dashboard" 
          subtitle="Visão geral do sistema de matrículas"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <FinancialMetrics data={financialMetrics} />
          <FinancialSummary data={financialSummary} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1">
            <PaymentStatusChart data={paymentStatus} />
          </div>
          <div className="md:col-span-2">
            <RecentTransactions data={recentTransactions} />
          </div>
        </div>
      </ResponsiveContainer>
    </ResponsiveLayout>
  );
}
