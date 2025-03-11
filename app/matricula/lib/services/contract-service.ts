/**
 * Contract Service
 * 
 * Este serviço é responsável pela geração, armazenamento e assinatura de contratos de matrícula.
 * Utiliza pdf-lib para geração de PDFs e integra com o storage do Supabase para armazenamento.
 */

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MatriculaStatus } from '../../types/matricula';

export interface ContractGenerationResult {
  buffer: Buffer;
  filename: string;
}

export interface ContractCreationResult {
  contrato_id: string;
  url: string;
}

export class ContractService {
  /**
   * Gera um PDF de contrato com os dados da matrícula e do curso
   */
  static async generateContractPDF(matriculaId: string): Promise<ContractGenerationResult> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Buscar dados da matrícula, aluno e curso
    const { data: matricula, error } = await supabase
      .from('matricula.registros')
      .select(`
        id,
        aluno:students(*),
        curso:courses(*),
        forma_pagamento,
        numero_parcelas,
        desconto:descontos(*)
      `)
      .eq('id', matriculaId)
      .single();
    
    if (error || !matricula) {
      throw new Error(`Erro ao buscar dados para geração de contrato: ${error?.message || 'Matrícula não encontrada'}`);
    }
    
    // Criar documento PDF
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
    // Adicionar página
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();
    
    // Configurações de texto
    const fontSize = 12;
    const titleSize = 18;
    const subtitleSize = 14;
    const lineHeight = 1.5;
    const margin = 50;
    
