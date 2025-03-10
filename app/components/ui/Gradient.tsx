import React from 'react';
import { cn } from '@/lib/utils';

interface GradientProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'blue' | 'dark' | 'accent';
  children: React.ReactNode;
}

const gradientVariants: Record<string, string> = {
  blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
  dark: 'bg-gradient-to-r from-gray-800 to-gray-900',
  accent: 'bg-gradient-to-r from-blue-500 to-violet-500',
};

export function Gradient({ 
  variant = 'blue', 
  className, 
  children, 
  ...props 
}: GradientProps) {
  return (
    <div
      className={cn(
        gradientVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
