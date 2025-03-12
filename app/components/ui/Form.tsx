'use client';

import * as React from 'react';
import { useFormState } from 'react-dom';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </form>
    );
  }
);
Form.displayName = 'Form';

const FormField = ({ children, ...props }: { children: React.ReactNode }) => {
  return <div className="space-y-2" {...props}>{children}</div>;
};

const FormItem = ({ children, ...props }: { children: React.ReactNode }) => {
  return <div className="space-y-1" {...props}>{children}</div>;
};

const FormLabel = ({ children, ...props }: { children: React.ReactNode }) => {
  return <label className="text-sm font-medium" {...props}>{children}</label>;
};

const FormControl = ({ children, ...props }: { children: React.ReactNode }) => {
  return <div className="mt-1" {...props}>{children}</div>;
};

const FormDescription = ({ children, ...props }: { children: React.ReactNode }) => {
  return <p className="text-sm text-neutral-500" {...props}>{children}</p>;
};

const FormMessage = ({ children, ...props }: { children: React.ReactNode }) => {
  return <p className="text-sm text-red-500" {...props}>{children}</p>;
};

export { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage };
