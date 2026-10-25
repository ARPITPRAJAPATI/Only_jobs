'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn, uid } from '@/lib/utils';

type Tone = 'success' | 'error' | 'info';
interface ToastItem {
  id: string;
  message: string;
  tone: Tone;
}

const Ctx = createContext<(message: string, tone?: Tone) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, tone: Tone = 'success') => {
    const id = uid();
    setItems((x) => [...x, { id, message, tone }]);
    setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), 3800);
  }, []);

  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2" aria-live="polite">
        {items.map((t) => {
          const Icon = t.tone === 'success' ? CheckCircle2 : t.tone === 'error' ? XCircle : Info;
          return (
            <div
              key={t.id}
              className={cn(
                'pointer-events-auto flex animate-fade-up items-start gap-3 rounded-2xl bg-ink px-4 py-3 text-sm text-surface shadow-pop',
              )}
            >
              <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', t.tone === 'success' && 'text-good', t.tone === 'error' && 'text-bad')} />
              <span>{t.message}</span>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
