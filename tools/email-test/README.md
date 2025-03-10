# Email Testing Tool

Esta ferramenta permite testar a configuração de email do módulo de matrículas da Edunéxia.

## Requisitos

- Node.js 14+
- Acesso ao Supabase
- Variáveis de ambiente configuradas (.env)

## Configuração

Certifique-se de que as seguintes variáveis de ambiente estão configuradas no arquivo `.env`:

```
SMTP_HOST=brasil.svrdedicado.org
SMTP_PORT=587
SMTP_USER=contato@eduzayn.com.br
SMTP_PASS=[senha]
```

## Uso

```bash
# Executar a ferramenta de teste
node tools/email-test/test-email.js
```

A ferramenta oferece as seguintes opções:

1. **Email direto**: Envia um email de teste diretamente para o destinatário especificado
2. **Email com template**: Envia um email usando um dos templates pré-configurados

## Templates Disponíveis

- `welcome_email`: Email de boas-vindas para novos alunos
- `document_approval`: Notificação de aprovação de documentos
- `payment_confirmation`: Confirmação de pagamento

## Exemplos

### Enviar email direto

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
    content: '<h1>Conteúdo HTML do Email</h1><p>Texto do email...</p>'
  })
});
```

### Enviar email com template

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
    }
  })
});
```

## Solução de Problemas

Se encontrar problemas ao executar a ferramenta:

1. Verifique se o servidor está rodando em http://localhost:3000
2. Confirme que as variáveis de ambiente estão configuradas corretamente
3. Verifique se o Supabase está acessível e configurado corretamente
4. Certifique-se de que as tabelas de email foram criadas no banco de dados