    // Título
    page.drawText('CONTRATO DE PRESTAÇÃO DE SERVIÇOS EDUCACIONAIS', {
      x: margin,
      y: height - margin,
      size: titleSize,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    
    // Data
    const dataAtual = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    page.drawText(`Data: ${dataAtual}`, {
      x: margin,
      y: height - margin - titleSize * lineHeight,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    // Dados do aluno
    page.drawText('CONTRATANTE:', {
      x: margin,
      y: height - margin - (titleSize + fontSize * 2) * lineHeight,
      size: subtitleSize,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`Nome: ${(matricula.aluno as any)?.name || 'N/A'}`, {
      x: margin,
      y: height - margin - (titleSize + fontSize * 3) * lineHeight,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`CPF: ${(matricula.aluno as any)?.cpf || 'N/A'}`, {
      x: margin,
      y: height - margin - (titleSize + fontSize * 4) * lineHeight,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    // Dados do curso
    page.drawText('CURSO CONTRATADO:', {
      x: margin,
      y: height - margin - (titleSize + fontSize * 6) * lineHeight,
      size: subtitleSize,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`Nome do Curso: ${(matricula.curso as any)?.name || 'N/A'}`, {
      x: margin,
      y: height - margin - (titleSize + fontSize * 7) * lineHeight,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`Carga Horária: ${(matricula.curso as any)?.carga_horaria || 'N/A'} horas`, {
      x: margin,
      y: height - margin - (titleSize + fontSize * 8) * lineHeight,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`Modalidade: ${(matricula.curso as any)?.modalidade || 'N/A'}`, {
      x: margin,
      y: height - margin - (titleSize + fontSize * 9) * lineHeight,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    // Dados financeiros
    page.drawText('CONDIÇÕES FINANCEIRAS:', {
      x: margin,
      y: height - margin - (titleSize + fontSize * 11) * lineHeight,
      size: subtitleSize,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    
    const valorCurso = (matricula.curso as any)?.valor || 0;
    const valorDesconto = (matricula.desconto as any)?.valor || 0;
    const tipoDesconto = (matricula.desconto as any)?.tipo || 'percentual';
    const valorFinal = tipoDesconto === 'percentual' 
      ? valorCurso * (1 - valorDesconto / 100) 
      : valorCurso - valorDesconto;
    
    page.drawText(`Valor do Curso: R$ ${valorCurso.toFixed(2)}`, {
      x: margin,
      y: height - margin - (titleSize + fontSize * 12) * lineHeight,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    if (valorDesconto > 0) {
      page.drawText(`Desconto: ${tipoDesconto === 'percentual' ? `${valorDesconto}%` : `R$ ${valorDesconto.toFixed(2)}`}`, {
        x: margin,
        y: height - margin - (titleSize + fontSize * 13) * lineHeight,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
    }
    
    page.drawText(`Valor Final: R$ ${valorFinal.toFixed(2)}`, {
      x: margin,
      y: height - margin - (titleSize + fontSize * 14) * lineHeight,
      size: fontSize,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`Forma de Pagamento: ${matricula.forma_pagamento}`, {
      x: margin,
      y: height - margin - (titleSize + fontSize * 15) * lineHeight,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(`Número de Parcelas: ${matricula.numero_parcelas}`, {
      x: margin,
      y: height - margin - (titleSize + fontSize * 16) * lineHeight,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    // Prazos e condições
    page.drawText('PRAZOS E CONDIÇÕES:', {
      x: margin,
      y: height - margin - (titleSize + fontSize * 18) * lineHeight,
      size: subtitleSize,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    
    const prazoMeses = (matricula.curso as any)?.carga_horaria ? Math.ceil((matricula.curso as any).carga_horaria / 80) : 24;
    
    page.drawText(`Prazo para Conclusão: ${prazoMeses} meses`, {
      x: margin,
      y: height - margin - (titleSize + fontSize * 19) * lineHeight,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    // Cláusulas contratuais
    page.drawText('CLÁUSULAS CONTRATUAIS:', {
      x: margin,
      y: height - margin - (titleSize + fontSize * 21) * lineHeight,
      size: subtitleSize,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    
    const clausulas = [
      "1. O CONTRATANTE declara ter conhecimento prévio das condições financeiras deste contrato, que foi exposto em local de fácil acesso e visualização.",
      "2. O CONTRATANTE se compromete a cumprir o regimento interno da instituição e o calendário acadêmico estabelecido.",
      "3. O prazo para conclusão do curso é contado a partir da data de assinatura deste contrato.",
      "4. Em caso de desistência, o CONTRATANTE deverá formalizar o pedido junto à secretaria acadêmica.",
      "5. Este contrato tem validade a partir da data de sua assinatura."
    ];
    
    clausulas.forEach((clausula, index) => {
      page.drawText(clausula, {
        x: margin,
        y: height - margin - (titleSize + fontSize * (22 + index)) * lineHeight,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
        maxWidth: width - 2 * margin,
      });
    });
    
    // Assinaturas
    page.drawText('ASSINATURAS:', {
      x: margin,
      y: height - margin - (titleSize + fontSize * 28) * lineHeight,
      size: subtitleSize,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    
    page.drawText('_______________________________', {
      x: margin,
      y: height - margin - (titleSize + fontSize * 31) * lineHeight,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    page.drawText('Contratante', {
      x: margin + 50,
      y: height - margin - (titleSize + fontSize * 32) * lineHeight,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    page.drawText('_______________________________', {
      x: width - margin - 200,
      y: height - margin - (titleSize + fontSize * 31) * lineHeight,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    page.drawText('Instituição', {
      x: width - margin - 150,
      y: height - margin - (titleSize + fontSize * 32) * lineHeight,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    // Gerar PDF
    const pdfBytes = await pdfDoc.save();
    const buffer = Buffer.from(pdfBytes);
    
    const filename = `contrato_${matriculaId}_${Date.now()}.pdf`;
    
    return { buffer, filename };
  }
  
  /**
   * Salva o PDF gerado no storage e cria o registro do contrato
   */
  static async saveContractAndCreateRecord(matriculaId: string): Promise<ContractCreationResult> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Gerar PDF
    const { buffer, filename } = await this.generateContractPDF(matriculaId);
    
    // Buscar dados da matrícula
    const { data: matricula } = await supabase
      .from('matricula.registros')
      .select(`
        id, 
        aluno_id, 
        curso_id,
        curso:courses(name)
      `)
      .eq('id', matriculaId)
      .single();
    
    // Upload do arquivo para o storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('matricula_contratos')
      .upload(filename, buffer);
    
    if (uploadError) {
      throw new Error(`Erro ao fazer upload do contrato: ${uploadError.message}`);
    }
    
    // Obter URL pública do arquivo
    const { data: urlData } = await supabase.storage
      .from('matricula_contratos')
      .getPublicUrl(filename);
    
    // Criar registro do contrato
    const { data: contrato, error: contratoError } = await supabase
      .from('matricula_contratos')
      .insert({
        matricula_id: matriculaId,
        titulo: `Contrato de Matrícula - ${(matricula?.curso as any)?.name || 'Curso'}`,
        versao: '1.0',
        url: urlData.publicUrl,
        status: 'pendente',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single();
    
    if (contratoError) {
      throw new Error(`Erro ao criar registro do contrato: ${contratoError.message}`);
    }
    
    return {
      contrato_id: contrato.id,
      url: urlData.publicUrl
    };
  }
  
  /**
   * Implementa a assinatura digital do contrato
   */
  static async signContract(contratoId: string, userId: string, metadata: Record<string, any> = {}): Promise<boolean> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Verificar se o contrato existe
    const { data: contrato, error: contratoError } = await supabase
      .from('matricula_contratos')
      .select('id, matricula_id, status')
      .eq('id', contratoId)
      .single();
    
    if (contratoError || !contrato) {
      throw new Error(`Erro ao buscar contrato: ${contratoError?.message || 'Contrato não encontrado'}`);
    }
    
    if (contrato.status === 'assinado') {
      throw new Error('Este contrato já foi assinado');
    }
    
    // Atualizar status do contrato
    const { error: updateError } = await supabase
      .from('matricula_contratos')
      .update({
        status: 'assinado',
        data_assinatura: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        assinado_por: userId,
        assinatura_metadata: {
          ip: metadata.ip || '127.0.0.1',
          user_agent: metadata.user_agent || 'Edunexia Web App',
          timestamp: Date.now(),
          browser_info: metadata.browser_info || {},
          device_info: metadata.device_info || {},
          location: metadata.location || {},
        }
      })
      .eq('id', contratoId);
    
    if (updateError) {
      throw new Error(`Erro ao atualizar status do contrato: ${updateError.message}`);
    }
    
    // Buscar informações da matrícula
    const { data: matricula, error: matriculaError } = await supabase
      .from('matricula.registros')
      .select('id, aluno_id, status')
      .eq('id', contrato.matricula_id)
      .single();
    
    if (matriculaError || !matricula) {
      throw new Error(`Erro ao buscar matrícula: ${matriculaError?.message || 'Matrícula não encontrada'}`);
    }
    
    // Atualizar status da matrícula se necessário
    if (matricula.status === MatriculaStatus.PENDENTE || matricula.status === MatriculaStatus.APROVADO) {
      // Buscar metadados atuais da matrícula
      const { data: matriculaCompleta, error: fetchError } = await supabase
        .from('matricula.registros')
        .select('metadata')
        .eq('id', matricula.id)
        .single();
        
      if (fetchError) {
        console.error('Erro ao buscar metadados da matrícula:', fetchError);
      }
      
      const currentMetadata = (matriculaCompleta?.metadata || {}) as Record<string, any>;
      const statusHistory = (currentMetadata.status_history || []) as any[];
      
      const { error: matriculaUpdateError } = await supabase
        .from('matricula.registros')
        .update({
          status: MatriculaStatus.ATIVO,
          updated_at: new Date().toISOString(),
          metadata: {
            ...currentMetadata,
            contrato_assinado: true,
            data_ativacao: new Date().toISOString(),
            status_history: [
              ...statusHistory,
              {
                from: matricula.status,
                to: MatriculaStatus.ATIVO,
                date: new Date().toISOString(),
                reason: 'Contrato assinado',
              },
            ],
          }
        })
        .eq('id', matricula.id);
      
      if (matriculaUpdateError) {
        throw new Error(`Erro ao atualizar status da matrícula: ${matriculaUpdateError.message}`);
      }
    }
    
    return true;
  }
  
  /**
   * Verifica se um contrato existe para uma matrícula
   */
  static async contractExists(matriculaId: string): Promise<boolean> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    const { count, error } = await supabase
      .from('matricula_contratos')
      .select('*', { count: 'exact', head: true })
      .eq('matricula_id', matriculaId);
    
    if (error) {
      throw new Error(`Erro ao verificar existência de contrato: ${error.message}`);
    }
    
    return count !== null && count > 0;
  }
  
  /**
   * Obtém os detalhes de um contrato
   */
  static async getContractDetails(contratoId: string): Promise<any> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    const { data, error } = await supabase
      .from('matricula_contratos')
      .select(`
        id,
        matricula_id,
        titulo,
        versao,
        url,
        status,
        data_assinatura,
        assinado_por,
        assinatura_metadata,
        created_at,
        updated_at,
        matricula:matricula_id(
          id,
          aluno_id,
          curso_id,
          status,
          aluno:aluno_id(name, email),
          curso:curso_id(name)
        )
      `)
      .eq('id', contratoId)
      .single();
    
    if (error) {
      throw new Error(`Erro ao buscar detalhes do contrato: ${error.message}`);
    }
    
    return data;
  }
  
  /**
   * Lista os contratos de uma matrícula
   */
  static async listContractsByMatricula(matriculaId: string): Promise<any[]> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    const { data, error } = await supabase
      .from('matricula_contratos')
      .select('*')
      .eq('matricula_id', matriculaId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Erro ao listar contratos: ${error.message}`);
    }
    
    return data || [];
  }
}

export default ContractService;
