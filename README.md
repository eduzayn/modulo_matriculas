# Módulo de Matrículas - Edunéxia

O Módulo de Matrículas é responsável por todo o processo de inscrição, gestão e acompanhamento das matrículas dos alunos, integrando-se com os módulos financeiro, acadêmico e de comunicação.

## Visão Geral

Este módulo gerencia o ciclo completo de matrículas, desde a pré-matrícula até a conclusão do processo, incluindo:

- Processo de matrícula online
- Gestão de documentos
- Contratos e assinaturas digitais
- Pagamentos e descontos
- Integrações com outros módulos
- Notificações automáticas

## Estrutura Principal

### 1. Processo de Matrícula

- **Pré-Matrícula**: Dados pessoais, documentação, escolha de curso
- **Análise Documental**: Verificação de documentos, requisitos e disponibilidade
- **Contrato de Matrícula**: Geração, assinatura digital e aceite
- **Pagamento**: Formas de pagamento, parcelas e descontos

### 2. Gestão de Documentos

- **Documentos Obrigatórios**: RG, CPF, histórico escolar, etc.
- **Validação**: Checklist de documentos, status de validação, histórico de revisões

### 3. Gestão Administrativa

- **Controle de Matrículas**: Ativas, pendentes, canceladas, trancadas
- **Análise Documental**: Fila de análise, tempo médio, taxa de aprovação
- **Relatórios**: Matrículas por período, taxa de conversão, indicadores financeiros

### 4. Integrações

- **Financeiro**: Geração de boletos, controle de pagamentos, acordos financeiros
- **Acadêmico**: Alocação de turmas, controle de vagas, grade curricular
- **Comunicação**: Notificações, emails automáticos, SMS

## Tecnologias Utilizadas

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Banco de Dados**: Supabase
- **Autenticação**: Supabase Auth
- **Validação**: Zod
- **Formulários**: React Hook Form
- **UI Components**: Shadcn UI

## Funcionalidades Principais

1. **Processo de Matrícula Online**
   - Formulário inteligente de cadastro
   - Upload de documentos
   - Assinatura digital de contratos
   - Seleção de formas de pagamento
   - Geração automática de documentos

2. **Automações**
   - Notificações automáticas
   - Validações automáticas
   - Lembretes de documentos pendentes

3. **Dashboard de Gestão**
   - Indicadores principais
   - Relatórios de matrículas
   - Análise de conversão

4. **Recursos Adicionais**
   - Gestão de descontos
   - Suporte ao aluno
   - Segurança e conformidade LGPD

## Benefícios

### Para a Instituição
- Processo automatizado
- Redução de erros
- Aumento na conversão
- Gestão eficiente
- Dados analíticos

### Para o Aluno
- Processo simplificado
- Matrícula 100% online
- Acompanhamento em tempo real
- Suporte multicanal
- Documentação digital

## Instalação e Configuração

```bash
# Instalar dependências
npm install

# Executar em ambiente de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Iniciar em produção
npm run start
```

## Contribuição

Para contribuir com o projeto, siga as diretrizes de desenvolvimento e padrões de código estabelecidos.

## Licença

Este projeto é proprietário e de uso exclusivo da Edunéxia.
