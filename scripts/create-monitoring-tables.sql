-- Script para criar tabelas de monitoramento e feedback no Supabase

-- Tabela para armazenar métricas de monitoramento
CREATE TABLE IF NOT EXISTS monitoring_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  endpoint VARCHAR(255),
  user_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para consultas comuns
CREATE INDEX IF NOT EXISTS idx_monitoring_metrics_type ON monitoring_metrics(type);
CREATE INDEX IF NOT EXISTS idx_monitoring_metrics_timestamp ON monitoring_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_monitoring_metrics_endpoint ON monitoring_metrics(endpoint);
CREATE INDEX IF NOT EXISTS idx_monitoring_metrics_user_id ON monitoring_metrics(user_id);

-- Tabela para armazenar alertas de monitoramento
CREATE TABLE IF NOT EXISTS monitoring_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  metric_type VARCHAR(50),
  metric_value DOUBLE PRECISION,
  endpoint VARCHAR(255),
  user_id UUID,
  metadata JSONB,
  acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
  acknowledged_by UUID,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para consultas comuns
CREATE INDEX IF NOT EXISTS idx_monitoring_alerts_severity ON monitoring_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_monitoring_alerts_timestamp ON monitoring_alerts(timestamp);
CREATE INDEX IF NOT EXISTS idx_monitoring_alerts_acknowledged ON monitoring_alerts(acknowledged);

-- Tabela para armazenar feedback dos usuários
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  satisfaction_level INTEGER,
  module VARCHAR(100) NOT NULL,
  feature VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  priority VARCHAR(20),
  tags TEXT[]
);

-- Índices para consultas comuns
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_type ON user_feedback(type);
CREATE INDEX IF NOT EXISTS idx_user_feedback_module ON user_feedback(module);
CREATE INDEX IF NOT EXISTS idx_user_feedback_status ON user_feedback(status);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at);

-- Tabela para armazenar plano de melhorias contínuas
CREATE TABLE IF NOT EXISTS improvement_plan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'planned',
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  category VARCHAR(50) NOT NULL,
  estimated_completion DATE,
  actual_completion DATE,
  created_by UUID,
  assigned_to UUID,
  feedback_ids UUID[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para consultas comuns
CREATE INDEX IF NOT EXISTS idx_improvement_plan_status ON improvement_plan(status);
CREATE INDEX IF NOT EXISTS idx_improvement_plan_priority ON improvement_plan(priority);
CREATE INDEX IF NOT EXISTS idx_improvement_plan_category ON improvement_plan(category);
CREATE INDEX IF NOT EXISTS idx_improvement_plan_created_at ON improvement_plan(created_at);

-- Função para atualizar o timestamp de atualização
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp de atualização
CREATE TRIGGER update_improvement_plan_updated_at
BEFORE UPDATE ON improvement_plan
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela para armazenar comentários sobre melhorias
CREATE TABLE IF NOT EXISTS improvement_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  improvement_id UUID NOT NULL REFERENCES improvement_plan(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para consultas comuns
CREATE INDEX IF NOT EXISTS idx_improvement_comments_improvement_id ON improvement_comments(improvement_id);
CREATE INDEX IF NOT EXISTS idx_improvement_comments_user_id ON improvement_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_improvement_comments_created_at ON improvement_comments(created_at);

-- Trigger para atualizar o timestamp de atualização
CREATE TRIGGER update_improvement_comments_updated_at
BEFORE UPDATE ON improvement_comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
