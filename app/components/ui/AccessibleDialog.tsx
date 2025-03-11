'use client';

import React, { useEffect, useRef } from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { cn } from '../../lib/utils';

export interface AccessibleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
}

export const AccessibleDialog: React.FC<AccessibleDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  contentClassName,
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOutsideClick = true,
}) => {
  const { announceToScreenReader } = useAccessibility();
  const dialogRef = useFocusTrap(isOpen);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Announce dialog open/close to screen readers
  useEffect(() => {
    if (isOpen) {
      announceToScreenReader(`Diálogo aberto: ${title}`, 'assertive');
    }
  }, [isOpen, title, announceToScreenReader]);
  
  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEscape]);
  
  // Handle outside click
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && event.target === overlayRef.current) {
      onClose();
    }
  };
  
  // Prevent scrolling of background content when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) {
    return null;
  }
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="presentation"
    >
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50"
        aria-hidden="true"
        onClick={handleOverlayClick}
      />
      
      <div
        ref={dialogRef as React.RefObject<HTMLDivElement>}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={description ? 'dialog-description' : undefined}
        className={cn(
          'relative z-50 max-h-[85vh] w-full max-w-md overflow-auto rounded-lg bg-white p-6 shadow-lg',
          className
        )}
        tabIndex={-1}
      >
        <div className={cn('space-y-4', contentClassName)}>
          <div className="flex items-start justify-between">
            <div>
              <h2
                id="dialog-title"
                className="text-lg font-medium"
              >
                {title}
              </h2>
              
              {description && (
                <p
                  id="dialog-description"
                  className="text-sm text-gray-500 mt-1"
                >
                  {description}
                </p>
              )}
            </div>
            
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Fechar diálogo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

AccessibleDialog.displayName = 'AccessibleDialog';

export default AccessibleDialog;
