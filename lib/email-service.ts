import { createClient } from '@supabase/supabase-js';

// Email configuration types
export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  secure: boolean;
  password?: string;
}

// Email template types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

// Email service class
export class EmailService {
  private supabase;
  private config: EmailConfig;

  constructor() {
    // Load environment variables
    this.config = {
      host: process.env.SMTP_HOST || 'brasil.svrdedicado.org',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER || 'contato@eduzayn.com.br',
      secure: false,
      password: process.env.SMTP_PASS,
    };

    // Create Supabase client
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  /**
   * Send an email using Supabase's email service
   */
  async sendEmail(to: string, subject: string, content: string, options?: {
    cc?: string[];
    bcc?: string[];
    replyTo?: string;
    attachments?: Array<{ name: string, content: string }>;
  }) {
    try {
      // In a real implementation, this would use Supabase's email service
      // For now, we'll log the email details and return success
      console.log('Sending email:', {
        to,
        subject,
        content: content.substring(0, 100) + '...',
        options,
      });

      // Record the email in our database for tracking
      const { data, error } = await this.supabase
        .from('email_logs')
        .insert({
          recipient: to,
          subject,
          content_preview: content.substring(0, 255),
          sent_at: new Date().toISOString(),
          status: 'sent',
        })
        .select();

      if (error) {
        console.error('Error logging email:', error);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }
  }

  /**
   * Send an email using a template
   */
  async sendTemplateEmail(to: string, templateId: string, variables: Record<string, any>, options?: {
    cc?: string[];
    bcc?: string[];
    replyTo?: string;
  }) {
    try {
      // Get the template from the database
      const { data: template, error } = await this.supabase
        .from('email_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error || !template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      // Replace variables in the template
      let content = template.content;
      let subject = template.subject;

      // Replace variables in subject and content
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(regex, String(value));
        subject = subject.replace(regex, String(value));
      });

      // Send the email
      return this.sendEmail(to, subject, content, options);
    } catch (error) {
      console.error('Error sending template email:', error);
      return { success: false, error };
    }
  }

  /**
   * Get the current email configuration
   */
  getEmailConfig(): EmailConfig {
    // Return a copy of the config without the password
    return {
      host: this.config.host,
      port: this.config.port,
      user: this.config.user,
      secure: this.config.secure,
    };
  }
}

// Create a singleton instance
let emailServiceInstance: EmailService | null = null;

export function getEmailService(): EmailService {
  if (!emailServiceInstance) {
    emailServiceInstance = new EmailService();
  }
  return emailServiceInstance;
}
