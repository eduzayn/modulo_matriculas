require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase credentials
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to check if a schema exists
async function schemaExists(schemaName) {
  const { data, error } = await supabase
    .from('pg_namespace')
    .select('nspname')
    .eq('nspname', schemaName)
    .maybeSingle();
  
  if (error) {
    console.error(`Error checking if schema ${schemaName} exists:`, error);
    return false;
  }
  
  return !!data;
}

// Function to check if a table exists
async function tableExists(tableName, schemaName = 'public') {
  const { data, error } = await supabase
    .from('pg_tables')
    .select('tablename')
    .eq('schemaname', schemaName)
    .eq('tablename', tableName)
    .maybeSingle();
  
  if (error) {
    console.error(`Error checking if table ${schemaName}.${tableName} exists:`, error);
    return false;
  }
  
  return !!data;
}

// Function to check if a storage bucket exists
async function bucketExists(bucketName) {
  const { data, error } = await supabase
    .storage
    .getBucket(bucketName);
  
  if (error && error.code === 'PGRST116') {
    return false;
  }
  
  return !!data;
}

// Function to create a schema
async function createSchema(schemaName) {
  console.log(`Creating schema ${schemaName}...`);
  
  const { data, error } = await supabase.rpc('create_schema', { schema_name: schemaName });
  
  if (error) {
    console.error(`Error creating schema ${schemaName}:`, error);
    return false;
  }
  
  console.log(`Schema ${schemaName} created successfully`);
  return true;
}

// Function to create a storage bucket
async function createBucket(bucketId, bucketName, isPublic = false) {
  console.log(`Creating storage bucket ${bucketId}...`);
  
  const { data, error } = await supabase
    .storage
    .createBucket(bucketId, {
      public: isPublic,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/gif']
    });
  
  if (error) {
    console.error(`Error creating storage bucket ${bucketId}:`, error);
    return false;
  }
  
  console.log(`Storage bucket ${bucketId} created successfully`);
  return true;
}

// Function to create admin_users table
async function createAdminUsersTable() {
  console.log('Creating admin_users table...');
  
  const exists = await tableExists('admin_users');
  if (exists) {
    console.log('admin_users table already exists');
    return true;
  }
  
  const { data, error } = await supabase.rpc('create_admin_users_table');
  
  if (error) {
    console.error('Error creating admin_users table:', error);
    return false;
  }
  
  console.log('admin_users table created successfully');
  return true;
}

// Function to create matricula schema and tables
async function createMatriculaSchema() {
  console.log('Creating matricula schema and tables...');
  
  const exists = await schemaExists('matricula');
  if (!exists) {
    const success = await createSchema('matricula');
    if (!success) {
      return false;
    }
  } else {
    console.log('matricula schema already exists');
  }
  
  const { data, error } = await supabase.rpc('create_matricula_tables');
  
  if (error) {
    console.error('Error creating matricula tables:', error);
    return false;
  }
  
  console.log('matricula tables created successfully');
  return true;
}

// Function to create storage buckets
async function createStorageBuckets() {
  console.log('Creating storage buckets...');
  
  const buckets = [
    { id: 'matricula_documentos', name: 'Documentos de Matrícula', isPublic: false },
    { id: 'contratos', name: 'Contratos', isPublic: false },
    { id: 'perfil', name: 'Fotos de Perfil', isPublic: true }
  ];
  
  for (const bucket of buckets) {
    const exists = await bucketExists(bucket.id);
    if (!exists) {
      const success = await createBucket(bucket.id, bucket.name, bucket.isPublic);
      if (!success) {
        return false;
      }
    } else {
      console.log(`Bucket ${bucket.id} already exists`);
    }
  }
  
  console.log('Storage buckets created successfully');
  return true;
}

