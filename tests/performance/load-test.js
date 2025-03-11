import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Métricas personalizadas
const errors = new Counter('errors');
const requestDuration = new Trend('request_duration');
const successRate = new Rate('success_rate');

// Configuração do teste de carga
export const options = {
  // Estágios de carga
  stages: [
    { duration: '30s', target: 10 }, // Rampa de subida para 10 usuários em 30 segundos
    { duration: '1m', target: 10 },  // Manter 10 usuários por 1 minuto
    { duration: '30s', target: 50 }, // Rampa de subida para 50 usuários em 30 segundos
    { duration: '1m', target: 50 },  // Manter 50 usuários por 1 minuto
    { duration: '30s', target: 0 },  // Rampa de descida para 0 usuários em 30 segundos
  ],
  // Limites de aceitação
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% das requisições devem ser concluídas em menos de 500ms
    'http_req_duration{name:dashboard}': ['p(95)<800'], // 95% das requisições ao dashboard devem ser concluídas em menos de 800ms
    'http_req_duration{name:payment}': ['p(95)<1000'], // 95% das requisições de pagamento devem ser concluídas em menos de 1000ms
    'success_rate': ['rate>0.95'], // Taxa de sucesso deve ser maior que 95%
  },
};

// URL base da aplicação
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Função principal do teste
export default function() {
  // Teste do dashboard financeiro
  testDashboard();
  sleep(1);
  
  // Teste da API de pagamentos
  testPaymentAPI();
  sleep(1);
  
  // Teste da API de relatórios
  testReportAPI();
  sleep(1);
}

// Teste do dashboard financeiro
function testDashboard() {
  const url = `${BASE_URL}/api/dashboard/financial-summary`;
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    tags: { name: 'dashboard' },
  };
  
  const response = http.get(url, params);
  
  // Registrar duração da requisição
  requestDuration.add(response.timings.duration, { name: 'dashboard' });
  
  // Verificar resposta
  const success = check(response, {
    'status é 200': (r) => r.status === 200,
    'resposta contém dados': (r) => r.json().data !== undefined,
  });
  
  // Registrar sucesso ou erro
  successRate.add(success);
  if (!success) {
    errors.add(1, { name: 'dashboard' });
    console.error(`Erro no dashboard: ${response.status} - ${response.body}`);
  }
}

// Teste da API de pagamentos
function testPaymentAPI() {
  const url = `${BASE_URL}/api/payment-gateways`;
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    tags: { name: 'payment' },
  };
  
  const response = http.get(url, params);
  
  // Registrar duração da requisição
  requestDuration.add(response.timings.duration, { name: 'payment' });
  
  // Verificar resposta
  const success = check(response, {
    'status é 200': (r) => r.status === 200,
    'resposta contém dados': (r) => r.json().data !== undefined,
  });
  
  // Registrar sucesso ou erro
  successRate.add(success);
  if (!success) {
    errors.add(1, { name: 'payment' });
    console.error(`Erro na API de pagamentos: ${response.status} - ${response.body}`);
  }
}

// Teste da API de relatórios
function testReportAPI() {
  const url = `${BASE_URL}/api/reports/financial`;
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    tags: { name: 'report' },
  };
  
  const response = http.get(url, params);
  
  // Registrar duração da requisição
  requestDuration.add(response.timings.duration, { name: 'report' });
  
  // Verificar resposta
  const success = check(response, {
    'status é 200': (r) => r.status === 200,
    'resposta contém dados': (r) => r.json().data !== undefined,
  });
  
  // Registrar sucesso ou erro
  successRate.add(success);
  if (!success) {
    errors.add(1, { name: 'report' });
    console.error(`Erro na API de relatórios: ${response.status} - ${response.body}`);
  }
}
