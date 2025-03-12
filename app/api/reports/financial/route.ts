import { NextResponse } from 'next/server';
import { reportGenerationService } from '../../../matricula/lib/services/report-generation-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.periodo?.inicio || !body.periodo?.fim) {
      return NextResponse.json(
        { error: 'Período de início e fim são obrigatórios' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would query the database
    // For now, we'll use mock data
    const mockData = {
      matriculas: [
        {
          id: '1',
          aluno: {
            nome: 'João Silva',
            email: 'joao@example.com',
          },
          curso: {
            nome: 'Desenvolvimento Web',
          },
          valor_total: 1000,
          valor_pago: 500,
          status: 'ativa',
          data_matricula: '2023-01-15',
          forma_pagamento: 'cartao',
          parcelas: 4,
        },
        {
          id: '2',
          aluno: {
            nome: 'Maria Souza',
            email: 'maria@example.com',
          },
          curso: {
            nome: 'Design UX/UI',
          },
          valor_total: 1200,
          valor_pago: 1200,
          status: 'concluida',
          data_matricula: '2023-02-10',
          forma_pagamento: 'boleto',
          parcelas: 1,
        },
      ],
      periodo: body.periodo,
    };
    
    // Generate report
    const reportBuffer = await reportGenerationService.generateFinancialReport(mockData);
    
    // Return the report as a downloadable file
    return new NextResponse(reportBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="relatorio-financeiro-${body.periodo.inicio}-${body.periodo.fim}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Error generating financial report:', error);
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
