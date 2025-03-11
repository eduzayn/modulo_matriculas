# Ambiente de Testes - Módulo de Matrículas

## Configuração do Ambiente

### Banco de Dados
- **Supabase URL**: https://uasnyifizdjxogowijip.supabase.co
- **Tabelas Criadas**:
  - `students`: Armazena informações dos alunos
  - `courses`: Armazena informações dos cursos
  - `matricula.registros`: Armazena registros de matrículas
  - `matricula_documentos`: Armazena documentos relacionados às matrículas

### Variáveis de Ambiente
Arquivo `.env.local` criado com as seguintes variáveis:
```
NEXT_PUBLIC_SUPABASE_URL=<URL do Supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Chave anônima do Supabase>
SUPABASE_SERVICE_ROLE_KEY=<Chave de serviço do Supabase>
```

Nota: As chaves reais não são incluídas neste documento por motivos de segurança.

### Dados de Teste
- **Aluno de Teste**: 
  - Nome: Aluno Teste
  - Email: aluno@teste.com
- **Curso de Teste**:
  - Nome: Curso de Teste
  - Descrição: Descrição do curso de teste
  - Preço: R$ 1.000,00

## Estrutura do Projeto

### Componentes Principais
- **Autenticação**: Sistema de login e registro de usuários
- **Matrícula**: Fluxo completo de matrícula online
- **Documentos**: Upload e gestão de documentos
- **Contratos**: Geração e assinatura de contratos
- **Pagamentos**: Processamento de pagamentos e descontos

### Arquivos Importantes
- `app/matricula/actions/matricula-actions.ts`: Ações do servidor para o processo de matrícula
- `app/matricula/lib/schemas/index.ts`: Esquemas de validação Zod
- `app/matricula/lib/services/index.ts`: Serviços de notificação e integração
- `app/matricula/types/matricula.ts`: Tipos e enums do sistema de matrícula

## Testes Automatizados

### Configuração de Testes
- **Jest**: Para testes unitários
- **Cypress**: Para testes E2E (a ser configurado)

### Execução de Testes
```bash
# Executar testes unitários
npm run test

# Executar testes E2E
npm run cypress
```

## Próximos Passos

1. Testar funcionalidades principais:
   - Autenticação
   - Criação de matrícula
   - Upload de documentos
   - Geração de contrato
   - Processamento de pagamento

2. Verificar integrações:
   - Notificações
   - Módulo financeiro
   - Módulo acadêmico

3. Validar fluxos completos:
   - Matrícula do início ao fim
   - Cenários de erro e exceção
