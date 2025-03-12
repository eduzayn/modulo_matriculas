import { createClient as createClientBrowser } from './client';
import { createClient as createClientServer } from './server';
import { validateEnvironmentVariables } from '../utils/env-validation';

// Validate Supabase environment variables
export function validateSupabaseEnv() {
  return validateEnvironmentVariables({
    'NEXT_PUBLIC_SUPABASE_URL': 'URL do projeto Supabase',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Chave anônima do Supabase',
    'SUPABASE_SERVICE_ROLE_KEY': 'Chave de serviço do Supabase (apenas para uso no servidor)'
  });
}

// Export client creators
export const createBrowserClient = createClientBrowser;
export const createServerClient = createClientServer;
