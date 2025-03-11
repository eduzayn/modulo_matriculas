'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface AccessibleSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
  as?: 'section' | 'article' | 'div';
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

export const AccessibleSection: React.FC<AccessibleSectionProps> = ({
  title,
  description,
  children,
  as: Component = 'section',
  titleAs: TitleComponent = 'h2',
  className,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  id,
  ...props
}) => {
  const sectionId = id || `section-${Math.random().toString(36).substring(2, 9)}`;
  const titleId = title ? `${sectionId}-title` : undefined;
  const descriptionId = description ? `${sectionId}-description` : undefined;
  
  // Determine which aria attributes to use
  const ariaAttributes: Record<string, string | undefined> = {};
  
  if (ariaLabel) {
    ariaAttributes['aria-label'] = ariaLabel;
  } else if (title && !ariaLabelledBy) {
    ariaAttributes['aria-labelledby'] = titleId;
  } else if (ariaLabelledBy) {
    ariaAttributes['aria-labelledby'] = ariaLabelledBy;
  }
  
  if (description && !ariaDescribedBy) {
    ariaAttributes['aria-describedby'] = descriptionId;
  } else if (ariaDescribedBy) {
    ariaAttributes['aria-describedby'] = ariaDescribedBy;
  }
  
  // Filtrar atributos undefined antes de passar para o componente
  const filteredAriaAttributes = Object.entries(ariaAttributes)
    .filter(([_, value]) => value !== undefined)
    .reduce((acc, [key, value]) => {
      acc[key] = value as string;
      return acc;
    }, {} as Record<string, string>);
  
  return (
    <Component
      id={sectionId}
      className={cn('my-4', className)}
      {...filteredAriaAttributes}
      {...props}
    >
      {title && (
        <TitleComponent
          id={titleId}
          className="text-lg font-medium mb-2"
        >
          {title}
        </TitleComponent>
      )}
      
      {description && (
        <p
          id={descriptionId}
          className="text-sm text-gray-500 mb-4"
        >
          {description}
        </p>
      )}
      
      {children}
    </Component>
  );
};

AccessibleSection.displayName = 'AccessibleSection';

export default AccessibleSection;
