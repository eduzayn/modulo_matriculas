#!/bin/bash

# Script para configurar o sistema de monitoramento, feedback e melhorias contínuas

# Diretório base do projeto
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Carregar variáveis de ambiente
if [ -f "$BASE_DIR/.env" ]; then
  source "$BASE_DIR/.env"
elif [ -f "$BASE_DIR/.env.local" ]; then
  source "$BASE_DIR/.env.local"
else
  echo "Arquivo .env não encontrado. Usando variáveis de ambiente existentes."
fi

# Verificar se as variáveis de ambiente necessárias estão definidas
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Erro: Variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar definidas."
  exit 1
fi

# Criar tabelas no banco de dados
echo "Criando tabelas de monitoramento e feedback..."
PGPASSWORD="$SUPABASE_DB_PASSWORD" psql -h "$SUPABASE_DB_HOST" -U "$SUPABASE_DB_USER" -d "$SUPABASE_DB_NAME" -f "$BASE_DIR/scripts/create-monitoring-tables.sql"

if [ $? -ne 0 ]; then
  echo "Erro ao criar tabelas. Tentando método alternativo..."
  
  # Método alternativo usando a API REST do Supabase
  echo "Executando SQL via API REST do Supabase..."
  
  SQL_CONTENT=$(cat "$BASE_DIR/scripts/create-monitoring-tables.sql")
  
  curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"sql\": \"$SQL_CONTENT\"}"
  
  if [ $? -ne 0 ]; then
    echo "Erro ao criar tabelas via API REST. Verifique as credenciais e tente novamente."
    exit 1
  fi
fi

echo "Tabelas criadas com sucesso!"

# Criar diretórios necessários
echo "Criando diretórios necessários..."
mkdir -p "$BASE_DIR/logs/monitoring"
mkdir -p "$BASE_DIR/logs/feedback"
mkdir -p "$BASE_DIR/logs/improvements"

# Configurar permissões
echo "Configurando permissões..."
chmod -R 755 "$BASE_DIR/logs"

# Adicionar políticas de acesso no Supabase (opcional)
echo "Configurando políticas de acesso no Supabase..."

# Política para métricas (apenas administradores podem ler)
METRICS_POLICY="
BEGIN;
  -- Políticas para monitoring_metrics
  DROP POLICY IF EXISTS \"Apenas administradores podem ler métricas\" ON monitoring_metrics;
  CREATE POLICY \"Apenas administradores podem ler métricas\" 
    ON monitoring_metrics FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'
      )
    );
COMMIT;
"

# Política para alertas (apenas administradores podem ler)
ALERTS_POLICY="
BEGIN;
  -- Políticas para monitoring_alerts
  DROP POLICY IF EXISTS \"Apenas administradores podem ler alertas\" ON monitoring_alerts;
  CREATE POLICY \"Apenas administradores podem ler alertas\" 
    ON monitoring_alerts FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'
      )
    );
COMMIT;
"

# Política para feedback (usuários podem ver seus próprios feedbacks, administradores podem ver todos)
FEEDBACK_POLICY="
BEGIN;
  -- Políticas para user_feedback
  DROP POLICY IF EXISTS \"Usuários podem ver seus próprios feedbacks\" ON user_feedback;
  CREATE POLICY \"Usuários podem ver seus próprios feedbacks\" 
    ON user_feedback FOR SELECT 
    USING (
      auth.uid() = user_id OR
      EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'
      )
    );
  
  DROP POLICY IF EXISTS \"Usuários podem criar seus próprios feedbacks\" ON user_feedback;
  CREATE POLICY \"Usuários podem criar seus próprios feedbacks\" 
    ON user_feedback FOR INSERT 
    WITH CHECK (
      auth.uid() = user_id
    );
COMMIT;
"

# Política para plano de melhorias (apenas administradores podem modificar, todos podem ver)
IMPROVEMENT_POLICY="
BEGIN;
  -- Políticas para improvement_plan
  DROP POLICY IF EXISTS \"Todos podem ver plano de melhorias\" ON improvement_plan;
  CREATE POLICY \"Todos podem ver plano de melhorias\" 
    ON improvement_plan FOR SELECT 
    USING (true);
  
  DROP POLICY IF EXISTS \"Apenas administradores podem modificar plano de melhorias\" ON improvement_plan;
  CREATE POLICY \"Apenas administradores podem modificar plano de melhorias\" 
    ON improvement_plan FOR INSERT 
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'
      )
    );
  
  DROP POLICY IF EXISTS \"Apenas administradores podem atualizar plano de melhorias\" ON improvement_plan;
  CREATE POLICY \"Apenas administradores podem atualizar plano de melhorias\" 
    ON improvement_plan FOR UPDATE 
    USING (
      EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'
      )
    );
COMMIT;
"

# Aplicar políticas via API REST do Supabase
echo "Aplicando políticas de acesso..."

curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"sql\": \"$METRICS_POLICY\"}"

curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"sql\": \"$ALERTS_POLICY\"}"

curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"sql\": \"$FEEDBACK_POLICY\"}"

curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"sql\": \"$IMPROVEMENT_POLICY\"}"

echo "Configuração concluída com sucesso!"
echo "O sistema de monitoramento, feedback e melhorias contínuas está pronto para uso."
