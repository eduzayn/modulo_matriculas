# Revisão do Banco de Dados - Módulo de Matrículas

## Estruturas Existentes

### Tabelas Principais
- `alunos`: Informações dos alunos
- `cursos`: Cursos disponíveis
- `turmas`: Turmas e horários
- `documentos`: Documentos dos alunos
- `contratos`: Contratos de matrícula
- `descontos`: Descontos aplicáveis
- `matriculas`: Registros de matrícula
- `parcelas`: Parcelas de pagamento
- `checklist_documentos`: Checklist de documentos necessários
- `validacao_documentos`: Validação de documentos
- `historico_revisoes`: Histórico de alterações
- `relatorios`: Relatórios gerados

### Tabelas de IA e Automação
- `ocr_verificacoes`: Verificação automática de documentos
- `chatbot_conversas`: Conversas com chatbot
- `chatbot_mensagens`: Mensagens do chatbot
- `analise_evasao`: Análise preditiva de evasão
- `recomendacoes_turmas`: Recomendação inteligente de turmas

### Tabelas de Email
- `email_templates`: Templates de email
- `email_logs`: Logs de emails enviados

## Estruturas Faltantes

### Schemas e Tabelas
- ✅ Schema `matricula`: Necessário para organizar as tabelas do módulo
- ✅ Tabela `matricula.registros`: Versão do schema matricula da tabela matriculas
- ✅ Tabela `matricula.documentos`: Documentos específicos de matrícula
- ✅ Tabela `matricula_documentos`: Tabela pública para documentos de matrícula
- ✅ Tabela `matricula_contratos`: Tabela para contratos de matrícula
- ✅ Tabela `admin_users`: Usuários administradores com roles

### Storage Buckets
- ✅ Bucket `matricula_documentos`: Armazenamento de documentos de matrícula
- ✅ Bucket `contratos`: Armazenamento de contratos
- ✅ Bucket `perfil`: Armazenamento de fotos de perfil

### Funções e Triggers
- ✅ Função `get_admin_role()`: Adiciona role ao JWT do usuário
- ✅ Trigger `on_auth_user_created`: Atualiza JWT ao criar usuário
- ✅ Trigger `on_auth_user_updated`: Atualiza JWT ao atualizar usuário
- ✅ Função `update_modified_column()`: Atualiza o campo updated_at automaticamente

## Scripts de Migração Criados

1. `20250310_matricula_schema.sql`: Cria o schema matricula e suas tabelas
2. `20250310_admin_users.sql`: Cria a tabela de usuários administradores
3. `20250310_matricula_documentos.sql`: Cria a tabela de documentos de matrícula
4. `20250310_matricula_contratos.sql`: Cria a tabela de contratos de matrícula
5. `storage/create_buckets.sql`: Cria os buckets de storage necessários

## Resumo das Alterações

### Tabelas Criadas
1. **Schema Matricula**
   - `matricula.registros`: Registros de matrícula
   - `matricula.documentos`: Documentos de matrícula
   - `matricula.parcelas`: Parcelas de pagamento
   - `matricula.checklist_documentos`: Checklist de documentos
   - `matricula.validacao_documentos`: Validação de documentos
   - `matricula.historico_revisoes`: Histórico de revisões

2. **Tabelas Públicas**
   - `admin_users`: Usuários administradores
   - `matricula_documentos`: Documentos de matrícula
   - `matricula_contratos`: Contratos de matrícula

### Storage Buckets
- `matricula_documentos`: Para armazenar documentos de matrícula
- `contratos`: Para armazenar contratos
- `perfil`: Para armazenar fotos de perfil

### Funções e Triggers
- Funções para atualização automática de timestamps
- Triggers para manter integridade de dados
- Funções para gerenciamento de roles de usuários

## Recomendações Adicionais

### Índices para Otimização
- Adicionar índices compostos para consultas frequentes
- Exemplo: `CREATE INDEX idx_matricula_complex_search ON matricula.registros (status, curso_id, data_assinatura);`

### Políticas RLS Adicionais
- Refinar políticas RLS para maior segurança
- Adicionar políticas específicas para cada role

### Funções para Automação
- Criar funções para automatizar processos comuns
- Exemplo: função para calcular status de matrícula baseado em documentos e pagamentos

### Triggers para Integridade
- Adicionar triggers para manter integridade entre tabelas relacionadas
- Exemplo: atualizar status de matrícula quando todos documentos forem aprovados

## Próximos Passos

1. **Executar Scripts de Migração**
   - Executar os scripts na ordem correta para evitar problemas de dependência
   - Verificar se todas as tabelas foram criadas corretamente

2. **Verificar Integridade**
   - Testar as políticas RLS para garantir segurança
   - Verificar se os triggers estão funcionando corretamente

3. **Otimizar Performance**
   - Monitorar consultas lentas
   - Adicionar índices adicionais conforme necessário

4. **Documentar Estrutura**
   - Manter documentação atualizada
   - Criar diagramas ER para visualização da estrutura
