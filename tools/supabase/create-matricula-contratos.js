require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to create matricula_contratos table
async function createMatriculaContratosTable() {
  console.log('Creating matricula_contratos table...');
  
  try {
    // Create matricula_contratos table
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'contracts_creator@example.com',
      password: 'tempPassword123',
      email_confirm: true,
      user_metadata: { 
        sql: `
        -- Criar tabela de contratos de matrícula
        CREATE TABLE IF NOT EXISTS public.matricula_contratos (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          matricula_id UUID NOT NULL,
          titulo TEXT NOT NULL,
          versao TEXT NOT NULL,
          url TEXT NOT NULL,
          status TEXT DEFAULT 'pendente',
          data_assinatura TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Criar índice para melhorar performance
        CREATE INDEX IF NOT EXISTS idx_matricula_contratos_matricula_id ON public.matricula_contratos(matricula_id);
        CREATE INDEX IF NOT EXISTS idx_matricula_contratos_status ON public.matricula_contratos(status);
        
        -- Habilitar RLS para a tabela
        ALTER TABLE public.matricula_contratos ENABLE ROW LEVEL SECURITY;
        
        -- Criar políticas RLS
        DROP POLICY IF EXISTS "Alunos podem ver seus próprios contratos" ON public.matricula_contratos;
        CREATE POLICY "Alunos podem ver seus próprios contratos" ON public.matricula_contratos
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM auth.users u 
            WHERE u.id = auth.uid() AND matricula_id::text = u.id::text
          ) OR 
          auth.jwt() ->> 'role' = 'admin' OR 
          auth.jwt() ->> 'role' = 'secretaria'
        );
        
        DROP POLICY IF EXISTS "Administradores podem gerenciar contratos" ON public.matricula_contratos;
        CREATE POLICY "Administradores podem gerenciar contratos" ON public.matricula_contratos
        FOR ALL USING (
          auth.jwt() ->> 'role' = 'admin' OR 
          auth.jwt() ->> 'role' = 'secretaria'
        );
        
        -- Criar função para atualizar o campo updated_at
        CREATE OR REPLACE FUNCTION update_matricula_contratos_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
           NEW.updated_at = NOW();
           RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        -- Criar trigger para atualização de updated_at
        DROP TRIGGER IF EXISTS update_matricula_contratos_modtime ON public.matricula_contratos;
        CREATE TRIGGER update_matricula_contratos_modtime
        BEFORE UPDATE ON public.matricula_contratos
        FOR EACH ROW
        EXECUTE FUNCTION update_matricula_contratos_updated_at();
        `
      }
    });
    
    if (error) {
      console.error('Error creating matricula_contratos table:', error);
      return false;
    }
    
    console.log('Matricula contratos table created successfully');
    return true;
  } catch (err) {
    console.error('Exception creating matricula_contratos table:', err);
    return false;
  }
}

// Run the function
createMatriculaContratosTable().catch(err => {
  console.error('Process failed:', err);
  process.exit(1);
});
