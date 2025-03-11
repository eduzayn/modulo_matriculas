#!/bin/bash

# Script para configuração do ambiente de testes do Módulo de Matrículas
# Autor: Devin AI
# Data: 11/03/2025

echo "Iniciando configuração do ambiente de testes..."

# Verificar se as variáveis de ambiente necessárias estão definidas
check_env_vars() {
  local missing=false
  
  if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "AVISO: Variável NEXT_PUBLIC_SUPABASE_URL não está definida"
    missing=true
  fi
  
  if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "AVISO: Variável NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida"
    missing=true
  fi
  
  if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "AVISO: Variável SUPABASE_SERVICE_ROLE_KEY não está definida"
    missing=true
  fi
  
  if [ "$missing" = true ]; then
    echo "Por favor, defina as variáveis de ambiente necessárias antes de executar este script."
    echo "Você pode definir as variáveis no arquivo .env.local ou exportá-las no terminal."
    exit 1
  fi
}

# Criar arquivo .env.local se não existir
create_env_file() {
  if [ ! -f .env.local ]; then
    echo "Criando arquivo .env.local..."
    echo "NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL" > .env.local
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY" >> .env.local
    echo "SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY" >> .env.local
    echo "Arquivo .env.local criado com sucesso!"
  else
    echo "Arquivo .env.local já existe."
  fi
}

# Função para executar SQL no Supabase
execute_sql() {
  local sql="$1"
  local result=$(curl -s -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rpc/exec_sql" \
    -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"sql\": \"${sql}\"}")
  
  echo "$result"
}

# Criar tabelas no banco de dados
create_tables() {
  echo "Verificando conexão com o banco de dados..."
  result=$(execute_sql "SELECT current_database(), current_user")
  if [[ "$result" == *"success"* ]]; then
    echo "Conexão com o banco de dados estabelecida com sucesso!"
  else
    echo "Erro ao conectar ao banco de dados: $result"
    exit 1
  fi

  echo "Criando extensões necessárias..."
  execute_sql "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"; CREATE EXTENSION IF NOT EXISTS \"pgcrypto\";"

  echo "Criando schema matricula..."
  execute_sql "CREATE SCHEMA IF NOT EXISTS matricula;"

  echo "Criando tabelas..."
  # Tabela de alunos
  execute_sql "CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );"

  # Tabela de cursos
  execute_sql "CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );"

  # Tabela de matrículas
  execute_sql "CREATE TABLE IF NOT EXISTS matricula.registros (
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
  );"

  # Tabela de documentos
  execute_sql "CREATE TABLE IF NOT EXISTS matricula_documentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    matricula_id UUID REFERENCES matricula.registros(id),
    tipo TEXT NOT NULL,
    nome TEXT NOT NULL,
    url TEXT NOT NULL,
    status TEXT NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );"

  # Tabela de contratos
  execute_sql "CREATE TABLE IF NOT EXISTS matricula_contratos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    matricula_id UUID REFERENCES matricula.registros(id),
    titulo TEXT NOT NULL,
    versao TEXT,
    url TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );"
}

# Inserir dados de teste
insert_test_data() {
  echo "Inserindo dados de teste..."
  # Inserir aluno de teste
  execute_sql "INSERT INTO students (name, email) 
    VALUES ('Aluno Teste', 'aluno@teste.com') 
    ON CONFLICT (email) DO NOTHING;"

  # Inserir curso de teste
  execute_sql "INSERT INTO courses (name, description, price) 
    VALUES ('Curso de Teste', 'Descrição do curso de teste', 1000.00) 
    ON CONFLICT DO NOTHING;"
}

# Executar funções principais
main() {
  # Carregar variáveis de ambiente do arquivo .env.local se existir
  if [ -f .env.local ]; then
    source .env.local
  fi
  
  check_env_vars
  create_env_file
  create_tables
  insert_test_data
  
  echo "Ambiente de testes configurado com sucesso!"
  echo "Para executar os testes, use: npm run test"
}

# Iniciar script
main
