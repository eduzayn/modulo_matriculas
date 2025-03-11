'use client';

import React from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { useTranslations } from 'next-intl';

interface HighContrastToggleProps {
  className?: string;
}

export const HighContrastToggle: React.FC<HighContrastToggleProps> = ({ className = '' }) => {
  const { highContrastMode, toggleHighContrastMode } = useAccessibility();
  const t = useTranslations('accessibility');

  return (
    <button
      type="button"
      onClick={toggleHighContrastMode}
      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
        highContrastMode
          ? 'bg-gray-900 text-white hover:bg-gray-700'
          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
      } ${className}`}
      aria-pressed={highContrastMode}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      {highContrastMode ? t('disableHighContrast') : t('enableHighContrast')}
    </button>
  );
};

export default HighContrastToggle;
