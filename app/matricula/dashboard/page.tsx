'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveLayout, ResponsiveContainer, ResponsiveHeader } from '../../components/ui/ResponsiveLayout';
import FinancialMetrics from '../components/dashboard/financial-metrics';
import FinancialSummary from '../components/dashboard/financial-summary';
import PaymentStatusChart from '../components/dashboard/payment-status-chart';
import RecentTransactions from '../components/dashboard/recent-transactions';

export default function DashboardPage() {
  return (
    <ResponsiveLayout>
      <ResponsiveContainer>
        <ResponsiveHeader 
          title="Dashboard" 
          subtitle="Visão geral do sistema de matrículas"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <FinancialMetrics />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2">
            <FinancialSummary />
          </div>
          <div>
            <PaymentStatusChart />
          </div>
        </div>
        
        <div className="mt-4">
          <RecentTransactions />
        </div>
      </ResponsiveContainer>
    </ResponsiveLayout>
  );
}
