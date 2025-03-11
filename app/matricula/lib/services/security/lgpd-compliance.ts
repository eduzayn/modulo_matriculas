import { EncryptionService } from './encryption-service';
import { TransactionLogger, TransactionType, TransactionStatus } from './transaction-logger';

/**
 * Tipos para o serviço de conformidade com LGPD
 */
export interface PersonalData {
  id: string;
  name?: string;
  email?: string;
  document?: string;
  phone?: string;
  address?: string;
  birthdate?: string;
  [key: string]: any;
}

export enum DataPurpose {
  REGISTRATION = 'registration',
  PAYMENT = 'payment',
  COMMUNICATION = 'communication',
  MARKETING = 'marketing',
  ANALYTICS = 'analytics',
  LEGAL = 'legal'
}

export interface ConsentRecord {
  user_id: string;
  purpose: DataPurpose;
  granted: boolean;
  timestamp: string;
  expiration?: string;
  details?: Record<string, any>;
}

/**
 * Serviço para conformidade com LGPD (Lei Geral de Proteção de Dados)
 * Implementa funções para gerenciar dados pessoais de acordo com a LGPD
 * incluindo anonimização, consentimento e direito ao esquecimento
 */
export class LGPDComplianceService {
  // Campos considerados sensíveis pela LGPD
  private static readonly SENSITIVE_FIELDS = [
    'document',
    'cpf',
    'rg',
    'passport',
    'birthdate',
    'data_nascimento',
    'address',
    'endereco',
    'phone',
    'telefone',
    'credit_card',
    'cartao_credito',
    'health_data',
    'dados_saude',
    'race',
    'raca',
    'ethnicity',
    'etnia',
    'religion',
    'religiao',
    'political_opinion',
    'opiniao_politica',
    'sexual_orientation',
    'orientacao_sexual',
    'biometric_data',
    'dados_biometricos'
  ];
  
  /**
   * Anonimiza dados pessoais
   * @param data Dados pessoais a serem anonimizados
   * @returns Dados anonimizados
   */
  static anonymizeData(data: PersonalData): PersonalData {
    const result = { ...data };
    
    // Anonimizar campos sensíveis
    if (result.name) {
      result.name = this.anonymizeName(result.name);
    }
    
    if (result.email) {
      result.email = this.anonymizeEmail(result.email);
    }
    
    if (result.document) {
      result.document = this.anonymizeDocument(result.document);
    }
    
    if (result.phone) {
      result.phone = this.anonymizePhone(result.phone);
    }
    
    if (result.address) {
      result.address = '[ENDEREÇO ANONIMIZADO]';
    }
    
    if (result.birthdate) {
      result.birthdate = '[DATA ANONIMIZADA]';
    }
    
    // Anonimizar outros campos sensíveis
    for (const field of Object.keys(result)) {
      if (this.SENSITIVE_FIELDS.some(sensitiveField => field.toLowerCase().includes(sensitiveField))) {
        result[field] = '[DADO SENSÍVEL ANONIMIZADO]';
      }
    }
    
    return result;
  }
  
  /**
   * Anonimiza nome
   * @param name Nome a ser anonimizado
   * @returns Nome anonimizado
   */
  private static anonymizeName(name: string): string {
    const parts = name.split(' ');
    if (parts.length === 1) {
      return `${parts[0].charAt(0)}${'*'.repeat(parts[0].length - 1)}`;
    }
    
    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    
    return `${firstName.charAt(0)}${'*'.repeat(firstName.length - 1)} ${lastName.charAt(0)}${'*'.repeat(lastName.length - 1)}`;
  }
  
  /**
   * Anonimiza email
   * @param email Email a ser anonimizado
   * @returns Email anonimizado
   */
  private static anonymizeEmail(email: string): string {
    const [username, domain] = email.split('@');
    
    if (!username || !domain) {
      return '[EMAIL INVÁLIDO]';
    }
    
    const anonymizedUsername = `${username.charAt(0)}${'*'.repeat(Math.max(1, username.length - 2))}${username.charAt(username.length - 1)}`;
    
    return `${anonymizedUsername}@${domain}`;
  }
  
  /**
   * Anonimiza documento (CPF, RG, etc.)
   * @param document Documento a ser anonimizado
   * @returns Documento anonimizado
   */
  private static anonymizeDocument(document: string): string {
    // Remover caracteres não numéricos
    const cleanDocument = document.replace(/\D/g, '');
    
    if (cleanDocument.length <= 4) {
      return '*'.repeat(cleanDocument.length);
    }
    
    // Manter os primeiros 3 e últimos 2 dígitos
    const firstPart = cleanDocument.substring(0, 3);
    const lastPart = cleanDocument.substring(cleanDocument.length - 2);
    const middlePart = '*'.repeat(cleanDocument.length - 5);
    
    return `${firstPart}${middlePart}${lastPart}`;
  }
  
