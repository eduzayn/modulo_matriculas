/**
 * Documentação da API do Módulo de Matrículas
 * 
 * Este arquivo contém a documentação das APIs do módulo de matrículas,
 * incluindo endpoints, parâmetros, respostas e exemplos de uso.
 * 
 * @module MatriculaAPI
 */

/**
 * Endpoints da API de Matrículas
 * 
 * @namespace Endpoints
 */

/**
 * API de Dashboard Financeiro
 * 
 * Retorna dados para o dashboard financeiro, incluindo métricas,
 * gráficos e transações recentes.
 * 
 * @endpoint GET /api/dashboard/financial-summary
 * @returns {Object} Dados do dashboard financeiro
 * @example
 * // Exemplo de resposta
 * {
 *   "success": true,
 *   "data": {
 *     "metrics": {
 *       "totalReceitas": 125000,
 *       "totalPendentes": 35000,
 *       "totalAtrasados": 15000,
 *       "taxaInadimplencia": 0.12
 *     },
 *     "monthlyData": [
 *       { "month": "Jan", "receitas": 15000, "pendentes": 5000, "atrasados": 2000 },
 *       { "month": "Fev", "receitas": 18000, "pendentes": 4500, "atrasados": 1800 }
 *     ],
 *     "recentPayments": [
 *       {
 *         "id": "pay_123",
 *         "aluno": "João Silva",
 *         "curso": "Engenharia de Software",
 *         "valor": 1500,
 *         "data": "2023-05-15",
 *         "forma_pagamento": "Cartão de Crédito"
 *       }
 *     ]
 *   }
 * }
 */

/**
 * API de Relatórios Financeiros
 * 
 * Gera relatórios financeiros com base nos parâmetros fornecidos.
 * 
 * @endpoint GET /api/reports/financial
 * @param {string} [start_date] Data de início do período (formato: YYYY-MM-DD)
 * @param {string} [end_date] Data de fim do período (formato: YYYY-MM-DD)
 * @param {string} [type] Tipo de relatório (receitas, inadimplencia, previsao)
 * @param {string} [format] Formato do relatório (json, csv, pdf)
 * @returns {Object} Dados do relatório financeiro
 * @example
 * // Exemplo de requisição
 * GET /api/reports/financial?start_date=2023-01-01&end_date=2023-12-31&type=receitas&format=json
 * 
 * // Exemplo de resposta
 * {
 *   "success": true,
 *   "data": {
 *     "title": "Relatório de Receitas",
 *     "period": "01/01/2023 a 31/12/2023",
 *     "summary": {
 *       "total": 250000,
 *       "media_mensal": 20833.33
 *     },
 *     "details": [
 *       { "mes": "Janeiro", "valor": 18000, "percentual": 0.072 },
 *       { "mes": "Fevereiro", "valor": 22000, "percentual": 0.088 }
 *     ]
 *   }
 * }
 */

/**
 * API de Gateways de Pagamento
 * 
 * Retorna a lista de gateways de pagamento disponíveis.
 * 
 * @endpoint GET /api/payment-gateways
 * @returns {Object} Lista de gateways de pagamento
 * @example
 * // Exemplo de resposta
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "lytex",
 *       "name": "Lytex Pagamentos",
 *       "code": "lytex",
 *       "logo": "https://lytex.com.br/logo.png",
 *       "methods": ["credit_card", "boleto", "pix"],
 *       "digitalWallets": [],
 *       "description": "Gateway de pagamento principal",
 *       "isDefault": true
 *     },
 *     {
 *       "id": "mercadopago",
 *       "name": "Mercado Pago",
 *       "code": "mercadopago",
 *       "logo": "https://www.mercadopago.com.br/logo.png",
 *       "methods": ["credit_card", "boleto", "pix", "digital_wallet"],
 *       "digitalWallets": ["mercadopago_wallet"],
 *       "description": "Integração com Mercado Pago",
 *       "isDefault": false
 *     }
 *   ]
 * }
 */

