'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveContainer({
  children,
  className,
  ...props
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default ResponsiveContainer;
