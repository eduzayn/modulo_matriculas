'use client';

import React from 'react';

interface ResponsiveHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function ResponsiveHeader({ title, subtitle, actions }: ResponsiveHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-neutral-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="mt-4 md:mt-0">{actions}</div>}
    </div>
  );
}

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveContainer({ children, className }: ResponsiveContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${className || ''}`}>
      {children}
    </div>
  );
}

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveLayout({ children, className }: ResponsiveLayoutProps) {
  return (
    <div className={`min-h-screen bg-neutral-50 ${className || ''}`}>
      {children}
    </div>
  );
}

interface ResponsiveFormProps {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

export function ResponsiveForm({ children, className, onSubmit }: ResponsiveFormProps) {
  return (
    <form 
      onSubmit={onSubmit} 
      className={`space-y-6 ${className || ''}`}
    >
      {children}
    </form>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: number;
  className?: string;
}

export function ResponsiveGrid({ children, columns = 3, className }: ResponsiveGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-6 ${gridCols[columns as keyof typeof gridCols]} ${className || ''}`}>
      {children}
    </div>
  );
}
