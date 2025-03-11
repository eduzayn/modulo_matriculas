import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

// Rotas que requerem autenticação
const protectedRoutes = [
  '/matricula/dashboard',
  '/matricula/reports',
  '/matricula/discounts',
  '/matricula/list',
  '/matricula/create',
  '/matricula/support',
]

// Rotas que requerem permissão de administrador
const adminRoutes = [
  '/matricula/dashboard',
  '/matricula/reports',
  '/matricula/discounts',
]

// Rotas do portal do aluno
const alunoRoutes = [
  '/aluno/dashboard',
  '/aluno/cursos',
  '/aluno/aulas',
  '/aluno/notas',
  '/aluno/financeiro',
  '/aluno/perfil',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Criar cliente Supabase
  const { supabase, response } = createClient(request)

  // Verificar se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Verificar se a rota atual requer autenticação para o módulo de matrículas
  const isMatriculaProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route) || pathname.includes('/matricula/') && pathname.includes('/edit') || 
    pathname.includes('/matricula/') && pathname.includes('/documents') ||
    pathname.includes('/matricula/') && pathname.includes('/contract') ||
    pathname.includes('/matricula/') && pathname.includes('/payments')
  )

  // Verificar se a rota atual é do portal do aluno
  const isAlunoRoute = pathname.startsWith('/aluno')

  // Verificar se a rota atual requer permissão de administrador
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  // Se não for uma rota protegida nem do portal do aluno, continuar normalmente
  if (!isMatriculaProtectedRoute && !isAlunoRoute) {
    return NextResponse.next()
  }

  // Se não estiver autenticado, redirecionar para a página de login
  if (!session) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Verificar se a rota requer permissão de administrador
  if (isAdminRoute) {
    const isAdmin = session.user?.app_metadata?.role === 'admin'
    
    // Se não for administrador, redirecionar para a lista de matrículas
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/matricula/list', request.url))
    }
  }

  // Verificar se é uma rota do portal do aluno
  if (isAlunoRoute) {
    // Verificar se o usuário é um aluno
    const { data: aluno } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', session.user.id)
      .single()
    
    // Se não for um aluno, redirecionar para a página de login com erro
    if (!aluno) {
      return NextResponse.redirect(new URL('/auth/login?error=unauthorized', request.url))
    }

    // Para rotas de detalhes de matrícula, verificar se o aluno tem acesso à matrícula
    if (pathname.match(/\/aluno\/matricula\/[^\/]+/)) {
      const matriculaId = pathname.split('/')[3]
      
      // Verificar se a matrícula pertence ao aluno
      const { data: matricula } = await supabase
        .from('matricula.registros')
        .select('id')
        .eq('id', matriculaId)
        .eq('aluno_id', aluno.id)
        .single()
      
      // Se a matrícula não pertencer ao aluno, redirecionar para o dashboard
      if (!matricula) {
        return NextResponse.redirect(new URL('/aluno/dashboard', request.url))
      }
    }
  }

  // Usuário autenticado e com permissões adequadas, continuar normalmente
  return response
}

// Configurar em quais caminhos o middleware será executado
export const config = {
  matcher: [
    '/matricula/:path*',
    '/aluno/:path*',
  ],
}
