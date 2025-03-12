'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { colors } from '../../app/styles/colors';

interface ResponsiveFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  spacing?: 'tight' | 'normal' | 'relaxed';
  bordered?: boolean;
  shadowed?: boolean;
  rounded?: boolean;
}

const spacingClasses = {
  tight: 'space-y-2',
  normal: 'space-y-4',
  relaxed: 'space-y-6',
};

export function ResponsiveForm({
  children,
  spacing = 'normal',
  bordered = true,
  shadowed = true,
  rounded = true,
  className,
  ...props
}: ResponsiveFormProps) {
  return (
    <form
      className={cn(
        spacingClasses[spacing],
        bordered && 'border border-neutral-200 dark:border-neutral-800',
        shadowed && 'shadow-sm',
        rounded && 'rounded-lg',
        'p-6 bg-white dark:bg-neutral-950',
        className
      )}
      {...props}
    >
      {children}
    </form>
  );
}

export default ResponsiveForm;
