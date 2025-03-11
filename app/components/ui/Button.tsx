import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { colors } from '../../styles/colors';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'text-white',
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, module = 'enrollment', asChild = false, ...props }, ref) => {
    // Apply module-specific colors
    const moduleColor = colors.primary[module];
    const style: React.CSSProperties = {};
    
    if (variant === 'default') {
      style.background = moduleColor.gradient;
    } else if (variant === 'outline') {
      style.borderColor = moduleColor.main;
      style.color = moduleColor.main;
    } else if (variant === 'ghost' || variant === 'link') {
      style.color = moduleColor.main;
    }
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        style={style}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
