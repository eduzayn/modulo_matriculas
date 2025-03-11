'use client';

import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface AccessibleTabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline' | 'enclosed';
  className?: string;
  tabListClassName?: string;
  tabPanelClassName?: string;
  tabClassName?: string;
}

export const AccessibleTabs: React.FC<AccessibleTabsProps> = ({
  tabs,
  defaultTabId,
  onChange,
  orientation = 'horizontal',
  variant = 'default',
  className,
  tabListClassName,
  tabPanelClassName,
  tabClassName,
}) => {
  const [activeTabId, setActiveTabId] = useState<string>(defaultTabId || (tabs.length > 0 ? tabs[0].id : ''));
  const [focusedTabIndex, setFocusedTabIndex] = useState<number>(-1);
  const { announceToScreenReader } = useAccessibility();
  const tabsRef = React.useRef<HTMLDivElement>(null);
  
  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    if (onChange) {
      onChange(tabId);
    }
    
    // Find the tab index for the selected tab
    const tabIndex = tabs.findIndex((tab) => tab.id === tabId);
    if (tabIndex !== -1) {
      setFocusedTabIndex(tabIndex);
      
      // Announce tab change to screen readers
      announceToScreenReader(`Aba ${tabs[tabIndex].label} selecionada`, 'polite');
    }
  };
  
  // Handle keyboard navigation
  const { handleKeyDown } = useKeyboardNavigation({
    onArrowRight: (event) => {
      if (orientation === 'horizontal') {
        event.preventDefault();
        const nextIndex = (focusedTabIndex + 1) % tabs.length;
        setFocusedTabIndex(nextIndex);
      }
    },
    onArrowLeft: (event) => {
      if (orientation === 'horizontal') {
        event.preventDefault();
        const prevIndex = (focusedTabIndex - 1 + tabs.length) % tabs.length;
        setFocusedTabIndex(prevIndex);
      }
    },
    onArrowDown: (event) => {
      if (orientation === 'vertical') {
        event.preventDefault();
        const nextIndex = (focusedTabIndex + 1) % tabs.length;
        setFocusedTabIndex(nextIndex);
      }
    },
    onArrowUp: (event) => {
      if (orientation === 'vertical') {
        event.preventDefault();
        const prevIndex = (focusedTabIndex - 1 + tabs.length) % tabs.length;
        setFocusedTabIndex(prevIndex);
      }
    },
    onHome: (event) => {
      event.preventDefault();
      setFocusedTabIndex(0);
    },
    onEnd: (event) => {
      event.preventDefault();
      setFocusedTabIndex(tabs.length - 1);
    },
    onEnter: (event) => {
      if (focusedTabIndex >= 0 && focusedTabIndex < tabs.length) {
        event.preventDefault();
        const tab = tabs[focusedTabIndex];
        if (!tab.disabled) {
          handleTabChange(tab.id);
        }
      }
    },
    onSpace: (event) => {
      if (focusedTabIndex >= 0 && focusedTabIndex < tabs.length) {
        event.preventDefault();
        const tab = tabs[focusedTabIndex];
        if (!tab.disabled) {
          handleTabChange(tab.id);
        }
      }
    },
  });
  
  // Focus the tab when focusedTabIndex changes
  useEffect(() => {
    if (focusedTabIndex >= 0 && tabsRef.current) {
      const tabElements = tabsRef.current.querySelectorAll('[role="tab"]');
      if (tabElements[focusedTabIndex]) {
        (tabElements[focusedTabIndex] as HTMLElement).focus();
      }
    }
  }, [focusedTabIndex]);
  
  // Set initial focus when component mounts
  useEffect(() => {
    if (activeTabId) {
      const activeIndex = tabs.findIndex((tab) => tab.id === activeTabId);
      if (activeIndex !== -1) {
        setFocusedTabIndex(activeIndex);
      }
    }
  }, []);
  
  // Determine tab list styles based on variant and orientation
  const tabListStyles = cn(
    'flex',
    {
      'flex-row border-b border-gray-200': orientation === 'horizontal' && variant !== 'enclosed',
      'flex-col border-r border-gray-200': orientation === 'vertical' && variant !== 'enclosed',
      'flex-row p-1 bg-gray-100 rounded-lg': variant === 'pills',
      'flex-row border border-gray-200 rounded-t-lg p-1 bg-gray-50': variant === 'enclosed' && orientation === 'horizontal',
      'flex-col border border-gray-200 rounded-l-lg p-1 bg-gray-50': variant === 'enclosed' && orientation === 'vertical',
    },
    tabListClassName
  );
  
  // Determine tab styles based on variant, orientation, and state
  const getTabStyles = (tab: TabItem, isActive: boolean) => {
    return cn(
      'flex items-center gap-2 px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      {
        'cursor-pointer': !tab.disabled,
        'opacity-50 cursor-not-allowed': tab.disabled,
        'text-gray-500 hover:text-gray-700': !isActive && !tab.disabled && variant !== 'pills',
        'text-primary-600': isActive && variant !== 'pills',
        'border-b-2 border-transparent -mb-px': orientation === 'horizontal' && variant === 'default',
        'border-b-2 border-primary-500 -mb-px': isActive && orientation === 'horizontal' && variant === 'default',
        'border-r-2 border-transparent -mr-px': orientation === 'vertical' && variant === 'default',
        'border-r-2 border-primary-500 -mr-px': isActive && orientation === 'vertical' && variant === 'default',
        'rounded-md': variant === 'pills',
        'bg-white shadow': isActive && variant === 'pills',
        'hover:bg-gray-50': !isActive && !tab.disabled && variant === 'pills',
        'rounded-t-lg': variant === 'enclosed' && orientation === 'horizontal',
        'rounded-l-lg': variant === 'enclosed' && orientation === 'vertical',
        'bg-white border-b-0': isActive && variant === 'enclosed' && orientation === 'horizontal',
        'bg-white border-r-0': isActive && variant === 'enclosed' && orientation === 'vertical',
        'border border-gray-200': variant === 'enclosed',
        'border-b-0': variant === 'enclosed' && orientation === 'horizontal',
        'border-r-0': variant === 'enclosed' && orientation === 'vertical',
      },
      tabClassName
    );
  };
  
  // Get the active tab content
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  
  return (
    <div className={cn('w-full', className)}>
      <div
        ref={tabsRef}
        role="tablist"
        aria-orientation={orientation}
        className={tabListStyles}
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTabId === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            aria-disabled={tab.disabled}
            tabIndex={activeTabId === tab.id ? 0 : -1}
            className={getTabStyles(tab, activeTabId === tab.id)}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            disabled={tab.disabled}
          >
            {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      
      {activeTab && (
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab.id}`}
          aria-labelledby={`tab-${activeTab.id}`}
          tabIndex={0}
          className={cn(
            'p-4 focus:outline-none',
            {
              'border border-gray-200 border-t-0 rounded-b-lg': variant === 'enclosed' && orientation === 'horizontal',
              'border border-gray-200 border-l-0 rounded-r-lg ml-[1px]': variant === 'enclosed' && orientation === 'vertical',
            },
            tabPanelClassName
          )}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
};

AccessibleTabs.displayName = 'AccessibleTabs';

export default AccessibleTabs;
