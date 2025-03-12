'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { colors } from './colors';

type ModuleType = 'communication' | 'student' | 'content' | 'enrollment';

interface ThemeContextType {
  module: ModuleType;
  colors: {
    main: string;
    light: string;
    dark: string;
    gradient: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ 
  children, 
  module = 'enrollment' 
}: { 
  children: ReactNode; 
  module: ModuleType;
}) => {
  const moduleColors = colors.primary[module];
  
  return (
    <ThemeContext.Provider value={{ module, colors: moduleColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
