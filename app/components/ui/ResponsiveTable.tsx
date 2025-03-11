'use client';

import React, { ReactNode } from 'react';
import { colors } from '@/app/styles/colors';

interface ResponsiveTableProps {
  children: ReactNode;
  module?: 'communication' | 'student' | 'content' | 'enrollment';
  className?: string;
}

/**
 * A responsive table component that adapts to different screen sizes
 * and supports module-specific styling.
 */
export const ResponsiveTable = ({
  children,
  module = 'enrollment',
  className = '',
}: ResponsiveTableProps) => {
  return (
    <div className={`overflow-x-auto -mx-4 md:mx-0 ${className}`}>
      <table className="min-w-full divide-y divide-neutral-200">
        {children}
      </table>
    </div>
  );
};

interface ResponsiveTableHeaderProps {
  children: ReactNode;
  module?: 'communication' | 'student' | 'content' | 'enrollment';
  className?: string;
}

export const ResponsiveTableHeader = ({
  children,
  module = 'enrollment',
  className = '',
}: ResponsiveTableHeaderProps) => {
  const moduleColor = colors.primary[module];
  
  return (
    <thead className={`bg-neutral-50 ${className}`}>
      {children}
    </thead>
  );
};

interface ResponsiveTableBodyProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveTableBody = ({
  children,
  className = '',
}: ResponsiveTableBodyProps) => {
  return (
    <tbody className={`bg-white divide-y divide-neutral-200 ${className}`}>
      {children}
    </tbody>
  );
};

interface ResponsiveTableRowProps {
  children: ReactNode;
  isEven?: boolean;
  isHighlighted?: boolean;
  module?: 'communication' | 'student' | 'content' | 'enrollment';
  className?: string;
}

export const ResponsiveTableRow = ({
  children,
  isEven = false,
  isHighlighted = false,
  module = 'enrollment',
  className = '',
}: ResponsiveTableRowProps) => {
  const moduleColor = colors.primary[module];
  
  return (
    <tr 
      className={`
        ${isEven ? 'bg-neutral-50' : ''}
        ${isHighlighted ? 'bg-neutral-100' : ''}
        hover:bg-neutral-100 transition-colors
        ${className}
      `}
      style={isHighlighted ? { backgroundColor: `${moduleColor.light}20` } : {}}
    >
      {children}
    </tr>
  );
};

interface ResponsiveTableCellProps {
  children: ReactNode;
  isHeader?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const ResponsiveTableCell = ({
  children,
  isHeader = false,
  align = 'left',
  className = '',
}: ResponsiveTableCellProps) => {
  const getAlignClass = () => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };
  
  const Tag = isHeader ? 'th' : 'td';
  
  return (
    <Tag 
      className={`
        px-4 py-3 text-sm whitespace-nowrap
        ${isHeader ? 'font-medium text-neutral-700' : 'font-normal text-neutral-800'}
        ${getAlignClass()}
        ${className}
      `}
    >
      {children}
    </Tag>
  );
};

export default ResponsiveTable;
