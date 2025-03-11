'use client';

import React, { ReactNode } from 'react';

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * A responsive layout component that provides consistent spacing
 * and structure across different screen sizes.
 */
export const ResponsiveLayout = ({
  children,
  className = '',
}: ResponsiveLayoutProps) => {
  return (
    <div className={`space-y-4 md:space-y-6 lg:space-y-8 ${className}`}>
      {children}
    </div>
  );
};

interface ResponsiveHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

/**
 * A responsive header component for page titles and actions.
 */
export const ResponsiveHeader = ({
  title,
  description,
  actions,
  className = '',
}: ResponsiveHeaderProps) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${className}`}>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
          {title}
        </h1>
        {description && (
          <p className="text-neutral-500 mt-1">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

interface ResponsiveSectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * A responsive section component for grouping related content.
 */
export const ResponsiveSection = ({
  children,
  title,
  description,
  className = '',
}: ResponsiveSectionProps) => {
  return (
    <section className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>}
          {description && <p className="text-neutral-500 mt-1">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
};

export default ResponsiveLayout;
