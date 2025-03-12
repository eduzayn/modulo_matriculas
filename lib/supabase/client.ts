import { createClient as createClientBase } from '@supabase/supabase-js';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Authentication features may not work properly.');
  }
  
  return createClientBase(
    supabaseUrl || '',
    supabaseAnonKey || '',
    {
      auth: {
        persistSession: true,
      },
      // Add graceful error handling for development
      global: {
        fetch: (url: RequestInfo | URL, options?: RequestInit) => {
          return fetch(url, options).catch(err => {
            console.error('Supabase fetch error:', err);
            throw err;
          });
        }
      }
    }
  );
};
