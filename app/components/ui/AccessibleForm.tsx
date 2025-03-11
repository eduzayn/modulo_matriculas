'use client';

import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { useTranslations } from 'next-intl';

interface FormValidationState {
  isValid: boolean;
  errors: Record<string, string>;
}

interface AccessibleFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onValidSubmit?: (data: FormData) => void;
  validate?: (formData: FormData) => Record<string, string>;
  children: React.ReactNode;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const AccessibleForm: React.FC<AccessibleFormProps> = ({
  onValidSubmit,
  validate,
  children,
  ariaLabel,
  ariaDescribedBy,
  ...props
}) => {
  const [validationState, setValidationState] = useState<FormValidationState>({
    isValid: true,
    errors: {},
  });
  const { announceToScreenReader } = useAccessibility();
  const t = useTranslations('accessibility');

  // Announce validation errors to screen readers
  useEffect(() => {
    if (!validationState.isValid && Object.keys(validationState.errors).length > 0) {
      const errorCount = Object.keys(validationState.errors).length;
      const errorMessage = t('screenReader.formError');
      announceToScreenReader(errorMessage, 'assertive');
    }
  }, [validationState, announceToScreenReader, t]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    if (validate) {
      const errors = validate(formData);
      const hasErrors = Object.keys(errors).length > 0;
      
      setValidationState({
        isValid: !hasErrors,
        errors,
      });
      
      if (hasErrors) {
        // Focus the first invalid field
        const firstErrorField = form.querySelector(
          `[name="${Object.keys(errors)[0]}"]`
        ) as HTMLElement;
        
        if (firstErrorField) {
          firstErrorField.focus();
        }
        
        return;
      }
    }
    
    if (onValidSubmit) {
      onValidSubmit(formData);
      announceToScreenReader(t('screenReader.formSuccess'), 'polite');
    }
  };

  // Clone children and inject error messages
  const childrenWithValidation = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && 'name' in child.props) {
      const name = child.props.name as string;
      const error = validationState.errors[name];
      
      if (error) {
        // Verificar se o componente aceita a prop 'error'
        if ('error' in child.props) {
          // Usar tipagem correta para o cloneElement
          return React.cloneElement(child as React.ReactElement<any>, { error });
        }
      }
    }
    
    return child;
  });

  return (
    <form
      {...props}
      onSubmit={handleSubmit}
      noValidate
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {childrenWithValidation}
      
      {!validationState.isValid && (
        <div
          className="sr-only"
          aria-live="assertive"
          role="alert"
        >
          {Object.values(validationState.errors).map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </form>
  );
};

export default AccessibleForm;
