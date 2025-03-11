/**
 * Script simplificado para verificar a implementação das funcionalidades do módulo financeiro
 */

const fs = require('fs');
const path = require('path');

// Diretório base do projeto
const BASE_DIR = path.resolve(__dirname, '../../..');
console.log('Diretório base:', BASE_DIR);

// Verificar existência de arquivos e diretórios
function checkFiles() {
  console.log('=== Verificação de Implementação do Módulo Financeiro ===\n');
  
  const files = [
    // Notificações
    'app/matricula/lib/services/notification-service.ts',
    'app/api/cron/overdue-payments/route.ts',
    
    // Relatórios
    'app/matricula/lib/services/report-generation-service.ts',
    'app/api/reports/financial/route.ts',
    
    // Lembretes
    'app/matricula/lib/services/payment-verification-service.ts',
    
    // Dashboard
    'app/matricula/components/financial-dashboard.tsx',
    'app/matricula/pages/dashboard/financial/page.tsx',
    'app/api/dashboard/financial-summary/route.ts',
    'app/matricula/components/dashboard',
    
    // Negociação de dívidas
    'app/matricula/pages/debt-negotiation/page.tsx',
    'app/matricula/components/debt-negotiation/negotiation-form.tsx',
    
    // Integrações de pagamento
    'app/matricula/types/payment-integrations.ts',
    'app/api/payment-gateways/route.ts',
    'app/api/digital-wallets/route.ts',
    'app/api/lytex/route.ts',
    'app/api/webhooks/lytex/route.ts',
    'app/matricula/actions/split-payment-actions.ts',
    
    // Segurança
    'app/matricula/lib/services/security',
    'app/api/webhooks/security/route.ts',
    '.env.example',
    
    // Otimizações técnicas
    'app/matricula/lib/services/cache-service.ts',
    'tests/performance/load-test.js',
    'scripts/run-load-tests.sh',
    'app/matricula/lib/services/api-documentation.ts'
  ];
  
  let implemented = 0;
  
  for (const file of files) {
    const fullPath = path.join(BASE_DIR, file);
    const exists = fs.existsSync(fullPath);
    
    if (exists) implemented++;
    console.log(`${exists ? '✅' : '❌'} ${file}`);
  }
  
  const implementationRate = (implemented / files.length) * 100;
  console.log(`\nTaxa de implementação: ${implementationRate.toFixed(2)}% (${implemented}/${files.length})`);
  
  return { implemented, total: files.length, rate: implementationRate };
}

// Verificar todo.txt
function checkTodoList() {
  console.log('\n=== Verificando Lista de Tarefas ===');
  
  const todoPath = path.join(BASE_DIR, 'todo.txt');
  if (!fs.existsSync(todoPath)) {
    console.log('❌ Arquivo todo.txt não encontrado');
    return;
  }
  
  const todoContent = fs.readFileSync(todoPath, 'utf8');
  console.log(todoContent);
  
  // Contar itens concluídos
  const totalItems = todoContent.split('\n').filter(line => line.trim()).length;
  const completedItems = todoContent.split('\n').filter(line => line.includes('[x]')).length;
  
  console.log(`\nItens concluídos: ${completedItems}/${totalItems} (${(completedItems/totalItems*100).toFixed(2)}%)`);
}

// Executar verificações
const { implemented, total, rate } = checkFiles();
checkTodoList();

console.log('\n=== Verificação Concluída ===');
