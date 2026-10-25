'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export const THEMES = [
  { id: 'indigo', label: 'GitHub Primer', swatch: ['#0969da', '#f6f8fa', '#1f2328'] },
  { id: 'forest', label: 'GitHub Green', swatch: ['#1f883d', '#dafbe1', '#0d1117'] },
  { id: 'mono', label: 'GitHub Minimal', swatch: ['#1f2328', '#ffffff', '#d0d7de'] },
  { id: 'midnight', label: 'GitHub Dark', swatch: ['#58a6ff', '#0d1117', '#161b22'] },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

const KEY = 'sp:theme';

/** Runs before hydration (inlined in <head>) to avoid a flash of the wrong theme. */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('${KEY}');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  isDark: boolean;
  toggleDark: () => void;
}

const Ctx = createContext<ThemeContextType>({
  theme: 'indigo',
  setTheme: () => {},
  isDark: false,
  toggleDark: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>('indigo');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') as ThemeId | null;
    if (current && THEMES.some((t) => t.id === current)) setThemeState(current);
  }, []);

  const setTheme = useCallback((t: ThemeId) => {
    setThemeState(t);
    document.documentElement.setAttribute('data-theme', t);
    try {
      localStorage.setItem(KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  const isDark = theme === 'midnight';
  const toggleDark = useCallback(() => {
    setTheme(theme === 'midnight' ? 'indigo' : 'midnight');
  }, [theme, setTheme]);

  return <Ctx.Provider value={{ theme, setTheme, isDark, toggleDark }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
