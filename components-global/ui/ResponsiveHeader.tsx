'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface ResponsiveHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  className?: string;
}

export function ResponsiveHeader({
  title,
  subtitle,
  className,
  ...props
}: ResponsiveHeaderProps) {
  return (
    <div className={cn('mb-8', className)} {...props}>
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default ResponsiveHeader;
