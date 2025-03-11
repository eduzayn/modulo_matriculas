import NodeCache from 'node-cache';

/**
 * Serviço de cache para melhorar a performance da aplicação
 * Implementa cache em memória com TTL configurável
 */
export class CacheService {
  private static instance: CacheService;
  private cache: NodeCache;
  
  // TTL padrão de 5 minutos (300 segundos)
  private static readonly DEFAULT_TTL = 300;
  
  private constructor() {
    this.cache = new NodeCache({
      stdTTL: CacheService.DEFAULT_TTL,
      checkperiod: 60, // Verificar expiração a cada 60 segundos
      useClones: false // Não clonar objetos para melhorar performance
    });
  }
  
  /**
   * Obtém a instância única do serviço de cache (Singleton)
   * @returns Instância do serviço de cache
   */
  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    
    return CacheService.instance;
  }
  
  /**
   * Define um valor no cache
   * @param key Chave do cache
   * @param value Valor a ser armazenado
   * @param ttl Tempo de vida em segundos (opcional)
   * @returns Verdadeiro se o valor foi armazenado com sucesso
   */
  public set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl);
  }
  
  /**
   * Obtém um valor do cache
   * @param key Chave do cache
   * @returns Valor armazenado ou undefined se não encontrado
   */
  public get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }
  
  /**
   * Obtém um valor do cache ou executa uma função para obtê-lo
   * @param key Chave do cache
   * @param fallback Função para obter o valor caso não esteja em cache
   * @param ttl Tempo de vida em segundos (opcional)
   * @returns Valor armazenado ou obtido pela função fallback
   */
  public async getOrSet<T>(key: string, fallback: () => Promise<T>, ttl?: number): Promise<T> {
    const cachedValue = this.get<T>(key);
    
    if (cachedValue !== undefined) {
      return cachedValue;
    }
    
    const value = await fallback();
    this.set(key, value, ttl);
    
    return value;
  }
  
  /**
   * Remove um valor do cache
   * @param key Chave do cache
   * @returns Verdadeiro se o valor foi removido com sucesso
   */
  public delete(key: string): boolean {
    return this.cache.del(key) > 0;
  }
  
  /**
   * Remove múltiplos valores do cache
   * @param keys Array de chaves a serem removidas
   * @returns Número de chaves removidas
   */
  public deleteMany(keys: string[]): number {
    return this.cache.del(keys);
  }
  
  /**
   * Remove todos os valores do cache
   */
  public clear(): void {
    this.cache.flushAll();
  }
  
  /**
   * Remove valores do cache que correspondem a um padrão
   * @param pattern Padrão para filtrar chaves (ex: "user:*")
   * @returns Número de chaves removidas
   */
  public deleteByPattern(pattern: string): number {
    const keys = this.cache.keys().filter(key => {
      // Converter padrão para regex
      const regexPattern = pattern.replace(/\*/g, '.*');
      const regex = new RegExp(`^${regexPattern}$`);
      
      return regex.test(key);
    });
    
    return this.deleteMany(keys);
  }
  
  /**
   * Verifica se uma chave existe no cache
   * @param key Chave a ser verificada
   * @returns Verdadeiro se a chave existe
   */
  public has(key: string): boolean {
    return this.cache.has(key);
  }
  
  /**
   * Obtém estatísticas do cache
   * @returns Estatísticas do cache
   */
  public getStats(): NodeCache.Stats {
    return this.cache.getStats();
  }
  
  /**
   * Obtém todas as chaves do cache
   * @returns Array de chaves
   */
  public getKeys(): string[] {
    return this.cache.keys();
  }
  
  /**
   * Obtém o número de itens no cache
   * @returns Número de itens
   */
  public getSize(): number {
    return this.cache.keys().length;
  }
}

// Exportar instância única do serviço de cache
export const cacheService = CacheService.getInstance();
