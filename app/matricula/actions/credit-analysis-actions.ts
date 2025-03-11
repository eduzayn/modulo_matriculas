import { ActionResponse } from '@/types/actions';
import { AppError, appErrors } from '@/lib/errors';
import { createSafeActionClient } from '@/lib/safe-action';
import { z } from 'zod';
import { CreditScoreLevel, CreditScoreResult } from '../types/payment-integrations';

// Configuração da API de análise de crédito
const CREDIT_API_URL = process.env.CREDIT_API_URL || 'https://api.creditanalysis.com';
const CREDIT_API_TOKEN = process.env.CREDIT_API_TOKEN || '';

/**
 * Realiza análise de crédito do aluno com base no CPF
 * Integração com serviço externo de análise de crédito
 */
export async function analyzeCreditScore(cpf: string): Promise<ActionResponse<CreditScoreResult>> {
  try {
    // Validar CPF
    if (!cpf || cpf.length < 11) {
      throw appErrors.INVALID_INPUT;
    }

    // Remover caracteres especiais do CPF
    const cleanCpf = cpf.replace(/[^\d]/g, '');

    // Em ambiente de produção, faria a chamada real para a API
    // Aqui estamos simulando a resposta para fins de demonstração
    if (process.env.NODE_ENV === 'production') {
      try {
        const response = await fetch(`${CREDIT_API_URL}/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CREDIT_API_TOKEN}`
          },
          body: JSON.stringify({ cpf: cleanCpf })
        });
        
        if (!response.ok) {
          throw new Error(`Falha na análise de crédito: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Mapear resposta da API para nosso formato
        return {
          success: true,
          data: {
            cpf: cleanCpf,
            score: data.score,
            level: mapScoreToLevel(data.score),
            lastUpdate: new Date().toISOString(),
            details: data.details
          }
        };
      } catch (error) {
        console.error('Erro ao analisar crédito:', error);
        return {
          success: false,
          error: error instanceof AppError ? error : appErrors.GATEWAY_ERROR
        };
      }
    } else {
      // Simulação para ambiente de desenvolvimento
      // Gerar score aleatório entre 0 e 1000
      const score = Math.floor(Math.random() * 1000);
      
      return {
        success: true,
        data: {
          cpf: cleanCpf,
          score,
          level: mapScoreToLevel(score),
          lastUpdate: new Date().toISOString(),
          details: {
            simulatedResponse: true,
            riskFactors: score < 500 ? ['histórico de inadimplência', 'alto endividamento'] : []
          }
        }
      };
    }
  } catch (error) {
    console.error('Erro ao analisar crédito:', error);
    return {
      success: false,
      error: error instanceof AppError ? error : appErrors.INTERNAL_ERROR
    };
  }
}

/**
 * Mapeia o score numérico para um nível de crédito
 */
function mapScoreToLevel(score: number): CreditScoreLevel {
  if (score < 300) return CreditScoreLevel.BAIXO;
  if (score < 700) return CreditScoreLevel.MEDIO;
  return CreditScoreLevel.ALTO;
}

// Schema para validação de entrada da ação
const creditAnalysisSchema = z.object({
  cpf: z.string().min(11, 'CPF deve ter pelo menos 11 caracteres')
});

// Ação segura para análise de crédito
export const creditAnalysisAction = createSafeActionClient()
  .input(creditAnalysisSchema)
  .handler(async ({ cpf }) => {
    return analyzeCreditScore(cpf);
  });
