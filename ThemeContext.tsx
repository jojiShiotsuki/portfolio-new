import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { ThemeTokens, darkTheme, lightTheme } from './theme';

type ThemeMode = 'dark' | 'light';

interface ThemeContextValue {
  mode: ThemeMode;
  theme: ThemeTokens;
  /* `origin` is the rectangle of the control that was pressed. The new theme grows out
     of that point instead of from the middle of the screen. Optional, so the older
     toggle in components/ui/theme-toggle.tsx can keep calling this with no arguments. */
  toggleTheme: (origin?: DOMRect) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const prefersDark = (): boolean =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const storedMode = (): ThemeMode | null => {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return null;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // No saved choice means follow the operating system, rather than assuming light.
  const [mode, setMode] = useState<ThemeMode>(() => storedMode() ?? (prefersDark() ? 'dark' : 'light'));

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', mode);

    // Sync CSS variables used by index.html and the older inline-styled pages.
    // The Mono Index design does NOT read these — its tokens are declared on .mono in
    // mono.css precisely so an inline style on <html> cannot override them.
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

  // Keep following the operating system for as long as the visitor has not chosen.
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      if (storedMode()) return;
      setMode(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = useCallback((origin?: DOMRect) => {
    const next: ThemeMode = mode === 'dark' ? 'light' : 'dark';

    const apply = () => {
      setMode(next);
      try { localStorage.setItem('theme', next); } catch {}
    };

    const root = document.documentElement;
    if (origin) {
      root.style.setProperty('--vx', `${((origin.left + origin.width / 2) / window.innerWidth * 100).toFixed(2)}%`);
      root.style.setProperty('--vy', `${((origin.top + origin.height / 2) / window.innerHeight * 100).toFixed(2)}%`);
    }

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // No View Transitions support, or motion turned down: swap straight away.
    if (!document.startViewTransition || reduce) {
      apply();
      return;
    }

    // The callback has to leave the DOM already changed when it returns, or the
    // transition captures the old paint twice. React batches by default, so this is
    // the one place flushSync is the right tool.
    document.startViewTransition(() => flushSync(apply));
  }, [mode]);

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
