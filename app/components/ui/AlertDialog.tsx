'use client';

import * as React from 'react';
import { Button } from './Button';

export interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const AlertDialog = ({ open, onOpenChange, children }: AlertDialogProps) => {
  const [isOpen, setIsOpen] = React.useState(open || false);
  
  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);
  
  const handleOpenChange = (value: boolean) => {
    setIsOpen(value);
    onOpenChange?.(value);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => handleOpenChange(false)} />
      <div className="z-50 bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        {children}
      </div>
    </div>
  );
};

const AlertDialogTrigger = ({ children, ...props }: { children: React.ReactNode }) => {
  return <div {...props}>{children}</div>;
};

const AlertDialogContent = ({ children, ...props }: { children: React.ReactNode }) => {
  return <div className="space-y-4" {...props}>{children}</div>;
};

const AlertDialogHeader = ({ children, ...props }: { children: React.ReactNode }) => {
  return <div className="space-y-2" {...props}>{children}</div>;
};

const AlertDialogTitle = ({ children, ...props }: { children: React.ReactNode }) => {
  return <h2 className="text-lg font-semibold" {...props}>{children}</h2>;
};

const AlertDialogDescription = ({ children, ...props }: { children: React.ReactNode }) => {
  return <p className="text-sm text-neutral-500" {...props}>{children}</p>;
};

const AlertDialogFooter = ({ children, ...props }: { children: React.ReactNode }) => {
  return <div className="flex justify-end space-x-2 mt-4" {...props}>{children}</div>;
};

const AlertDialogAction = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <Button {...props}>{children}</Button>;
};

const AlertDialogCancel = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <Button variant="outline" {...props}>{children}</Button>;
};

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
};
