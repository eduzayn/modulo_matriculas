-- Módulo de Matrículas - Edunéxia
-- Script de Migração para Supabase - Recursos de IA e Automação

-- Criar tipos ENUM para IA e automação
CREATE TYPE ocr_status AS ENUM (
  'pendente', 'em_processamento', 'concluido', 'falha'
);

CREATE TYPE chatbot_intent AS ENUM (
  'matricula', 'documentos', 'pagamentos', 'turmas', 'bolsas', 'suporte', 'outros'
);

CREATE TYPE evasion_risk AS ENUM (
  'baixo', 'medio', 'alto', 'muito_alto'
);

-- Tabela para verificação automática de documentos com OCR
CREATE TABLE IF NOT EXISTS ocr_verificacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  documento_id UUID NOT NULL REFERENCES documentos(id),
  status ocr_status DEFAULT 'pendente',
  data_processamento TIMESTAMP WITH TIME ZONE,
  resultado JSONB,
  confianca DECIMAL(5, 2),
  texto_extraido TEXT,
  campos_validados JSONB,
  erros TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para armazenar modelos de documentos para comparação
CREATE TABLE IF NOT EXISTS ocr_modelos_documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo_documento TEXT NOT NULL,
  campos_obrigatorios JSONB NOT NULL,
  padroes_validacao JSONB,
  exemplos TEXT[],
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para chatbot de dúvidas frequentes
CREATE TABLE IF NOT EXISTS chatbot_conversas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID REFERENCES alunos(id),
  sessao_id TEXT NOT NULL,
  data_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_fim TIMESTAMP WITH TIME ZONE,
  intent chatbot_intent,
  contexto JSONB,
  feedback INTEGER,
  resolvido BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chatbot_mensagens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversa_id UUID NOT NULL REFERENCES chatbot_conversas(id),
  remetente TEXT NOT NULL CHECK (remetente IN ('aluno', 'bot', 'atendente')),
  mensagem TEXT NOT NULL,
  intent chatbot_intent,
  entidades JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chatbot_intents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  tipo chatbot_intent NOT NULL,
  frases_treinamento TEXT[] NOT NULL,
  respostas TEXT[] NOT NULL,
  contexto_necessario JSONB,
  acoes JSONB,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para análise preditiva de evasão
CREATE TABLE IF NOT EXISTS analise_evasao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES alunos(id),
  matricula_id UUID NOT NULL REFERENCES matriculas(id),
  risco evasion_risk DEFAULT 'baixo',
  score DECIMAL(5, 2),
  fatores JSONB,
  ultima_analise TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acoes_recomendadas JSONB,
  acoes_tomadas JSONB,
  resultado TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aluno_id, matricula_id)
);

CREATE TABLE IF NOT EXISTS indicadores_evasao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT,
  peso DECIMAL(5, 2) NOT NULL,
  formula TEXT,
  parametros JSONB,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para recomendação inteligente de turmas/horários
CREATE TABLE IF NOT EXISTS recomendacoes_turmas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES alunos(id),
  curso_id UUID NOT NULL REFERENCES cursos(id),
  turmas_recomendadas UUID[] NOT NULL,
  score_compatibilidade JSONB,
  criterios_utilizados JSONB,
  preferencias_aluno JSONB,
  data_recomendacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  aceita BOOLEAN,
  data_resposta TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS preferencias_alunos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id UUID NOT NULL REFERENCES alunos(id),
  horarios_preferidos JSONB,
  modalidade_preferida modalidade_curso,
  restricoes JSONB,
  interesses TEXT[],
  historico_academico JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aluno_id)
);

-- Tabela para métricas e logs de IA
CREATE TABLE IF NOT EXISTS metricas_ia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo TEXT NOT NULL CHECK (tipo IN ('ocr', 'chatbot', 'evasao', 'recomendacao')),
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metricas JSONB NOT NULL,
  detalhes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para otimização de performance
