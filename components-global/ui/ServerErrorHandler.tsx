'use client';

import React from 'react';
import { colors } from '../../app/styles/colors';

interface ServerErrorHandlerProps {
  error: Error;
  reset: () => void;
  module?: 'enrollment' | 'communication' | 'student' | 'content';
}

/**
 * A component to display server errors with consistent styling
 * and provide a way to retry the operation.
 */
export default function ServerErrorHandler({
  error,
  reset,
  module = 'enrollment'
}: ServerErrorHandlerProps) {
  // Log the error to console for debugging
  console.error('Server error occurred:', error);
  
  const moduleColor = colors.primary[module]?.main || '#F59E0B';
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <div 
        className="w-16 h-16 mb-6 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${moduleColor}20` }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          className="w-8 h-8"
          style={{ color: moduleColor }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Erro no Servidor</h2>
      
      <p className="text-gray-600 mb-6 max-w-md">
        Ocorreu um erro ao processar sua solicitação. Nossa equipe foi notificada.
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
        style={{ backgroundColor: moduleColor }}
      >
        Tentar Novamente
      </button>
    </div>
  );
}
