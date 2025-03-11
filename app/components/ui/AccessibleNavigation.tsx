'use client';

import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { cn } from '../../lib/utils';

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: NavigationItem[];
  disabled?: boolean;
}

export interface AccessibleNavigationProps {
  items: NavigationItem[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'sidebar' | 'tabs' | 'pills';
  className?: string;
  itemClassName?: string;
  activeItemId?: string;
  onItemClick?: (item: NavigationItem) => void;
  ariaLabel?: string;
}

export const AccessibleNavigation: React.FC<AccessibleNavigationProps> = ({
  items,
  orientation = 'horizontal',
  variant = 'default',
  className,
  itemClassName,
  activeItemId,
  onItemClick,
  ariaLabel = 'Navegação principal',
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const { announceToScreenReader } = useAccessibility();
  const navRef = React.useRef<HTMLElement>(null);
  
  // Handle keyboard navigation
  const { handleKeyDown } = useKeyboardNavigation({
    onArrowDown: (event) => {
      if (orientation === 'vertical' || expandedItemId) {
        event.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, items.length - 1));
      }
    },
    onArrowUp: (event) => {
      if (orientation === 'vertical' || expandedItemId) {
        event.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      }
    },
    onArrowRight: (event) => {
      if (orientation === 'horizontal' && !expandedItemId) {
        event.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, items.length - 1));
      }
    },
    onArrowLeft: (event) => {
      if (orientation === 'horizontal' && !expandedItemId) {
        event.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      }
    },
    onEnter: (event) => {
      if (focusedIndex >= 0 && focusedIndex < items.length) {
        event.preventDefault();
        const item = items[focusedIndex];
        
        if (item.children && item.children.length > 0) {
          setExpandedItemId(expandedItemId === item.id ? null : item.id);
        } else if (item.onClick && !item.disabled) {
          item.onClick();
          if (onItemClick) onItemClick(item);
        }
      }
    },
    onEscape: (event) => {
      if (expandedItemId) {
        event.preventDefault();
        setExpandedItemId(null);
      }
    },
    onHome: (event) => {
      event.preventDefault();
      setFocusedIndex(0);
    },
    onEnd: (event) => {
      event.preventDefault();
      setFocusedIndex(items.length - 1);
    },
  });
  
  // Focus the item when focusedIndex changes
  useEffect(() => {
    if (focusedIndex >= 0 && navRef.current) {
      const itemElements = navRef.current.querySelectorAll('[role="menuitem"]');
      if (itemElements[focusedIndex]) {
        (itemElements[focusedIndex] as HTMLElement).focus();
        
        // Announce the focused item to screen readers
        const item = items[focusedIndex];
        announceToScreenReader(`${item.label} ${item.disabled ? 'desativado' : ''}`, 'polite');
      }
    }
  }, [focusedIndex, items, announceToScreenReader]);
  
  // Determine navigation styles based on variant and orientation
  const navStyles = cn(
    'outline-none',
    {
      'flex flex-row items-center gap-2': orientation === 'horizontal',
      'flex flex-col gap-1': orientation === 'vertical',
      'border-b border-gray-200': variant === 'tabs' && orientation === 'horizontal',
      'border-r border-gray-200': variant === 'tabs' && orientation === 'vertical',
      'bg-gray-100 p-2 rounded-lg': variant === 'pills',
      'bg-gray-900 text-white p-4': variant === 'sidebar',
    },
    className
  );
  
  // Determine item styles based on variant, orientation, and state
  const getItemStyles = (item: NavigationItem, index: number) => {
    return cn(
      'flex items-center gap-2 px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
      {
        'cursor-pointer': !item.disabled,
        'opacity-50 cursor-not-allowed': item.disabled,
        'hover:bg-gray-100': !item.disabled && variant !== 'sidebar',
        'hover:bg-gray-800': !item.disabled && variant === 'sidebar',
        'bg-primary-100 text-primary-900': item.id === activeItemId && variant !== 'sidebar',
        'bg-primary-800 text-white': item.id === activeItemId && variant === 'sidebar',
        'border-b-2 border-transparent': variant === 'tabs' && orientation === 'horizontal',
        'border-b-2 border-primary-500': item.id === activeItemId && variant === 'tabs' && orientation === 'horizontal',
        'border-r-2 border-transparent': variant === 'tabs' && orientation === 'vertical',
        'border-r-2 border-primary-500': item.id === activeItemId && variant === 'tabs' && orientation === 'vertical',
        'bg-white shadow': variant === 'pills' && item.id === activeItemId,
        'bg-gray-800': variant === 'sidebar' && item.id === activeItemId,
        'font-medium': item.id === activeItemId,
      },
      itemClassName
    );
  };
  
  const handleItemClick = (item: NavigationItem) => {
    if (!item.disabled) {
      if (item.onClick) {
        item.onClick();
      }
      
      if (onItemClick) {
        onItemClick(item);
      }
      
      if (item.children && item.children.length > 0) {
        setExpandedItemId(expandedItemId === item.id ? null : item.id);
      }
    }
  };
  
  return (
    <nav
      ref={navRef}
      className={navStyles}
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      role="menubar"
      aria-orientation={orientation}
    >
      {items.map((item, index) => (
        <div key={item.id} className="relative">
          <a
            href={item.href}
            className={getItemStyles(item, index)}
            onClick={(e) => {
              if (!item.href) e.preventDefault();
              handleItemClick(item);
            }}
            role="menuitem"
            aria-current={item.id === activeItemId ? 'page' : undefined}
            aria-disabled={item.disabled}
            aria-expanded={item.children && item.children.length > 0 ? expandedItemId === item.id : undefined}
            aria-haspopup={item.children && item.children.length > 0 ? 'true' : undefined}
            tabIndex={focusedIndex === index ? 0 : -1}
          >
            {item.icon && <span aria-hidden="true">{item.icon}</span>}
            <span>{item.label}</span>
            {item.children && item.children.length > 0 && (
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
                  'ml-auto h-4 w-4 transition-transform',
                  expandedItemId === item.id && 'rotate-180'
                )}
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            )}
          </a>
          
          {item.children && item.children.length > 0 && expandedItemId === item.id && (
            <div
              className={cn(
                'absolute z-10 mt-1 min-w-[200px] rounded-md border border-gray-200 bg-white p-1 shadow-lg',
                {
                  'left-0 top-full': orientation === 'horizontal',
                  'left-full top-0': orientation === 'vertical',
                  'bg-gray-800 border-gray-700': variant === 'sidebar',
                }
              )}
              role="menu"
              aria-label={`Submenu de ${item.label}`}
            >
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={child.href}
                  className={cn(
                    'block px-4 py-2 text-sm rounded-md',
                    {
                      'cursor-pointer': !child.disabled,
                      'opacity-50 cursor-not-allowed': child.disabled,
                      'hover:bg-gray-100': !child.disabled && variant !== 'sidebar',
                      'hover:bg-gray-700': !child.disabled && variant === 'sidebar',
                      'text-white': variant === 'sidebar',
                    }
                  )}
                  onClick={(e) => {
                    if (!child.href) e.preventDefault();
                    if (!child.disabled && child.onClick) {
                      child.onClick();
                    }
                    if (!child.disabled && onItemClick) {
                      onItemClick(child);
                    }
                  }}
                  role="menuitem"
                  aria-disabled={child.disabled}
                >
                  {child.icon && <span className="mr-2">{child.icon}</span>}
                  {child.label}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

AccessibleNavigation.displayName = 'AccessibleNavigation';

export default AccessibleNavigation;
