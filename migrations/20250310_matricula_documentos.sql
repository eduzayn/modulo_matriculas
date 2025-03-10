-- Módulo de Matrículas - Edunéxia
-- Script de Migração para Supabase - Tabela de Documentos de Matrícula

-- Criar tabela de documentos de matrícula
CREATE TABLE IF NOT EXISTS public.matricula_documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricula_id UUID NOT NULL,
  tipo TEXT NOT NULL,
  nome TEXT NOT NULL,
  url TEXT NOT NULL,
  status documento_status DEFAULT 'pendente',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar constraint de chave estrangeira
ALTER TABLE public.matricula_documentos 
ADD CONSTRAINT fk_matricula_documentos_matricula_id 
FOREIGN KEY (matricula_id) 
REFERENCES matricula.registros(id) 
ON DELETE CASCADE;

-- Criar índice para melhorar performance
CREATE INDEX idx_matricula_documentos_matricula_id ON public.matricula_documentos(matricula_id);
CREATE INDEX idx_matricula_documentos_tipo ON public.matricula_documentos(tipo);
CREATE INDEX idx_matricula_documentos_status ON public.matricula_documentos(status);

-- Habilitar RLS para a tabela
ALTER TABLE public.matricula_documentos ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Alunos podem ver seus próprios documentos" ON public.matricula_documentos
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM matricula.registros m 
    WHERE m.id = matricula_id AND m.aluno_id = auth.uid()
  ) OR 
  auth.jwt() -> 'role' ? 'admin' OR 
  auth.jwt() -> 'role' ? 'secretaria'
);

CREATE POLICY "Alunos podem inserir documentos em suas matrículas" ON public.matricula_documentos
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM matricula.registros m 
    WHERE m.id = matricula_id AND m.aluno_id = auth.uid()
  ) OR 
  auth.jwt() -> 'role' ? 'admin' OR 
  auth.jwt() -> 'role' ? 'secretaria'
);

CREATE POLICY "Administradores podem gerenciar documentos" ON public.matricula_documentos
FOR ALL USING (
  auth.jwt() -> 'role' ? 'admin' OR 
  auth.jwt() -> 'role' ? 'secretaria'
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
CREATE TRIGGER update_matricula_documentos_modtime
BEFORE UPDATE ON public.matricula_documentos
FOR EACH ROW
EXECUTE FUNCTION update_matricula_documentos_updated_at();
