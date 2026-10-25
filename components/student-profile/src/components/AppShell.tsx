'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { titleFor } from '@/lib/nav';
import { FrozenBanner } from './FrozenBanner';
import { Sidebar } from './Sidebar';
import { useStudent } from './store';
import { IconButton } from './ui';
import { FeedNavbar } from './feed/FeedNavbar';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { student } = useStudent();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);



  // Standalone full-width pages: Landing, Feed, Courses, Jobs, Alumni, Contact, Profile, Projects, Academics, Badges, Certifications, Coding, Settings
  if (
    pathname === '/' ||
    pathname.startsWith('/feed') ||
    pathname.startsWith('/courses') ||
    pathname.startsWith('/jobs') ||
    pathname.startsWith('/class') ||
    pathname.startsWith('/alumni') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/projects') ||
    pathname.startsWith('/academics') ||
    pathname.startsWith('/badges') ||
    pathname.startsWith('/certifications') ||
    pathname.startsWith('/coding') ||
    pathname.startsWith('/settings')
  ) {
    return (
      <div className="min-h-screen bg-bg text-ink flex flex-col transition-colors">
        <FeedNavbar />
        <FrozenBanner />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    );
  }

  // Dashboard pages: /profile, /projects, /academics, /badges, /certifications, /coding, /settings
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col transition-colors">
      {/* Universal Campus Top Navbar across all sections */}
      <FeedNavbar />

      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[1536px] gap-4 p-3 sm:p-4 lg:gap-5 lg:p-5">
        {/* desktop sidebar */}
        <div className="sticky top-[76px] hidden h-[calc(100vh-5.5rem)] w-[235px] shrink-0 lg:block">
          <Sidebar />
        </div>

        {/* mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 animate-fade-in bg-black/50 backdrop-blur-xs" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-[270px] max-w-[85vw] animate-fade-in p-3">
              <Sidebar onNavigate={() => setOpen(false)} onClose={() => setOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-5">
          {/* Streamlined Sub-Header Breadcrumb (GitHub Primer Style) */}
          <div className="flex items-center justify-between gap-3 px-1 py-1 sm:px-2">
            <div className="flex items-center gap-3 min-w-0">
              <IconButton className="lg:hidden shrink-0" onClick={() => setOpen(true)} aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </IconButton>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-muted">
                  <Link href="/feed" className="hover:text-[#0969da] transition-colors">
                    KIET Campus
                  </Link>
                  <span className="text-muted/60">/</span>
                  <span className="text-ink">{titleFor(pathname)}</span>
                </div>
                <h1 className="truncate text-xl sm:text-2xl font-bold tracking-tight text-ink font-sans">
                  {titleFor(pathname)}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/feed"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:bg-surface2 px-3 py-1.5 rounded-md border border-line bg-surface transition-all shadow-2xs"
              >
                <span>Campus Feed</span>
                <span>&rarr;</span>
              </Link>
              <Link
                href="/courses"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#0969da] hover:bg-surface2 px-3 py-1.5 rounded-md border border-line bg-surface transition-all shadow-2xs"
              >
                <span>Courses & Labs</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          <FrozenBanner />
          <main className="min-w-0 pb-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
