import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export enum ThemeType {
  LIGHT = 'emerald',
  DARK = 'forest',
}

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // start with system preference or default to light
  const [theme, setTheme] = useState<ThemeType>(
    (localStorage.getItem('theme') as ThemeType) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? ThemeType.DARK : ThemeType.LIGHT)
  );

  // whenever `theme` changes, update `data-theme` and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === ThemeType.DARK ? ThemeType.LIGHT : ThemeType.DARK));
  };

  const value = {
    theme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
