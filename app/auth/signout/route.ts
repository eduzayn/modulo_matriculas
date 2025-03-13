import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  
  // Create Supabase client with simplified configuration
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        flowType: 'pkce',
        detectSessionInUrl: false,
      }
    }
  );

  // Sign out the user
  await supabase.auth.signOut();

  // Clear bypass cookie if it exists
  cookieStore.set('bypass-auth', '', { maxAge: 0, path: '/' });

  // Redirect to login page
  return NextResponse.redirect(new URL('/auth/login', request.url), {
    status: 302,
  });
}
