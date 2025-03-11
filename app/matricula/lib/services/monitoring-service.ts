/**
 * Serviço de monitoramento de desempenho da aplicação
 * Implementa coleta de métricas, logging e alertas
 */

import { cacheService } from './cache-service';
import { createClient } from '@supabase/supabase-js';
import { env } from 'process';

// Tipos de métricas
export enum MetricType {
  RESPONSE_TIME = 'response_time',
  ERROR_RATE = 'error_rate',
  API_USAGE = 'api_usage',
  CACHE_HIT_RATE = 'cache_hit_rate',
  DATABASE_QUERY_TIME = 'database_query_time',
  MEMORY_USAGE = 'memory_usage',
  CPU_USAGE = 'cpu_usage'
}

// Interface para métricas
export interface Metric {
  type: MetricType;
  value: number;
  timestamp: Date;
  endpoint?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

// Interface para alertas
export interface Alert {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  metric?: Metric;
  metadata?: Record<string, any>;
}

/**
 * Serviço de monitoramento
 */
export class MonitoringService {
  private static instance: MonitoringService;
  private metrics: Metric[] = [];
  private alerts: Alert[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private supabase: any;
  
  // Limites para alertas
  private thresholds = {
    [MetricType.RESPONSE_TIME]: 1000, // ms
    [MetricType.ERROR_RATE]: 0.05, // 5%
    [MetricType.CACHE_HIT_RATE]: 0.7, // 70%
    [MetricType.DATABASE_QUERY_TIME]: 500, // ms
    [MetricType.MEMORY_USAGE]: 0.8, // 80%
    [MetricType.CPU_USAGE]: 0.7 // 70%
  };
  
  private constructor() {
    // Inicializar cliente Supabase para armazenamento de métricas
    if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
      this.supabase = createClient(
        env.SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY
      );
    }
    
    // Configurar intervalo para envio de métricas
    this.setupFlushInterval();
  }
  
  /**
   * Obtém a instância única do serviço de monitoramento (Singleton)
   * @returns Instância do serviço de monitoramento
   */
  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    
    return MonitoringService.instance;
  }
  
