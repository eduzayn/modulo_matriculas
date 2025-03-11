'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface SkipNavigationProps {
  mainContentId?: string;
  navigationId?: string;
  footerId?: string;
}

export const SkipNavigation: React.FC<SkipNavigationProps> = ({
  mainContentId = 'main-content',
  navigationId = 'main-navigation',
  footerId = 'main-footer',
}) => {
  const t = useTranslations('accessibility');

  return (
    <div className="skip-navigation">
      <a
        href={`#${mainContentId}`}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {t('skipToContent')}
      </a>
      
      <a
        href={`#${navigationId}`}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-40 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {t('skipToNavigation')}
      </a>
      
      <a
        href={`#${footerId}`}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-80 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {t('skipToFooter')}
      </a>
    </div>
  );
};

export default SkipNavigation;
