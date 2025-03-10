-- Módulo de Matrículas - Edunéxia
-- Script de Migração para Supabase - Tabela de Contratos de Matrícula

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
ADD CONSTRAINT fk_matricula_contratos_matricula_id 
FOREIGN KEY (matricula_id) 
REFERENCES matricula.registros(id) 
ON DELETE CASCADE;

-- Criar índice para melhorar performance
CREATE INDEX idx_matricula_contratos_matricula_id ON public.matricula_contratos(matricula_id);
CREATE INDEX idx_matricula_contratos_status ON public.matricula_contratos(status);

-- Habilitar RLS para a tabela
ALTER TABLE public.matricula_contratos ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Alunos podem ver seus próprios contratos" ON public.matricula_contratos
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM matricula.registros m 
    WHERE m.id = matricula_id AND m.aluno_id = auth.uid()
  ) OR 
  auth.jwt() -> 'role' ? 'admin' OR 
  auth.jwt() -> 'role' ? 'secretaria'
);

CREATE POLICY "Administradores podem gerenciar contratos" ON public.matricula_contratos
FOR ALL USING (
  auth.jwt() -> 'role' ? 'admin' OR 
  auth.jwt() -> 'role' ? 'secretaria'
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
CREATE TRIGGER update_matricula_contratos_modtime
BEFORE UPDATE ON public.matricula_contratos
FOR EACH ROW
EXECUTE FUNCTION update_matricula_contratos_updated_at();
