'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { AppError } from '@/lib/errors';

interface NotificationRecipient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface NotificationOptions {
  matricula_id: string;
  event_type: 'matricula_criada' | 'status_alterado' | 'documento_enviado' | 'documento_avaliado' | 'contrato_gerado' | 'contrato_assinado' | 'pagamento_gerado' | 'pagamento_confirmado';
  recipient: NotificationRecipient;
  channel: 'email' | 'sms' | 'whatsapp';
  metadata?: Record<string, any>;
}

export async function sendMatriculaNotification(options: NotificationOptions): Promise<boolean> {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Verificar se o destinatário tem o canal de contato necessário
    if (options.channel === 'email' && !options.recipient.email) {
      console.warn(`Não foi possível enviar notificação por email: destinatário ${options.recipient.id} não possui email`);
      return false;
    }

    if ((options.channel === 'sms' || options.channel === 'whatsapp') && !options.recipient.phone) {
      console.warn(`Não foi possível enviar notificação por ${options.channel}: destinatário ${options.recipient.id} não possui telefone`);
      return false;
    }

    // Obter template da notificação
    const { data: template, error: templateError } = await supabase
      .from('communication.templates')
      .select('id, title, content, variables')
      .eq('type', options.event_type)
      .eq('channel', options.channel)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (templateError) {
      console.error(`Template de notificação não encontrado para evento ${options.event_type} no canal ${options.channel}:`, templateError);
      // Fallback para template padrão
      const defaultContent = getDefaultTemplate(options.event_type, options.channel);
      
      // Registrar notificação no histórico
      await registerNotification(supabase, {
        ...options,
        template_id: null,
        content: defaultContent,
      });
      
      // Enviar notificação usando serviço apropriado
      return await sendNotification({
        ...options,
        content: defaultContent,
      });
    }

    // Processar variáveis do template
    const processedContent = processTemplateVariables(template.content, {
      recipient_name: options.recipient.name,
      matricula_id: options.matricula_id,
      ...options.metadata,
    });

    // Registrar notificação no histórico
    await registerNotification(supabase, {
      ...options,
      template_id: template.id,
      content: processedContent,
    });

    // Enviar notificação usando serviço apropriado
    return await sendNotification({
      ...options,
      content: processedContent,
    });
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return false;
  }
}

async function registerNotification(
  supabase: any,
  options: NotificationOptions & { template_id: string | null; content: string }
): Promise<void> {
  try {
    await supabase.from('communication.messages').insert({
      recipient_id: options.recipient.id,
      recipient_type: 'student',
      channel: options.channel,
      template_id: options.template_id,
      content: options.content,
      metadata: {
        event_type: options.event_type,
        matricula_id: options.matricula_id,
        ...options.metadata,
      },
      status: 'sent',
    });
  } catch (error) {
    console.error('Erro ao registrar notificação:', error);
  }
}

async function sendNotification(
  options: NotificationOptions & { content: string }
): Promise<boolean> {
  try {
    // Implementação mock - em produção, isso usaria serviços reais de email/SMS/WhatsApp
    console.log(`[MOCK] Enviando notificação por ${options.channel} para ${options.recipient.name}:`);
    console.log(`Assunto: Notificação de Matrícula - ${getNotificationSubject(options.event_type)}`);
    console.log(`Conteúdo: ${options.content}`);
    
    // Simular envio bem-sucedido
    return true;
  } catch (error) {
    console.error(`Erro ao enviar notificação por ${options.channel}:`, error);
    return false;
  }
}

function processTemplateVariables(template: string, variables: Record<string, any>): string {
  let processedTemplate = template;
  
  for (const [key, value] of Object.entries(variables)) {
    processedTemplate = processedTemplate.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }
  
  return processedTemplate;
}

function getNotificationSubject(eventType: string): string {
  const subjects: Record<string, string> = {
    'matricula_criada': 'Sua matrícula foi criada com sucesso',
    'status_alterado': 'Atualização no status da sua matrícula',
    'documento_enviado': 'Documento enviado com sucesso',
    'documento_avaliado': 'Seu documento foi avaliado',
    'contrato_gerado': 'Seu contrato está disponível para assinatura',
    'contrato_assinado': 'Confirmação de assinatura de contrato',
    'pagamento_gerado': 'Novo pagamento gerado',
    'pagamento_confirmado': 'Confirmação de pagamento',
  };
  
  return subjects[eventType] || 'Notificação de Matrícula';
}

