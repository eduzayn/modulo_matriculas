import { NextResponse } from 'next/server';

// Force static generation
export const dynamic = 'force-static';

export async function GET() {
  // Mock data for financial summary
  const mockData = {
    metrics: {
      totalReceitas: 124500,
      totalPendentes: 45750,
      totalAtrasados: 12300,
      taxaInadimplencia: 10
    },
    monthlyData: [
      { month: 'Jan', receitas: 38000, pendentes: 12000, atrasados: 5000 },
      { month: 'Fev', receitas: 42000, pendentes: 15000, atrasados: 6000 },
      { month: 'Mar', receitas: 45000, pendentes: 18000, atrasados: 7000 },
      { month: 'Abr', receitas: 48000, pendentes: 16000, atrasados: 5500 },
      { month: 'Mai', receitas: 52000, pendentes: 14000, atrasados: 4800 },
      { month: 'Jun', receitas: 55000, pendentes: 12500, atrasados: 4200 }
    ],
    recentPayments: [
      { aluno: 'Ana Silva', curso: 'Desenvolvimento Web', data: '15/03/2025', valor: 1200, forma_pagamento: 'Cartão de Crédito' },
      { aluno: 'Carlos Oliveira', curso: 'Data Science', data: '14/03/2025', valor: 1500, forma_pagamento: 'Boleto' },
      { aluno: 'Mariana Santos', curso: 'UX/UI Design', data: '12/03/2025', valor: 950, forma_pagamento: 'PIX' },
      { aluno: 'Rafael Costa', curso: 'Marketing Digital', data: '10/03/2025', valor: 1350, forma_pagamento: 'Cartão de Crédito' },
      { aluno: 'Juliana Lima', curso: 'Gestão de Projetos', data: '08/03/2025', valor: 1100, forma_pagamento: 'Boleto' }
    ]
  };

  return NextResponse.json({
    success: true,
    data: mockData
  });
}
