# Configuração de Email no Supabase

Este documento descreve como configurar e utilizar o sistema de email no módulo de matrículas da Edunéxia.

## Configuração Inicial

### Variáveis de Ambiente

As seguintes variáveis de ambiente são necessárias para a configuração de email:

```
SMTP_HOST=brasil.svrdedicado.org
SMTP_PORT=587
SMTP_USER=contato@eduzayn.com.br
SMTP_PASS=[senha]
```

### Configuração no Supabase

1. Acesse o dashboard do Supabase em https://app.supabase.io
2. Navegue até as configurações do projeto
3. Vá para a seção "Auth" e encontre "Email Templates"
4. Configure as configurações SMTP com:
   - Host: brasil.svrdedicado.org
   - Port: 587
   - User: contato@eduzayn.com.br
   - Password: [Senha configurada no .env]
   - Secure: No (TLS será usado)
5. Teste a configuração de email a partir do dashboard
6. Atualize os templates de email conforme necessário

## Estrutura do Banco de Dados

O sistema utiliza duas tabelas principais para gerenciar emails:

### email_templates

Armazena templates de email que podem ser reutilizados.

```sql
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  category VARCHAR(50) DEFAULT 'general'
);
```

### email_logs

Registra todos os emails enviados pelo sistema.

```sql
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content_preview TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status VARCHAR(50) DEFAULT 'sent',
  template_id UUID REFERENCES public.email_templates(id),
  error_message TEXT
);
```

## Uso da API de Email

### Enviar Email Direto

```javascript
// Exemplo de envio de email direto
const response = await fetch('/api/email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // Token de autenticação
  },
  body: JSON.stringify({
    to: 'destinatario@exemplo.com',
    subject: 'Assunto do Email',
    content: '<h1>Conteúdo HTML do Email</h1><p>Texto do email...</p>',
    options: {
      cc: ['copia@exemplo.com'],
      bcc: ['copiaoculta@exemplo.com'],
      replyTo: 'responder@exemplo.com'
    }
  })
});
```

### Enviar Email com Template

```javascript
// Exemplo de envio de email usando template
const response = await fetch('/api/email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // Token de autenticação
  },
  body: JSON.stringify({
    to: 'destinatario@exemplo.com',
    templateId: 'welcome_email', // ID do template
    variables: {
      name: 'Nome do Usuário',
      enrollment_id: 'MAT-12345',
      course_name: 'Nome do Curso',
      login_url: 'https://edunexia.com/login'
    },
    options: {
      cc: ['copia@exemplo.com']
    }
  })
});
```

### Verificar Configuração de Email

```javascript
// Exemplo de verificação da configuração de email
const response = await fetch('/api/email', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});
```

## Ferramenta de Teste de Email

Uma ferramenta de linha de comando está disponível para testar a configuração de email:

```bash
# Executar a ferramenta de teste
node tools/email-test/test-email.js
```

A ferramenta permite:
- Verificar a configuração atual de email
- Enviar emails de teste diretos
- Enviar emails de teste usando templates

## Templates Padrão

O sistema inclui os seguintes templates padrão:

1. **welcome_email**: Email de boas-vindas para novos alunos
2. **document_approval**: Notificação de aprovação de documentos
3. **payment_confirmation**: Confirmação de pagamento

## Segurança

- Todas as rotas de API de email requerem autenticação
- As tabelas de email têm políticas RLS (Row Level Security) configuradas
- Apenas usuários autenticados podem enviar emails
- Apenas administradores podem gerenciar templates de email