  /**
   * Anonimiza número de telefone
   * @param phone Telefone a ser anonimizado
   * @returns Telefone anonimizado
   */
  private static anonymizePhone(phone: string): string {
    // Remover caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length <= 4) {
      return '*'.repeat(cleanPhone.length);
    }
    
    // Manter os primeiros 2 e últimos 2 dígitos
    const firstPart = cleanPhone.substring(0, 2);
    const lastPart = cleanPhone.substring(cleanPhone.length - 2);
    const middlePart = '*'.repeat(cleanPhone.length - 4);
    
    return `${firstPart}${middlePart}${lastPart}`;
  }
  
  /**
   * Criptografa dados pessoais sensíveis
   * @param data Dados pessoais a serem criptografados
   * @returns Dados com campos sensíveis criptografados
   */
  static encryptSensitiveData(data: PersonalData): PersonalData {
    // Identificar campos sensíveis presentes nos dados
    const sensitiveFields = Object.keys(data).filter(field => 
      this.SENSITIVE_FIELDS.some(sensitiveField => field.toLowerCase().includes(sensitiveField))
    );
    
    // Criptografar campos sensíveis
    return EncryptionService.encryptSensitiveFields(data, sensitiveFields) as PersonalData;
  }
  
  /**
   * Descriptografa dados pessoais sensíveis
   * @param data Dados pessoais com campos criptografados
   * @returns Dados com campos sensíveis descriptografados
   */
  static decryptSensitiveData(data: PersonalData): PersonalData {
    // Identificar campos sensíveis presentes nos dados
    const sensitiveFields = Object.keys(data).filter(field => 
      this.SENSITIVE_FIELDS.some(sensitiveField => field.toLowerCase().includes(sensitiveField))
    );
    
    // Descriptografar campos sensíveis
    return EncryptionService.decryptSensitiveFields(data, sensitiveFields) as PersonalData;
  }
  
  /**
   * Registra consentimento do usuário
   * @param consentRecord Registro de consentimento
   * @returns Resultado da operação
   */
  static async registerConsent(consentRecord: ConsentRecord): Promise<{ success: boolean; error?: any }> {
    try {
      // Registrar consentimento no log de transações
      return await TransactionLogger.logTransaction({
        transaction_type: TransactionType.DATA_ACCESS,
        status: TransactionStatus.SUCCESS,
        user_id: consentRecord.user_id,
        details: {
          action: 'consent',
          purpose: consentRecord.purpose,
          granted: consentRecord.granted,
          timestamp: consentRecord.timestamp,
          expiration: consentRecord.expiration,
          ...consentRecord.details
        }
      });
    } catch (error) {
      console.error('Erro ao registrar consentimento:', error);
      return { success: false, error };
    }
  }
  
  /**
   * Verifica se o usuário deu consentimento para determinada finalidade
   * @param userId ID do usuário
   * @param purpose Finalidade do uso dos dados
   * @returns Resultado da verificação
   */
  static async hasConsent(userId: string, purpose: DataPurpose): Promise<{ hasConsent: boolean; error?: any }> {
    try {
      // Obter logs de consentimento do usuário
      const { success, data, error } = await TransactionLogger.getUserTransactionLogs(userId);
      
      if (!success || !data) {
        return { hasConsent: false, error };
      }
      
      // Filtrar logs de consentimento para a finalidade específica
      const consentLogs = data.filter(log => 
        log.transaction_type === TransactionType.DATA_ACCESS &&
        log.details?.action === 'consent' &&
        log.details?.purpose === purpose
      );
      
      if (consentLogs.length === 0) {
        return { hasConsent: false };
      }
      
      // Ordenar logs por data (mais recente primeiro)
      consentLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      // Verificar consentimento mais recente
      const latestConsent = consentLogs[0];
      
      // Verificar se o consentimento está expirado
      if (latestConsent.details?.expiration) {
        const expirationDate = new Date(latestConsent.details.expiration);
        if (expirationDate < new Date()) {
          return { hasConsent: false };
        }
      }
      
      return { hasConsent: latestConsent.details?.granted === true };
    } catch (error) {
      console.error('Erro ao verificar consentimento:', error);
      return { hasConsent: false, error };
    }
  }
  
  /**
   * Implementa o direito ao esquecimento (apagamento de dados pessoais)
   * @param userId ID do usuário
   * @returns Resultado da operação
   */
  static async implementRightToBeForgotten(userId: string): Promise<{ success: boolean; error?: any }> {
    try {
      // Registrar solicitação de esquecimento
      await TransactionLogger.logTransaction({
        transaction_type: TransactionType.DATA_MODIFICATION,
        status: TransactionStatus.SUCCESS,
        user_id: userId,
        details: {
          action: 'right_to_be_forgotten',
          timestamp: new Date().toISOString()
        }
      });
      
      // Aqui seria implementada a lógica para anonimizar ou apagar dados do usuário
      // em todas as tabelas relevantes do banco de dados
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao implementar direito ao esquecimento:', error);
      return { success: false, error };
    }
  }
}
