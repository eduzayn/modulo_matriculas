/**
 * Serviço de coleta e análise de feedback dos usuários
 */

import { createClient } from '@supabase/supabase-js';
import { env } from 'process';

// Tipos de feedback
export enum FeedbackType {
  BUG = 'bug',
  FEATURE_REQUEST = 'feature_request',
  USABILITY = 'usability',
  PERFORMANCE = 'performance',
  GENERAL = 'general'
}

// Níveis de satisfação
export enum SatisfactionLevel {
  VERY_DISSATISFIED = 1,
  DISSATISFIED = 2,
  NEUTRAL = 3,
  SATISFIED = 4,
  VERY_SATISFIED = 5
}

// Interface para feedback
export interface Feedback {
  id?: string;
  userId: string;
  type: FeedbackType;
  message: string;
  satisfactionLevel?: SatisfactionLevel;
  module: string;
  feature?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  status: 'pending' | 'reviewed' | 'implemented' | 'rejected';
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

/**
 * Serviço de feedback
 */
export class FeedbackService {
  private static instance: FeedbackService;
  private supabase: any;
  
  private constructor() {
    // Inicializar cliente Supabase para armazenamento de feedback
    if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
      this.supabase = createClient(
        env.SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY
      );
    }
  }
  
  /**
   * Obtém a instância única do serviço de feedback (Singleton)
   * @returns Instância do serviço de feedback
   */
  public static getInstance(): FeedbackService {
    if (!FeedbackService.instance) {
      FeedbackService.instance = new FeedbackService();
    }
    
    return FeedbackService.instance;
  }
  
  /**
   * Submete um feedback
   * @param feedback Feedback a ser submetido
   * @returns ID do feedback criado
   */
  public async submitFeedback(feedback: Omit<Feedback, 'id' | 'createdAt' | 'status'>): Promise<string | null> {
    if (!this.supabase) {
      console.error('Cliente Supabase não inicializado');
      return null;
    }
    
    try {
      const newFeedback: Feedback = {
        ...feedback,
        createdAt: new Date(),
        status: 'pending'
      };
      
      // Determinar prioridade com base no tipo e nível de satisfação
      if (feedback.type === FeedbackType.BUG) {
        newFeedback.priority = 'high';
      } else if (feedback.satisfactionLevel && feedback.satisfactionLevel <= SatisfactionLevel.DISSATISFIED) {
        newFeedback.priority = 'medium';
      } else {
        newFeedback.priority = 'low';
      }
      
      // Adicionar tags com base no conteúdo
      newFeedback.tags = this.generateTags(feedback);
      
      const { data, error } = await this.supabase
        .from('user_feedback')
        .insert([{
          user_id: newFeedback.userId,
          type: newFeedback.type,
          message: newFeedback.message,
          satisfaction_level: newFeedback.satisfactionLevel,
          module: newFeedback.module,
          feature: newFeedback.feature,
          metadata: newFeedback.metadata ? JSON.stringify(newFeedback.metadata) : null,
          created_at: newFeedback.createdAt.toISOString(),
          status: newFeedback.status,
          priority: newFeedback.priority,
          tags: newFeedback.tags
        }])
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      return data.id;
    } catch (error) {
      console.error('Erro ao submeter feedback:', error);
      return null;
    }
  }
  
