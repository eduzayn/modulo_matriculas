'use client';

import React from 'react';
import { cn } from '../../../lib/utils';

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
    <div className={cn("flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4", className)} {...props}>
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-neutral-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 w-full md:w-auto">{actions}</div>}
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
          {description && <p className="text-neutral-500 mt-1">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
}

export function ResponsiveGrid({
  children,
  columns = 2,
  className,
  ...props
}: ResponsiveGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn(`grid ${gridCols[columns]} gap-4`, className)} {...props}>
      {children}
    </div>
  );
}

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function ResponsiveContainer({
  children,
  maxWidth = 'xl',
  className,
  ...props
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    'full': 'max-w-full',
  };

  return (
    <div className={cn(`w-full ${maxWidthClasses[maxWidth]} mx-auto px-4`, className)} {...props}>
      {children}
    </div>
  );
}

export function ResponsiveLayout({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("min-h-screen bg-neutral-50", className)} {...props}>
      {children}
    </div>
  );
}
