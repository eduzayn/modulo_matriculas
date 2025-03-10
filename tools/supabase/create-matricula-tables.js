require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to create matricula tables
async function createMatriculaTables() {
  console.log('Creating matricula tables...');
  
  try {
    // Create matricula tables
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'matricula_creator@example.com',
      password: 'tempPassword123',
      email_confirm: true,
      user_metadata: { 
        sql: `
        -- Criar tipos enum para status
        CREATE TYPE IF NOT EXISTS matricula_status AS ENUM (
          'pendente', 'em_analise', 'aprovada', 'rejeitada', 'cancelada', 'trancada', 'concluida'
        );
        
        CREATE TYPE IF NOT EXISTS documento_status AS ENUM (
          'pendente', 'aprovado', 'rejeitado', 'expirado'
        );
        
        CREATE TYPE IF NOT EXISTS assinatura_status AS ENUM (
          'pendente', 'assinado', 'rejeitado', 'expirado'
        );
        
        -- Criar tabela de registros de matrícula
        CREATE TABLE IF NOT EXISTS matricula.registros (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          aluno_id UUID NOT NULL REFERENCES auth.users(id),
          curso_id UUID NOT NULL,
          status matricula_status DEFAULT 'pendente',
          data_matricula TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          data_inicio TIMESTAMP WITH TIME ZONE,
          data_conclusao TIMESTAMP WITH TIME ZONE,
          observacoes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Criar índice para melhorar performance
        CREATE INDEX IF NOT EXISTS idx_matricula_registros_aluno_id ON matricula.registros(aluno_id);
        CREATE INDEX IF NOT EXISTS idx_matricula_registros_curso_id ON matricula.registros(curso_id);
        CREATE INDEX IF NOT EXISTS idx_matricula_registros_status ON matricula.registros(status);
        
        -- Criar tabela de documentos
        CREATE TABLE IF NOT EXISTS matricula.documentos (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          matricula_id UUID NOT NULL REFERENCES matricula.registros(id) ON DELETE CASCADE,
          tipo TEXT NOT NULL,
          nome TEXT NOT NULL,
          url TEXT NOT NULL,
          status documento_status DEFAULT 'pendente',
          data_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          data_analise TIMESTAMP WITH TIME ZONE,
          observacoes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Criar índice para melhorar performance
        CREATE INDEX IF NOT EXISTS idx_matricula_documentos_matricula_id ON matricula.documentos(matricula_id);
        CREATE INDEX IF NOT EXISTS idx_matricula_documentos_status ON matricula.documentos(status);
        
        -- Criar função para atualizar o campo updated_at
        CREATE OR REPLACE FUNCTION matricula.update_modified_column()
        RETURNS TRIGGER AS $$
        BEGIN
           NEW.updated_at = NOW();
           RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        -- Criar trigger para atualização de updated_at em registros
        DROP TRIGGER IF EXISTS update_matricula_registros_modtime ON matricula.registros;
        CREATE TRIGGER update_matricula_registros_modtime
        BEFORE UPDATE ON matricula.registros
        FOR EACH ROW
        EXECUTE FUNCTION matricula.update_modified_column();
        
        -- Criar trigger para atualização de updated_at em documentos
        DROP TRIGGER IF EXISTS update_matricula_documentos_modtime ON matricula.documentos;
        CREATE TRIGGER update_matricula_documentos_modtime
        BEFORE UPDATE ON matricula.documentos
        FOR EACH ROW
        EXECUTE FUNCTION matricula.update_modified_column();
        `
      }
    });
    
    if (error) {
      console.error('Error creating matricula tables:', error);
      return false;
    }
    
    console.log('Matricula tables created successfully');
    return true;
  } catch (err) {
    console.error('Exception creating matricula tables:', err);
    return false;
  }
}

// Run the function
createMatriculaTables().catch(err => {
  console.error('Process failed:', err);
  process.exit(1);
});
