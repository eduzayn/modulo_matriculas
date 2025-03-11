#!/bin/bash

# Script to fix database schema issues
# Author: Devin AI
# Date: 11/03/2025

echo "Fixing database schema issues..."

# Load environment variables
if [ -f .env.local ]; then
  source .env.local
fi

# Connect to the database
PGPASSWORD=EDUNEXIA2028 psql -h db.uasnyifizdjxogowijip.supabase.co -U postgres -d postgres << 'EOSQL'

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS matricula;

-- Create or fix students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create or fix courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create or fix matricula.registros table
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

-- Create or fix matricula_documentos table
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

-- Create or fix matricula_contratos table
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

-- Insert test data
INSERT INTO students (name, email)
VALUES ('Test Student Shell', 'test.shell@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO courses (name, title, description, price)
VALUES ('Test Course Shell', 'Test Course Title Shell', 'Test course description', 1000.00)
ON CONFLICT DO NOTHING;

-- Get IDs for test data
WITH student_id AS (
  SELECT id FROM students WHERE email = 'test.shell@example.com' LIMIT 1
),
course_id AS (
  SELECT id FROM courses WHERE name = 'Test Course Shell' LIMIT 1
)
INSERT INTO matricula.registros (aluno_id, curso_id, status, forma_pagamento, numero_parcelas, metadata)
SELECT student_id.id, course_id.id, 'pendente', 'cartao_credito', 12, '{"source":"shell_script"}'::jsonb
FROM student_id, course_id
ON CONFLICT DO NOTHING;

EOSQL

echo "Database schema fixed successfully!"
