// Comprehensive fix script
// Author: Devin AI
// Date: 11/03/2025

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixEverything() {
  console.log('Starting comprehensive fixes...');
  
  try {
    // Drop existing tables
    console.log('Dropping existing tables...');
    await supabase.rpc('exec_sql', {
      sql: `
        DROP TABLE IF EXISTS public.contratos CASCADE;
        DROP TABLE IF EXISTS public.documentos CASCADE;
        DROP TABLE IF EXISTS public.matriculas CASCADE;
      `
    });
    
    // Create matriculas table
    console.log('Creating matriculas table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE public.matriculas (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          aluno_id UUID REFERENCES public.students(id),
          curso_id UUID REFERENCES public.courses(id),
          status TEXT DEFAULT 'pendente',
          forma_pagamento TEXT,
          numero_parcelas INTEGER,
          desconto_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          metadata JSONB DEFAULT '{}'::jsonb
        );
      `
    });
    
    // Create documentos table
    console.log('Creating documentos table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE public.documentos (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          matricula_id UUID REFERENCES public.matriculas(id),
          tipo TEXT NOT NULL,
          nome TEXT NOT NULL,
          url TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pendente',
          observacoes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    // Create contratos table
    console.log('Creating contratos table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE public.contratos (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          matricula_id UUID REFERENCES public.matriculas(id),
          titulo TEXT NOT NULL,
          versao TEXT,
          url TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pendente',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    console.log('All tables created successfully!');
    
    // Refresh schema cache
    console.log('Refreshing schema cache...');
    await supabase.rpc('exec_sql', {
      sql: `
        NOTIFY pgrst, 'reload schema';
      `
    });
    
    console.log('Schema cache refreshed!');
    console.log('All fixes applied successfully!');
  } catch (error) {
    console.error('Error during fixes:', error);
  }
}

// Run the fixes
fixEverything();
