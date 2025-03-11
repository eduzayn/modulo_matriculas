'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { useAccessibility } from '../providers/AccessibilityProvider';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white hover:bg-primary-600',
        secondary: 'bg-neutral-900 text-white hover:bg-neutral-800',
        outline: 'border border-neutral-300 bg-white hover:bg-neutral-50',
        ghost: 'bg-transparent hover:bg-neutral-100',
        link: 'bg-transparent underline-offset-4 hover:underline',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        success: 'bg-green-500 text-white hover:bg-green-600',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 py-1 text-xs',
        lg: 'h-12 px-6 py-3 text-base',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
);

export interface AccessibleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  ariaLabel?: string;
}

export const AccessibleButton = React.forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth, 
    asChild = false,
    loading = false,
    loadingText,
    iconLeft,
    iconRight,
    children,
    disabled,
    ariaLabel,
    ...props 
  }, ref) => {
    const { highContrastMode } = useAccessibility();
    const isDisabled = disabled || loading;
    const buttonText = loading && loadingText ? loadingText : children;
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled ? 'true' : 'false'}
        aria-busy={loading ? 'true' : 'false'}
        aria-label={ariaLabel}
        {...props}
      >
        {loading && (
          <span className="animate-spin mr-2" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </span>
        )}
        {!loading && iconLeft && (
          <span aria-hidden="true">{iconLeft}</span>
        )}
        {buttonText}
        {!loading && iconRight && (
          <span aria-hidden="true">{iconRight}</span>
        )}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export { buttonVariants };
