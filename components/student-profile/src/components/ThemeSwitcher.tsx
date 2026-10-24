'use client';

import { cn } from '@/lib/utils';
import { THEMES, useTheme } from './theme';

export function ThemeSwitcher({ variant = 'compact' }: { variant?: 'compact' | 'cards' }) {
  const { theme, setTheme } = useTheme();

  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              'rounded-2xl border-2 p-3 text-left transition',
              theme === t.id ? 'border-accent bg-accentSoft/50' : 'border-line hover:border-muted/40',
            )}
            aria-pressed={theme === t.id}
          >
            <div className="mb-2 flex h-10 overflow-hidden rounded-xl ring-1 ring-black/5">
              {t.swatch.map((c) => (
                <span key={c} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <span className="text-sm font-semibold">{t.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 rounded-full bg-surface2 p-1" role="group" aria-label="Theme">
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={t.label}
          aria-label={`${t.label} theme`}
          aria-pressed={theme === t.id}
          className={cn('grid h-6 w-6 place-items-center rounded-full transition', theme === t.id && 'ring-2 ring-accent ring-offset-2 ring-offset-surface2')}
        >
          <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: `linear-gradient(135deg, ${t.swatch[0]} 50%, ${t.swatch[2]} 50%)` }} />
        </button>
      ))}
    </div>
  );
}
