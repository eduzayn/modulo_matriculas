import { FinancialSummary } from '@/app/matricula/components/dashboard/financial-summary';
import { PaymentStatusChart } from '@/app/matricula/components/dashboard/payment-status-chart';
import { RecentTransactions } from '@/app/matricula/components/dashboard/recent-transactions';
import { FinancialMetrics } from '@/app/matricula/components/dashboard/financial-metrics';

export default function FinancialDashboardPage() {
  // Mock data for financial metrics
  const metricsData = {
    totalRevenue: 'R$ 124.500,00',
    pendingPayments: 'R$ 45.750,00',
    overduePayments: 'R$ 12.300,00',
    paidInvoices: 68
  };

  // Mock data for financial summary
  const summaryData = {
    currentMonth: 'R$ 42.800,00',
    lastMonth: 'R$ 38.200,00',
    percentageChange: 12,
    trend: 'up' as const
  };

  // Mock data for payment status chart
  const chartData = {
    paid: 68,
    pending: 22,
    overdue: 10
  };

  // Mock data for recent transactions
  const transactionsData = [
    {
      id: 1,
      student: 'Ana Silva',
      amount: 'R$ 1.200,00',
      date: '15/03/2025',
      status: 'Pago'
    },
    {
      id: 2,
      student: 'Carlos Oliveira',
      amount: 'R$ 1.500,00',
      date: '14/03/2025',
      status: 'Pago'
    },
    {
      id: 3,
      student: 'Mariana Santos',
      amount: 'R$ 950,00',
      date: '12/03/2025',
      status: 'Pendente'
    },
    {
      id: 4,
      student: 'Rafael Costa',
      amount: 'R$ 1.350,00',
      date: '10/03/2025',
      status: 'Atrasado'
    },
    {
      id: 5,
      student: 'Juliana Lima',
      amount: 'R$ 1.100,00',
      date: '08/03/2025',
      status: 'Pago'
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Financeiro</h1>
      
      <div className="mb-6">
        <FinancialMetrics data={metricsData} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FinancialSummary data={summaryData} />
        <PaymentStatusChart data={chartData} />
      </div>
      
      <div>
        <RecentTransactions data={transactionsData} />
      </div>
    </div>
  );
}
