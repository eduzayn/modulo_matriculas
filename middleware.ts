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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se a rota atual requer autenticação
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route) || pathname.includes('/matricula/') && pathname.includes('/edit') || 
    pathname.includes('/matricula/') && pathname.includes('/documents') ||
    pathname.includes('/matricula/') && pathname.includes('/contract') ||
    pathname.includes('/matricula/') && pathname.includes('/payments')
  )

  // Verificar se a rota atual requer permissão de administrador
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  // Se não for uma rota protegida, continuar normalmente
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Criar cliente Supabase
  const { supabase, response } = createClient(request)

  // Verificar se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

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

  // Usuário autenticado e com permissões adequadas, continuar normalmente
  return response
}

// Configurar em quais caminhos o middleware será executado
export const config = {
  matcher: [
    '/matricula/:path*',
  ],
}
