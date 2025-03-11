import React from 'react';
import { cn } from '../../lib/utils';
import { colors } from '../../styles/colors';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
  module?: 'communication' | 'student' | 'content' | 'enrollment';
  variant?: 'default' | 'bordered' | 'gradient';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, gradient = false, module = 'enrollment', variant = 'default', ...props }, ref) => {
    const moduleColor = colors.primary[module];
    const style: React.CSSProperties = {};
    
    if (gradient || variant === 'gradient') {
      style.borderTop = `4px solid ${moduleColor.main}`;
    } else if (variant === 'bordered') {
      style.border = `1px solid ${moduleColor.light}`;
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg shadow-md overflow-hidden bg-white',
          variant === 'default' && 'border border-neutral-200',
          className
        )}
        style={style}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, module = 'enrollment', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4 border-b border-neutral-200', className)}
        {...props}
      />
    );
  }
);
CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, module = 'enrollment', ...props }, ref) => {
    const moduleColor = colors.primary[module];
    
    return (
      <h3
        ref={ref}
        className={cn('text-xl font-semibold text-neutral-900', className)}
        {...props}
      />
    );
  }
);
CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-neutral-500', className)}
        {...props}
      />
    );
  }
);
CardDescription.displayName = 'CardDescription';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6', className)}
        {...props}
      />
    );
  }
);
CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, module = 'enrollment', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4 bg-neutral-50 border-t border-neutral-200', className)}
        {...props}
      />
    );
  }
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
