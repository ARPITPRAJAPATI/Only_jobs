'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export const THEMES = [
  { id: 'indigo', label: 'Indigo', swatch: ['#534ca8', '#deeafa', '#ffffff'] },
  { id: 'forest', label: 'Forest', swatch: ['#3e5754', '#e2eceb', '#d4a017'] },
  { id: 'mono', label: 'Mono', swatch: ['#262626', '#e8e7e5', '#859ccc'] },
  { id: 'midnight', label: 'Midnight', swatch: ['#14161e', '#0f1117', '#818cf8'] },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

const KEY = 'sp:theme';

/** Runs before hydration (inlined in <head>) to avoid a flash of the wrong theme. */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('${KEY}');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

const Ctx = createContext<{ theme: ThemeId; setTheme: (t: ThemeId) => void }>({ theme: 'indigo', setTheme: () => {} });

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

  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
