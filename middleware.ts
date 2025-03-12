import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas públicas que não requerem autenticação
const publicRoutes = [
  '/test-responsive',
  '/demo',
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
]

// Rotas que requerem autenticação
const protectedRoutes = [
  '/matricula/pages/dashboard',
  '/matricula/reports',
  '/matricula/discounts',
  '/matricula/list',
  '/matricula/create',
  '/matricula/support',
]

// Rotas que requerem permissão de administrador
const adminRoutes = [
  '/matricula/pages/dashboard',
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
  '/aluno/contratos',
  '/aluno/perfil',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // MODO DE DESENVOLVIMENTO: Bypass de autenticação para testes
  // Remover esta linha em produção
  return NextResponse.next()

  // Código original comentado para testes
  /*
  // Verificar se a rota atual é pública
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route) || pathname === '/'
  )

  // Se for uma rota pública, permitir acesso sem autenticação
  if (isPublicRoute) {
    return NextResponse.next()
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

  // Se não for uma rota protegida nem do portal do aluno, continuar normalmente
  if (!isMatriculaProtectedRoute && !isAlunoRoute) {
    return NextResponse.next()
  }

  // Verificar autenticação através do site principal
  // Redirecionar para o site principal para autenticação
  const mainSiteLoginUrl = new URL(process.env.MAIN_SITE_URL + '/login' || '/auth/login', request.url)
  mainSiteLoginUrl.searchParams.set('callbackUrl', request.url)
  return NextResponse.redirect(mainSiteLoginUrl)
  */
}

// Configurar em quais caminhos o middleware será executado
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