/**
 * API de Carteiras Digitais
 * 
 * Retorna a lista de carteiras digitais disponíveis.
 * 
 * @endpoint GET /api/digital-wallets
 * @returns {Object} Lista de carteiras digitais
 * @example
 * // Exemplo de resposta
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "google_pay",
 *       "name": "Google Pay",
 *       "code": "google_pay",
 *       "logo": "https://www.gstatic.com/pay/logos/googlepay_mark.svg",
 *       "description": "Pagamento via Google Pay",
 *       "supportedGateways": ["mercadopago", "stripe"]
 *     },
 *     {
 *       "id": "mercadopago_wallet",
 *       "name": "Carteira Mercado Pago",
 *       "code": "mercadopago_wallet",
 *       "logo": "https://www.mercadopago.com.br/wallet-logo.png",
 *       "description": "Pagamento via carteira Mercado Pago",
 *       "supportedGateways": ["mercadopago"]
 *     }
 *   ]
 * }
 */

/**
 * API de Processamento de Pagamentos
 * 
 * Processa um pagamento através do gateway selecionado.
 * 
 * @endpoint POST /api/payments/process
 * @param {Object} body Dados do pagamento
 * @param {string} body.gateway Gateway de pagamento (lytex, pagseguro, mercadopago, stripe, paypal)
 * @param {string} body.method Método de pagamento (credit_card, debit_card, boleto, pix, transfer, digital_wallet)
 * @param {number} body.amount Valor do pagamento
 * @param {string} body.description Descrição do pagamento
 * @param {string} body.reference Referência do pagamento
 * @param {Object} body.customer Dados do cliente
 * @param {string} body.customer.name Nome do cliente
 * @param {string} body.customer.email Email do cliente
 * @param {string} body.customer.document Documento do cliente (CPF/CNPJ)
 * @param {string} [body.customer.phone] Telefone do cliente
 * @param {string} [body.digitalWallet] Carteira digital (google_pay, apple_pay, samsung_pay, mercadopago_wallet, picpay, paypal)
 * @param {number} [body.installments] Número de parcelas
 * @param {string} [body.dueDate] Data de vencimento (formato: YYYY-MM-DDTHH:mm:ss.sssZ)
 * @param {string} [body.callbackUrl] URL de callback para notificações
 * @param {Object} [body.metadata] Metadados adicionais
 * @returns {Object} Resultado do processamento do pagamento
 * @example
 * // Exemplo de requisição
 * POST /api/payments/process
 * {
 *   "gateway": "lytex",
 *   "method": "credit_card",
 *   "amount": 1500,
 *   "description": "Mensalidade do curso de Engenharia de Software",
 *   "reference": "MAT123456",
 *   "customer": {
 *     "name": "João Silva",
 *     "email": "joao.silva@example.com",
 *     "document": "123.456.789-00",
 *     "phone": "(11) 98765-4321"
 *   },
 *   "installments": 3,
 *   "callbackUrl": "https://example.com/webhooks/payments",
 *   "metadata": {
 *     "matricula_id": "MAT123456",
 *     "curso_id": "CUR789"
 *   }
 * }
 * 
 * // Exemplo de resposta
 * {
 *   "success": true,
 *   "data": {
 *     "id": "pay_123456789",
 *     "gateway": "lytex",
 *     "status": "pending",
 *     "amount": 1500,
 *     "paymentUrl": "https://checkout.lytex.com.br/pay/123456789",
 *     "expiresAt": "2023-06-15T23:59:59.999Z",
 *     "gatewayResponse": {
 *       "id": "123456789",
 *       "status": "pending",
 *       "created_at": "2023-05-15T14:30:00.000Z"
 *     }
 *   }
 * }
 */

/**
 * API de Análise de Crédito
 * 
 * Realiza análise de crédito do aluno com base no CPF.
 * 
 * @endpoint POST /api/credit-analysis
 * @param {Object} body Dados para análise de crédito
 * @param {string} body.cpf CPF do aluno
 * @returns {Object} Resultado da análise de crédito
 * @example
 * // Exemplo de requisição
 * POST /api/credit-analysis
 * {
 *   "cpf": "123.456.789-00"
 * }
 * 
 * // Exemplo de resposta
 * {
 *   "success": true,
 *   "data": {
 *     "cpf": "12345678900",
 *     "score": 850,
 *     "level": "alto",
 *     "lastUpdate": "2023-05-15T14:30:00.000Z",
 *     "details": {
 *       "riskFactors": []
 *     }
 *   }
 * }
 */

