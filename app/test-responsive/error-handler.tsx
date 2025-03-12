'use client';

import React from 'react';
import { colors } from '../styles/colors';

interface ErrorHandlerProps {
  error: Error;
  reset: () => void;
}

/**
 * Componente específico para tratamento de erros na página de teste responsivo
 */
export default function TestResponsiveErrorHandler({
  error,
  reset
}: ErrorHandlerProps) {
  // Log do erro para debugging
  console.error('Erro na página de teste responsivo:', error);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <div 
        className="w-16 h-16 mb-6 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${colors.primary.enrollment.main}20` }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          className="w-8 h-8"
          style={{ color: colors.primary.enrollment.main }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Erro na Página de Teste</h2>
      
      <p className="text-gray-600 mb-6 max-w-md">
        Ocorreu um erro ao carregar a página de teste responsivo. Por favor, tente novamente.
      </p>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-6 p-4 bg-gray-100 rounded-md text-left max-w-md overflow-auto">
          <p className="font-mono text-sm text-red-600">{error.message}</p>
          {error.stack && (
            <pre className="mt-2 font-mono text-xs text-gray-700 overflow-x-auto">
              {error.stack}
            </pre>
          )}
        </div>
      )}
      
      <button
        onClick={reset}
        className="px-4 py-2 rounded-md text-white font-medium"
        style={{ backgroundColor: colors.primary.enrollment.main }}
      >
        Tentar Novamente
      </button>
    </div>
  );
}
