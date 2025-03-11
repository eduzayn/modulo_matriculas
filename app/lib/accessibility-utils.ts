'use client';

import { useCallback } from 'react';

/**
 * Utility function to get accessibility translation keys
 * @param locale Current locale
 * @param key Translation key path
 * @returns Translated string or fallback
 */
export const getAccessibilityTranslation = async (
  locale: string,
  key: string
): Promise<string> => {
  try {
    // Dynamic import of locale file
    const module = await import(`../messages/accessibility/${locale}.json`);
    
    // Split the key path and traverse the object
    const keys = key.split('.');
    let value: any = module;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Key not found, try fallback to en-US
        if (locale !== 'en-US') {
          return getAccessibilityTranslation('en-US', key);
        }
        return key; // Last resort fallback
      }
    }
    
    if (typeof value === 'string') {
      return value;
    }
    
    // If value is not a string, try fallback to en-US
    if (locale !== 'en-US') {
      return getAccessibilityTranslation('en-US', key);
    }
    
    return key; // Last resort fallback
  } catch (error) {
    // If file not found or error, try fallback to en-US
    if (locale !== 'en-US') {
      return getAccessibilityTranslation('en-US', key);
    }
    return key; // Last resort fallback
  }
};

/**
 * React hook for accessibility translations
 * @param locale Current locale
 * @returns Object with translation functions
 */
export const useAccessibilityTranslations = (locale: string = 'pt-BR') => {
  const t = useCallback(
    async (key: string, fallback?: string): Promise<string> => {
      try {
        return await getAccessibilityTranslation(locale, key);
      } catch (error) {
        return fallback || key;
      }
    },
    [locale]
  );
  
  return { t };
};

/**
 * Utility to announce messages to screen readers
 * @param message Message to announce
 * @param politeness Politeness level (polite or assertive)
 */
export const announceToScreenReader = (
  message: string,
  politeness: 'polite' | 'assertive' = 'polite'
) => {
  if (typeof document === 'undefined') return;
  
  // Look for existing announcer element
  let announcer = document.getElementById(`accessibility-announcer-${politeness}`);
  
  // Create announcer if it doesn't exist
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = `accessibility-announcer-${politeness}`;
    announcer.setAttribute('aria-live', politeness);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'announcer';
    document.body.appendChild(announcer);
  }
  
  // Clear previous announcements
  announcer.textContent = '';
  
  // Use setTimeout to ensure the announcement is made after the DOM updates
  setTimeout(() => {
    announcer!.textContent = message;
  }, 50);
};

/**
 * Utility to check if high contrast mode should be enabled
 * @returns Boolean indicating if high contrast mode should be enabled
 */
export const shouldUseHighContrast = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for user preference in localStorage
  const userPreference = localStorage.getItem('highContrastMode');
  if (userPreference !== null) {
    return userPreference === 'true';
  }
  
  // Check for system preference
  return window.matchMedia('(forced-colors: active)').matches;
};

/**
 * Utility to toggle high contrast mode
 * @param enabled Boolean indicating if high contrast mode should be enabled
 */
export const toggleHighContrast = (enabled: boolean): void => {
  if (typeof document === 'undefined') return;
  
  // Save user preference
  localStorage.setItem('highContrastMode', enabled.toString());
  
  // Apply class to html element
  if (enabled) {
    document.documentElement.classList.add('high-contrast');
  } else {
    document.documentElement.classList.remove('high-contrast');
  }
};

/**
 * Format date with accessibility considerations
 * @param date Date to format
 * @param locale Current locale
 * @returns Formatted date string
 */
export const formatAccessibleDate = (
  date: Date | string | number,
  locale: string = 'pt-BR'
): string => {
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;
    
    // Format options for screen readers
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    };
    
    return dateObj.toLocaleDateString(locale, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
};

/**
 * Format currency with accessibility considerations
 * @param amount Amount to format
 * @param locale Current locale
 * @param currency Currency code
 * @returns Formatted currency string
 */
export const formatAccessibleCurrency = (
  amount: number,
  locale: string = 'pt-BR',
  currency: string = 'BRL'
): string => {
  try {
    // Format options for screen readers
    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };
    
    return new Intl.NumberFormat(locale, options).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return String(amount);
  }
};

/**
 * Format number with accessibility considerations
 * @param num Number to format
 * @param locale Current locale
 * @param options Formatting options
 * @returns Formatted number string
 */
export const formatAccessibleNumber = (
  num: number,
  locale: string = 'pt-BR',
  options: Intl.NumberFormatOptions = {}
): string => {
  try {
    return new Intl.NumberFormat(locale, options).format(num);
  } catch (error) {
    console.error('Error formatting number:', error);
    return String(num);
  }
};

/**
 * Format percentage with accessibility considerations
 * @param value Percentage value (0-100)
 * @param locale Current locale
 * @returns Formatted percentage string
 */
export const formatAccessiblePercentage = (
  value: number,
  locale: string = 'pt-BR'
): string => {
  try {
    // Format options for screen readers
    const options: Intl.NumberFormatOptions = {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    };
    
    // Convert to decimal if needed
    const decimalValue = value > 1 ? value / 100 : value;
    
    return new Intl.NumberFormat(locale, options).format(decimalValue);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return `${value}%`;
  }
};
