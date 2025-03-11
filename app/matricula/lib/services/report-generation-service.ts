/**
 * Report Generation Service
 * 
 * Este serviço é responsável por gerar relatórios financeiros em diferentes formatos
 * como Excel e PDF, além de permitir o envio por email.
 */

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { PaymentStatus, TransactionType } from '@/app/matricula/types/financial';
import { NotificationService } from './notification-service';
import ExcelJS from 'exceljs';
import { Readable } from 'stream';

export class ReportGenerationService {
  /**
   * Gera relatório de inadimplência
   */
  static async generateOverdueReport(format = 'excel', options = {}) {
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      const today = new Date().toISOString().split('T')[0];
      
      // Buscar pagamentos vencidos
      const { data: overduePayments, error } = await supabase
        .from('financial.payments')
        .select(`
          id,
          matricula_id,
          valor,
          data_vencimento,
          numero_parcela,
          forma_pagamento,
          matricula:matricula_id (
            aluno_id,
            curso_id,
            aluno:aluno_id (
              nome,
              email,
              telefone
            ),
            curso:curso_id (
              nome
            )
          )
        `)
        .eq('status', PaymentStatus.PENDENTE)
        .lt('data_vencimento', today)
        .order('data_vencimento', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar pagamentos vencidos:', error);
        return { success: false, error };
      }
      
      // Formatar dados para o relatório
      const reportData = (overduePayments || []).map(payment => ({
        id: payment.id,
        aluno: payment.matricula?.aluno?.nome || 'N/A',
        email: payment.matricula?.aluno?.email || 'N/A',
        telefone: payment.matricula?.aluno?.telefone || 'N/A',
        curso: payment.matricula?.curso?.nome || 'N/A',
        parcela: payment.numero_parcela,
        valor: payment.valor,
        vencimento: new Date(payment.data_vencimento).toLocaleDateString('pt-BR'),
        dias_atraso: Math.floor((new Date().getTime() - new Date(payment.data_vencimento).getTime()) / (1000 * 60 * 60 * 24)),
        forma_pagamento: payment.forma_pagamento
      }));
      
      // Calcular estatísticas
      const totalOverdue = reportData.reduce((sum, item) => sum + item.valor, 0);
      const averageDaysOverdue = reportData.length > 0 
        ? reportData.reduce((sum, item) => sum + item.dias_atraso, 0) / reportData.length 
        : 0;
      
      // Agrupar por curso
      const courseGroups = reportData.reduce((groups, item) => {
        const course = item.curso;
        if (!groups[course]) {
          groups[course] = {
            count: 0,
            total: 0
          };
        }
        groups[course].count++;
        groups[course].total += item.valor;
        return groups;
      }, {});
      
      // Gerar arquivo no formato solicitado
      if (format === 'excel') {
        return await this.generateExcelOverdueReport(reportData, courseGroups, totalOverdue, averageDaysOverdue);
      } else if (format === 'pdf') {
        return await this.generatePDFOverdueReport(reportData, courseGroups, totalOverdue, averageDaysOverdue);
      } else {
        return { success: false, error: 'Formato não suportado' };
      }
    } catch (error) {
      console.error('Erro ao gerar relatório de inadimplência:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
  
  /**
   * Gera relatório de fluxo de caixa
   */
  static async generateCashFlowReport(startDate, endDate, format = 'excel') {
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      
      // Buscar transações no período
      const { data: transactions, error } = await supabase
        .from('financial.transactions')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar transações:', error);
        return { success: false, error };
      }
      
      // Formatar dados para o relatório
      const reportData = (transactions || []).map(transaction => ({
        id: transaction.id,
        data: new Date(transaction.created_at).toLocaleDateString('pt-BR'),
        tipo: transaction.type,
        valor: transaction.amount,
        status: transaction.status,
        metodo_pagamento: transaction.payment_method,
        referencia: transaction.reference_id
      }));
      
      // Calcular estatísticas
      const totalIncome = reportData
        .filter(t => t.tipo === TransactionType.PAGAMENTO)
        .reduce((sum, item) => sum + item.valor, 0);
      
      const totalExpense = reportData
        .filter(t => t.tipo === TransactionType.ESTORNO)
        .reduce((sum, item) => sum + item.valor, 0);
      
      const netCashFlow = totalIncome - totalExpense;
      
      // Agrupar por tipo de transação
      const typeGroups = reportData.reduce((groups, item) => {
        const type = item.tipo;
        if (!groups[type]) {
          groups[type] = {
            count: 0,
            total: 0
          };
        }
        groups[type].count++;
        groups[type].total += item.valor;
        return groups;
      }, {});
      
      // Agrupar por método de pagamento
      const methodGroups = reportData.reduce((groups, item) => {
        const method = item.metodo_pagamento;
        if (!groups[method]) {
          groups[method] = {
            count: 0,
            total: 0
          };
        }
        groups[method].count++;
        groups[method].total += item.valor;
        return groups;
      }, {});
      
      // Gerar arquivo no formato solicitado
      if (format === 'excel') {
        return await this.generateExcelCashFlowReport(
          reportData, 
          typeGroups, 
          methodGroups, 
          totalIncome, 
          totalExpense, 
          netCashFlow,
          startDate,
          endDate
        );
      } else if (format === 'pdf') {
        return await this.generatePDFCashFlowReport(
          reportData, 
          typeGroups, 
          methodGroups, 
          totalIncome, 
          totalExpense, 
          netCashFlow,
          startDate,
          endDate
        );
      } else {
        return { success: false, error: 'Formato não suportado' };
      }
    } catch (error) {
      console.error('Erro ao gerar relatório de fluxo de caixa:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
  
  /**
   * Gera relatório de projeção financeira
   */
  static async generateFinancialProjectionReport(months = 6, format = 'excel') {
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      const today = new Date();
      
      // Buscar pagamentos futuros
      const { data: futurePayments, error } = await supabase
        .from('financial.payments')
        .select(`
          id,
          valor,
          data_vencimento,
          status
        `)
        .gte('data_vencimento', today.toISOString().split('T')[0])
        .order('data_vencimento', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar pagamentos futuros:', error);
        return { success: false, error };
      }
      
      // Calcular projeções mensais
      const projections = [];
      for (let i = 0; i < months; i++) {
        const month = new Date(today);
        month.setMonth(month.getMonth() + i);
        const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
        const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        
        // Filtrar pagamentos do mês
        const monthPayments = (futurePayments || []).filter(payment => {
          const paymentDate = new Date(payment.data_vencimento);
          return paymentDate >= monthStart && paymentDate <= monthEnd;
        });
        
        // Calcular valores
        const expectedIncome = monthPayments.reduce((sum, payment) => sum + payment.valor, 0);
        const expectedPaymentCount = monthPayments.length;
        
        // Adicionar à projeção
        projections.push({
          mes: `${month.getMonth() + 1}/${month.getFullYear()}`,
          receita_prevista: expectedIncome,
          quantidade_pagamentos: expectedPaymentCount,
          mes_inicio: monthStart.toISOString().split('T')[0],
          mes_fim: monthEnd.toISOString().split('T')[0]
        });
      }
      
      // Gerar arquivo no formato solicitado
      if (format === 'excel') {
        return await this.generateExcelProjectionReport(projections);
      } else if (format === 'pdf') {
        return await this.generatePDFProjectionReport(projections);
      } else {
        return { success: false, error: 'Formato não suportado' };
      }
    } catch (error) {
      console.error('Erro ao gerar relatório de projeção financeira:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
  
  /**
   * Gera arquivo Excel para relatório de inadimplência
   */
  private static async generateExcelOverdueReport(data, courseGroups, totalOverdue, averageDaysOverdue) {
    try {
      const workbook = new ExcelJS.Workbook();
      
      // Planilha de resumo
      const summarySheet = workbook.addWorksheet('Resumo');
      
      summarySheet.columns = [
        { header: 'Métrica', key: 'metric', width: 30 },
        { header: 'Valor', key: 'value', width: 20 }
      ];
      
      summarySheet.addRows([
        { metric: 'Total de Pagamentos Vencidos', value: data.length },
        { metric: 'Valor Total em Atraso (R$)', value: totalOverdue.toFixed(2) },
        { metric: 'Média de Dias em Atraso', value: averageDaysOverdue.toFixed(1) }
      ]);
      
      // Adicionar dados por curso
      summarySheet.addRow({});
      summarySheet.addRow({ metric: 'Distribuição por Curso', value: '' });
      
      Object.entries(courseGroups).forEach(([course, stats]) => {
        summarySheet.addRow({
          metric: course,
          value: `${stats.count} pagamentos - R$ ${stats.total.toFixed(2)}`
        });
      });
      
      // Estilizar cabeçalho
      summarySheet.getRow(1).font = { bold: true };
      summarySheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
      
      // Planilha de detalhes
      const detailsSheet = workbook.addWorksheet('Detalhes');
      
      // Adicionar cabeçalho
      detailsSheet.columns = [
        { header: 'ID', key: 'id', width: 36 },
        { header: 'Aluno', key: 'aluno', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Telefone', key: 'telefone', width: 20 },
        { header: 'Curso', key: 'curso', width: 30 },
        { header: 'Parcela', key: 'parcela', width: 10 },
        { header: 'Valor (R$)', key: 'valor', width: 15 },
        { header: 'Vencimento', key: 'vencimento', width: 15 },
        { header: 'Dias em Atraso', key: 'dias_atraso', width: 15 },
        { header: 'Forma de Pagamento', key: 'forma_pagamento', width: 20 }
      ];
      
      // Adicionar dados
      detailsSheet.addRows(data);
      
      // Estilizar cabeçalho
      detailsSheet.getRow(1).font = { bold: true };
      detailsSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
      
      // Formatar valores monetários
      detailsSheet.getColumn('valor').numFmt = 'R$ #,##0.00';
      
      // Gerar buffer
      const buffer = await workbook.xlsx.writeBuffer();
      
      return {
        success: true,
        data: {
          buffer,
          filename: `relatorio-inadimplencia-${new Date().toISOString().split('T')[0]}.xlsx`,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      };
    } catch (error) {
      console.error('Erro ao gerar relatório Excel de inadimplência:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
  
  /**
   * Gera arquivo Excel para relatório de fluxo de caixa
   */
  private static async generateExcelCashFlowReport(
    data, 
    typeGroups, 
    methodGroups, 
    totalIncome, 
    totalExpense, 
    netCashFlow,
    startDate,
    endDate
  ) {
    try {
      const workbook = new ExcelJS.Workbook();
      
      // Planilha de resumo
      const summarySheet = workbook.addWorksheet('Resumo');
      
      summarySheet.columns = [
        { header: 'Métrica', key: 'metric', width: 30 },
        { header: 'Valor', key: 'value', width: 20 }
      ];
      
      summarySheet.addRows([
        { metric: 'Período', value: `${startDate} a ${endDate}` },
        { metric: 'Total de Transações', value: data.length },
        { metric: 'Receita Total (R$)', value: totalIncome.toFixed(2) },
        { metric: 'Despesa Total (R$)', value: totalExpense.toFixed(2) },
        { metric: 'Fluxo de Caixa Líquido (R$)', value: netCashFlow.toFixed(2) }
      ]);
      
      // Adicionar dados por tipo de transação
      summarySheet.addRow({});
      summarySheet.addRow({ metric: 'Distribuição por Tipo', value: '' });
      
      Object.entries(typeGroups).forEach(([type, stats]) => {
        summarySheet.addRow({
          metric: type,
          value: `${stats.count} transações - R$ ${stats.total.toFixed(2)}`
        });
      });
      
      // Adicionar dados por método de pagamento
      summarySheet.addRow({});
      summarySheet.addRow({ metric: 'Distribuição por Método', value: '' });
      
      Object.entries(methodGroups).forEach(([method, stats]) => {
        summarySheet.addRow({
          metric: method || 'N/A',
          value: `${stats.count} transações - R$ ${stats.total.toFixed(2)}`
        });
      });
      
      // Estilizar cabeçalho
      summarySheet.getRow(1).font = { bold: true };
      summarySheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
      
      // Planilha de detalhes
      const detailsSheet = workbook.addWorksheet('Detalhes');
      
      // Adicionar cabeçalho
      detailsSheet.columns = [
        { header: 'ID', key: 'id', width: 36 },
        { header: 'Data', key: 'data', width: 15 },
        { header: 'Tipo', key: 'tipo', width: 20 },
        { header: 'Valor (R$)', key: 'valor', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Método de Pagamento', key: 'metodo_pagamento', width: 25 },
        { header: 'Referência', key: 'referencia', width: 36 }
      ];
      
      // Adicionar dados
      detailsSheet.addRows(data);
      
      // Estilizar cabeçalho
      detailsSheet.getRow(1).font = { bold: true };
      detailsSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
      
      // Formatar valores monetários
      detailsSheet.getColumn('valor').numFmt = 'R$ #,##0.00';
      
      // Gerar buffer
      const buffer = await workbook.xlsx.writeBuffer();
      
      return {
        success: true,
        data: {
          buffer,
          filename: `relatorio-fluxo-caixa-${startDate}-a-${endDate}.xlsx`,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      };
    } catch (error) {
      console.error('Erro ao gerar relatório Excel de fluxo de caixa:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
  
  /**
   * Gera arquivo Excel para relatório de projeção financeira
   */
  private static async generateExcelProjectionReport(projections) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Projeção Financeira');
      
      // Adicionar cabeçalho
      worksheet.columns = [
        { header: 'Mês', key: 'mes', width: 15 },
        { header: 'Receita Prevista (R$)', key: 'receita_prevista', width: 20 },
        { header: 'Quantidade de Pagamentos', key: 'quantidade_pagamentos', width: 25 }
      ];
      
      // Adicionar dados
      worksheet.addRows(projections);
      
      // Estilizar cabeçalho
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
      
      // Formatar valores monetários
      worksheet.getColumn('receita_prevista').numFmt = 'R$ #,##0.00';
      
      // Gerar buffer
      const buffer = await workbook.xlsx.writeBuffer();
      
      return {
        success: true,
        data: {
          buffer,
          filename: `projecao-financeira-${new Date().toISOString().split('T')[0]}.xlsx`,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      };
    } catch (error) {
      console.error('Erro ao gerar relatório Excel de projeção financeira:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
  
  /**
   * Gera arquivo PDF para relatório de inadimplência
   */
  private static async generatePDFOverdueReport(data, courseGroups, totalOverdue, averageDaysOverdue) {
    try {
      // Placeholder para implementação real de geração de PDF
      // Em uma implementação real, usaríamos uma biblioteca como PDFKit
      
      // Simulando um buffer de PDF
      const buffer = Buffer.from(`
        Relatório de Inadimplência
        Data: ${new Date().toLocaleDateString('pt-BR')}
        
        Resumo:
        - Total de Pagamentos Vencidos: ${data.length}
        - Valor Total em Atraso: R$ ${totalOverdue.toFixed(2)}
        - Média de Dias em Atraso: ${averageDaysOverdue.toFixed(1)}
        
        Distribuição por Curso:
        ${Object.entries(courseGroups).map(([course, stats]) => 
          `- ${course}: ${stats.count} pagamentos - R$ ${stats.total.toFixed(2)}`
        ).join('\n')}
        
        Detalhes dos Pagamentos Vencidos:
        ${data.map(item => 
          `- Aluno: ${item.aluno}, Curso: ${item.curso}, Parcela: ${item.parcela}, Valor: R$ ${item.valor.toFixed(2)}, Vencimento: ${item.vencimento}, Dias em Atraso: ${item.dias_atraso}`
        ).join('\n')}
      `);
      
      return {
        success: true,
        data: {
          buffer,
          filename: `relatorio-inadimplencia-${new Date().toISOString().split('T')[0]}.pdf`,
          contentType: 'application/pdf'
        }
      };
    } catch (error) {
      console.error('Erro ao gerar relatório PDF de inadimplência:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
  
  /**
   * Gera arquivo PDF para relatório de fluxo de caixa
   */
  private static async generatePDFCashFlowReport(
    data, 
    typeGroups, 
    methodGroups, 
    totalIncome, 
    totalExpense, 
    netCashFlow,
    startDate,
    endDate
  ) {
    try {
      // Placeholder para implementação real de geração de PDF
      // Em uma implementação real, usaríamos uma biblioteca como PDFKit
      
      // Simulando um buffer de PDF
      const buffer = Buffer.from(`
        Relatório de Fluxo de Caixa
        Período: ${startDate} a ${endDate}
        Data de Geração: ${new Date().toLocaleDateString('pt-BR')}
        
        Resumo:
        - Total de Transações: ${data.length}
        - Receita Total: R$ ${totalIncome.toFixed(2)}
        - Despesa Total: R$ ${totalExpense.toFixed(2)}
        - Fluxo de Caixa Líquido: R$ ${netCashFlow.toFixed(2)}
        
        Distribuição por Tipo:
        ${Object.entries(typeGroups).map(([type, stats]) => 
          `- ${type}: ${stats.count} transações - R$ ${stats.total.toFixed(2)}`
        ).join('\n')}
        
        Distribuição por Método de Pagamento:
        ${Object.entries(methodGroups).map(([method, stats]) => 
          `- ${method || 'N/A'}: ${stats.count} transações - R$ ${stats.total.toFixed(2)}`
        ).join('\n')}
        
        Detalhes das Transações:
        ${data.map(item => 
          `- Data: ${item.data}, Tipo: ${item.tipo}, Valor: R$ ${item.valor.toFixed(2)}, Status: ${item.status}, Método: ${item.metodo_pagamento || 'N/A'}`
        ).join('\n')}
      `);
      
      return {
        success: true,
        data: {
          buffer,
          filename: `relatorio-fluxo-caixa-${startDate}-a-${endDate}.pdf`,
          contentType: 'application/pdf'
        }
      };
    } catch (error) {
      console.error('Erro ao gerar relatório PDF de fluxo de caixa:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
  
  /**
   * Gera arquivo PDF para relatório de projeção financeira
   */
  private static async generatePDFProjectionReport(projections) {
    try {
      // Placeholder para implementação real de geração de PDF
      // Em uma implementação real, usaríamos uma biblioteca como PDFKit
      
      // Simulando um buffer de PDF
      const buffer = Buffer.from(`
        Relatório de Projeção Financeira
        Data de Geração: ${new Date().toLocaleDateString('pt-BR')}
        
        Projeções Mensais:
        ${projections.map(item => 
          `- Mês: ${item.mes}, Receita Prevista: R$ ${item.receita_prevista.toFixed(2)}, Quantidade de Pagamentos: ${item.quantidade_pagamentos}`
        ).join('\n')}
      `);
      
      return {
        success: true,
        data: {
          buffer,
          filename: `projecao-financeira-${new Date().toISOString().split('T')[0]}.pdf`,
          contentType: 'application/pdf'
        }
      };
    } catch (error) {
      console.error('Erro ao gerar relatório PDF de projeção financeira:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
  
  /**
   * Envia relatório por email
   */
  static async sendReportByEmail(reportResult, recipient, subject, body) {
    if (!reportResult.success) {
      return { success: false, error: 'Falha ao gerar relatório' };
    }
    
    try {
      const { buffer, filename, contentType } = reportResult.data;
      
      // Enviar email com anexo
      const emailResult = await NotificationService.sendEmail({
        recipient,
        subject,
        body: body || `Segue em anexo o relatório solicitado.\n\nAtenciosamente,\nEquipe Edunexia`,
        attachments: [
          {
            filename,
            content: buffer,
            contentType
          }
        ]
      });
      
      return emailResult;
    } catch (error) {
      console.error('Erro ao enviar relatório por email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
}

export default ReportGenerationService;
