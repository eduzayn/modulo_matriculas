-- Módulo de Matrículas - Edunéxia
-- Script de Migração para Supabase - Criação de Buckets de Storage

-- Criar bucket para documentos de matrícula
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'matricula_documentos',
  'Documentos de Matrícula',
  false,
  false,
  5242880, -- 5MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = EXCLUDED.public,
  avif_autodetection = EXCLUDED.avif_autodetection,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Criar bucket para contratos
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'contratos',
  'Contratos',
  false,
  false,
  10485760, -- 10MB
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = EXCLUDED.public,
  avif_autodetection = EXCLUDED.avif_autodetection,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Criar bucket para fotos de perfil
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'perfil',
  'Fotos de Perfil',
  true,
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = EXCLUDED.public,
  avif_autodetection = EXCLUDED.avif_autodetection,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Criar políticas RLS para bucket de documentos de matrícula
CREATE POLICY "Alunos podem visualizar seus próprios documentos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'matricula_documentos' AND
  (
    -- Verificar se o documento pertence ao aluno
    EXISTS (
      SELECT 1 FROM matricula.documentos d
      JOIN matricula.registros m ON d.matricula_id = m.id
      WHERE d.url = storage.objects.name AND m.aluno_id = auth.uid()
    ) OR
    -- Ou se o usuário é admin ou secretaria
    auth.jwt() -> 'role' ? 'admin' OR
    auth.jwt() -> 'role' ? 'secretaria'
  )
);

CREATE POLICY "Alunos podem fazer upload de seus próprios documentos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'matricula_documentos' AND
  (
    -- Verificar se o documento pertence ao aluno
    EXISTS (
      SELECT 1 FROM matricula.registros m
      WHERE m.aluno_id = auth.uid() AND
      storage.objects.name LIKE 'matricula_' || m.id::text || '/%'
    ) OR
    -- Ou se o usuário é admin ou secretaria
    auth.jwt() -> 'role' ? 'admin' OR
    auth.jwt() -> 'role' ? 'secretaria'
  )
);

CREATE POLICY "Administradores podem gerenciar documentos"
ON storage.objects FOR ALL
USING (
  bucket_id = 'matricula_documentos' AND
  (
    auth.jwt() -> 'role' ? 'admin' OR
    auth.jwt() -> 'role' ? 'secretaria'
  )
);

-- Criar políticas RLS para bucket de contratos
CREATE POLICY "Alunos podem visualizar seus próprios contratos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'contratos' AND
  (
    -- Verificar se o contrato pertence ao aluno
    EXISTS (
      SELECT 1 FROM matricula.registros m
      WHERE m.aluno_id = auth.uid() AND
      storage.objects.name LIKE 'contrato_' || m.id::text || '/%'
    ) OR
    -- Ou se o usuário é admin, secretaria ou financeiro
    auth.jwt() -> 'role' ? 'admin' OR
    auth.jwt() -> 'role' ? 'secretaria' OR
    auth.jwt() -> 'role' ? 'financeiro'
  )
);

CREATE POLICY "Administradores podem gerenciar contratos"
ON storage.objects FOR ALL
USING (
  bucket_id = 'contratos' AND
  (
    auth.jwt() -> 'role' ? 'admin' OR
    auth.jwt() -> 'role' ? 'secretaria' OR
    auth.jwt() -> 'role' ? 'financeiro'
  )
);

-- Criar políticas RLS para bucket de fotos de perfil
CREATE POLICY "Usuários podem visualizar fotos de perfil"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'perfil'
);

CREATE POLICY "Usuários podem fazer upload de suas próprias fotos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'perfil' AND
  (
    -- Verificar se a foto pertence ao usuário
    storage.objects.name LIKE 'perfil_' || auth.uid() || '/%' OR
    -- Ou se o usuário é admin
    auth.jwt() -> 'role' ? 'admin'
  )
);

CREATE POLICY "Usuários podem atualizar suas próprias fotos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'perfil' AND
  (
    -- Verificar se a foto pertence ao usuário
    storage.objects.name LIKE 'perfil_' || auth.uid() || '/%' OR
    -- Ou se o usuário é admin
    auth.jwt() -> 'role' ? 'admin'
  )
);

CREATE POLICY "Usuários podem excluir suas próprias fotos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'perfil' AND
  (
    -- Verificar se a foto pertence ao usuário
    storage.objects.name LIKE 'perfil_' || auth.uid() || '/%' OR
    -- Ou se o usuário é admin
    auth.jwt() -> 'role' ? 'admin'
  )
);
