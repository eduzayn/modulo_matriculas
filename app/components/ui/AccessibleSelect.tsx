'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AccessibleSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  label: string;
  id?: string;
  name?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export const AccessibleSelect: React.FC<AccessibleSelectProps> = ({
  options,
  value,
  onChange,
  label,
  id,
  name,
  placeholder = 'Selecione uma opção',
  error,
  hint,
  required = false,
  disabled = false,
  className,
  fullWidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLUListElement>(null);
  const { announceToScreenReader } = useAccessibility();
  
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
  const listboxId = `${selectId}-listbox`;
  const errorId = error ? `${selectId}-error` : undefined;
  const hintId = hint ? `${selectId}-hint` : undefined;
  
  const selectedOption = options.find(option => option.value === value);
  
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      
      if (!isOpen) {
        // Announce when opening
        announceToScreenReader('Lista de opções aberta', 'polite');
        // Focus the first option or the selected option
        const selectedIndex = options.findIndex(option => option.value === value);
        setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      } else {
        // Announce when closing
        announceToScreenReader('Lista de opções fechada', 'polite');
      }
    }
  };
  
  const handleSelect = (option: SelectOption) => {
    if (!option.disabled) {
      onChange?.(option.value);
      setIsOpen(false);
      announceToScreenReader(`Opção ${option.label} selecionada`, 'polite');
      
      // Return focus to the select button
      selectRef.current?.focus();
    }
  };
  
  // Handle keyboard navigation
  const { handleKeyDown } = useKeyboardNavigation({
    onArrowDown: (event) => {
      if (isOpen) {
        event.preventDefault();
        const nextIndex = Math.min(focusedIndex + 1, options.length - 1);
        setFocusedIndex(nextIndex);
      } else {
        handleToggle();
      }
    },
    onArrowUp: (event) => {
      if (isOpen) {
        event.preventDefault();
        const prevIndex = Math.max(focusedIndex - 1, 0);
        setFocusedIndex(prevIndex);
      } else {
        handleToggle();
      }
    },
    onEnter: (event) => {
      if (isOpen && focusedIndex >= 0) {
        event.preventDefault();
        handleSelect(options[focusedIndex]);
      } else {
        handleToggle();
      }
    },
    onEscape: (event) => {
      if (isOpen) {
        event.preventDefault();
        setIsOpen(false);
        announceToScreenReader('Lista de opções fechada', 'polite');
      }
    },
    onTab: (event) => {
      if (isOpen) {
        event.preventDefault();
        setIsOpen(false);
      }
    },
    onHome: (event) => {
      if (isOpen) {
        event.preventDefault();
        setFocusedIndex(0);
      }
    },
    onEnd: (event) => {
      if (isOpen) {
        event.preventDefault();
        setFocusedIndex(options.length - 1);
      }
    },
  });
  
  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionsRef.current) {
      const optionElements = optionsRef.current.querySelectorAll('[role="option"]');
      if (optionElements[focusedIndex]) {
        optionElements[focusedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex, isOpen]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const describedBy = [
    hintId,
    errorId
  ].filter(Boolean).join(' ') || undefined;
  
  return (
    <div className={cn('relative', fullWidth && 'w-full', className)}>
      <div className="flex justify-between">
        <label
          htmlFor={selectId}
          className={cn(
            'text-sm font-medium mb-1',
            error ? 'text-red-500' : 'text-gray-700'
          )}
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
          {required && (
            <span className="sr-only"> (obrigatório)</span>
          )}
        </label>
      </div>
      
      {hint && (
        <p
          id={hintId}
          className="text-sm text-gray-500 mb-1"
        >
          {hint}
        </p>
      )}
      
      <div
        ref={selectRef}
        className={cn(
          'relative w-full',
          fullWidth && 'w-full'
        )}
      >
        <button
          type="button"
          id={selectId}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500',
            fullWidth && 'w-full'
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={selectId}
          aria-describedby={describedBy}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required ? 'true' : 'false'}
          aria-disabled={disabled ? 'true' : 'false'}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          name={name}
        >
          <span className={cn(!selectedOption && 'text-gray-500')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
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
            className={cn(
              'h-4 w-4 transition-transform',
              isOpen && 'rotate-180'
            )}
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        
        {isOpen && (
          <ul
            ref={optionsRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={selectId}
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white py-1 shadow-lg"
            tabIndex={-1}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                id={`${selectId}-option-${option.value}`}
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled}
                className={cn(
                  'px-3 py-2 cursor-pointer',
                  option.value === value && 'bg-primary-100 text-primary-900',
                  focusedIndex === index && 'bg-primary-50',
                  option.disabled && 'opacity-50 cursor-not-allowed',
                  !option.disabled && 'hover:bg-primary-50'
                )}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {error && (
        <p
          id={errorId}
          className="text-sm font-medium text-red-500 mt-1"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

AccessibleSelect.displayName = 'AccessibleSelect';

export default AccessibleSelect;
