require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to create admin_users table
async function createAdminUsersTable() {
  console.log('Creating admin_users table...');
  
  try {
    // Create admin_users table
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin_creator@example.com',
      password: 'tempPassword123',
      email_confirm: true,
      user_metadata: { 
        sql: `
        CREATE TABLE IF NOT EXISTS public.admin_users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id),
          role TEXT NOT NULL CHECK (role IN ('admin', 'secretaria', 'financeiro', 'academico', 'atendimento')),
          nome TEXT NOT NULL,
          email TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id)
        );
        
        -- Habilitar RLS para a tabela
        ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
        
        -- Criar políticas RLS
        DROP POLICY IF EXISTS "Administradores podem ver todos os usuários admin" ON public.admin_users;
        CREATE POLICY "Administradores podem ver todos os usuários admin" ON public.admin_users
        FOR SELECT USING (
          auth.jwt() ->> 'role' = 'admin'
        );
        
        DROP POLICY IF EXISTS "Administradores podem gerenciar usuários admin" ON public.admin_users;
        CREATE POLICY "Administradores podem gerenciar usuários admin" ON public.admin_users
        FOR ALL USING (
          auth.jwt() ->> 'role' = 'admin'
        );
        
        DROP POLICY IF EXISTS "Usuários podem ver seu próprio registro" ON public.admin_users;
        CREATE POLICY "Usuários podem ver seu próprio registro" ON public.admin_users
        FOR SELECT USING (
          user_id = auth.uid()
        );
        
        -- Criar função para atualizar o campo updated_at
        CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
           NEW.updated_at = NOW();
           RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        -- Criar trigger para atualização de updated_at
        DROP TRIGGER IF EXISTS update_admin_users_modtime ON public.admin_users;
        CREATE TRIGGER update_admin_users_modtime
        BEFORE UPDATE ON public.admin_users
        FOR EACH ROW
        EXECUTE FUNCTION update_admin_users_updated_at();
        
        -- Criar função para adicionar role ao JWT
        CREATE OR REPLACE FUNCTION public.get_admin_role()
        RETURNS TRIGGER AS $$
        DECLARE
          admin_role TEXT;
        BEGIN
          SELECT role INTO admin_role FROM public.admin_users
          WHERE user_id = NEW.id;
          
          IF admin_role IS NOT NULL THEN
            NEW.raw_app_meta_data := 
              jsonb_set(
                COALESCE(NEW.raw_app_meta_data, '{}'::jsonb),
                '{role}',
                to_jsonb(admin_role)
              );
          END IF;
          
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        -- Criar trigger para adicionar role ao JWT
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.get_admin_role();
        
        DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
        CREATE TRIGGER on_auth_user_updated
        AFTER UPDATE ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.get_admin_role();
        `
      }
    });
    
    if (error) {
      console.error('Error creating admin_users table:', error);
      return false;
    }
    
    console.log('Admin users table created successfully');
    return true;
  } catch (err) {
    console.error('Exception creating admin_users table:', err);
    return false;
  }
}

// Run the function
createAdminUsersTable().catch(err => {
  console.error('Process failed:', err);
  process.exit(1);
});
