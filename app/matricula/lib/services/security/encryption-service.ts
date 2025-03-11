import crypto from 'crypto';

/**
 * Serviço para criptografia end-to-end de dados sensíveis
 * Implementa funções para criptografar e descriptografar dados
 * usando algoritmos seguros e chaves armazenadas em variáveis de ambiente
 */
export class EncryptionService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY = process.env.ENCRYPTION_KEY || 'default-encryption-key-for-development-only';
  private static readonly IV_LENGTH = 16;
  private static readonly AUTH_TAG_LENGTH = 16;
  
  /**
   * Criptografa dados sensíveis
   * @param data Dados a serem criptografados
   * @returns Dados criptografados em formato base64
   */
  static encrypt(data: string): string {
    try {
      // Gerar IV aleatório
      const iv = crypto.randomBytes(this.IV_LENGTH);
      
      // Criar cipher com chave e IV
      const cipher = crypto.createCipheriv(
        this.ALGORITHM, 
        Buffer.from(this.KEY), 
        iv
      );
      
      // Criptografar dados
      let encrypted = cipher.update(data, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      
      // Obter tag de autenticação
      const authTag = cipher.getAuthTag();
      
      // Combinar IV, dados criptografados e tag de autenticação
      const result = Buffer.concat([
        iv,
        Buffer.from(encrypted, 'base64'),
        authTag
      ]).toString('base64');
      
      return result;
    } catch (error) {
      console.error('Erro ao criptografar dados:', error);
      throw new Error('Falha ao criptografar dados sensíveis');
    }
  }
  
  /**
   * Descriptografa dados sensíveis
   * @param encryptedData Dados criptografados em formato base64
   * @returns Dados descriptografados
   */
  static decrypt(encryptedData: string): string {
    try {
      // Converter dados criptografados de base64 para buffer
      const buffer = Buffer.from(encryptedData, 'base64');
      
      // Extrair IV, dados criptografados e tag de autenticação
      const iv = buffer.slice(0, this.IV_LENGTH);
      const authTag = buffer.slice(buffer.length - this.AUTH_TAG_LENGTH);
      const encrypted = buffer.slice(this.IV_LENGTH, buffer.length - this.AUTH_TAG_LENGTH);
      
      // Criar decipher com chave e IV
      const decipher = crypto.createDecipheriv(
        this.ALGORITHM, 
        Buffer.from(this.KEY), 
        iv
      );
      
      // Definir tag de autenticação
      decipher.setAuthTag(authTag);
      
      // Descriptografar dados
      let decrypted = decipher.update(encrypted);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      
      return decrypted.toString('utf8');
    } catch (error) {
      console.error('Erro ao descriptografar dados:', error);
      throw new Error('Falha ao descriptografar dados sensíveis');
    }
  }
  
  /**
   * Criptografa objeto JSON
   * @param data Objeto a ser criptografado
   * @returns Dados criptografados em formato base64
   */
  static encryptObject(data: Record<string, any>): string {
    return this.encrypt(JSON.stringify(data));
  }
  
  /**
   * Descriptografa objeto JSON
   * @param encryptedData Dados criptografados em formato base64
   * @returns Objeto descriptografado
   */
  static decryptObject<T = Record<string, any>>(encryptedData: string): T {
    const decrypted = this.decrypt(encryptedData);
    return JSON.parse(decrypted) as T;
  }
  
  /**
   * Criptografa apenas campos sensíveis de um objeto
   * @param data Objeto com campos a serem criptografados
   * @param sensitiveFields Array com nomes dos campos sensíveis
   * @returns Objeto com campos sensíveis criptografados
   */
  static encryptSensitiveFields(
    data: Record<string, any>,
    sensitiveFields: string[]
  ): Record<string, any> {
    const result = { ...data };
    
    for (const field of sensitiveFields) {
      if (result[field] !== undefined) {
        result[field] = this.encrypt(String(result[field]));
      }
    }
    
    return result;
  }
  
  /**
   * Descriptografa campos sensíveis de um objeto
   * @param data Objeto com campos criptografados
   * @param sensitiveFields Array com nomes dos campos sensíveis
   * @returns Objeto com campos sensíveis descriptografados
   */
  static decryptSensitiveFields(
    data: Record<string, any>,
    sensitiveFields: string[]
  ): Record<string, any> {
    const result = { ...data };
    
    for (const field of sensitiveFields) {
      if (result[field] !== undefined) {
        try {
          result[field] = this.decrypt(String(result[field]));
        } catch (error) {
          console.warn(`Falha ao descriptografar campo ${field}:`, error);
          // Manter valor original se não for possível descriptografar
        }
      }
    }
    
    return result;
  }
  
  /**
   * Gera hash seguro para senha
   * @param password Senha a ser hasheada
   * @returns Hash da senha
   */
  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }
  
  /**
   * Verifica se uma senha corresponde ao hash armazenado
   * @param password Senha a ser verificada
   * @param storedHash Hash armazenado
   * @returns Verdadeiro se a senha corresponder ao hash
   */
  static verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':');
    const calculatedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === calculatedHash;
  }
}
