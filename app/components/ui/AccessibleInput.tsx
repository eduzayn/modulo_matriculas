'use client';

import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { useAccessibility } from '../providers/AccessibilityProvider';

export interface AccessibleInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  fullWidth?: boolean;
  id?: string;
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      required = false,
      fullWidth = false,
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const { highContrastMode } = useAccessibility();
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;
    
    const describedBy = [
      hintId,
      errorId
    ].filter(Boolean).join(' ') || undefined;
    
    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        <div className="flex justify-between">
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium',
              error ? 'text-red-500' : 'text-gray-700',
              highContrastMode && 'font-bold'
            )}
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            )}
            {required && (
              <span className="sr-only"> (obrigatório)</span>
            )}
          </label>
        </div>
        
        {hint && (
          <p
            id={hintId}
            className="text-sm text-gray-500"
          >
            {hint}
          </p>
        )}
        
        <input
          id={inputId}
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus-visible:ring-red-500',
            fullWidth && 'w-full',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          aria-required={required ? 'true' : 'false'}
          {...props}
        />
        
        {error && (
          <p
            id={errorId}
            className="text-sm font-medium text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';
