'use client';

import React, { forwardRef } from 'react';
import { colors } from '../../styles/colors';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
  error?: boolean;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', module = 'enrollment', error = false, icon, ...props }, ref) => {
    const moduleColor = colors.primary[module];
    
    return (
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
            {icon}
          </div>
        )}
        <input
          className={`flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-neutral-300'
          } ${icon ? 'pl-10' : ''} ${className}`}
          ref={ref}
          style={{ 
            borderColor: error ? colors.semantic.error : undefined,
            '--tw-ring-color': error ? colors.semantic.error : moduleColor.main
          } as React.CSSProperties}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
