-- Módulo de Matrículas - Edunéxia
-- Script de Migração para Supabase - Criação do Schema Matricula

-- Criar schema matricula se não existir
CREATE SCHEMA IF NOT EXISTS matricula;

-- Criar tabela de registros de matrícula no schema matricula
CREATE TABLE IF NOT EXISTS matricula.registros (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES public.alunos(id),
  curso_id UUID NOT NULL REFERENCES public.cursos(id),
  turma_id UUID REFERENCES public.turmas(id),
  status matricula_status DEFAULT 'pendente',
  contrato_id UUID REFERENCES public.contratos(id),
  desconto_id UUID REFERENCES public.descontos(id),
  data_assinatura TIMESTAMP WITH TIME ZONE,
  assinatura_status assinatura_status DEFAULT 'pendente',
  analise_status documento_status DEFAULT 'pendente',
  analise_observacoes TEXT,
  documentos_pendentes JSONB,
  integracoes JSONB DEFAULT '{"financeiro": {"geracaoBoletos": false, "controlePagamentos": false, "acordosFinanceiros": false}, "academico": {"alocacaoTurmas": false, "controleVagas": false, "gradeCurricular": false}, "comunicacao": {"notificacoes": false, "emailsAutomaticos": false, "sms": false}}',
  notificacoes JSONB DEFAULT '{"documentosPendentes": "email", "aprovacaoMatricula": "email", "boletoPagamento": "email", "confirmacaoMatricula": "email", "lembreteDocumentos": "whatsapp"}',
  validacoes JSONB DEFAULT '{"documentosObrigatorios": false, "dadosPessoais": false, "requisitosAcademicos": false, "situacaoFinanceira": false}',
  seguranca JSONB DEFAULT '{"criptografiaDados": true, "assinaturaDigital": true, "conformidadeLGPD": true, "backupAutomatico": true}',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de documentos de matrícula no schema matricula
CREATE TABLE IF NOT EXISTS matricula.documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricula_id UUID NOT NULL REFERENCES matricula.registros(id),
  tipo TEXT NOT NULL,
  nome TEXT NOT NULL,
  url TEXT NOT NULL,
  status documento_status DEFAULT 'pendente',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de parcelas no schema matricula
CREATE TABLE IF NOT EXISTS matricula.parcelas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricula_id UUID NOT NULL REFERENCES matricula.registros(id),
  numero INTEGER NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  data_vencimento DATE NOT NULL,
  status status_pagamento DEFAULT 'pendente',
  forma_pagamento forma_pagamento,
  data_pagamento TIMESTAMP WITH TIME ZONE,
  comprovante TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de checklist de documentos no schema matricula
CREATE TABLE IF NOT EXISTS matricula.checklist_documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricula_id UUID NOT NULL REFERENCES matricula.registros(id),
  nome TEXT NOT NULL,
  obrigatorio BOOLEAN DEFAULT TRUE,
  status documento_status DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de validação de documentos no schema matricula
CREATE TABLE IF NOT EXISTS matricula.validacao_documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricula_id UUID NOT NULL REFERENCES matricula.registros(id),
  status status_validacao DEFAULT 'pendente',
  responsavel TEXT,
  data_analise TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de histórico de revisões no schema matricula
CREATE TABLE IF NOT EXISTS matricula.historico_revisoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricula_id UUID NOT NULL REFERENCES matricula.registros(id),
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responsavel TEXT NOT NULL,
  acao TEXT NOT NULL,
  detalhes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_matricula_registros_aluno_id ON matricula.registros(aluno_id);
CREATE INDEX IF NOT EXISTS idx_matricula_registros_curso_id ON matricula.registros(curso_id);
CREATE INDEX IF NOT EXISTS idx_matricula_registros_status ON matricula.registros(status);
CREATE INDEX IF NOT EXISTS idx_matricula_documentos_matricula_id ON matricula.documentos(matricula_id);
CREATE INDEX IF NOT EXISTS idx_matricula_parcelas_matricula_id ON matricula.parcelas(matricula_id);

-- Habilitar RLS para as tabelas
ALTER TABLE matricula.registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE matricula.documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE matricula.parcelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE matricula.checklist_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE matricula.validacao_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE matricula.historico_revisoes ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para matricula.registros
CREATE POLICY "Alunos podem ver suas próprias matrículas" ON matricula.registros
FOR SELECT USING (
  aluno_id = auth.uid() OR 
  auth.jwt() -> 'role' ? 'admin' OR 
  auth.jwt() -> 'role' ? 'secretaria'
);

CREATE POLICY "Administradores podem gerenciar matrículas" ON matricula.registros
FOR ALL USING (
  auth.jwt() -> 'role' ? 'admin' OR 
  auth.jwt() -> 'role' ? 'secretaria'
);

-- Criar políticas RLS para matricula.documentos
CREATE POLICY "Alunos podem ver seus próprios documentos" ON matricula.documentos
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM matricula.registros m 
    WHERE m.id = matricula_id AND m.aluno_id = auth.uid()
  ) OR 
  auth.jwt() -> 'role' ? 'admin' OR 
  auth.jwt() -> 'role' ? 'secretaria'
);

CREATE POLICY "Administradores podem gerenciar documentos" ON matricula.documentos
FOR ALL USING (
  auth.jwt() -> 'role' ? 'admin' OR 
  auth.jwt() -> 'role' ? 'secretaria'
);

-- Criar políticas RLS para matricula.parcelas
CREATE POLICY "Alunos podem ver suas próprias parcelas" ON matricula.parcelas
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM matricula.registros m 
    WHERE m.id = matricula_id AND m.aluno_id = auth.uid()
  ) OR 
  auth.jwt() -> 'role' ? 'admin' OR 
  auth.jwt() -> 'role' ? 'financeiro'
);

CREATE POLICY "Administradores podem gerenciar parcelas" ON matricula.parcelas
FOR ALL USING (
  auth.jwt() -> 'role' ? 'admin' OR 
  auth.jwt() -> 'role' ? 'financeiro'
);

-- Criar triggers para atualização de updated_at
CREATE TRIGGER update_matricula_registros_modtime
BEFORE UPDATE ON matricula.registros
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_matricula_documentos_modtime
BEFORE UPDATE ON matricula.documentos
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_matricula_parcelas_modtime
BEFORE UPDATE ON matricula.parcelas
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_matricula_checklist_documentos_modtime
BEFORE UPDATE ON matricula.checklist_documentos
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_matricula_validacao_documentos_modtime
BEFORE UPDATE ON matricula.validacao_documentos
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