function getDefaultTemplate(eventType: string, channel: string): string {
  // Templates padrão para cada tipo de evento e canal
  const defaultTemplates: Record<string, Record<string, string>> = {
    'matricula_criada': {
      'email': 'Olá {{recipient_name}},\n\nSua matrícula foi criada com sucesso. O número da sua matrícula é {{matricula_id}}.\n\nAcesse o portal do aluno para mais informações.\n\nAtenciosamente,\nEquipe Edunexia',
      'sms': 'Edunexia: Sua matrícula foi criada com sucesso. Acesse o portal do aluno para mais informações.',
      'whatsapp': 'Olá {{recipient_name}},\n\nSua matrícula foi criada com sucesso. O número da sua matrícula é {{matricula_id}}.\n\nAcesse o portal do aluno para mais informações.\n\nAtenciosamente,\nEquipe Edunexia',
    },
    'status_alterado': {
      'email': 'Olá {{recipient_name}},\n\nO status da sua matrícula foi alterado de {{status_anterior}} para {{novo_status}}.\n\nAcesse o portal do aluno para mais informações.\n\nAtenciosamente,\nEquipe Edunexia',
      'sms': 'Edunexia: O status da sua matrícula foi alterado para {{novo_status}}. Acesse o portal para mais informações.',
      'whatsapp': 'Olá {{recipient_name}},\n\nO status da sua matrícula foi alterado de {{status_anterior}} para {{novo_status}}.\n\nAcesse o portal do aluno para mais informações.\n\nAtenciosamente,\nEquipe Edunexia',
    },
    'documento_enviado': {
      'email': 'Olá {{recipient_name}},\n\nSeu documento foi enviado com sucesso e está em análise. Você receberá uma notificação quando a análise for concluída.\n\nAtenciosamente,\nEquipe Edunexia',
      'sms': 'Edunexia: Seu documento foi enviado com sucesso e está em análise.',
      'whatsapp': 'Olá {{recipient_name}},\n\nSeu documento foi enviado com sucesso e está em análise. Você receberá uma notificação quando a análise for concluída.\n\nAtenciosamente,\nEquipe Edunexia',
    },
    'documento_avaliado': {
      'email': 'Olá {{recipient_name}},\n\nSeu documento foi avaliado. Status: {{status_documento}}.\n\nAcesse o portal do aluno para mais informações.\n\nAtenciosamente,\nEquipe Edunexia',
      'sms': 'Edunexia: Seu documento foi avaliado. Status: {{status_documento}}. Acesse o portal para mais informações.',
      'whatsapp': 'Olá {{recipient_name}},\n\nSeu documento foi avaliado. Status: {{status_documento}}.\n\nAcesse o portal do aluno para mais informações.\n\nAtenciosamente,\nEquipe Edunexia',
    },
    'contrato_gerado': {
      'email': 'Olá {{recipient_name}},\n\nSeu contrato está disponível para assinatura. Acesse o portal do aluno para assinar.\n\nAtenciosamente,\nEquipe Edunexia',
      'sms': 'Edunexia: Seu contrato está disponível para assinatura. Acesse o portal do aluno.',
      'whatsapp': 'Olá {{recipient_name}},\n\nSeu contrato está disponível para assinatura. Acesse o portal do aluno para assinar.\n\nAtenciosamente,\nEquipe Edunexia',
    },
    'contrato_assinado': {
      'email': 'Olá {{recipient_name}},\n\nSeu contrato foi assinado com sucesso. Você pode acessar o documento a qualquer momento no portal do aluno.\n\nAtenciosamente,\nEquipe Edunexia',
      'sms': 'Edunexia: Seu contrato foi assinado com sucesso. Acesse o portal para visualizar.',
      'whatsapp': 'Olá {{recipient_name}},\n\nSeu contrato foi assinado com sucesso. Você pode acessar o documento a qualquer momento no portal do aluno.\n\nAtenciosamente,\nEquipe Edunexia',
    },
    'pagamento_gerado': {
      'email': 'Olá {{recipient_name}},\n\nUm novo pagamento foi gerado para sua matrícula. Vencimento: {{data_vencimento}}. Valor: R$ {{valor}}.\n\nAcesse o portal do aluno para mais informações.\n\nAtenciosamente,\nEquipe Edunexia',
      'sms': 'Edunexia: Novo pagamento gerado. Vencimento: {{data_vencimento}}. Valor: R$ {{valor}}.',
      'whatsapp': 'Olá {{recipient_name}},\n\nUm novo pagamento foi gerado para sua matrícula. Vencimento: {{data_vencimento}}. Valor: R$ {{valor}}.\n\nAcesse o portal do aluno para mais informações.\n\nAtenciosamente,\nEquipe Edunexia',
    },
    'pagamento_confirmado': {
      'email': 'Olá {{recipient_name}},\n\nSeu pagamento foi confirmado. Obrigado!\n\nAtenciosamente,\nEquipe Edunexia',
      'sms': 'Edunexia: Seu pagamento foi confirmado. Obrigado!',
      'whatsapp': 'Olá {{recipient_name}},\n\nSeu pagamento foi confirmado. Obrigado!\n\nAtenciosamente,\nEquipe Edunexia',
    },
  };
  
  return defaultTemplates[eventType]?.[channel] || `Notificação de matrícula: ${eventType}`;
}
