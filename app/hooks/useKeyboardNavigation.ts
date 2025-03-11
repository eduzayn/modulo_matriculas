'use client';

import { useEffect, useRef, KeyboardEvent as ReactKeyboardEvent } from 'react';

type KeyboardNavigationOptions = {
  onArrowUp?: (event: KeyboardEvent) => void;
  onArrowDown?: (event: KeyboardEvent) => void;
  onArrowLeft?: (event: KeyboardEvent) => void;
  onArrowRight?: (event: KeyboardEvent) => void;
  onEnter?: (event: KeyboardEvent) => void;
  onEscape?: (event: KeyboardEvent) => void;
  onTab?: (event: KeyboardEvent) => void;
  onSpace?: (event: KeyboardEvent) => void;
  onHome?: (event: KeyboardEvent) => void;
  onEnd?: (event: KeyboardEvent) => void;
  onPageUp?: (event: KeyboardEvent) => void;
  onPageDown?: (event: KeyboardEvent) => void;
};

/**
 * Hook for handling keyboard navigation
 * @param options Object with callback functions for different key presses
 * @returns Object with handleKeyDown function for React components
 */
export const useKeyboardNavigation = (options: KeyboardNavigationOptions) => {
  const optionsRef = useRef(options);
  
  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        optionsRef.current.onArrowUp?.(event);
        break;
      case 'ArrowDown':
        optionsRef.current.onArrowDown?.(event);
        break;
      case 'ArrowLeft':
        optionsRef.current.onArrowLeft?.(event);
        break;
      case 'ArrowRight':
        optionsRef.current.onArrowRight?.(event);
        break;
      case 'Enter':
        optionsRef.current.onEnter?.(event);
        break;
      case 'Escape':
        optionsRef.current.onEscape?.(event);
        break;
      case 'Tab':
        optionsRef.current.onTab?.(event);
        break;
      case ' ':
        optionsRef.current.onSpace?.(event);
        break;
      case 'Home':
        optionsRef.current.onHome?.(event);
        break;
      case 'End':
        optionsRef.current.onEnd?.(event);
        break;
      case 'PageUp':
        optionsRef.current.onPageUp?.(event);
        break;
      case 'PageDown':
        optionsRef.current.onPageDown?.(event);
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return {
    handleKeyDown: (event: ReactKeyboardEvent) => handleKeyDown(event.nativeEvent),
  };
};

export default useKeyboardNavigation;
