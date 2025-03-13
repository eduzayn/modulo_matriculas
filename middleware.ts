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
  // Remover esta linha em produção antes do deploy final
  return NextResponse.next()
}

// Configurar em quais caminhos o middleware será executado
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
