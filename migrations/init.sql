-- Módulo de Matrículas - Edunéxia
-- SQL Migration Script for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE matricula_status AS ENUM (
  'pendente', 'aprovado', 'rejeitado', 'ativo', 'trancado', 'cancelado', 'concluido'
);

CREATE TYPE documento_status AS ENUM (
  'pendente', 'aprovado', 'rejeitado'
);

CREATE TYPE assinatura_status AS ENUM (
  'pendente', 'assinado', 'expirado'
);

CREATE TYPE forma_pagamento AS ENUM (
  'cartao_credito', 'boleto', 'pix', 'transferencia'
);

CREATE TYPE modalidade_curso AS ENUM (
  'presencial', 'online', 'hibrido'
);

CREATE TYPE tipo_desconto AS ENUM (
  'percentual', 'valor_fixo'
);

CREATE TYPE status_pagamento AS ENUM (
  'pendente', 'pago', 'atrasado', 'cancelado'
);

CREATE TYPE status_validacao AS ENUM (
  'pendente', 'em_analise', 'aprovado', 'rejeitado'
);

-- Create tables
CREATE TABLE IF NOT EXISTS alunos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  rg TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  cep TEXT NOT NULL,
  logradouro TEXT NOT NULL,
  numero TEXT NOT NULL,
  complemento TEXT,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cursos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT,
  carga_horaria INTEGER NOT NULL,
  modalidade modalidade_curso NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS turmas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  curso_id UUID NOT NULL REFERENCES cursos(id),
  nome TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  horario TEXT,
  vagas_total INTEGER NOT NULL,
  vagas_disponiveis INTEGER NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES alunos(id),
  tipo TEXT NOT NULL,
  nome TEXT NOT NULL,
  url TEXT NOT NULL,
  data_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status documento_status DEFAULT 'pendente',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contratos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  versao TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  data_geracao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  url TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS descontos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  tipo tipo_desconto NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  ativo BOOLEAN DEFAULT TRUE,
  regras JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campanhas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  regras JSONB,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campanhas_descontos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campanha_id UUID NOT NULL REFERENCES campanhas(id),
  desconto_id UUID NOT NULL REFERENCES descontos(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bolsas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT,
  percentual_cobertura DECIMAL(5, 2) NOT NULL,
  criterios JSONB,
  documentos_necessarios JSONB,
  processo JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS programa_indicacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT,
  recompensa_indicador_id UUID REFERENCES descontos(id),
  recompensa_indicado_id UUID REFERENCES descontos(id),
  regras JSONB,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faq_categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faq_perguntas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  categoria_id UUID NOT NULL REFERENCES faq_categorias(id),
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main matricula table
CREATE TABLE IF NOT EXISTS matriculas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES alunos(id),
  curso_id UUID NOT NULL REFERENCES cursos(id),
  turma_id UUID REFERENCES turmas(id),
  status matricula_status DEFAULT 'pendente',
  contrato_id UUID REFERENCES contratos(id),
  desconto_id UUID REFERENCES descontos(id),
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

CREATE TABLE IF NOT EXISTS parcelas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricula_id UUID NOT NULL REFERENCES matriculas(id),
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

CREATE TABLE IF NOT EXISTS checklist_documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricula_id UUID NOT NULL REFERENCES matriculas(id),
  nome TEXT NOT NULL,
  obrigatorio BOOLEAN DEFAULT TRUE,
  status documento_status DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS validacao_documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricula_id UUID NOT NULL REFERENCES matriculas(id),
  status status_validacao DEFAULT 'pendente',
  responsavel TEXT,
  data_analise TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS historico_revisoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricula_id UUID NOT NULL REFERENCES matriculas(id),
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responsavel TEXT NOT NULL,
  acao TEXT NOT NULL,
  detalhes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS relatorios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  dados JSONB NOT NULL,
  filtros JSONB,
  data_geracao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE descontos ENABLE ROW LEVEL SECURITY;
ALTER TABLE campanhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE campanhas_descontos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bolsas ENABLE ROW LEVEL SECURITY;
ALTER TABLE programa_indicacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_perguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE matriculas ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE validacao_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_revisoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (these should be refined based on specific requirements)
CREATE POLICY "Allow authenticated users to read alunos" ON alunos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to read cursos" ON cursos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to read turmas" ON turmas FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to read matriculas" ON matriculas FOR SELECT USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX idx_matriculas_aluno_id ON matriculas(aluno_id);
CREATE INDEX idx_matriculas_curso_id ON matriculas(curso_id);
CREATE INDEX idx_matriculas_status ON matriculas(status);
CREATE INDEX idx_documentos_aluno_id ON documentos(aluno_id);
CREATE INDEX idx_parcelas_matricula_id ON parcelas(matricula_id);
CREATE INDEX idx_turmas_curso_id ON turmas(curso_id);

-- Create functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_alunos_modtime BEFORE UPDATE ON alunos FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_cursos_modtime BEFORE UPDATE ON cursos FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_turmas_modtime BEFORE UPDATE ON turmas FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_documentos_modtime BEFORE UPDATE ON documentos FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_contratos_modtime BEFORE UPDATE ON contratos FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_descontos_modtime BEFORE UPDATE ON descontos FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_campanhas_modtime BEFORE UPDATE ON campanhas FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_bolsas_modtime BEFORE UPDATE ON bolsas FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_programa_indicacao_modtime BEFORE UPDATE ON programa_indicacao FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_faq_categorias_modtime BEFORE UPDATE ON faq_categorias FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_faq_perguntas_modtime BEFORE UPDATE ON faq_perguntas FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_matriculas_modtime BEFORE UPDATE ON matriculas FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_parcelas_modtime BEFORE UPDATE ON parcelas FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_checklist_documentos_modtime BEFORE UPDATE ON checklist_documentos FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_validacao_documentos_modtime BEFORE UPDATE ON validacao_documentos FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Sample data for testing (optional)
INSERT INTO cursos (nome, descricao, carga_horaria, modalidade, valor)
VALUES 
  ('Administração', 'Curso de Administração de Empresas', 3000, 'presencial', 1200.00),
  ('Engenharia de Software', 'Curso de Engenharia de Software', 3600, 'hibrido', 1500.00),
  ('Marketing Digital', 'Curso de Marketing Digital', 2400, 'online', 900.00);

INSERT INTO turmas (curso_id, nome, data_inicio, vagas_total, vagas_disponiveis)
VALUES 
  ((SELECT id FROM cursos WHERE nome = 'Administração' LIMIT 1), 'Turma 2025.1', '2025-02-10', 40, 40),
  ((SELECT id FROM cursos WHERE nome = 'Engenharia de Software' LIMIT 1), 'Turma 2025.1', '2025-02-15', 30, 30),
  ((SELECT id FROM cursos WHERE nome = 'Marketing Digital' LIMIT 1), 'Turma 2025.1', '2025-03-01', 50, 50);

INSERT INTO descontos (nome, tipo, valor, data_inicio, data_fim)
VALUES 
  ('Desconto Antecipação', 'percentual', 10.00, '2025-01-01', '2025-12-31'),
  ('Desconto Convênio Empresarial', 'percentual', 15.00, '2025-01-01', '2025-12-31'),
  ('Desconto Primeira Matrícula', 'valor_fixo', 200.00, '2025-01-01', '2025-06-30');

INSERT INTO faq_categorias (nome)
VALUES 
  ('Processo de Matrícula'),
  ('Documentação'),
  ('Pagamentos'),
  ('Bolsas e Descontos');

INSERT INTO faq_perguntas (categoria_id, pergunta, resposta)
VALUES 
  ((SELECT id FROM faq_categorias WHERE nome = 'Processo de Matrícula' LIMIT 1), 
   'Como faço minha matrícula online?', 
   'Para realizar sua matrícula online, acesse o portal do aluno, selecione o curso desejado e siga o passo a passo para preencher seus dados, enviar documentos e realizar o pagamento.'),
  
  ((SELECT id FROM faq_categorias WHERE nome = 'Documentação' LIMIT 1), 
   'Quais documentos são necessários para a matrícula?', 
   'Os documentos necessários são: RG, CPF, Histórico Escolar, Diploma, Comprovante de Residência e uma foto 3x4 recente.'),
  
  ((SELECT id FROM faq_categorias WHERE nome = 'Pagamentos' LIMIT 1), 
   'Quais formas de pagamento são aceitas?', 
   'Aceitamos pagamento via cartão de crédito, boleto bancário, PIX e transferência bancária.'),
  
  ((SELECT id FROM faq_categorias WHERE nome = 'Bolsas e Descontos' LIMIT 1), 
   'Como posso solicitar uma bolsa de estudos?', 
   'Para solicitar uma bolsa de estudos, acesse a seção de Bolsas no portal do aluno, verifique os requisitos e preencha o formulário de solicitação com os documentos comprobatórios necessários.');
