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

/** Quick jump: pages, projects, badges, certifications. Press "/" to focus. */
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
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
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
    <div ref={box} className="relative w-full max-w-[260px]">
      <div className="flex items-center rounded-full bg-surface2 pl-4 pr-1 ring-accent/30 focus-within:ring-2">
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
          placeholder="Search…  ( / )"
          aria-label="Search profile"
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-muted"
        />
        <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-accentInk">
          <Search className="h-4 w-4" />
        </span>
      </div>
      {open && q.trim() && (
        <div className="absolute left-0 right-0 top-12 z-40 overflow-hidden rounded-2xl bg-surface p-1.5 shadow-pop ring-1 ring-line animate-fade-in">
          {hits.length === 0 ? (
            <p className="px-3 py-3 text-sm text-muted">No matches</p>
          ) : (
            hits.map((h, i) => (
              <button
                key={h.kind + h.label}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(h)}
                className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm', i === active ? 'bg-accentSoft text-accent' : 'hover:bg-surface2')}
              >
                {h.icon}
                <span className="flex-1 truncate">{h.label}</span>
                <span className="text-[10px] uppercase tracking-wide text-muted">{h.kind}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
