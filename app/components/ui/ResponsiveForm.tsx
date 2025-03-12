'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/Select';

interface ResponsiveFormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  htmlFor: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function ResponsiveFormGroup({
  label,
  htmlFor,
  description,
  error,
  required = false,
  children,
  className,
  ...props
}: ResponsiveFormGroupProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-sm text-neutral-500">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

interface ResponsiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function ResponsiveInput({
  error,
  className,
  ...props
}: ResponsiveInputProps) {
  return (
    <Input
      className={cn(
        error && "border-red-500 focus:ring-red-500",
        className
      )}
      {...props}
    />
  );
}

interface ResponsiveTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export function ResponsiveTextarea({
  error,
  className,
  ...props
}: ResponsiveTextareaProps) {
  return (
    <Textarea
      className={cn(
        error && "border-red-500 focus:ring-red-500",
        className
      )}
      {...props}
    />
  );
}

interface ResponsiveSelectProps {
  options: { value: string; label: string }[];
  error?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ResponsiveSelect({
  options,
  error,
  placeholder = "Selecione uma opção",
  value,
  onChange,
  disabled,
  className,
}: ResponsiveSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className={cn(
        error && "border-red-500 focus:ring-red-500",
        className
      )}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface ResponsiveFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export function ResponsiveForm({
  children,
  className,
  ...props
}: ResponsiveFormProps) {
  return (
    <form
      className={cn("space-y-6", className)}
      {...props}
    >
      {children}
    </form>
  );
}

interface ResponsiveFormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function ResponsiveFormSection({
  title,
  description,
  children,
  className,
  ...props
}: ResponsiveFormSectionProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {(title || description) && (
        <div>
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && <p className="text-sm text-neutral-500 mt-1">{description}</p>}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

interface ResponsiveFormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ResponsiveFormActions({
  children,
  className,
  ...props
}: ResponsiveFormActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
