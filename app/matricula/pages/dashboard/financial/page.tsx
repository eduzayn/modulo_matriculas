import { FinancialSummary } from '@/app/matricula/components/dashboard/financial-summary';
import { PaymentStatusChart } from '@/app/matricula/components/dashboard/payment-status-chart';
import { RecentTransactions } from '@/app/matricula/components/dashboard/recent-transactions';
import { FinancialMetrics } from '@/app/matricula/components/dashboard/financial-metrics';

export default function FinancialDashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Financeiro</h1>
      
      <div className="mb-6">
        <FinancialMetrics />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FinancialSummary />
        <PaymentStatusChart />
      </div>
      
      <div>
        <RecentTransactions />
      </div>
    </div>
  );
}
