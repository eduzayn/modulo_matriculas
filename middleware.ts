import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@edunexia/auth'

// Rotas públicas que não requerem autenticação
const publicRoutes = [
  '/test-responsive',
  '/demo',
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
  '/api/auth/callback',
  '/auth/signout',
]

// Rotas que requerem autenticação
const protectedRoutes = [
  '/matricula/dashboard',
  '/matricula/relatorios',
  '/matricula/descontos',
  '/matricula/alunos',
  '/matricula/cursos',
  '/matricula/pagamentos',
  '/matricula/configuracoes',
]

// Rotas que requerem permissão de administrador
const adminRoutes = [
  '/matricula/configuracoes',
]

// Rotas do portal do aluno
const alunoRoutes = [
  '/aluno/dashboard',
  '/aluno/cursos',
  '/aluno/aulas',
  '/aluno/notas',
  '/aluno/financeiro',
  '/aluno/contratos',
  '/aluno/perfil',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se estamos em modo de desenvolvimento
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  // Verificar se a rota atual é pública
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route) || pathname === '/'
  )

  // Se for uma rota pública, permitir acesso sem autenticação
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Em modo de desenvolvimento, podemos opcionalmente permitir bypass de autenticação
  if (isDevelopment && request.cookies.get('bypass-auth')?.value === 'true') {
    console.log('Bypass de autenticação ativado para desenvolvimento')
    return NextResponse.next()
  }

  // Criar resposta inicial
  let response = NextResponse.next()

  // Criar cliente de middleware do novo sistema de autenticação
  const supabase = createMiddlewareClient(request, response)

  try {
    // Verificar se o token é válido
    const { data: { session }, error } = await supabase.auth.getSession()

    // Se houver erro ou não houver sessão, redirecionar para login
    if (error || !session) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(redirectUrl)
    }

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

    // Verificar permissões de administrador para rotas que requerem
    if (isAdminRoute) {
      const userRole = session.user?.user_metadata?.role
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/matricula/dashboard', request.url))
      }
    }

    // Verificar permissões para rotas do portal do aluno
    if (isAlunoRoute) {
      const userRole = session.user?.user_metadata?.role
      if (userRole !== 'aluno') {
        return NextResponse.redirect(new URL('/matricula/dashboard', request.url))
      }
    }

    return response
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error)
    // Em caso de erro, redirecionar para login
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(redirectUrl)
  }
}

// Configurar em quais caminhos o middleware será executado
export const config = {
  matcher: [
    '/((?!api/auth/callback|_next/static|_next/image|favicon.ico).*)',
  ],
}