CREATE INDEX idx_ocr_verificacoes_documento_id ON ocr_verificacoes(documento_id);
CREATE INDEX idx_ocr_verificacoes_status ON ocr_verificacoes(status);
CREATE INDEX idx_chatbot_conversas_aluno_id ON chatbot_conversas(aluno_id);
CREATE INDEX idx_chatbot_mensagens_conversa_id ON chatbot_mensagens(conversa_id);
CREATE INDEX idx_analise_evasao_aluno_id ON analise_evasao(aluno_id);
CREATE INDEX idx_analise_evasao_matricula_id ON analise_evasao(matricula_id);
CREATE INDEX idx_analise_evasao_risco ON analise_evasao(risco);
CREATE INDEX idx_recomendacoes_turmas_aluno_id ON recomendacoes_turmas(aluno_id);
CREATE INDEX idx_recomendacoes_turmas_curso_id ON recomendacoes_turmas(curso_id);
CREATE INDEX idx_preferencias_alunos_aluno_id ON preferencias_alunos(aluno_id);

-- Políticas de segurança (RLS)
ALTER TABLE ocr_verificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ocr_modelos_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversas ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE analise_evasao ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicadores_evasao ENABLE ROW LEVEL SECURITY;
ALTER TABLE recomendacoes_turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferencias_alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas_ia ENABLE ROW LEVEL SECURITY;

-- Políticas para alunos (podem ver apenas seus próprios dados)
CREATE POLICY "Alunos podem ver suas próprias verificações OCR" ON ocr_verificacoes
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM documentos d 
    WHERE d.id = documento_id AND d.aluno_id = auth.uid()
  ) OR 
  auth.jwt() -> 'role' ? 'admin' OR 
  auth.jwt() -> 'role' ? 'secretaria'
);

CREATE POLICY "Alunos podem ver suas próprias conversas" ON chatbot_conversas
FOR SELECT USING (
  aluno_id = auth.uid() OR 
  auth.jwt() -> 'role' ? 'admin' OR 
  auth.jwt() -> 'role' ? 'atendimento'
);

CREATE POLICY "Alunos podem ver suas próprias mensagens" ON chatbot_mensagens
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chatbot_conversas c 
    WHERE c.id = conversa_id AND c.aluno_id = auth.uid()
  ) OR 
  auth.jwt() -> 'role' ? 'admin' OR 
  auth.jwt() -> 'role' ? 'atendimento'
);

CREATE POLICY "Alunos podem ver suas próprias análises de evasão" ON analise_evasao
FOR SELECT USING (
  aluno_id = auth.uid() OR 
  auth.jwt() -> 'role' ? 'admin' OR 
  auth.jwt() -> 'role' ? 'coordenacao'
);

CREATE POLICY "Alunos podem ver suas próprias recomendações" ON recomendacoes_turmas
FOR SELECT USING (
  aluno_id = auth.uid() OR 
  auth.jwt() -> 'role' ? 'admin' OR 
  auth.jwt() -> 'role' ? 'secretaria'
);

CREATE POLICY "Alunos podem ver suas próprias preferências" ON preferencias_alunos
FOR SELECT USING (
  aluno_id = auth.uid() OR 
  auth.jwt() -> 'role' ? 'admin' OR 
  auth.jwt() -> 'role' ? 'secretaria'
);

-- Funções e Triggers
CREATE OR REPLACE FUNCTION update_ai_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger para todas as tabelas
CREATE TRIGGER update_ocr_verificacoes_updated_at
BEFORE UPDATE ON ocr_verificacoes
FOR EACH ROW EXECUTE FUNCTION update_ai_updated_at_column();

CREATE TRIGGER update_ocr_modelos_documentos_updated_at
BEFORE UPDATE ON ocr_modelos_documentos
FOR EACH ROW EXECUTE FUNCTION update_ai_updated_at_column();

CREATE TRIGGER update_chatbot_conversas_updated_at
BEFORE UPDATE ON chatbot_conversas
FOR EACH ROW EXECUTE FUNCTION update_ai_updated_at_column();

CREATE TRIGGER update_analise_evasao_updated_at
BEFORE UPDATE ON analise_evasao
FOR EACH ROW EXECUTE FUNCTION update_ai_updated_at_column();

CREATE TRIGGER update_indicadores_evasao_updated_at
BEFORE UPDATE ON indicadores_evasao
FOR EACH ROW EXECUTE FUNCTION update_ai_updated_at_column();

