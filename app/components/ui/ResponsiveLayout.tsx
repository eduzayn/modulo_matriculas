'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface ResponsiveHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function ResponsiveHeader({ 
  title, 
  subtitle, 
  actions, 
  className, 
  ...props 
}: ResponsiveHeaderProps) {
  return (
    <div 
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4",
        className
      )} 
      {...props}
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

interface ResponsiveSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function ResponsiveSection({
  title,
  description,
  children,
  className,
  ...props
}: ResponsiveSectionProps) {
  return (
    <section className={cn("mb-8", className)} {...props}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg';
}

export function ResponsiveGrid({
  children,
  columns = { sm: 1, md: 2, lg: 3 },
  gap = 'md',
  className,
  ...props
}: ResponsiveGridProps) {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const getColumnsClass = () => {
    const sm = columns.sm || 1;
    const md = columns.md || 2;
    const lg = columns.lg || 3;

    return `grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg}`;
  };

  return (
    <div
      className={cn(
        "grid",
        gapClasses[gap],
        getColumnsClass(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function ResponsiveContainer({
  children,
  size = 'lg',
  className,
  ...props
}: ResponsiveContainerProps) {
  const sizeClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        "mx-auto px-4 w-full",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
