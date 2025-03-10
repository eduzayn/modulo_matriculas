import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

interface CookieOptions {
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  path?: string;
  domain?: string;
  sameSite?: 'strict' | 'lax' | 'none';
  [key: string]: any;
}

export const createClient = (request: NextRequest) => {
  // Criar um objeto de resposta vazio para começar
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Criar cliente Supabase com cookies do request e response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Se já existir um cookie com este nome, atualizá-lo
          request.cookies.set({
            name,
            value,
            ...options,
          })
          
          // Atualizar o objeto de resposta com o novo cookie
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          // Remover o cookie
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          
          // Atualizar o objeto de resposta
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  return { supabase, response }
}
