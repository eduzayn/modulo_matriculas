import { NextRequest, NextResponse } from 'next/server';
import { FeedbackService, FeedbackType, SatisfactionLevel } from '@/app/matricula/lib/services/feedback-service';
import { createClient } from '@supabase/supabase-js';
import { env } from 'process';
import { z } from 'zod';

// Schema para validação do feedback
const feedbackSchema = z.object({
  type: z.enum([
    FeedbackType.BUG,
    FeedbackType.FEATURE_REQUEST,
    FeedbackType.USABILITY,
    FeedbackType.PERFORMANCE,
    FeedbackType.GENERAL
  ]),
  message: z.string().min(10).max(1000),
  satisfactionLevel: z.nativeEnum(SatisfactionLevel).optional(),
  module: z.string(),
  feature: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

/**
 * API para submeter feedback
 * 
 * @route POST /api/feedback
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const supabase = createClient(
      env.SUPABASE_URL || '',
      env.SUPABASE_ANON_KEY || ''
    );
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Obter dados do corpo da requisição
    const body = await request.json();
    
    // Validar dados
    const result = feedbackSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Submeter feedback
    const feedbackService = FeedbackService.getInstance();
    const feedbackId = await feedbackService.submitFeedback({
      userId: session.user.id,
      ...result.data
    });
    
    if (!feedbackId) {
      return NextResponse.json(
        { error: 'Erro ao submeter feedback' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: { id: feedbackId }
    });
  } catch (error) {
    console.error('Erro ao processar requisição de feedback:', error);
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * API para obter feedbacks
 * 
 * @route GET /api/feedback
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação (apenas administradores para ver todos os feedbacks)
    const supabase = createClient(
      env.SUPABASE_URL || '',
      env.SUPABASE_ANON_KEY || ''
    );
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Verificar se o usuário é administrador
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();
    
    const isAdmin = userRole && userRole.role === 'admin';
    
    // Obter parâmetros da requisição
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as FeedbackType | null;
    const module = searchParams.get('module');
    const feature = searchParams.get('feature');
    const status = searchParams.get('status') as 'pending' | 'reviewed' | 'implemented' | 'rejected' | null;
    const priority = searchParams.get('priority') as 'low' | 'medium' | 'high' | null;
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    
    // Construir filtros
    const filters: any = {};
    
    if (type) filters.type = type;
    if (module) filters.module = module;
    if (feature) filters.feature = feature;
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    
    if (startDate) {
      filters.startDate = new Date(startDate);
    }
    
    if (endDate) {
      filters.endDate = new Date(endDate);
    }
    
    // Se não for admin, mostrar apenas os feedbacks do próprio usuário
    if (!isAdmin) {
      filters.userId = session.user.id;
    }
    
    // Obter feedbacks
    const feedbackService = FeedbackService.getInstance();
    const feedbacks = await feedbackService.getAllFeedback(filters);
    
    return NextResponse.json({
      success: true,
      data: feedbacks
    });
  } catch (error) {
    console.error('Erro ao processar requisição de feedbacks:', error);
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
