'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Menu } from 'lucide-react';
import { titleFor } from '@/lib/nav';
import { FrozenBanner } from './FrozenBanner';
import { SearchBox } from './SearchBox';
import { Sidebar } from './Sidebar';
import { useStudent } from './store';
import { ThemeSwitcher } from './ThemeSwitcher';
import { IconButton } from './ui';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { student, source } = useStudent();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const pending = student.badges.filter((b) => b.status === 'PENDING').length;

  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] gap-4 p-3 sm:p-4 lg:gap-5 lg:p-5">
      {/* desktop sidebar */}
      <div className="sticky top-5 hidden h-[calc(100vh-2.5rem)] w-[264px] shrink-0 lg:block">
        <Sidebar />
      </div>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-ink/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[290px] max-w-[85vw] animate-fade-in p-3">
            <Sidebar onNavigate={() => setOpen(false)} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-5">
        <header className="card flex items-center gap-3 !rounded-[28px] !px-4 !py-3.5 sm:!px-6 sm:!py-4">
          <IconButton className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </IconButton>
          <h1 className="min-w-0 flex-1 truncate text-xl font-bold tracking-tight sm:text-2xl">{titleFor(pathname)}</h1>
          {source === 'mock' && <span className="hidden rounded-full bg-warn/10 px-2.5 py-1 text-[11px] font-semibold text-warn xl:inline">Demo data</span>}
          <div className="hidden md:block">
            <ThemeSwitcher />
          </div>
          <div className="hidden w-full max-w-[260px] sm:block">
            <SearchBox />
          </div>
          <div className="relative">
            <IconButton aria-label={`${pending} pending reviews`} title={pending ? `${pending} badge request(s) awaiting review` : 'No notifications'}>
              <Bell className="h-5 w-5" />
            </IconButton>
            {pending > 0 && <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-accent2 ring-2 ring-surface" />}
          </div>
        </header>

        <FrozenBanner />
        <main className="min-w-0 pb-6">{children}</main>
      </div>
    </div>
  );
}
