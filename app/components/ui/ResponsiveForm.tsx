'use client';

import React, { ReactNode } from 'react';
import { colors } from '../../styles/colors';

interface ResponsiveFormProps {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

/**
 * A responsive form component that adapts to different screen sizes.
 */
export const ResponsiveForm = ({
  children,
  onSubmit,
  className = '',
}: ResponsiveFormProps) => {
  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(e);
      }}
      className={`space-y-4 md:space-y-6 ${className}`}
    >
      {children}
    </form>
  );
};

interface ResponsiveFormGroupProps {
  children: ReactNode;
  label?: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

/**
 * A responsive form group component for grouping form elements.
 */
export const ResponsiveFormGroup = ({
  children,
  label,
  htmlFor,
  error,
  required = false,
  className = '',
}: ResponsiveFormGroupProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label 
          htmlFor={htmlFor} 
          className="block text-sm font-medium text-neutral-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

interface ResponsiveFormRowProps {
  children: ReactNode;
  className?: string;
}

/**
 * A responsive form row component for horizontal form layouts.
 */
export const ResponsiveFormRow = ({
  children,
  className = '',
}: ResponsiveFormRowProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {children}
    </div>
  );
};

interface ResponsiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
  error?: boolean;
  fullWidth?: boolean;
  className?: string;
}

/**
 * A responsive input component that adapts to different screen sizes.
 */
export const ResponsiveInput = ({
  module = 'enrollment',
  error = false,
  fullWidth = true,
  className = '',
  ...props
}: ResponsiveInputProps) => {
  const moduleColor = colors.primary[module];
  
  return (
    <input
      className={`
        px-3 py-2 bg-white border rounded-md text-sm
        focus:outline-none focus:ring-2 focus:ring-offset-0
        disabled:opacity-50 disabled:cursor-not-allowed
        ${error ? 'border-red-500 focus:ring-red-500' : `border-neutral-300 focus:ring-${module}-500 focus:border-${module}-500`}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={!error ? { 
        borderColor: props.disabled ? '' : 'var(--border)',
        '--border': props.disabled ? '' : moduleColor.light,
      } as React.CSSProperties : undefined}
      {...props}
    />
  );
};

interface ResponsiveSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
  error?: boolean;
  fullWidth?: boolean;
  className?: string;
  options?: Array<{ value: string; label: string }>;
}

/**
 * A responsive select component that adapts to different screen sizes.
 */
export const ResponsiveSelect = ({
  module = 'enrollment',
  error = false,
  fullWidth = true,
  className = '',
  options = [],
  children,
  ...props
}: ResponsiveSelectProps) => {
  const moduleColor = colors.primary[module];
  
  return (
    <select
      className={`
        px-3 py-2 bg-white border rounded-md text-sm
        focus:outline-none focus:ring-2 focus:ring-offset-0
        disabled:opacity-50 disabled:cursor-not-allowed
        ${error ? 'border-red-500 focus:ring-red-500' : `border-neutral-300 focus:ring-${module}-500 focus:border-${module}-500`}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={!error ? { 
        borderColor: props.disabled ? '' : 'var(--border)',
        '--border': props.disabled ? '' : moduleColor.light,
      } as React.CSSProperties : undefined}
      {...props}
    >
      {options.length > 0 ? (
        options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))
      ) : (
        children
      )}
    </select>
  );
};

export default ResponsiveForm;
