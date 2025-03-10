#!/usr/bin/env node

/**
 * Email Testing Tool
 * 
 * This script tests the email configuration by sending a test email
 * through the API route.
 */

require('dotenv').config();
const fetch = require('node-fetch');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Default test email content
const defaultTestEmail = {
  to: 'test@example.com',
  subject: 'Teste de Configuração de Email - Edunéxia',
  content: `
    <h1>Teste de Email</h1>
    <p>Este é um email de teste enviado pelo sistema de matrículas da Edunéxia.</p>
    <p>Se você está recebendo este email, a configuração SMTP está funcionando corretamente.</p>
    <p>Detalhes da configuração:</p>
    <ul>
      <li>Host: ${process.env.SMTP_HOST}</li>
      <li>Porta: ${process.env.SMTP_PORT}</li>
      <li>Usuário: ${process.env.SMTP_USER}</li>
    </ul>
    <p>Data e hora do teste: ${new Date().toLocaleString()}</p>
  `
};

// Function to test email using template
async function testTemplateEmail(templateId, to, variables) {
  try {
    console.log(`Enviando email de teste usando template ${templateId} para ${to}...`);
    
    const response = await fetch('http://localhost:3000/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        templateId,
        to,
        variables
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Email enviado com sucesso!');
      console.log(result);
    } else {
      console.error('Erro ao enviar email:');
      console.error(result);
    }
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
}

// Function to test direct email
async function testDirectEmail(to, subject, content) {
  try {
    console.log(`Enviando email de teste para ${to}...`);
    
    const response = await fetch('http://localhost:3000/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        to,
        subject,
        content
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Email enviado com sucesso!');
      console.log(result);
    } else {
      console.error('Erro ao enviar email:');
      console.error(result);
    }
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
}

// Function to check email configuration
async function checkEmailConfig() {
  try {
    console.log('Verificando configuração de email...');
    
    const response = await fetch('http://localhost:3000/api/email', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Configuração de email:');
      console.log(result.config);
    } else {
      console.error('Erro ao verificar configuração de email:');
      console.error(result);
    }
  } catch (error) {
    console.error('Erro ao verificar configuração de email:', error);
  }
}

// Main function
async function main() {
  console.log('Ferramenta de Teste de Email - Edunéxia');
  console.log('=======================================');
  
  // Check if the server is running
  try {
    await fetch('http://localhost:3000');
    console.log('Servidor detectado em http://localhost:3000');
  } catch (error) {
    console.error('Erro: O servidor não está rodando em http://localhost:3000');
    console.error('Por favor, inicie o servidor com "npm run dev" antes de executar este teste.');
    process.exit(1);
  }
  
  // Check email configuration
  await checkEmailConfig();
  
  // Ask for test type
  rl.question('\nEscolha o tipo de teste:\n1. Email direto\n2. Email com template\n> ', async (answer) => {
    if (answer === '1') {
      // Direct email test
      rl.question('\nEmail de destino (deixe em branco para usar test@example.com): ', async (to) => {
        const recipient = to || defaultTestEmail.to;
        
        console.log(`\nEnviando email de teste para ${recipient}...`);
        await testDirectEmail(
          recipient,
          defaultTestEmail.subject,
          defaultTestEmail.content
        );
        
        rl.close();
      });
    } else if (answer === '2') {
      // Template email test
      rl.question('\nID do template (welcome_email, document_approval, payment_confirmation): ', async (templateId) => {
        if (!templateId) {
          console.error('ID do template é obrigatório.');
          rl.close();
          return;
        }
        
        rl.question('Email de destino (deixe em branco para usar test@example.com): ', async (to) => {
          const recipient = to || defaultTestEmail.to;
          
          console.log(`\nEnviando email de teste usando template ${templateId} para ${recipient}...`);
          await testTemplateEmail(
            templateId,
            recipient,
            {
              name: 'Usuário de Teste',
              enrollment_id: 'MAT-' + Math.floor(Math.random() * 10000),
              course_name: 'Curso de Teste',
              login_url: 'https://edunexia.com/login',
              amount: '1.000,00',
              payment_date: new Date().toLocaleDateString(),
              payment_method: 'Cartão de Crédito',
              reference: 'REF-' + Math.floor(Math.random() * 10000),
              receipt_url: 'https://edunexia.com/receipts/test',
              next_steps_url: 'https://edunexia.com/next-steps'
            }
          );
          
          rl.close();
        });
      });
    } else {
      console.log('Opção inválida.');
      rl.close();
    }
  });
}

main().catch(err => {
  console.error('Erro não tratado:', err);
  process.exit(1);
});
