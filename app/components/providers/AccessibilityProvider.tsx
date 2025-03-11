'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { announceToScreenReader, toggleHighContrast, shouldUseHighContrast } from '../../lib/accessibility-utils';

type AccessibilityContextType = {
  highContrastMode: boolean;
  toggleHighContrastMode: () => void;
  announceToScreenReader: (message: string, politeness?: 'polite' | 'assertive') => void;
  focusableElements: HTMLElement[];
  registerFocusableElement: (element: HTMLElement) => void;
  unregisterFocusableElement: (element: HTMLElement) => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);
  const t = useTranslations('accessibility');

  // Initialize high contrast mode based on user preference or system settings
  useEffect(() => {
    const shouldUseHC = shouldUseHighContrast();
    setHighContrastMode(shouldUseHC);
    
    if (shouldUseHC) {
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  const handleToggleHighContrastMode = () => {
    const newMode = !highContrastMode;
    setHighContrastMode(newMode);
    toggleHighContrast(newMode);
    
    // Announce change to screen readers
    announceToScreenReader(
      newMode 
        ? t('highContrastEnabled') 
        : t('highContrastDisabled')
    );
  };

  const registerFocusableElement = (element: HTMLElement) => {
    setFocusableElements((prev) => [...prev, element]);
  };

  const unregisterFocusableElement = (element: HTMLElement) => {
    setFocusableElements((prev) => prev.filter((el) => el !== element));
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrastMode,
        toggleHighContrastMode: handleToggleHighContrastMode,
        announceToScreenReader,
        focusableElements,
        registerFocusableElement,
        unregisterFocusableElement,
      }}
    >
      {/* Skip navigation links */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {t('skipToContent')}
      </a>
      
      <a
        href="#main-navigation"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-40 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {t('skipToNavigation')}
      </a>
      
      {/* Screen reader announcer elements */}
      <div
        id="accessibility-announcer-polite"
        aria-live="polite"
        aria-atomic="true"
        className="announcer"
      />
      
      <div
        id="accessibility-announcer-assertive"
        aria-live="assertive"
        aria-atomic="true"
        className="announcer"
      />
      
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;
