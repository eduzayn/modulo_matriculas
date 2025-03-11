'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { colors } from '../../styles/colors';

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-neutral-100 text-neutral-800",
        primary: "",
        success: "",
        warning: "",
        error: "",
        outline: "bg-transparent border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

function Badge({ 
  className, 
  variant, 
  module = 'enrollment',
  ...props 
}: BadgeProps) {
  const moduleColor = colors.primary[module];
  const style: React.CSSProperties = {};
  
  if (variant === 'primary') {
    style.backgroundColor = `${moduleColor.light}20`; // 20% opacity
    style.color = moduleColor.main;
  } else if (variant === 'success') {
    style.backgroundColor = `${colors.semantic.success}20`; // 20% opacity
    style.color = colors.semantic.success;
  } else if (variant === 'warning') {
    style.backgroundColor = `${colors.semantic.warning}20`; // 20% opacity
    style.color = colors.semantic.warning;
  } else if (variant === 'error') {
    style.backgroundColor = `${colors.semantic.error}20`; // 20% opacity
    style.color = colors.semantic.error;
  } else if (variant === 'outline') {
    style.borderColor = moduleColor.main;
    style.color = moduleColor.main;
  }
  
  return (
    <div className={badgeVariants({ variant, className })} style={style} {...props} />
  );
}

export { Badge, badgeVariants };