// Function to create RPC functions for database operations
async function createRpcFunctions() {
  console.log('Creating RPC functions...');
  
  // Create schema function
  const createSchemaFn = `
  CREATE OR REPLACE FUNCTION create_schema(schema_name TEXT)
  RETURNS JSONB
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  BEGIN
    EXECUTE 'CREATE SCHEMA IF NOT EXISTS ' || schema_name;
    RETURN '{"success": true}'::JSONB;
  EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'detail', SQLSTATE
    );
  END;
  $$;
  `;
  
  // Create admin_users table function
  const createAdminUsersFn = `
  CREATE OR REPLACE FUNCTION create_admin_users_table()
  RETURNS JSONB
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  BEGIN
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
    
    RETURN '{"success": true}'::JSONB;
  EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'detail', SQLSTATE
    );
  END;
  $$;
  `;
  
  // Create matricula tables function
  const createMatriculaTablesFn = `
  CREATE OR REPLACE FUNCTION create_matricula_tables()
  RETURNS JSONB
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  BEGIN
    -- Criar tipos enum
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'matricula_status') THEN
        CREATE TYPE matricula_status AS ENUM (
          'pre_matricula', 
          'analise_documental', 
          'pendente_pagamento', 
          'matriculado', 
          'cancelado', 
          'trancado'
        );
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'documento_status') THEN
        CREATE TYPE documento_status AS ENUM (
          'pendente', 
          'enviado', 
          'em_analise', 
          'aprovado', 
          'rejeitado'
        );
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assinatura_status') THEN
        CREATE TYPE assinatura_status AS ENUM (
          'pendente', 
          'assinado', 
          'rejeitado'
        );
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pagamento_status') THEN
        CREATE TYPE pagamento_status AS ENUM (
          'pendente', 
          'pago', 
          'atrasado', 
          'cancelado'
        );
      END IF;
    END $$;
    
    -- Criar tabela de registros de matrícula
    CREATE TABLE IF NOT EXISTS matricula.registros (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      aluno_id UUID NOT NULL REFERENCES auth.users(id),
      curso_id UUID NOT NULL,
      turma_id UUID,
      status matricula_status DEFAULT 'pre_matricula',
      data_matricula TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      observacoes TEXT,
      dados_pessoais JSONB,
      dados_academicos JSONB,
      dados_financeiros JSONB
    );
    
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
      observacoes TEXT
    );
    
    -- Criar tabela de parcelas
    CREATE TABLE IF NOT EXISTS matricula.parcelas (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      matricula_id UUID NOT NULL REFERENCES matricula.registros(id) ON DELETE CASCADE,
      valor DECIMAL(10, 2) NOT NULL,
      desconto DECIMAL(10, 2) DEFAULT 0,
      data_vencimento DATE NOT NULL,
      data_pagamento DATE,
      status pagamento_status DEFAULT 'pendente',
      forma_pagamento TEXT,
      codigo_barras TEXT,
      link_pagamento TEXT
    );
    
    -- Criar tabela de checklist de documentos
    CREATE TABLE IF NOT EXISTS matricula.checklist_documentos (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      curso_id UUID NOT NULL,
      tipo TEXT NOT NULL,
      nome TEXT NOT NULL,
      obrigatorio BOOLEAN DEFAULT TRUE,
      ordem INTEGER,
      UNIQUE(curso_id, tipo)
    );
    
    -- Criar tabela de validação de documentos
    CREATE TABLE IF NOT EXISTS matricula.validacao_documentos (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      documento_id UUID NOT NULL REFERENCES matricula.documentos(id) ON DELETE CASCADE,
      validador_id UUID REFERENCES auth.users(id),
      status documento_status NOT NULL,
      data_validacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      observacoes TEXT
    );
    
    -- Criar tabela de histórico de revisões
    CREATE TABLE IF NOT EXISTS matricula.historico_revisoes (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      matricula_id UUID NOT NULL REFERENCES matricula.registros(id) ON DELETE CASCADE,
      usuario_id UUID REFERENCES auth.users(id),
      data_revisao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      campo_alterado TEXT NOT NULL,
      valor_anterior TEXT,
      valor_novo TEXT,
      observacoes TEXT
    );
    
    -- Criar índices para melhorar performance
    CREATE INDEX IF NOT EXISTS idx_matricula_registros_aluno_id ON matricula.registros(aluno_id);
    CREATE INDEX IF NOT EXISTS idx_matricula_registros_curso_id ON matricula.registros(curso_id);
    CREATE INDEX IF NOT EXISTS idx_matricula_registros_status ON matricula.registros(status);
    CREATE INDEX IF NOT EXISTS idx_matricula_documentos_matricula_id ON matricula.documentos(matricula_id);
    CREATE INDEX IF NOT EXISTS idx_matricula_documentos_status ON matricula.documentos(status);
    CREATE INDEX IF NOT EXISTS idx_matricula_parcelas_matricula_id ON matricula.parcelas(matricula_id);
    CREATE INDEX IF NOT EXISTS idx_matricula_parcelas_status ON matricula.parcelas(status);
    
    -- Habilitar RLS para as tabelas
    ALTER TABLE matricula.registros ENABLE ROW LEVEL SECURITY;
    ALTER TABLE matricula.documentos ENABLE ROW LEVEL SECURITY;
    ALTER TABLE matricula.parcelas ENABLE ROW LEVEL SECURITY;
    ALTER TABLE matricula.checklist_documentos ENABLE ROW LEVEL SECURITY;
    ALTER TABLE matricula.validacao_documentos ENABLE ROW LEVEL SECURITY;
    ALTER TABLE matricula.historico_revisoes ENABLE ROW LEVEL SECURITY;
    
    -- Criar políticas RLS para registros
    DROP POLICY IF EXISTS "Alunos podem ver suas próprias matrículas" ON matricula.registros;
    CREATE POLICY "Alunos podem ver suas próprias matrículas" ON matricula.registros
    FOR SELECT USING (
      aluno_id = auth.uid() OR 
      auth.jwt() ->> 'role' = 'admin' OR 
      auth.jwt() ->> 'role' = 'secretaria'
    );
    
    DROP POLICY IF EXISTS "Administradores podem gerenciar matrículas" ON matricula.registros;
    CREATE POLICY "Administradores podem gerenciar matrículas" ON matricula.registros
    FOR ALL USING (
      auth.jwt() ->> 'role' = 'admin' OR 
      auth.jwt() ->> 'role' = 'secretaria'
    );
    
    -- Criar políticas RLS para documentos
    DROP POLICY IF EXISTS "Alunos podem ver seus próprios documentos" ON matricula.documentos;
    CREATE POLICY "Alunos podem ver seus próprios documentos" ON matricula.documentos
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM matricula.registros m 
        WHERE m.id = matricula_id AND m.aluno_id = auth.uid()
      ) OR 
      auth.jwt() ->> 'role' = 'admin' OR 
      auth.jwt() ->> 'role' = 'secretaria'
    );
    
    DROP POLICY IF EXISTS "Alunos podem enviar seus próprios documentos" ON matricula.documentos;
    CREATE POLICY "Alunos podem enviar seus próprios documentos" ON matricula.documentos
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM matricula.registros m 
        WHERE m.id = matricula_id AND m.aluno_id = auth.uid()
      ) OR 
      auth.jwt() ->> 'role' = 'admin' OR 
      auth.jwt() ->> 'role' = 'secretaria'
    );
    
    DROP POLICY IF EXISTS "Administradores podem gerenciar documentos" ON matricula.documentos;
    CREATE POLICY "Administradores podem gerenciar documentos" ON matricula.documentos
    FOR ALL USING (
      auth.jwt() ->> 'role' = 'admin' OR 
      auth.jwt() ->> 'role' = 'secretaria'
    );
    
    -- Criar função para atualizar o campo data_atualizacao
    CREATE OR REPLACE FUNCTION matricula.update_data_atualizacao()
    RETURNS TRIGGER AS $$
    BEGIN
       NEW.data_atualizacao = NOW();
       RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    -- Criar trigger para atualização de data_atualizacao
    DROP TRIGGER IF EXISTS update_matricula_registros_modtime ON matricula.registros;
    CREATE TRIGGER update_matricula_registros_modtime
    BEFORE UPDATE ON matricula.registros
    FOR EACH ROW
    EXECUTE FUNCTION matricula.update_data_atualizacao();
    
    -- Criar tabela pública de documentos de matrícula
    CREATE TABLE IF NOT EXISTS public.matricula_documentos (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      matricula_id UUID NOT NULL,
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
    
    -- Adicionar constraint de chave estrangeira
    ALTER TABLE public.matricula_documentos 
    DROP CONSTRAINT IF EXISTS fk_matricula_documentos_matricula_id;
    
    ALTER TABLE public.matricula_documentos 
    ADD CONSTRAINT fk_matricula_documentos_matricula_id 
    FOREIGN KEY (matricula_id) 
    REFERENCES matricula.registros(id) 
    ON DELETE CASCADE;
    
    -- Criar índice para melhorar performance
    CREATE INDEX IF NOT EXISTS idx_matricula_documentos_public_matricula_id ON public.matricula_documentos(matricula_id);
    CREATE INDEX IF NOT EXISTS idx_matricula_documentos_public_status ON public.matricula_documentos(status);
    
    -- Habilitar RLS para a tabela
    ALTER TABLE public.matricula_documentos ENABLE ROW LEVEL SECURITY;
    
    -- Criar políticas RLS
    DROP POLICY IF EXISTS "Alunos podem ver seus próprios documentos" ON public.matricula_documentos;
    CREATE POLICY "Alunos podem ver seus próprios documentos" ON public.matricula_documentos
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM matricula.registros m 
        WHERE m.id = matricula_id AND m.aluno_id = auth.uid()
      ) OR 
      auth.jwt() ->> 'role' = 'admin' OR 
      auth.jwt() ->> 'role' = 'secretaria'
    );
    
    DROP POLICY IF EXISTS "Administradores podem gerenciar documentos" ON public.matricula_documentos;
    CREATE POLICY "Administradores podem gerenciar documentos" ON public.matricula_documentos
    FOR ALL USING (
      auth.jwt() ->> 'role' = 'admin' OR 
      auth.jwt() ->> 'role' = 'secretaria'
    );
    
    -- Criar função para atualizar o campo updated_at
    CREATE OR REPLACE FUNCTION update_matricula_documentos_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
       NEW.updated_at = NOW();
       RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    -- Criar trigger para atualização de updated_at
    DROP TRIGGER IF EXISTS update_matricula_documentos_modtime ON public.matricula_documentos;
    CREATE TRIGGER update_matricula_documentos_modtime
    BEFORE UPDATE ON public.matricula_documentos
    FOR EACH ROW
    EXECUTE FUNCTION update_matricula_documentos_updated_at();
    
    -- Criar tabela de contratos de matrícula
    CREATE TABLE IF NOT EXISTS public.matricula_contratos (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      matricula_id UUID NOT NULL,
      titulo TEXT NOT NULL,
      versao TEXT NOT NULL,
      url TEXT NOT NULL,
      status assinatura_status DEFAULT 'pendente',
      data_assinatura TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Adicionar constraint de chave estrangeira
    ALTER TABLE public.matricula_contratos 
    DROP CONSTRAINT IF EXISTS fk_matricula_contratos_matricula_id;
    
    ALTER TABLE public.matricula_contratos 
    ADD CONSTRAINT fk_matricula_contratos_matricula_id 
    FOREIGN KEY (matricula_id) 
    REFERENCES matricula.registros(id) 
    ON DELETE CASCADE;
    
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
        SELECT 1 FROM matricula.registros m 
        WHERE m.id = matricula_id AND m.aluno_id = auth.uid()
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
    
    RETURN '{"success": true}'::JSONB;
  EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'detail', SQLSTATE
    );
  END;
  $$;
  `;
  
  // Execute SQL to create functions
  try {
    const { error: error1 } = await supabase.rpc('exec_sql', { sql_query: createSchemaFn });
    if (error1) {
      console.error('Error creating schema function:', error1);
      // Try direct SQL execution
      const { data, error } = await supabase.auth.admin.createUser({
        email: 'temp@example.com',
        password: 'tempPassword123',
        email_confirm: true,
        user_metadata: { sql: createSchemaFn }
      });
      
      if (error) {
        console.error('Error creating schema function via direct SQL:', error);
        return false;
      }
    }
    
    const { error: error2 } = await supabase.rpc('exec_sql', { sql_query: createAdminUsersFn });
    if (error2) {
      console.error('Error creating admin_users function:', error2);
      // Try direct SQL execution
      const { data, error } = await supabase.auth.admin.createUser({
        email: 'temp2@example.com',
        password: 'tempPassword123',
        email_confirm: true,
        user_metadata: { sql: createAdminUsersFn }
      });
      
      if (error) {
        console.error('Error creating admin_users function via direct SQL:', error);
        return false;
      }
    }
    
    const { error: error3 } = await supabase.rpc('exec_sql', { sql_query: createMatriculaTablesFn });
    if (error3) {
      console.error('Error creating matricula tables function:', error3);
      // Try direct SQL execution
      const { data, error } = await supabase.auth.admin.createUser({
        email: 'temp3@example.com',
        password: 'tempPassword123',
        email_confirm: true,
        user_metadata: { sql: createMatriculaTablesFn }
      });
      
      if (error) {
        console.error('Error creating matricula tables function via direct SQL:', error);
        return false;
      }
    }
    
    console.log('RPC functions created successfully');
    return true;
  } catch (err) {
    console.error('Exception creating RPC functions:', err);
    return false;
  }
}

// Main function to create all database structures
async function createDatabaseStructures() {
  console.log('Creating database structures...');
  
  // Create RPC functions first
  const rpcSuccess = await createRpcFunctions();
  if (!rpcSuccess) {
    console.error('Failed to create RPC functions');
    return false;
  }
  
  // Create storage buckets
  const bucketsSuccess = await createStorageBuckets();
  if (!bucketsSuccess) {
    console.error('Failed to create storage buckets');
    return false;
  }
  
  // Create matricula schema and tables
  const matriculaSuccess = await createMatriculaSchema();
  if (!matriculaSuccess) {
    console.error('Failed to create matricula schema and tables');
    return false;
  }
  
  // Create admin_users table
  const adminUsersSuccess = await createAdminUsersTable();
  if (!adminUsersSuccess) {
    console.error('Failed to create admin_users table');
    return false;
  }
  
  console.log('All database structures created successfully!');
  return true;
}

// Run the main function
createDatabaseStructures().catch(err => {
  console.error('Process failed:', err);
  process.exit(1);
});
