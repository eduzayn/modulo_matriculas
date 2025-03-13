'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { useAccessibility } from '../providers/AccessibilityProvider';

export interface AccessibleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
  interactive?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

export const AccessibleCard: React.FC<AccessibleCardProps> = ({
  title,
  description,
  children,
  interactive = false,
  onClick,
  variant = 'default',
  size = 'default',
  module = 'enrollment',
  className,
  ...props
}) => {
  const { highContrastMode } = useAccessibility();
  const cardId = `card-${Math.random().toString(36).substring(2, 9)}`;
  const titleId = title ? `${cardId}-title` : undefined;
  const descriptionId = description ? `${cardId}-description` : undefined;
  
  // Determine card styles based on variant and size
  const cardStyles = cn(
    'rounded-lg overflow-hidden',
    {
      'border border-gray-200 bg-white shadow-sm': variant === 'default',
      'border border-gray-300 bg-transparent': variant === 'outline',
      'bg-gray-50': variant === 'ghost',
      'p-4': size === 'default',
      'p-2': size === 'sm',
      'p-6': size === 'lg',
      'cursor-pointer hover:shadow-md transition-shadow': interactive,
      'border-2 border-black': highContrastMode,
    },
    className
  );
  
  // Handle keyboard interaction for interactive cards
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (interactive && onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };
  
  return (
    <div
      id={cardId}
      className={cardStyles}
      onClick={interactive ? onClick : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      {...props}
    >
      {title && (
        <h3
          id={titleId}
          className={cn(
            'font-medium',
            {
              'text-lg mb-2': size === 'default' || size === 'lg',
              'text-base mb-1': size === 'sm',
            }
          )}
        >
          {title}
        </h3>
      )}
      
      {description && (
        <p
          id={descriptionId}
          className={cn(
            'text-gray-500',
            {
              'text-sm mb-4': size === 'default' || size === 'lg',
              'text-xs mb-2': size === 'sm',
            }
          )}
        >
          {description}
        </p>
      )}
      
      {children}
    </div>
  );
};

AccessibleCard.displayName = 'AccessibleCard';

export default AccessibleCard;
