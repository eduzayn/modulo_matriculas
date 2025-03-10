-- Módulo de Matrículas - Edunéxia
-- Script de Migração para Supabase - Tabela de Usuários Administradores

-- Criar tabela de usuários administradores
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('admin', 'secretaria', 'financeiro', 'academico', 'atendimento')),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Habilitar RLS para a tabela
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Administradores podem ver todos os usuários admin" ON public.admin_users
FOR SELECT USING (
  auth.jwt() -> 'role' ? 'admin'
);

CREATE POLICY "Administradores podem gerenciar usuários admin" ON public.admin_users
FOR ALL USING (
  auth.jwt() -> 'role' ? 'admin'
);

CREATE POLICY "Usuários podem ver seu próprio registro" ON public.admin_users
FOR SELECT USING (
  user_id = auth.uid()
);

-- Criar função para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualização de updated_at
CREATE TRIGGER update_admin_users_modtime
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION update_admin_users_updated_at();

-- Criar função para adicionar role ao JWT
CREATE OR REPLACE FUNCTION public.get_admin_role()
RETURNS TRIGGER AS $$
DECLARE
  admin_role TEXT;
BEGIN
  SELECT role INTO admin_role FROM public.admin_users
  WHERE user_id = NEW.id;
  
  IF admin_role IS NOT NULL THEN
    NEW.raw_app_meta_data := 
      jsonb_set(
        COALESCE(NEW.raw_app_meta_data, '{}'::jsonb),
        '{role}',
        to_jsonb(admin_role)
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para adicionar role ao JWT
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.get_admin_role();

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
AFTER UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.get_admin_role();

-- Inserir usuário admin padrão (opcional)
-- Substitua 'USER_ID_HERE' pelo ID do usuário que deve ser administrador
-- INSERT INTO public.admin_users (user_id, role, nome, email)
-- VALUES ('USER_ID_HERE', 'admin', 'Administrador', 'admin@eduzayn.com.br');
