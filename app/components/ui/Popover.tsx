'use client';

import * as React from 'react';

export interface PopoverProps {
  children: React.ReactNode;
  className?: string;
}

const Popover = ({ children, className }: PopoverProps) => {
  return (
    <div className={`relative inline-block ${className || ''}`}>
      {children}
    </div>
  );
};

export interface PopoverTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const PopoverTrigger = ({ children, onClick, className }: PopoverTriggerProps) => {
  return (
    <div className={`inline-block ${className || ''}`} onClick={onClick}>
      {children}
    </div>
  );
};

export interface PopoverContentProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
}

const PopoverContent = ({ children, className, isOpen = false }: PopoverContentProps) => {
  if (!isOpen) return null;
  
  return (
    <div className={`absolute z-10 mt-2 bg-white rounded-md shadow-lg p-4 ${className || ''}`}>
      {children}
    </div>
  );
};

export { Popover, PopoverTrigger, PopoverContent };
