'use client';

import React from 'react';
import { colors } from '../../styles/colors';

interface TableProps {
  children: React.ReactNode;
  className?: string;
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

export const Table = ({ 
  children, 
  className = '', 
  module = 'enrollment' 
}: TableProps) => {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full border-collapse ${className}`}>
        {children}
      </table>
    </div>
  );
};

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

export const TableHeader = ({ 
  children, 
  className = '', 
  module = 'enrollment' 
}: TableHeaderProps) => {
  const moduleColor = colors.primary[module];
  
  return (
    <thead className={`bg-neutral-50 ${className}`} style={{ borderBottom: `2px solid ${moduleColor.light}` }}>
      {children}
    </thead>
  );
};

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const TableBody = ({ children, className = '' }: TableBodyProps) => {
  return (
    <tbody className={`divide-y divide-neutral-200 ${className}`}>
      {children}
    </tbody>
  );
};

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  isEven?: boolean;
}

export const TableRow = ({ children, className = '', isEven = false }: TableRowProps) => {
  return (
    <tr className={`${isEven ? 'bg-neutral-50' : 'bg-white'} ${className}`}>
      {children}
    </tr>
  );
};

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

export const TableHead = ({ 
  children, 
  className = '', 
  module = 'enrollment' 
}: TableHeadProps) => {
  const moduleColor = colors.primary[module];
  
  return (
    <th 
      className={`px-4 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider ${className}`}
      style={{ color: moduleColor.dark }}
    >
      {children}
    </th>
  );
};

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export const TableCell = ({ children, className = '' }: TableCellProps) => {
  return (
    <td className={`px-4 py-4 text-sm text-neutral-800 ${className}`}>
      {children}
    </td>
  );
};

interface TableFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const TableFooter = ({ children, className = '' }: TableFooterProps) => {
  return (
    <tfoot className={`bg-neutral-50 border-t border-neutral-200 ${className}`}>
      {children}
    </tfoot>
  );
};

export default Table;
