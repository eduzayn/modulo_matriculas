import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

/**
 * Tipos para o serviço de log de transações
 */
export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  CANCELLATION = 'cancellation',
  WEBHOOK = 'webhook',
  CREDIT_ANALYSIS = 'credit_analysis',
  AUTHENTICATION = 'authentication',
  DATA_ACCESS = 'data_access',
  DATA_MODIFICATION = 'data_modification',
  SYSTEM = 'system'
}

export enum TransactionStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
  PENDING = 'pending',
  CANCELLED = 'cancelled'
}

export interface TransactionLogEntry {
  transaction_id?: string;
  transaction_type: TransactionType;
  status: TransactionStatus;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  details: Record<string, any>;
  created_at?: string;
}

/**
 * Serviço para registro detalhado de transações
 * Implementa funções para registrar logs de transações financeiras e outras operações
 * com detalhes completos para auditoria e conformidade com LGPD
 */
export class TransactionLogger {
  /**
   * Registra uma transação no banco de dados
   * @param entry Dados da transação a ser registrada
   * @returns Resultado da operação
   */
  static async logTransaction(entry: TransactionLogEntry): Promise<{ success: boolean; error?: any }> {
    try {
      // Obter cliente Supabase
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      
      // Preparar dados para inserção
      const logEntry = {
        ...entry,
        created_at: entry.created_at || new Date().toISOString(),
        // Remover dados sensíveis dos detalhes
        details: this.sanitizeSensitiveData(entry.details)
      };
      
      // Inserir log no banco de dados
      const { error } = await supabase
        .from('financial.transaction_logs')
        .insert(logEntry);
      
      if (error) {
        console.error('Erro ao registrar log de transação:', error);
        return { success: false, error };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao registrar log de transação:', error);
      return { success: false, error };
    }
  }
  
  /**
   * Registra log de pagamento
   * @param paymentData Dados do pagamento
   * @param status Status da transação
   * @param userId ID do usuário (opcional)
   * @param requestInfo Informações da requisição (opcional)
   * @returns Resultado da operação
   */
  static async logPayment(
    paymentData: Record<string, any>,
    status: TransactionStatus,
    userId?: string,
    requestInfo?: { ip: string; userAgent: string }
  ): Promise<{ success: boolean; error?: any }> {
    return this.logTransaction({
      transaction_id: paymentData.id || paymentData.payment_id,
      transaction_type: TransactionType.PAYMENT,
      status,
      user_id: userId,
      ip_address: requestInfo?.ip,
      user_agent: requestInfo?.userAgent,
      details: paymentData
    });
  }
  
  /**
   * Registra log de webhook
   * @param webhookData Dados do webhook
   * @param status Status da transação
   * @param requestInfo Informações da requisição (opcional)
   * @returns Resultado da operação
   */
  static async logWebhook(
    webhookData: Record<string, any>,
    status: TransactionStatus,
    requestInfo?: { ip: string; userAgent: string }
  ): Promise<{ success: boolean; error?: any }> {
    return this.logTransaction({
      transaction_id: webhookData.id || webhookData.event_id,
      transaction_type: TransactionType.WEBHOOK,
      status,
      ip_address: requestInfo?.ip,
      user_agent: requestInfo?.userAgent,
      details: webhookData
    });
  }
  
  /**
   * Registra log de acesso a dados
   * @param dataAccess Informações sobre o acesso a dados
   * @param userId ID do usuário
   * @param requestInfo Informações da requisição (opcional)
   * @returns Resultado da operação
   */
  static async logDataAccess(
    dataAccess: { resource: string; action: string; resourceId?: string; details?: Record<string, any> },
    userId: string,
    requestInfo?: { ip: string; userAgent: string }
  ): Promise<{ success: boolean; error?: any }> {
    return this.logTransaction({
      transaction_type: TransactionType.DATA_ACCESS,
      status: TransactionStatus.SUCCESS,
      user_id: userId,
      ip_address: requestInfo?.ip,
      user_agent: requestInfo?.userAgent,
      details: {
        resource: dataAccess.resource,
        action: dataAccess.action,
        resource_id: dataAccess.resourceId,
        ...dataAccess.details
      }
    });
  }
  
  /**
   * Sanitiza dados sensíveis antes de armazenar no log
   * @param data Dados a serem sanitizados
   * @returns Dados sanitizados
   */
  private static sanitizeSensitiveData(data: Record<string, any>): Record<string, any> {
    const sensitiveFields = [
      'password',
      'senha',
      'credit_card',
      'cartao_credito',
      'card_number',
      'numero_cartao',
      'cvv',
      'cvc',
      'security_code',
      'codigo_seguranca',
      'token',
      'access_token',
      'refresh_token',
      'api_key',
      'secret',
      'private_key',
      'chave_privada'
    ];
    
    const result = { ...data };
    
    // Função recursiva para sanitizar objetos aninhados
    const sanitizeObject = (obj: Record<string, any>): Record<string, any> => {
      const sanitized: Record<string, any> = {};
      
      for (const [key, value] of Object.entries(obj)) {
        // Verificar se é um campo sensível
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          sanitized[key] = '[REDACTED]';
        } 
        // Verificar se é um objeto aninhado
        else if (value && typeof value === 'object' && !Array.isArray(value)) {
          sanitized[key] = sanitizeObject(value);
        }
        // Verificar se é um array de objetos
        else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
          sanitized[key] = value.map(item => 
            typeof item === 'object' ? sanitizeObject(item) : item
          );
        }
        // Manter valor original
        else {
          sanitized[key] = value;
        }
      }
      
      return sanitized;
    };
    
    return sanitizeObject(result);
  }
  
  /**
   * Obtém logs de transações para um usuário específico
   * @param userId ID do usuário
   * @param limit Limite de registros (opcional, padrão: 50)
   * @param offset Offset para paginação (opcional, padrão: 0)
   * @returns Logs de transações do usuário
   */
  static async getUserTransactionLogs(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ success: boolean; data?: any[]; error?: any }> {
    try {
      // Obter cliente Supabase
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      
      // Buscar logs do usuário
      const { data, error } = await supabase
        .from('financial.transaction_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) {
        console.error('Erro ao buscar logs de transações do usuário:', error);
        return { success: false, error };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao buscar logs de transações do usuário:', error);
      return { success: false, error };
    }
  }
}
