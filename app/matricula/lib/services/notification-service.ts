// Simplified notification service
import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Create a test SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'test@example.com',
    pass: process.env.SMTP_PASSWORD || 'password',
  },
});

// Create a test Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID || 'AC00000000000000000000000000000000',
  process.env.TWILIO_AUTH_TOKEN || '0000000000000000000000000000000000'
);

export const notificationService = {
  /**
   * Send an email notification
   */
  sendEmail: async (to: string, subject: string, html: string): Promise<boolean> => {
    try {
      // In development/test, just log the email
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[EMAIL] To: ${to}, Subject: ${subject}, Body: ${html}`);
        return true;
      }
      
      // In production, send the email
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@edunexia.com',
        to,
        subject,
        html,
      });
      
      console.log(`Email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  },
  
  /**
   * Send an SMS notification
   */
  sendSMS: async (to: string, body: string): Promise<boolean> => {
    try {
      // In development/test, just log the SMS
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[SMS] To: ${to}, Body: ${body}`);
        return true;
      }
      
      // In production, send the SMS
      const message = await twilioClient.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER || '+15005550006', // Twilio test number
        to,
      });
      
      console.log(`SMS sent: ${message.sid}`);
      return true;
    } catch (error) {
      console.error('Error sending SMS:', error);
      return false;
    }
  },
  
  /**
   * Send a payment reminder
   */
  sendPaymentReminder: async (
    email: string,
    phone: string,
    studentName: string,
    matriculaId: string,
    amount: number,
    dueDate: string
  ): Promise<boolean> => {
    const subject = 'Lembrete de Pagamento - Edunexia';
    const html = `
      <h1>Olá, ${studentName}!</h1>
      <p>Este é um lembrete de que você tem um pagamento pendente:</p>
      <ul>
        <li>Matrícula: ${matriculaId}</li>
        <li>Valor: R$ ${amount.toFixed(2)}</li>
        <li>Data de Vencimento: ${dueDate}</li>
      </ul>
      <p>Por favor, efetue o pagamento o mais breve possível para evitar juros e multas.</p>
      <p>Atenciosamente,<br>Equipe Edunexia</p>
    `;
    
    const smsBody = `Edunexia: Olá, ${studentName}! Você tem um pagamento de R$ ${amount.toFixed(2)} com vencimento em ${dueDate}. Acesse sua conta para mais detalhes.`;
    
    // Send both email and SMS
    const emailSent = await notificationService.sendEmail(email, subject, html);
    const smsSent = await notificationService.sendSMS(phone, smsBody);
    
    return emailSent && smsSent;
  },
  
  /**
   * Send a document approval notification
   */
  sendDocumentApprovalNotification: async (
    email: string,
    studentName: string,
    documentType: string,
    approved: boolean,
    observation?: string
  ): Promise<boolean> => {
    const status = approved ? 'aprovado' : 'rejeitado';
    const subject = `Documento ${status} - Edunexia`;
    const html = `
      <h1>Olá, ${studentName}!</h1>
      <p>Seu documento "${documentType}" foi ${status}.</p>
      ${observation ? `<p>Observação: ${observation}</p>` : ''}
      <p>Atenciosamente,<br>Equipe Edunexia</p>
    `;
    
    return await notificationService.sendEmail(email, subject, html);
  },
};