/**
 * API de Notificações de Pagamentos Atrasados
 * 
 * Endpoint para envio de notificações de pagamentos atrasados.
 * 
 * @endpoint POST /api/cron/overdue-payments
 * @param {Object} body Configurações para envio de notificações
 * @param {number} [body.daysOverdue] Dias de atraso para filtrar (padrão: 1)
 * @param {boolean} [body.sendEmail] Enviar notificação por email (padrão: true)
 * @param {boolean} [body.sendSMS] Enviar notificação por SMS (padrão: false)
 * @param {boolean} [body.sendWhatsApp] Enviar notificação por WhatsApp (padrão: false)
 * @returns {Object} Resultado do envio de notificações
 * @example
 * // Exemplo de requisição
 * POST /api/cron/overdue-payments
 * {
 *   "daysOverdue": 5,
 *   "sendEmail": true,
 *   "sendSMS": true,
 *   "sendWhatsApp": true
 * }
 * 
 * // Exemplo de resposta
 * {
 *   "success": true,
 *   "data": {
 *     "total": 15,
 *     "sent": 15,
 *     "failed": 0,
 *     "details": {
 *       "email": { "sent": 15, "failed": 0 },
 *       "sms": { "sent": 12, "failed": 3 },
 *       "whatsapp": { "sent": 10, "failed": 5 }
 *     }
 *   }
 * }
 */

/**
 * Webhook para Eventos de Pagamento
 * 
 * Endpoint para receber notificações de eventos de pagamento dos gateways.
 * 
 * @endpoint POST /api/webhooks/security
 * @param {Object} body Payload do webhook
 * @param {string} body.gateway Gateway de pagamento
 * @param {string} body.event Tipo de evento
 * @param {Object} body.data Dados do evento
 * @param {string} [body.signature] Assinatura para verificação
 * @returns {Object} Confirmação de recebimento
 * @example
 * // Exemplo de requisição
 * POST /api/webhooks/security
 * {
 *   "gateway": "lytex",
 *   "event": "payment.succeeded",
 *   "data": {
 *     "id": "pay_123456789",
 *     "status": "paid",
 *     "amount": 1500,
 *     "paid_at": "2023-05-15T15:30:00.000Z"
 *   },
 *   "signature": "a1b2c3d4e5f6g7h8i9j0"
 * }
 * 
 * // Exemplo de resposta
 * {
 *   "success": true
 * }
 */

/**
 * Tipos de dados utilizados nas APIs
 * 
 * @namespace Types
 */

/**
 * Tipo de Gateway de Pagamento
 * 
 * @typedef {string} PaymentGateway
 * @enum {string}
 * @memberof Types
 * @property {string} LYTEX "lytex" - Lytex Pagamentos
 * @property {string} PAGSEGURO "pagseguro" - PagSeguro
 * @property {string} MERCADOPAGO "mercadopago" - Mercado Pago
 * @property {string} STRIPE "stripe" - Stripe
 * @property {string} PAYPAL "paypal" - PayPal
 */

/**
 * Tipo de Método de Pagamento
 * 
 * @typedef {string} PaymentMethod
 * @enum {string}
 * @memberof Types
 * @property {string} CREDIT_CARD "credit_card" - Cartão de Crédito
 * @property {string} DEBIT_CARD "debit_card" - Cartão de Débito
 * @property {string} BOLETO "boleto" - Boleto Bancário
 * @property {string} PIX "pix" - PIX
 * @property {string} TRANSFER "transfer" - Transferência Bancária
 * @property {string} DIGITAL_WALLET "digital_wallet" - Carteira Digital
 */

/**
 * Tipo de Carteira Digital
 * 
 * @typedef {string} DigitalWallet
 * @enum {string}
 * @memberof Types
 * @property {string} GOOGLE_PAY "google_pay" - Google Pay
 * @property {string} APPLE_PAY "apple_pay" - Apple Pay
 * @property {string} SAMSUNG_PAY "samsung_pay" - Samsung Pay
 * @property {string} MERCADOPAGO_WALLET "mercadopago_wallet" - Carteira Mercado Pago
 * @property {string} PICPAY "picpay" - PicPay
 * @property {string} PAYPAL "paypal" - PayPal
 */

/**
 * Tipo de Evento de Webhook
 * 
 * @typedef {string} WebhookEventType
 * @enum {string}
 * @memberof Types
 * @property {string} PAYMENT_CREATED "payment.created" - Pagamento criado
 * @property {string} PAYMENT_UPDATED "payment.updated" - Pagamento atualizado
 * @property {string} PAYMENT_SUCCEEDED "payment.succeeded" - Pagamento bem-sucedido
 * @property {string} PAYMENT_FAILED "payment.failed" - Pagamento falhou
 * @property {string} PAYMENT_REFUNDED "payment.refunded" - Pagamento reembolsado
 * @property {string} PAYMENT_CHARGEBACK "payment.chargeback" - Pagamento com chargeback
 */

