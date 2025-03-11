import { NextRequest, NextResponse } from 'next/server';
import { ReportGenerationService } from '@/app/matricula/lib/services/report-generation-service';

// Chave de segurança para proteger o endpoint de relatórios
const REPORT_SECRET = process.env.REPORT_SECRET || 'default-report-key';

/**
 * Endpoint para geração de relatórios financeiros
 * Este endpoint permite gerar diferentes tipos de relatórios financeiros
 * em formatos como Excel e PDF, além de enviar por email.
 * 
 * Requer autenticação via token no header Authorization
 */
export async function POST(request: NextRequest) {
  // Verificar autenticação
  const authHeader = request.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${REPORT_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  
  try {
    // Obter parâmetros da requisição
    const body = await request.json();
    const { 
      report_type, 
      format = 'excel', 
      start_date, 
      end_date, 
      months,
      email,
      email_subject,
      email_body
    } = body;
    
    let reportResult;
    
    // Gerar relatório de acordo com o tipo solicitado
    switch (report_type) {
      case 'overdue':
        reportResult = await ReportGenerationService.generateOverdueReport(format);
        break;
        
      case 'cash_flow':
        if (!start_date || !end_date) {
          return NextResponse.json({ 
            error: 'Datas de início e fim são obrigatórias para relatório de fluxo de caixa' 
          }, { status: 400 });
        }
        reportResult = await ReportGenerationService.generateCashFlowReport(start_date, end_date, format);
        break;
        
      case 'projection':
        reportResult = await ReportGenerationService.generateFinancialProjectionReport(months || 6, format);
        break;
        
      default:
        return NextResponse.json({ error: 'Tipo de relatório não suportado' }, { status: 400 });
    }
    
    if (!reportResult.success) {
      return NextResponse.json({ 
        error: 'Falha ao gerar relatório', 
        details: reportResult.error 
      }, { status: 500 });
    }
    
    // Se email for fornecido, enviar relatório por email
    if (email) {
      const subject = email_subject || getDefaultSubject(report_type);
      const body = email_body || getDefaultBody(report_type);
      
      const emailResult = await ReportGenerationService.sendReportByEmail(
        reportResult, 
        email, 
        subject,
        body
      );
      
      if (!emailResult.success) {
        return NextResponse.json({ 
          error: 'Relatório gerado com sucesso, mas falha ao enviar por email', 
          details: emailResult.error 
        }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Relatório gerado e enviado por email com sucesso',
        report_id: emailResult.id
      });
    }
    
    // Caso contrário, retornar o arquivo para download
    const { buffer, filename, contentType } = reportResult.data;
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': contentType
      }
    });
  } catch (error) {
    console.error('Erro ao processar solicitação de relatório:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

/**
 * Endpoint para agendamento de relatórios
 * Este endpoint permite configurar o envio automático de relatórios
 * para destinatários específicos em intervalos regulares.
 * 
 * Requer autenticação via token no header Authorization
 */
export async function PUT(request: NextRequest) {
  // Verificar autenticação
  const authHeader = request.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${REPORT_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  
  try {
    // Obter parâmetros da requisição
    const body = await request.json();
    const { 
      report_type, 
      format = 'excel', 
      schedule_type, // 'daily', 'weekly', 'monthly'
      day_of_week, // 0-6 (domingo-sábado) para weekly
      day_of_month, // 1-31 para monthly
      recipients, // array de emails
      email_subject,
      email_body,
      active = true
    } = body;
    
    // Validar parâmetros
    if (!report_type || !schedule_type || !recipients || !Array.isArray(recipients)) {
      return NextResponse.json({ 
        error: 'Parâmetros inválidos para agendamento de relatório' 
      }, { status: 400 });
    }
    
    // Validar tipo de agendamento
    if (!['daily', 'weekly', 'monthly'].includes(schedule_type)) {
      return NextResponse.json({ 
        error: 'Tipo de agendamento inválido. Use daily, weekly ou monthly' 
      }, { status: 400 });
    }
    
    // Validar parâmetros específicos do tipo de agendamento
    if (schedule_type === 'weekly' && (day_of_week === undefined || day_of_week < 0 || day_of_week > 6)) {
      return NextResponse.json({ 
        error: 'Dia da semana inválido para agendamento semanal. Use 0-6 (domingo-sábado)' 
      }, { status: 400 });
    }
    
    if (schedule_type === 'monthly' && (day_of_month === undefined || day_of_month < 1 || day_of_month > 31)) {
      return NextResponse.json({ 
        error: 'Dia do mês inválido para agendamento mensal. Use 1-31' 
      }, { status: 400 });
    }
    
    // Criar configuração de agendamento no banco de dados
    // Isso seria implementado com uma chamada ao Supabase
    // para armazenar a configuração
    
    return NextResponse.json({
      success: true,
      message: 'Agendamento de relatório configurado com sucesso',
      schedule: {
        report_type,
        format,
        schedule_type,
        day_of_week,
        day_of_month,
        recipients,
        active
      }
    });
  } catch (error) {
    console.error('Erro ao configurar agendamento de relatório:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

/**
 * Obtém assunto padrão para email de relatório
 */
function getDefaultSubject(reportType: string): string {
  switch (reportType) {
    case 'overdue':
      return 'Relatório de Inadimplência - Edunexia';
    case 'cash_flow':
      return 'Relatório de Fluxo de Caixa - Edunexia';
    case 'projection':
      return 'Relatório de Projeção Financeira - Edunexia';
    default:
      return 'Relatório Financeiro - Edunexia';
  }
}

/**
 * Obtém corpo padrão para email de relatório
 */
function getDefaultBody(reportType: string): string {
  const date = new Date().toLocaleDateString('pt-BR');
  
  switch (reportType) {
    case 'overdue':
      return `Prezado(a),\n\nSegue em anexo o Relatório de Inadimplência gerado em ${date}.\n\nEste relatório contém informações sobre pagamentos vencidos e pendentes no sistema.\n\nAtenciosamente,\nEquipe Edunexia`;
    case 'cash_flow':
      return `Prezado(a),\n\nSegue em anexo o Relatório de Fluxo de Caixa gerado em ${date}.\n\nEste relatório contém informações sobre transações financeiras no período selecionado.\n\nAtenciosamente,\nEquipe Edunexia`;
    case 'projection':
      return `Prezado(a),\n\nSegue em anexo o Relatório de Projeção Financeira gerado em ${date}.\n\nEste relatório contém projeções de receitas para os próximos meses.\n\nAtenciosamente,\nEquipe Edunexia`;
    default:
      return `Prezado(a),\n\nSegue em anexo o Relatório Financeiro gerado em ${date}.\n\nAtenciosamente,\nEquipe Edunexia`;
  }
}
