'use client';

import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import { colors } from '../../styles/colors';

interface ResponsiveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg';
  module?: 'communication' | 'student' | 'content' | 'enrollment';
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  className?: string;
}

/**
 * A responsive button component that adapts to different screen sizes
 * and supports module-specific styling.
 */
export const ResponsiveButton = ({
  children,
  variant = 'primary',
  size = 'md',
  module = 'enrollment',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  ...props
}: ResponsiveButtonProps) => {
  const moduleColor = colors.primary[module];
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'text-white';
      case 'secondary':
        return 'bg-neutral-900 text-white hover:bg-neutral-800';
      case 'outline':
        return 'border border-neutral-300 bg-white hover:bg-neutral-50';
      case 'ghost':
        return 'bg-transparent hover:bg-neutral-100';
      case 'link':
        return 'bg-transparent underline-offset-4 hover:underline';
      case 'destructive':
        return 'bg-red-500 text-white hover:bg-red-600';
      case 'success':
        return 'bg-green-500 text-white hover:bg-green-600';
      default:
        return 'text-white';
    }
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1 md:px-3 md:py-1.5';
      case 'md':
        return 'text-sm px-3 py-2 md:px-4 md:py-2';
      case 'lg':
        return 'text-base px-4 py-2.5 md:px-6 md:py-3';
      default:
        return 'text-sm px-3 py-2 md:px-4 md:py-2';
    }
  };
  
  // Apply module-specific colors
  const style: React.CSSProperties = {};
  
  if (variant === 'primary' && moduleColor?.gradient) {
    style.background = moduleColor.gradient;
  } else if (variant === 'outline' && moduleColor?.main) {
    style.borderColor = moduleColor.main;
    style.color = moduleColor.main;
  } else if ((variant === 'ghost' || variant === 'link') && moduleColor?.main) {
    style.color = moduleColor.main;
  }
  
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-md font-medium transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={style}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {icon && iconPosition === 'left' && !isLoading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default ResponsiveButton;
