import { createClient as createClientBase } from '@supabase/supabase-js';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Missing Supabase environment variables. Server-side authentication features may not work properly.');
  }
  
  return createClientBase(
    supabaseUrl || '',
    supabaseServiceKey || '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};
