import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeTokens, darkTheme, lightTheme } from './theme';

type ThemeMode = 'dark' | 'light';

interface ThemeContextValue {
  mode: ThemeMode;
  theme: ThemeTokens;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {}
    return 'light';
  });

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    localStorage.setItem('theme', mode);
    const root = document.documentElement;
    root.setAttribute('data-theme', mode);

    // Sync CSS variables used by index.html styles
    root.style.setProperty('--bg-primary', theme.bgPrimary);
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--bg-secondary', theme.bgTertiary);
    root.style.setProperty('--bg-tertiary', theme.bgTertiary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-dim', theme.accentDim);
    root.style.setProperty('--accent-secondary', theme.accentLight);
    root.style.setProperty('--accent-secondary-dim', `${theme.accentLight}33`);
    root.style.setProperty('--text-muted', theme.textMuted);
  }, [mode, theme]);

  const toggleTheme = () => {
    setMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
