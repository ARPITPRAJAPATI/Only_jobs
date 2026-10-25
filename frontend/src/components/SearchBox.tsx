'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, FolderGit2, LayoutDashboard, Search, ShieldCheck } from 'lucide-react';
import { NAV } from '@/lib/nav';
import { cn } from '@/lib/utils';
import { useStudent } from './store';

interface Hit {
  label: string;
  kind: string;
  href: string;
  icon: React.ReactNode;
}

/** Quick jump: pages, projects, badges, certifications. Press "/" or "⌘K" to focus. */
export function SearchBox() {
  const { student, catalog } = useStudent();
  const router = useRouter();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLInputElement>(null);
  const box = useRef<HTMLDivElement>(null);

  const hits = useMemo<Hit[]>(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const all: Hit[] = [
      ...NAV.map((n) => ({ label: n.label, kind: 'Page', href: n.href, icon: <LayoutDashboard className="h-4 w-4" /> })),
      ...student.projects.map((p) => ({ label: p.title, kind: 'Project', href: `/projects/${p.id}`, icon: <FolderGit2 className="h-4 w-4" /> })),
      ...catalog.map((b) => ({ label: b.title, kind: 'Badge', href: '/badges', icon: <ShieldCheck className="h-4 w-4" /> })),
      ...student.certifications.map((c) => ({ label: c.title, kind: 'Certification', href: '/certifications', icon: <Award className="h-4 w-4" /> })),
    ];
    return all.filter((h) => h.label.toLowerCase().includes(term)).slice(0, 6);
  }, [q, student.projects, student.certifications, catalog]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  const go = (h: Hit) => {
    router.push(h.href);
    setQ('');
    setOpen(false);
    ref.current?.blur();
  };

  return (
    <div ref={box} className="relative w-full">
      <div className="flex h-9 w-full items-center gap-2 rounded-xl bg-surface2 px-3 border border-line focus-within:border-[#0969da] focus-within:bg-surface focus-within:ring-2 focus-within:ring-[#0969da]/20 transition-all">
        <Search className="h-3.5 w-3.5 text-muted shrink-0" />
        <input
          ref={ref}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') setActive((a) => Math.min(a + 1, hits.length - 1));
            if (e.key === 'ArrowUp') setActive((a) => Math.max(a - 1, 0));
            if (e.key === 'Enter' && hits[active]) go(hits[active]);
            if (e.key === 'Escape') setOpen(false);
          }}
          placeholder="Search profile..."
          aria-label="Search profile"
          className="min-w-0 flex-1 bg-transparent text-xs text-ink placeholder:text-muted outline-none font-medium"
        />
        <kbd className="hidden sm:inline-flex items-center rounded bg-surface px-1.5 py-0.5 text-[10px] font-mono text-muted border border-line">
          /
        </kbd>
      </div>

      {open && q.trim() && (
        <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-xl bg-surface p-1 shadow-lg ring-1 ring-line animate-fade-in min-w-[240px]">
          {hits.length === 0 ? (
            <p className="px-3 py-2.5 text-xs text-muted font-medium">No matches found</p>
          ) : (
            hits.map((h, i) => (
              <button
                key={h.kind + h.label}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(h)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors',
                  i === active ? 'bg-[#ddf4ff] text-[#0969da] font-semibold' : 'text-ink/80 hover:bg-surface2',
                )}
              >
                <span className="shrink-0 text-muted">{h.icon}</span>
                <span className="flex-1 truncate">{h.label}</span>
                <span className="text-[10px] uppercase tracking-wide text-muted font-bold font-mono">{h.kind}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
