'use client';

import React from 'react';
import { colors } from '../styles/colors';

export default function TestResponsiveLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <div className="w-16 h-16 mb-6 relative">
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-75"
          style={{ backgroundColor: `${colors.primary.enrollment.main}40` }}
        ></div>
        <div 
          className="absolute inset-0 rounded-full animate-pulse"
          style={{ backgroundColor: colors.primary.enrollment.main }}
        ></div>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Carregando...</h2>
      <p className="text-gray-600">
        Aguarde enquanto preparamos a página de teste responsivo.
      </p>
    </div>
  );
}