  /**
   * Gera tags com base no conteúdo do feedback
   * @param feedback Feedback
   * @returns Array de tags
   */
  private generateTags(feedback: Omit<Feedback, 'id' | 'createdAt' | 'status'>): string[] {
    const tags: string[] = [feedback.type];
    
    // Adicionar módulo como tag
    tags.push(`module:${feedback.module}`);
    
    // Adicionar feature como tag se existir
    if (feedback.feature) {
      tags.push(`feature:${feedback.feature}`);
    }
    
    // Adicionar nível de satisfação como tag se existir
    if (feedback.satisfactionLevel !== undefined) {
      let satisfactionTag = '';
      
      switch (feedback.satisfactionLevel) {
        case SatisfactionLevel.VERY_DISSATISFIED:
          satisfactionTag = 'very_dissatisfied';
          break;
        case SatisfactionLevel.DISSATISFIED:
          satisfactionTag = 'dissatisfied';
          break;
        case SatisfactionLevel.NEUTRAL:
          satisfactionTag = 'neutral';
          break;
        case SatisfactionLevel.SATISFIED:
          satisfactionTag = 'satisfied';
          break;
        case SatisfactionLevel.VERY_SATISFIED:
          satisfactionTag = 'very_satisfied';
          break;
      }
      
      tags.push(`satisfaction:${satisfactionTag}`);
    }
    
    // Analisar mensagem para extrair palavras-chave
    const keywords = this.extractKeywords(feedback.message);
    tags.push(...keywords.map(keyword => `keyword:${keyword}`));
    
    return tags;
  }
  
  /**
   * Extrai palavras-chave de uma mensagem
   * @param message Mensagem
   * @returns Array de palavras-chave
   */
  private extractKeywords(message: string): string[] {
    // Lista de palavras-chave comuns em feedback
    const commonKeywords = [
      'lento', 'rápido', 'difícil', 'fácil', 'confuso', 'intuitivo',
      'erro', 'bug', 'problema', 'falha', 'travando', 'carregando',
      'melhorar', 'adicionar', 'remover', 'atualizar', 'mudar',
      'interface', 'design', 'layout', 'botão', 'formulário', 'campo',
      'pagamento', 'financeiro', 'matrícula', 'contrato', 'documento',
      'relatório', 'dashboard', 'gráfico', 'notificação', 'alerta'
    ];
    
    // Normalizar mensagem
    const normalizedMessage = message.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s{2,}/g, ' ');
    
    // Extrair palavras
    const words = normalizedMessage.split(' ');
    