CREATE TRIGGER update_recomendacoes_turmas_updated_at
BEFORE UPDATE ON recomendacoes_turmas
FOR EACH ROW EXECUTE FUNCTION update_ai_updated_at_column();

CREATE TRIGGER update_preferencias_alunos_updated_at
BEFORE UPDATE ON preferencias_alunos
FOR EACH ROW EXECUTE FUNCTION update_ai_updated_at_column();

-- Dados de exemplo (opcional)
INSERT INTO ocr_modelos_documentos (tipo_documento, campos_obrigatorios, padroes_validacao)
VALUES 
  ('RG', 
   '{"nome": true, "numero": true, "orgao_emissor": true, "data_emissao": true}',
   '{"numero": "^[0-9]{2}\\.[0-9]{3}\\.[0-9]{3}\\-[0-9]$", "data_emissao": "^[0-9]{2}/[0-9]{2}/[0-9]{4}$"}'
  ),
  ('CPF', 
   '{"nome": true, "numero": true}',
   '{"numero": "^[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}\\-[0-9]{2}$"}'
  ),
  ('Histórico Escolar', 
   '{"nome_aluno": true, "instituicao": true, "curso": true, "disciplinas": true}',
   '{}'
  );

INSERT INTO chatbot_intents (nome, tipo, frases_treinamento, respostas)
VALUES 
  ('Dúvidas sobre matrícula', 
   'matricula', 
   ARRAY['Como faço minha matrícula?', 'Quais os passos para me matricular?', 'Preciso ir presencialmente para fazer matrícula?', 'Como funciona o processo de matrícula?'],
   ARRAY['Para realizar sua matrícula, acesse o portal do aluno, selecione o curso desejado e siga o passo a passo para preencher seus dados, enviar documentos e realizar o pagamento.', 'O processo de matrícula é 100% online. Basta acessar nosso portal, escolher seu curso, preencher seus dados, enviar os documentos necessários e efetuar o pagamento.']
  ),
  ('Documentos necessários', 
   'documentos', 
   ARRAY['Quais documentos preciso para matrícula?', 'Que documentos devo enviar?', 'Documentação necessária para matrícula'],
   ARRAY['Os documentos necessários são: RG, CPF, Histórico Escolar, Diploma, Comprovante de Residência e uma foto 3x4 recente.', 'Para sua matrícula, você precisará enviar: Documento de identidade (RG), CPF, Histórico Escolar, Diploma ou Certificado de Conclusão, Comprovante de Residência atualizado e uma foto 3x4.']
  ),
  ('Formas de pagamento', 
   'pagamentos', 
   ARRAY['Como posso pagar?', 'Quais formas de pagamento são aceitas?', 'Posso pagar com cartão?', 'Aceitam PIX?'],
   ARRAY['Aceitamos pagamento via cartão de crédito, boleto bancário, PIX e transferência bancária.', 'Você pode pagar sua matrícula e mensalidades usando cartão de crédito (parcelado em até 12x), boleto bancário, PIX ou transferência.']
  );

INSERT INTO indicadores_evasao (nome, descricao, peso, formula, parametros)
VALUES 
  ('Frequência de acesso', 
   'Analisa a frequência com que o aluno acessa o sistema', 
   0.25, 
   'media_acessos_semana < parametros.limite_minimo ? 1.0 : 0.0', 
   '{"limite_minimo": 3}'
  ),
  ('Atraso em pagamentos', 
   'Verifica se há atrasos recorrentes nos pagamentos', 
   0.30, 
   'count_pagamentos_atrasados > parametros.limite_atrasos ? 1.0 : 0.0', 
   '{"limite_atrasos": 2}'
  ),
  ('Desempenho acadêmico', 
   'Avalia o desempenho do aluno nas disciplinas', 
   0.25, 
   'media_notas < parametros.nota_minima ? 1.0 : 0.0', 
   '{"nota_minima": 6.0}'
  ),
  ('Interação com conteúdo', 
   'Mede o nível de interação do aluno com materiais e atividades', 
   0.20, 
   'percentual_atividades_realizadas < parametros.percentual_minimo ? 1.0 : 0.0', 
   '{"percentual_minimo": 0.7}'
  );
