import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

const THEME_STORAGE_KEY = 'preferredTheme';
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

const normalizeTheme = (value) => {
  if (value === THEMES.DARK) {
    return THEMES.DARK;
  }
  return THEMES.LIGHT;
};

const applyTheme = (theme) => {
  if (typeof document === 'undefined') {
    return;
  }

  const normalizedTheme = normalizeTheme(theme);
  const root = document.documentElement;
  root.classList.toggle('dark', normalizedTheme === THEMES.DARK);
  document.body.dataset.theme = normalizedTheme;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') {
      return THEMES.LIGHT;
    }

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      return normalizeTheme(stored);
    }

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? THEMES.DARK : THEMES.LIGHT;
  });

  useEffect(() => {
    applyTheme(theme);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const listener = (event) => {
      if (event.matches) {
        setThemeState(THEMES.DARK);
      } else {
        setThemeState(THEMES.LIGHT);
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const setTheme = useCallback((nextTheme) => {
    setThemeState(normalizeTheme(nextTheme));
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK));
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
