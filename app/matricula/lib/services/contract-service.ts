// Simplified contract service
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface ContractData {
  matriculaId: string;
  alunoNome: string;
  cursoNome: string;
  valorTotal: number;
  dataInicio: string;
  dataTermino?: string;
}

export const contractService = {
  /**
   * Generate a contract PDF for a matricula
   */
  generateContract: async (data: ContractData): Promise<Uint8Array> => {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add a page to the document
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    
    // Get the standard font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Set font size and line height
    const fontSize = 12;
    const lineHeight = 20;
    
    // Draw the header
    page.drawText('CONTRATO DE MATRÍCULA', {
      x: 50,
      y: 800,
      size: 18,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    // Draw the contract content
    page.drawText(`Matrícula ID: ${data.matriculaId}`, {
      x: 50,
      y: 760,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`Aluno: ${data.alunoNome}`, {
      x: 50,
      y: 760 - lineHeight,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`Curso: ${data.cursoNome}`, {
      x: 50,
      y: 760 - lineHeight * 2,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`Valor Total: R$ ${data.valorTotal.toFixed(2)}`, {
      x: 50,
      y: 760 - lineHeight * 3,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`Data de Início: ${data.dataInicio}`, {
      x: 50,
      y: 760 - lineHeight * 4,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    
    if (data.dataTermino) {
      page.drawText(`Data de Término: ${data.dataTermino}`, {
        x: 50,
        y: 760 - lineHeight * 5,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }
    
    // Add contract terms
    page.drawText('TERMOS E CONDIÇÕES', {
      x: 50,
      y: 600,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    page.drawText('Este contrato estabelece os termos e condições para a matrícula do aluno no curso.', {
      x: 50,
      y: 580,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    
    // Add signature fields
    page.drawText('Assinatura do Aluno: _______________________________', {
      x: 50,
      y: 300,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    
    page.drawText('Assinatura da Instituição: _______________________________', {
      x: 50,
      y: 250,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`Data: ${new Date().toLocaleDateString('pt-BR')}`, {
      x: 50,
      y: 200,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    
    // Serialize the PDF to bytes
    return await pdfDoc.save();
  },
  
  /**
   * Sign a contract
   */
  signContract: async (contractPdf: Uint8Array, signature: string): Promise<Uint8Array> => {
    // Load the existing PDF
    const pdfDoc = await PDFDocument.load(contractPdf);
    
    // Get the first page
    const page = pdfDoc.getPages()[0];
    
    // Get the standard font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Add signature timestamp
    page.drawText(`Assinado digitalmente em: ${new Date().toLocaleString('pt-BR')}`, {
      x: 50,
      y: 150,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    
    // Add signature hash
    page.drawText(`Assinatura Digital: ${signature}`, {
      x: 50,
      y: 130,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    
    // Serialize the PDF to bytes
    return await pdfDoc.save();
  }
};
