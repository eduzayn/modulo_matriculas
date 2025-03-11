-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS matricula;

-- Create students table if it doesn't exist
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table if it doesn't exist
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matricula.registros table if it doesn't exist
CREATE TABLE IF NOT EXISTS matricula.registros (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID REFERENCES students(id),
  curso_id UUID REFERENCES courses(id),
  status TEXT,
  forma_pagamento TEXT,
  numero_parcelas INTEGER,
  desconto_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create matricula_documentos table if it doesn't exist
CREATE TABLE IF NOT EXISTS matricula_documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricula_id UUID REFERENCES matricula.registros(id),
  tipo TEXT NOT NULL,
  nome TEXT NOT NULL,
  url TEXT NOT NULL,
  status TEXT NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matricula_contratos table if it doesn't exist
CREATE TABLE IF NOT EXISTS matricula_contratos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricula_id UUID REFERENCES matricula.registros(id),
  titulo TEXT NOT NULL,
  versao TEXT,
  url TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
