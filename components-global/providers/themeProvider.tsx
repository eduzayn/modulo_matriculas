'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export const colors = {
  primary: 'blue-600',
  secondary: 'purple-600',
  success: 'green-600',
  danger: 'red-600',
  warning: 'yellow-600',
  info: 'cyan-600',
};

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  colors,
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
