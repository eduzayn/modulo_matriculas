'use client';

import React from 'react';
import { cn } from '../../../lib/utils';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Label } from '../../../components/ui/label';

interface ResponsiveFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export function ResponsiveForm({
  children,
  className,
  ...props
}: ResponsiveFormProps) {
  return (
    <form className={cn("space-y-6", className)} {...props}>
      {children}
    </form>
  );
}

interface ResponsiveFormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ResponsiveFormGroup({
  children,
  className,
  ...props
}: ResponsiveFormGroupProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {children}
    </div>
  );
}

interface ResponsiveFormRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ResponsiveFormRow({
  children,
  className,
  ...props
}: ResponsiveFormRowProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)} {...props}>
      {children}
    </div>
  );
}

interface ResponsiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
}

export function ResponsiveInput({
  label,
  description,
  error,
  className,
  id,
  ...props
}: ResponsiveInputProps) {
  return (
    <ResponsiveFormGroup>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input id={id} className={cn(error && "border-red-500", className)} {...props} />
      {description && <p className="text-sm text-neutral-500">{description}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </ResponsiveFormGroup>
  );
}

interface ResponsiveTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
}

export function ResponsiveTextarea({
  label,
  description,
  error,
  className,
  id,
  ...props
}: ResponsiveTextareaProps) {
  return (
    <ResponsiveFormGroup>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Textarea id={id} className={cn(error && "border-red-500", className)} {...props} />
      {description && <p className="text-sm text-neutral-500">{description}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </ResponsiveFormGroup>
  );
}

interface ResponsiveSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  description?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function ResponsiveSelect({
  label,
  description,
  error,
  options,
  className,
  id,
  ...props
}: ResponsiveSelectProps) {
  return (
    <ResponsiveFormGroup>
      {label && <Label htmlFor={id}>{label}</Label>}
      <select
        id={id}
        className={cn(
          "flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-50 dark:focus:ring-neutral-400 dark:focus:ring-offset-neutral-900",
          error && "border-red-500",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description && <p className="text-sm text-neutral-500">{description}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </ResponsiveFormGroup>
  );
}