/**
 * Tipo de Nível de Score de Crédito
 * 
 * @typedef {string} CreditScoreLevel
 * @enum {string}
 * @memberof Types
 * @property {string} BAIXO "baixo" - Score de crédito baixo
 * @property {string} MEDIO "medio" - Score de crédito médio
 * @property {string} ALTO "alto" - Score de crédito alto
 */

/**
 * Exemplos de uso das APIs
 * 
 * @namespace Examples
 */

/**
 * Exemplo de uso da API de Dashboard Financeiro
 * 
 * @example
 * // Requisição
 * fetch('/api/dashboard/financial-summary')
 *   .then(response => response.json())
 *   .then(data => {
 *     if (data.success) {
 *       // Atualizar dashboard com os dados recebidos
 *       updateMetrics(data.data.metrics);
 *       updateCharts(data.data.monthlyData);
 *       updateTransactions(data.data.recentPayments);
 *     } else {
 *       console.error('Erro ao carregar dashboard:', data.error);
 *     }
 *   })
 *   .catch(error => {
 *     console.error('Erro na requisição:', error);
 *   });
 * 
 * @memberof Examples
 */

/**
 * Exemplo de uso da API de Processamento de Pagamentos
 * 
 * @example
 * // Requisição
 * const paymentData = {
 *   gateway: 'lytex',
 *   method: 'credit_card',
 *   amount: 1500,
 *   description: 'Mensalidade do curso de Engenharia de Software',
 *   reference: 'MAT123456',
 *   customer: {
 *     name: 'João Silva',
 *     email: 'joao.silva@example.com',
 *     document: '123.456.789-00',
 *     phone: '(11) 98765-4321'
 *   },
 *   installments: 3,
 *   callbackUrl: 'https://example.com/webhooks/payments',
 *   metadata: {
 *     matricula_id: 'MAT123456',
 *     curso_id: 'CUR789'
 *   }
 * };
 * 
 * fetch('/api/payments/process', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json'
 *   },
 *   body: JSON.stringify(paymentData)
 * })
 *   .then(response => response.json())
 *   .then(data => {
 *     if (data.success) {
 *       // Redirecionar para URL de pagamento
 *       window.location.href = data.data.paymentUrl;
 *     } else {
 *       console.error('Erro ao processar pagamento:', data.error);
 *     }
 *   })
 *   .catch(error => {
 *     console.error('Erro na requisição:', error);
 *   });
 * 
 * @memberof Examples
 */

/**
 * Exemplo de uso da API de Análise de Crédito
 * 
 * @example
 * // Requisição
 * const cpf = '123.456.789-00';
 * 
 * fetch('/api/credit-analysis', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json'
 *   },
 *   body: JSON.stringify({ cpf })
 * })
 *   .then(response => response.json())
 *   .then(data => {
 *     if (data.success) {
 *       // Exibir resultado da análise de crédito
 *       displayCreditScore(data.data);
 *     } else {
 *       console.error('Erro na análise de crédito:', data.error);
 *     }
 *   })
 *   .catch(error => {
 *     console.error('Erro na requisição:', error);
 *   });
 * 
 * @memberof Examples
 */

/**
 * Exemplo de uso da API de Notificações de Pagamentos Atrasados
 * 
 * @example
 * // Requisição
 * const notificationConfig = {
 *   daysOverdue: 5,
 *   sendEmail: true,
 *   sendSMS: true,
 *   sendWhatsApp: true
 * };
 * 
 * fetch('/api/cron/overdue-payments', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json'
 *   },
 *   body: JSON.stringify(notificationConfig)
 * })
 *   .then(response => response.json())
 *   .then(data => {
 *     if (data.success) {
 *       // Exibir resultado do envio de notificações
 *       displayNotificationResults(data.data);
 *     } else {
 *       console.error('Erro ao enviar notificações:', data.error);
 *     }
 *   })
 *   .catch(error => {
 *     console.error('Erro na requisição:', error);
 *   });
 * 
 * @memberof Examples
 */
