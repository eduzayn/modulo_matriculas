import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: string;
}

const statusVariants: Record<string, string> = {
  pendente: 'bg-yellow-100 text-yellow-800',
  aprovado: 'bg-green-100 text-green-800',
  rejeitado: 'bg-red-100 text-red-800',
  ativo: 'bg-blue-100 text-blue-800',
  trancado: 'bg-gray-100 text-gray-800',
  cancelado: 'bg-red-100 text-red-800',
  concluido: 'bg-green-100 text-green-800',
  default: 'bg-gray-100 text-gray-800',
};

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const statusKey = status.toLowerCase();
  const badgeClass = statusVariants[statusKey] || statusVariants.default;
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        badgeClass,
        className
      )}
      {...props}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
}
