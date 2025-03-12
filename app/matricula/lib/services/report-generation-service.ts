// Simplified report generation service
import ExcelJS from 'exceljs';

export interface FinancialReportData {
  matriculas: {
    id: string;
    aluno: {
      nome: string;
      email: string;
    };
    curso: {
      nome: string;
    };
    valor_total: number;
    valor_pago: number;
    status: string;
    data_matricula: string;
    forma_pagamento: string;
    parcelas: number;
  }[];
  periodo: {
    inicio: string;
    fim: string;
  };
}

export interface EnrollmentReportData {
  matriculas: {
    id: string;
    aluno: {
      nome: string;
      email: string;
    };
    curso: {
      nome: string;
    };
    status: string;
    data_matricula: string;
    data_inicio: string;
    data_termino?: string;
  }[];
  periodo: {
    inicio: string;
    fim: string;
  };
}

export const reportGenerationService = {
  /**
   * Generate a financial report
   */
  generateFinancialReport: async (data: FinancialReportData): Promise<Buffer> => {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Edunexia';
    workbook.lastModifiedBy = 'Edunexia';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    // Add a worksheet
    const worksheet = workbook.addWorksheet('Relatório Financeiro');
    
    // Add headers
    worksheet.columns = [
      { header: 'ID Matrícula', key: 'id', width: 20 },
      { header: 'Aluno', key: 'aluno', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Curso', key: 'curso', width: 30 },
      { header: 'Valor Total', key: 'valorTotal', width: 15 },
      { header: 'Valor Pago', key: 'valorPago', width: 15 },
      { header: 'Valor Pendente', key: 'valorPendente', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Data Matrícula', key: 'dataMatricula', width: 15 },
      { header: 'Forma Pagamento', key: 'formaPagamento', width: 15 },
      { header: 'Parcelas', key: 'parcelas', width: 10 },
    ];
    
    // Add title and period
    worksheet.mergeCells('A1:K1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Relatório Financeiro - Edunexia';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center' };
    
    worksheet.mergeCells('A2:K2');
    const periodCell = worksheet.getCell('A2');
    periodCell.value = `Período: ${data.periodo.inicio} a ${data.periodo.fim}`;
    periodCell.font = { size: 12, bold: false };
    periodCell.alignment = { horizontal: 'center' };
    
    // Add empty row
    worksheet.addRow([]);
    
    // Style the header row
    worksheet.getRow(4).font = { bold: true };
    worksheet.getRow(4).alignment = { horizontal: 'center' };
    
    // Add data
    data.matriculas.forEach(matricula => {
      worksheet.addRow({
        id: matricula.id,
        aluno: matricula.aluno.nome,
        email: matricula.aluno.email,
        curso: matricula.curso.nome,
        valorTotal: matricula.valor_total,
        valorPago: matricula.valor_pago,
        valorPendente: matricula.valor_total - matricula.valor_pago,
        status: matricula.status,
        dataMatricula: matricula.data_matricula,
        formaPagamento: matricula.forma_pagamento,
        parcelas: matricula.parcelas,
      });
    });
    
    // Format currency columns
    worksheet.getColumn('valorTotal').numFmt = '"R$ "#,##0.00';
    worksheet.getColumn('valorPago').numFmt = '"R$ "#,##0.00';
    worksheet.getColumn('valorPendente').numFmt = '"R$ "#,##0.00';
    
    // Add summary
    const totalRow = worksheet.rowCount + 2;
    worksheet.mergeCells(`A${totalRow}:D${totalRow}`);
    worksheet.getCell(`A${totalRow}`).value = 'Total:';
    worksheet.getCell(`A${totalRow}`).font = { bold: true };
    worksheet.getCell(`A${totalRow}`).alignment = { horizontal: 'right' };
    
    // Calculate totals
    const totalValorTotal = data.matriculas.reduce((sum, item) => sum + item.valor_total, 0);
    const totalValorPago = data.matriculas.reduce((sum, item) => sum + item.valor_pago, 0);
    const totalValorPendente = totalValorTotal - totalValorPago;
    
    worksheet.getCell(`E${totalRow}`).value = totalValorTotal;
    worksheet.getCell(`E${totalRow}`).numFmt = '"R$ "#,##0.00';
    worksheet.getCell(`E${totalRow}`).font = { bold: true };
    
    worksheet.getCell(`F${totalRow}`).value = totalValorPago;
    worksheet.getCell(`F${totalRow}`).numFmt = '"R$ "#,##0.00';
    worksheet.getCell(`F${totalRow}`).font = { bold: true };
    
    worksheet.getCell(`G${totalRow}`).value = totalValorPendente;
    worksheet.getCell(`G${totalRow}`).numFmt = '"R$ "#,##0.00';
    worksheet.getCell(`G${totalRow}`).font = { bold: true };
    
    // Write to buffer
    return await workbook.xlsx.writeBuffer();
  },
  
  /**
   * Generate an enrollment report
   */
  generateEnrollmentReport: async (data: EnrollmentReportData): Promise<Buffer> => {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Edunexia';
    workbook.lastModifiedBy = 'Edunexia';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    // Add a worksheet
    const worksheet = workbook.addWorksheet('Relatório de Matrículas');
    
    // Add headers
    worksheet.columns = [
      { header: 'ID Matrícula', key: 'id', width: 20 },
      { header: 'Aluno', key: 'aluno', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Curso', key: 'curso', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Data Matrícula', key: 'dataMatricula', width: 15 },
      { header: 'Data Início', key: 'dataInicio', width: 15 },
      { header: 'Data Término', key: 'dataTermino', width: 15 },
    ];
    
    // Add title and period
    worksheet.mergeCells('A1:H1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Relatório de Matrículas - Edunexia';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center' };
    
    worksheet.mergeCells('A2:H2');
    const periodCell = worksheet.getCell('A2');
    periodCell.value = `Período: ${data.periodo.inicio} a ${data.periodo.fim}`;
    periodCell.font = { size: 12, bold: false };
    periodCell.alignment = { horizontal: 'center' };
    
    // Add empty row
    worksheet.addRow([]);
    
    // Style the header row
    worksheet.getRow(4).font = { bold: true };
    worksheet.getRow(4).alignment = { horizontal: 'center' };
    
    // Add data
    data.matriculas.forEach(matricula => {
      worksheet.addRow({
        id: matricula.id,
        aluno: matricula.aluno.nome,
        email: matricula.aluno.email,
        curso: matricula.curso.nome,
        status: matricula.status,
        dataMatricula: matricula.data_matricula,
        dataInicio: matricula.data_inicio,
        dataTermino: matricula.data_termino || 'N/A',
      });
    });
    
    // Add summary
    const totalRow = worksheet.rowCount + 2;
    worksheet.mergeCells(`A${totalRow}:C${totalRow}`);
    worksheet.getCell(`A${totalRow}`).value = 'Total de Matrículas:';
    worksheet.getCell(`A${totalRow}`).font = { bold: true };
    worksheet.getCell(`A${totalRow}`).alignment = { horizontal: 'right' };
    
    worksheet.getCell(`D${totalRow}`).value = data.matriculas.length;
    worksheet.getCell(`D${totalRow}`).font = { bold: true };
    
    // Count by status
    const statusCounts: Record<string, number> = {};
    data.matriculas.forEach(matricula => {
      statusCounts[matricula.status] = (statusCounts[matricula.status] || 0) + 1;
    });
    
    let rowIndex = totalRow + 2;
    worksheet.mergeCells(`A${rowIndex}:C${rowIndex}`);
    worksheet.getCell(`A${rowIndex}`).value = 'Matrículas por Status:';
    worksheet.getCell(`A${rowIndex}`).font = { bold: true };
    worksheet.getCell(`A${rowIndex}`).alignment = { horizontal: 'right' };
    
    Object.entries(statusCounts).forEach(([status, count], index) => {
      rowIndex = totalRow + 3 + index;
      worksheet.mergeCells(`A${rowIndex}:C${rowIndex}`);
      worksheet.getCell(`A${rowIndex}`).value = `${status}:`;
      worksheet.getCell(`A${rowIndex}`).alignment = { horizontal: 'right' };
      
      worksheet.getCell(`D${rowIndex}`).value = count;
    });
    
    // Write to buffer
    return await workbook.xlsx.writeBuffer();
  },
};
