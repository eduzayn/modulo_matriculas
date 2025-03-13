'use client';

import React, { ReactNode } from 'react';
import { colors } from '../../styles/colors';

interface ResponsiveCardProps {
  children: ReactNode;
  title?: string;
  module?: 'communication' | 'student' | 'content' | 'enrollment';
  variant?: 'default' | 'bordered' | 'gradient';
  className?: string;
  headerAction?: ReactNode;
}

/**
 * A responsive card component that adapts to different screen sizes
 * and supports module-specific styling.
 */
export const ResponsiveCard = ({
  children,
  title,
  module = 'enrollment',
  variant = 'default',
  className = '',
  headerAction,
}: ResponsiveCardProps) => {
  const moduleColor = colors.primary[module];
  
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden
        ${variant === 'bordered' ? 'border-t-4' : ''}
        ${className}
      `}
      style={variant === 'bordered' ? { borderTopColor: moduleColor.main } : {}}
    >
      {variant === 'gradient' && (
        <div className="p-1" style={{ background: moduleColor.gradient }}></div>
      )}
      
      {title && (
        <div className="p-4 md:p-6 border-b border-neutral-100 flex flex-col md:flex-row md:items-center md:justify-between">
          <h3 className="text-base md:text-lg font-medium text-neutral-800 mb-2 md:mb-0">{title}</h3>
          {headerAction && (
            <div className="mt-2 md:mt-0">
              {headerAction}
            </div>
          )}
        </div>
      )}
      
      <div className="p-4 md:p-6">
        {children}
      </div>
    </div>
  );
};

interface ResponsiveCardGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * A responsive grid layout for cards that adjusts columns based on screen size.
 */
export const ResponsiveCardGrid = ({
  children,
  columns = 2,
  gap = 'md',
  className = '',
}: ResponsiveCardGridProps) => {
  const getColumnsClass = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2';
    }
  };

  const getGapClass = () => {
    switch (gap) {
      case 'sm':
        return 'gap-2 md:gap-3';
      case 'md':
        return 'gap-4 md:gap-6';
      case 'lg':
        return 'gap-6 md:gap-8';
      default:
        return 'gap-4 md:gap-6';
    }
  };

  return (
    <div className={`grid ${getColumnsClass()} ${getGapClass()} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveCard;
