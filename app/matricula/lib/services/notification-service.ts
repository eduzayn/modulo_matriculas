/**
 * Notification Service
 * 
 * This service handles sending notifications to users through various channels
 * including email, SMS, and WhatsApp.
 */

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Types for notification service
export interface NotificationOptions {
  event: string;
  recipient: {
    id?: string;
    type: 'aluno' | 'admin' | 'professor';
    role?: string;
  };
  data: Record<string, any>;
  channels: Array<'email' | 'sms' | 'whatsapp' | 'push'>;
}

export interface NotificationResult {
  success: boolean;
  id?: string;
  error?: string;
}

export interface EmailOptions {
  recipient: string;
  subject: string;
  body: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface SMSOptions {
  recipient: string;
  message: string;
}

export interface WhatsAppOptions {
  recipient: string;
  message: string;
  template?: string;
  templateData?: Record<string, any>;
}

// Configuração do serviço de email
const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASSWORD || 'password'
  }
});

// Configuração do serviço de SMS (Twilio)
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Notification service implementation
export class NotificationService {
  /**
   * Envia notificação por email
   */
  static async sendEmail(options: EmailOptions): Promise<NotificationResult> {
    try {
      // Verificar ambiente de desenvolvimento
      if (process.env.NODE_ENV === 'development' && !process.env.ENABLE_REAL_EMAILS) {
        console.log('Email simulado (ambiente de desenvolvimento):', options);
        return { success: true, id: 'dev-email-' + Date.now() };
      }
      
      // Enviar email real
      const info = await emailTransporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@edunexia.com.br',
        to: options.recipient,
        subject: options.subject,
        text: options.body,
        attachments: options.attachments || []
      });
      
      // Registrar no banco de dados
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      
      const { data, error } = await supabase
        .from('communication.messages')
        .insert({
          channel: 'email',
          recipient: options.recipient,
          subject: options.subject,
          body: options.body,
          sent_at: new Date().toISOString(),
          status: 'sent',
          external_id: info.messageId
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Erro ao registrar email no banco de dados:', error);
        // Não falhar se apenas o registro falhar
      }
      
      return {
        success: true,
        id: info.messageId,
      };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  /**
   * Envia notificação por SMS
   */
  static async sendSMS(options: SMSOptions): Promise<NotificationResult> {
    try {
      // Verificar ambiente de desenvolvimento
      if (process.env.NODE_ENV === 'development' && !process.env.ENABLE_REAL_SMS) {
        console.log('SMS simulado (ambiente de desenvolvimento):', options);
        return { success: true, id: 'dev-sms-' + Date.now() };
      }
      
      // Verificar se Twilio está configurado
      if (!twilioClient) {
        throw new Error('Twilio não configurado');
      }
      
      // Enviar SMS real
      const sms = await twilioClient.messages.create({
        body: options.message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: options.recipient
      });
      
      // Registrar no banco de dados
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      
      const { data, error } = await supabase
        .from('communication.messages')
        .insert({
          channel: 'sms',
          recipient: options.recipient,
          body: options.message,
          sent_at: new Date().toISOString(),
          status: 'sent',
          external_id: sms.sid
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Erro ao registrar SMS no banco de dados:', error);
        // Não falhar se apenas o registro falhar
      }
      
      return {
        success: true,
        id: sms.sid,
      };
    } catch (error) {
      console.error('Erro ao enviar SMS:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  /**
   * Envia notificação por WhatsApp
   */
  static async sendWhatsApp(options: WhatsAppOptions): Promise<NotificationResult> {
    try {
      // Verificar ambiente de desenvolvimento
      if (process.env.NODE_ENV === 'development' && !process.env.ENABLE_REAL_WHATSAPP) {
        console.log('WhatsApp simulado (ambiente de desenvolvimento):', options);
        return { success: true, id: 'dev-whatsapp-' + Date.now() };
      }
      
      // Implementar integração real com WhatsApp Business API ou similar
      // Este é um placeholder para a implementação real
      const whatsappId = 'whatsapp-' + Date.now();
      
      // Registrar no banco de dados
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      
      const { data, error } = await supabase
        .from('communication.messages')
        .insert({
          channel: 'whatsapp',
          recipient: options.recipient,
          body: options.message,
          template: options.template,
          template_data: options.templateData,
          sent_at: new Date().toISOString(),
          status: 'sent',
          external_id: whatsappId
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Erro ao registrar WhatsApp no banco de dados:', error);
        // Não falhar se apenas o registro falhar
      }
      
      return {
        success: true,
        id: whatsappId,
      };
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  /**
   * Envia notificação para um destinatário através de canais especificados
   */
  static async sendNotification(options: NotificationOptions): Promise<NotificationResult> {
    try {
      console.log('Enviando notificação:', options);
      
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      
      // Armazenar notificação no banco de dados para rastreamento
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          event: options.event,
          recipient_type: options.recipient.type,
          recipient_id: options.recipient.id,
          recipient_role: options.recipient.role,
          data: options.data,
          channels: options.channels,
          status: 'sent',
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Erro ao armazenar notificação:', error);
        // Não falhar se apenas o armazenamento falhar
      }
      
      // Processar cada canal
      const results = [];
      
      for (const channel of options.channels) {
        switch (channel) {
          case 'email':
            if (options.data.email) {
              const emailResult = await this.sendEmail({
                recipient: options.data.email,
                subject: options.data.subject || `Notificação: ${options.event}`,
                body: options.data.body || `Notificação do evento: ${options.event}`
              });
              results.push({ channel: 'email', success: emailResult.success });
            }
            break;
            
          case 'sms':
            if (options.data.phone) {
              const smsResult = await this.sendSMS({
                recipient: options.data.phone,
                message: options.data.message || `Edunexia: Notificação do evento ${options.event}`
              });
              results.push({ channel: 'sms', success: smsResult.success });
            }
            break;
            
          case 'whatsapp':
            if (options.data.phone) {
              const whatsappResult = await this.sendWhatsApp({
                recipient: options.data.phone,
                message: options.data.message || `Edunexia: Notificação do evento ${options.event}`,
                template: options.data.template,
                templateData: options.data.templateData
              });
              results.push({ channel: 'whatsapp', success: whatsappResult.success });
            }
            break;
            
          case 'push':
            // Implementação futura para notificações push
            console.log('Enviando notificação push para evento:', options.event);
            results.push({ channel: 'push', success: false, error: 'Não implementado' });
            break;
        }
      }
      
      // Atualizar status da notificação no banco de dados
      const allSuccess = results.every(r => r.success);
      const anySuccess = results.some(r => r.success);
      
      if (data?.id) {
        await supabase
          .from('notifications')
          .update({
            status: allSuccess ? 'delivered' : anySuccess ? 'partial' : 'failed',
            updated_at: new Date().toISOString(),
            delivery_results: results
          })
          .eq('id', data.id);
      }
      
      return {
        success: anySuccess,
        id: data?.id || 'notification-id',
      };
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export default NotificationService;
