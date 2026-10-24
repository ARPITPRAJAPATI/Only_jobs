'use client';

import type { ReactNode } from 'react';
import { AppShell } from './AppShell';
import { StudentProvider } from './store';
import { ThemeProvider } from './theme';
import { ToastProvider } from './toast';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <StudentProvider>
          <AppShell>{children}</AppShell>
        </StudentProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