  /**
   * Configura o intervalo para envio de métricas
   * @param interval Intervalo em milissegundos (padrão: 60000 = 1 minuto)
   */
  private setupFlushInterval(interval: number = 60000): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    
    this.flushInterval = setInterval(() => {
      this.flushMetrics();
    }, interval);
  }
  
  /**
   * Registra uma métrica
   * @param type Tipo da métrica
   * @param value Valor da métrica
   * @param endpoint Endpoint relacionado (opcional)
   * @param userId ID do usuário (opcional)
   * @param metadata Metadados adicionais (opcional)
   */
  public recordMetric(
    type: MetricType,
    value: number,
    endpoint?: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    const metric: Metric = {
      type,
      value,
      timestamp: new Date(),
      endpoint,
      userId,
      metadata
    };
    
    this.metrics.push(metric);
    
    // Verificar se a métrica ultrapassa o limite
    this.checkThreshold(metric);
    
    // Se tiver muitas métricas acumuladas, enviar imediatamente
    if (this.metrics.length >= 100) {
      this.flushMetrics();
    }
  }
  
  /**
   * Registra tempo de resposta de uma API
   * @param endpoint Endpoint da API
   * @param responseTime Tempo de resposta em milissegundos
   * @param userId ID do usuário (opcional)
   */
  public recordResponseTime(endpoint: string, responseTime: number, userId?: string): void {
    this.recordMetric(MetricType.RESPONSE_TIME, responseTime, endpoint, userId);
  }
  
  /**
   * Registra erro de API
   * @param endpoint Endpoint da API
   * @param error Erro ocorrido
   * @param userId ID do usuário (opcional)
   */
  public recordError(endpoint: string, error: Error, userId?: string): void {
    // Incrementar contador de erros para o endpoint
    const cacheKey = `error_count:${endpoint}`;
    const currentCount = cacheService.get<number>(cacheKey) || 0;
    cacheService.set(cacheKey, currentCount + 1, 3600); // TTL de 1 hora
    
    // Calcular taxa de erro
    const requestsKey = `requests_count:${endpoint}`;
    const requestsCount = cacheService.get<number>(requestsKey) || 1;
    const errorRate = (currentCount + 1) / requestsCount;
    
    // Registrar métrica de taxa de erro
    this.recordMetric(
      MetricType.ERROR_RATE,
      errorRate,
      endpoint,
      userId,
      { error: error.message, stack: error.stack }
    );
  }
  
  /**
   * Registra uso de API
   * @param endpoint Endpoint da API
   * @param userId ID do usuário (opcional)
   */
  public recordApiUsage(endpoint: string, userId?: string): void {
    // Incrementar contador de requisições para o endpoint
    const requestsKey = `requests_count:${endpoint}`;
    const currentCount = cacheService.get<number>(requestsKey) || 0;
    cacheService.set(requestsKey, currentCount + 1, 3600); // TTL de 1 hora
    
    this.recordMetric(MetricType.API_USAGE, 1, endpoint, userId);
  }
  
  /**
   * Registra taxa de acerto de cache
   * @param hitRate Taxa de acerto (0-1)
   */
  public recordCacheHitRate(hitRate: number): void {
    this.recordMetric(MetricType.CACHE_HIT_RATE, hitRate);
  }
  
  /**
   * Registra tempo de consulta ao banco de dados
   * @param queryName Nome da consulta
   * @param queryTime Tempo de consulta em milissegundos
   */
  public recordDatabaseQueryTime(queryName: string, queryTime: number): void {
    this.recordMetric(
      MetricType.DATABASE_QUERY_TIME,
      queryTime,
      undefined,
      undefined,
      { queryName }
    );
  }
  
  /**
   * Verifica se uma métrica ultrapassa o limite e gera alerta
   * @param metric Métrica a ser verificada
   */
  private checkThreshold(metric: Metric): void {
    const threshold = this.thresholds[metric.type];
    
    if (threshold === undefined) {
      return;
    }
    
    let isExceeded = false;
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    // Verificar se o valor ultrapassa o limite
    switch (metric.type) {
      case MetricType.RESPONSE_TIME:
      case MetricType.DATABASE_QUERY_TIME:
        isExceeded = metric.value > threshold;
        if (metric.value > threshold * 2) severity = 'critical';
        else if (metric.value > threshold * 1.5) severity = 'high';
        else if (metric.value > threshold * 1.2) severity = 'medium';
        break;
        
      case MetricType.ERROR_RATE:
      case MetricType.MEMORY_USAGE:
      case MetricType.CPU_USAGE:
        isExceeded = metric.value > threshold;
        if (metric.value > threshold * 1.5) severity = 'critical';
        else if (metric.value > threshold * 1.3) severity = 'high';
        else if (metric.value > threshold * 1.1) severity = 'medium';
        break;
        
      case MetricType.CACHE_HIT_RATE:
        isExceeded = metric.value < threshold;
        if (metric.value < threshold * 0.5) severity = 'critical';
        else if (metric.value < threshold * 0.7) severity = 'high';
        else if (metric.value < threshold * 0.9) severity = 'medium';
        break;
    }
    
    if (isExceeded) {
      this.createAlert(metric, severity);
    }
  }
  
  /**
   * Cria um alerta
   * @param metric Métrica que gerou o alerta
   * @param severity Severidade do alerta
   */
  private createAlert(metric: Metric, severity: 'low' | 'medium' | 'high' | 'critical'): void {
    const alert: Alert = {
      type: `${metric.type}_threshold_exceeded`,
      message: this.getAlertMessage(metric),
      severity,
      timestamp: new Date(),
      metric,
      metadata: {
        threshold: this.thresholds[metric.type]
      }
    };
    
    this.alerts.push(alert);
    
    // Enviar alerta imediatamente se for crítico ou de alta severidade
    if (severity === 'critical' || severity === 'high') {
      this.sendAlert(alert);
    }
  }
  
  /**
   * Obtém mensagem para o alerta
   * @param metric Métrica que gerou o alerta
   * @returns Mensagem do alerta
   */
  private getAlertMessage(metric: Metric): string {
    const threshold = this.thresholds[metric.type];
    
    switch (metric.type) {
      case MetricType.RESPONSE_TIME:
        return `Tempo de resposta elevado (${metric.value}ms) para o endpoint ${metric.endpoint || 'desconhecido'}. Limite: ${threshold}ms.`;
        
      case MetricType.ERROR_RATE:
        return `Taxa de erro elevada (${(metric.value * 100).toFixed(2)}%) para o endpoint ${metric.endpoint || 'desconhecido'}. Limite: ${(threshold * 100).toFixed(2)}%.`;
        
      case MetricType.CACHE_HIT_RATE:
        return `Taxa de acerto de cache baixa (${(metric.value * 100).toFixed(2)}%). Limite mínimo: ${(threshold * 100).toFixed(2)}%.`;
        
      case MetricType.DATABASE_QUERY_TIME:
        return `Tempo de consulta ao banco de dados elevado (${metric.value}ms). Limite: ${threshold}ms.`;
        
      case MetricType.MEMORY_USAGE:
        return `Uso de memória elevado (${(metric.value * 100).toFixed(2)}%). Limite: ${(threshold * 100).toFixed(2)}%.`;
        
      case MetricType.CPU_USAGE:
        return `Uso de CPU elevado (${(metric.value * 100).toFixed(2)}%). Limite: ${(threshold * 100).toFixed(2)}%.`;
        
      default:
        return `Limite excedido para métrica ${metric.type}. Valor: ${metric.value}, Limite: ${threshold}.`;
    }
  }
  
  /**
   * Envia um alerta
   * @param alert Alerta a ser enviado
   */
  private async sendAlert(alert: Alert): Promise<void> {
    // Armazenar alerta no banco de dados
    if (this.supabase) {
      try {
        await this.supabase
          .from('monitoring_alerts')
          .insert([{
            type: alert.type,
            message: alert.message,
            severity: alert.severity,
            timestamp: alert.timestamp,
            metric_type: alert.metric?.type,
            metric_value: alert.metric?.value,
            endpoint: alert.metric?.endpoint,
            user_id: alert.metric?.userId,
            metadata: JSON.stringify(alert.metadata || {})
          }]);
      } catch (error) {
        console.error('Erro ao armazenar alerta:', error);
      }
    }
    
    // Implementar envio de notificações (email, SMS, etc.)
    // TODO: Implementar integração com serviços de notificação
    
    console.warn(`[ALERTA ${alert.severity.toUpperCase()}] ${alert.message}`);
  }
  
  /**
   * Envia métricas para armazenamento
   */
  private async flushMetrics(): Promise<void> {
    if (this.metrics.length === 0) {
      return;
    }
    
    // Armazenar métricas no banco de dados
    if (this.supabase) {
      try {
        const metricsToInsert = this.metrics.map(metric => ({
          type: metric.type,
          value: metric.value,
          timestamp: metric.timestamp,
          endpoint: metric.endpoint,
          user_id: metric.userId,
          metadata: JSON.stringify(metric.metadata || {})
        }));
        
        await this.supabase
          .from('monitoring_metrics')
          .insert(metricsToInsert);
      } catch (error) {
        console.error('Erro ao armazenar métricas:', error);
      }
    }
    
    // Enviar alertas pendentes
    for (const alert of this.alerts) {
      await this.sendAlert(alert);
    }
    
    // Limpar métricas e alertas
    this.metrics = [];
    this.alerts = [];
  }
  
  /**
   * Obtém estatísticas de métricas
   * @param type Tipo da métrica
   * @param startDate Data de início
   * @param endDate Data de fim
   * @param endpoint Endpoint específico (opcional)
   * @returns Estatísticas da métrica
   */
  public async getMetricStats(
    type: MetricType,
    startDate: Date,
    endDate: Date,
    endpoint?: string
  ): Promise<any> {
    if (!this.supabase) {
      return null;
    }
    
    try {
      let query = this.supabase
        .from('monitoring_metrics')
        .select('*')
        .eq('type', type)
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());
      
      if (endpoint) {
        query = query.eq('endpoint', endpoint);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Calcular estatísticas
      const values = data.map((item: any) => item.value);
      
      return {
        count: values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((sum: number, val: number) => sum + val, 0) / values.length,
        p95: this.calculatePercentile(values, 95),
        p99: this.calculatePercentile(values, 99),
        data
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas de métricas:', error);
      return null;
    }
  }
  
  /**
   * Calcula percentil de um array de valores
   * @param values Array de valores
   * @param percentile Percentil a ser calculado (0-100)
   * @returns Valor do percentil
   */
  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) {
      return 0;
    }
    
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    
    return sorted[index];
  }
  
  /**
   * Limpa recursos do serviço
   */
  public dispose(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    // Enviar métricas pendentes
    this.flushMetrics();
  }
}

// Exportar instância única do serviço de monitoramento
export const monitoringService = MonitoringService.getInstance();
