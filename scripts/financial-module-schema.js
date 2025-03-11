// Financial module database schema
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

async function createFinancialSchema() {
  console.log('Creating financial module database schema...');
  
  try {
    // Create financial schema
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE SCHEMA IF NOT EXISTS financial;
      `
    });
    
    // Create discounts table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS financial.discounts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          nome TEXT NOT NULL,
          descricao TEXT,
          tipo TEXT NOT NULL CHECK (tipo IN ('percentual', 'valor_fixo')),
          valor DECIMAL(10,2) NOT NULL,
          data_inicio DATE,
          data_fim DATE,
          ativo BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    // Create payment_methods table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS financial.payment_methods (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          nome TEXT NOT NULL,
          codigo TEXT NOT NULL UNIQUE,
          descricao TEXT,
          tipo TEXT NOT NULL CHECK (tipo IN ('cartao_credito', 'boleto', 'pix', 'transferencia')),
          ativo BOOLEAN DEFAULT TRUE,
          config JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    // Create payments table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS financial.payments (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          matricula_id UUID REFERENCES matricula.registros(id),
          numero_parcela INTEGER NOT NULL,
          valor DECIMAL(10,2) NOT NULL,
          data_vencimento DATE NOT NULL,
          data_pagamento DATE,
          status TEXT NOT NULL CHECK (status IN ('pendente', 'pago', 'atrasado', 'cancelado')),
          forma_pagamento TEXT NOT NULL,
          gateway_id TEXT,
          gateway_data JSONB DEFAULT '{}'::jsonb,
          comprovante_url TEXT,
          observacoes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    // Create transactions table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS financial.transactions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          reference_id UUID NOT NULL,
          reference_type TEXT NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'refund')),
          status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
          payment_method TEXT,
          gateway_id TEXT,
          gateway_data JSONB DEFAULT '{}'::jsonb,
          metadata JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    // Create invoices table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS financial.invoices (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          matricula_id UUID REFERENCES matricula.registros(id),
          aluno_id UUID REFERENCES students(id),
          numero TEXT NOT NULL,
          data_emissao DATE NOT NULL,
          data_vencimento DATE NOT NULL,
          valor_total DECIMAL(10,2) NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('pendente', 'pago', 'atrasado', 'cancelado')),
          url TEXT,
          metadata JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    // Create invoice_items table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS financial.invoice_items (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          invoice_id UUID REFERENCES financial.invoices(id),
          descricao TEXT NOT NULL,
          quantidade INTEGER NOT NULL DEFAULT 1,
          valor_unitario DECIMAL(10,2) NOT NULL,
          valor_total DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    // Create negotiations table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS financial.negotiations (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          aluno_id UUID REFERENCES students(id),
          responsavel_id UUID,
          status TEXT NOT NULL CHECK (status IN ('pendente', 'aprovada', 'rejeitada', 'cancelada', 'concluida')),
          valor_original DECIMAL(10,2) NOT NULL,
          valor_negociado DECIMAL(10,2) NOT NULL,
          numero_parcelas INTEGER NOT NULL,
          data_primeira_parcela DATE NOT NULL,
          observacoes TEXT,
          metadata JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    // Create negotiation_items table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS financial.negotiation_items (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          negotiation_id UUID REFERENCES financial.negotiations(id),
          payment_id UUID REFERENCES financial.payments(id),
          valor_original DECIMAL(10,2) NOT NULL,
          valor_negociado DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    // Create lytex_integration table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS financial.lytex_integration (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          payment_id UUID REFERENCES financial.payments(id),
          lytex_id TEXT NOT NULL,
          status TEXT NOT NULL,
          payment_method TEXT NOT NULL,
          payment_url TEXT,
          payment_data JSONB DEFAULT '{}'::jsonb,
          callback_data JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    // Create default payment methods
    await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO financial.payment_methods (nome, codigo, descricao, tipo, ativo, config)
        VALUES 
          ('Cartão de Crédito', 'cartao_credito', 'Pagamento via cartão de crédito', 'cartao_credito', TRUE, '{"gateway": "lytex"}'::jsonb),
          ('Boleto Bancário', 'boleto', 'Pagamento via boleto bancário', 'boleto', TRUE, '{"gateway": "lytex"}'::jsonb),
          ('PIX', 'pix', 'Pagamento via PIX', 'pix', TRUE, '{"gateway": "lytex"}'::jsonb),
          ('Transferência Bancária', 'transferencia', 'Pagamento via transferência bancária', 'transferencia', TRUE, '{"gateway": "lytex"}'::jsonb)
        ON CONFLICT (codigo) DO NOTHING;
      `
    });
    
    console.log('Financial module database schema created successfully!');
  } catch (error) {
    console.error('Error creating financial module database schema:', error);
  }
}

// Run the schema creation
createFinancialSchema();
