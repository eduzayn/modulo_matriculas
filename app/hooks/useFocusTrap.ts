'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook to trap focus within a container
 * @param active Whether the focus trap is active
 * @param returnFocusOnDeactivate Whether to return focus to the previously focused element when deactivated
 * @returns Ref to attach to the container element
 */
export const useFocusTrap = (
  active: boolean = true,
  returnFocusOnDeactivate: boolean = true
) => {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Store the currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus the container if it doesn't have any focusable elements
    if (containerRef.current) {
      containerRef.current.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!containerRef.current || event.key !== 'Tab') return;

      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      // If Shift+Tab on first element, move to last element
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
      // If Tab on last element, move to first element
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Return focus to the previously focused element when deactivated
      if (returnFocusOnDeactivate && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [active, returnFocusOnDeactivate]);

  return containerRef;
};

export default useFocusTrap;