    // Filtrar palavras-chave
    return words.filter(word => 
      word.length > 3 && commonKeywords.includes(word)
    ).slice(0, 5); // Limitar a 5 palavras-chave
  }
  
  /**
   * Obtém feedback por ID
   * @param id ID do feedback
   * @returns Feedback
   */
  public async getFeedbackById(id: string): Promise<Feedback | null> {
    if (!this.supabase) {
      console.error('Cliente Supabase não inicializado');
      return null;
    }
    
    try {
      const { data, error } = await this.supabase
        .from('user_feedback')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        return null;
      }
      
      return this.mapDatabaseToFeedback(data);
    } catch (error) {
      console.error('Erro ao obter feedback:', error);
      return null;
    }
  }
  
  /**
   * Mapeia dados do banco para objeto Feedback
   * @param data Dados do banco
   * @returns Objeto Feedback
   */
  private mapDatabaseToFeedback(data: any): Feedback {
    return {
      id: data.id,
      userId: data.user_id,
      type: data.type as FeedbackType,
      message: data.message,
      satisfactionLevel: data.satisfaction_level as SatisfactionLevel | undefined,
      module: data.module,
      feature: data.feature,
      metadata: data.metadata ? JSON.parse(data.metadata) : undefined,
      createdAt: new Date(data.created_at),
      status: data.status as 'pending' | 'reviewed' | 'implemented' | 'rejected',
      priority: data.priority as 'low' | 'medium' | 'high' | undefined,
      tags: data.tags
    };
  }
  
  /**
   * Obtém todos os feedbacks
   * @param filters Filtros opcionais
   * @returns Array de feedbacks
   */
  public async getAllFeedback(filters?: {
    type?: FeedbackType;
    module?: string;
    feature?: string;
    status?: 'pending' | 'reviewed' | 'implemented' | 'rejected';
    priority?: 'low' | 'medium' | 'high';
    startDate?: Date;
    endDate?: Date;
    userId?: string;
  }): Promise<Feedback[]> {
    if (!this.supabase) {
      console.error('Cliente Supabase não inicializado');
      return [];
    }
    
    try {
      let query = this.supabase
        .from('user_feedback')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Aplicar filtros
      if (filters) {
        if (filters.type) {
          query = query.eq('type', filters.type);
        }
        
        if (filters.module) {
          query = query.eq('module', filters.module);
        }
        
        if (filters.feature) {
          query = query.eq('feature', filters.feature);
        }
        
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        
        if (filters.priority) {
          query = query.eq('priority', filters.priority);
        }
        
        if (filters.startDate) {
          query = query.gte('created_at', filters.startDate.toISOString());
        }
        
        if (filters.endDate) {
          query = query.lte('created_at', filters.endDate.toISOString());
        }
        
        if (filters.userId) {
          query = query.eq('user_id', filters.userId);
        }
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data.map(this.mapDatabaseToFeedback);
    } catch (error) {
      console.error('Erro ao obter feedbacks:', error);
      return [];
    }
  }
  
  /**
   * Atualiza o status de um feedback
   * @param id ID do feedback
   * @param status Novo status
   * @param priority Nova prioridade (opcional)
   * @returns Verdadeiro se atualizado com sucesso
   */
  public async updateFeedbackStatus(
    id: string,
    status: 'pending' | 'reviewed' | 'implemented' | 'rejected',
    priority?: 'low' | 'medium' | 'high'
  ): Promise<boolean> {
    if (!this.supabase) {
      console.error('Cliente Supabase não inicializado');
      return false;
    }
    
    try {
      const updateData: any = { status };
      
      if (priority) {
        updateData.priority = priority;
      }
      
      const { error } = await this.supabase
        .from('user_feedback')
        .update(updateData)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status do feedback:', error);
      return false;
    }
  }
  
  /**
   * Obtém estatísticas de feedback
   * @param startDate Data de início
   * @param endDate Data de fim
   * @returns Estatísticas de feedback
   */
  public async getFeedbackStats(startDate: Date, endDate: Date): Promise<any> {
    if (!this.supabase) {
      console.error('Cliente Supabase não inicializado');
      return null;
    }
    
    try {
      const { data, error } = await this.supabase
        .from('user_feedback')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
      
      if (error) {
        throw error;
      }
      
      // Calcular estatísticas
      const stats = {
        total: data.length,
        byType: {} as Record<string, number>,
        byModule: {} as Record<string, number>,
        byStatus: {} as Record<string, number>,
        byPriority: {} as Record<string, number>,
        averageSatisfaction: 0,
        topFeatures: [] as { feature: string; count: number }[]
      };
      
      // Contagem por tipo
      data.forEach((item: any) => {
        // Por tipo
        stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
        
        // Por módulo
        stats.byModule[item.module] = (stats.byModule[item.module] || 0) + 1;
        
        // Por status
        stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1;
        
        // Por prioridade
        if (item.priority) {
          stats.byPriority[item.priority] = (stats.byPriority[item.priority] || 0) + 1;
        }
      });
      
      // Média de satisfação
      const satisfactionItems = data.filter((item: any) => item.satisfaction_level !== null);
      if (satisfactionItems.length > 0) {
        const totalSatisfaction = satisfactionItems.reduce(
          (sum: number, item: any) => sum + item.satisfaction_level,
          0
        );
        stats.averageSatisfaction = totalSatisfaction / satisfactionItems.length;
      }
      
      // Top features
      const featureCounts: Record<string, number> = {};
      data.forEach((item: any) => {
        if (item.feature) {
          featureCounts[item.feature] = (featureCounts[item.feature] || 0) + 1;
        }
      });
      
      stats.topFeatures = Object.entries(featureCounts)
        .map(([feature, count]) => ({ feature, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas de feedback:', error);
      return null;
    }
  }
}

// Exportar instância única do serviço de feedback
export const feedbackService = FeedbackService.getInstance();
