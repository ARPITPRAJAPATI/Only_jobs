'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Award, BadgeCheck, FolderGit2, GraduationCap, LayoutDashboard, Settings, ShieldAlert, ShieldCheck, X, type LucideIcon } from 'lucide-react';
import { NAV } from '@/lib/nav';
import { MAX_PROJECTS, cn, trustBreakdown } from '@/lib/utils';
import { Avatar } from './Avatar';
import { useStudent } from './store';
import { ProgressRing } from './ui';

const ICONS: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  academics: GraduationCap,
  projects: FolderGit2,
  coding: Activity,
  badges: BadgeCheck,
  certs: Award,
  settings: Settings,
};

export function Sidebar({ onNavigate, onClose }: { onNavigate?: () => void; onClose?: () => void }) {
  const pathname = usePathname();
  const { student } = useStudent();
  const trust = trustBreakdown(student).total;

  const counts: Record<string, string | undefined> = {
    '/academics': String(student.academics.length),
    '/projects': `${student.projects.length}/${MAX_PROJECTS}`,
    '/badges': String(student.badges.filter((b) => b.status === 'APPROVED').length),
    '/certifications': String(student.certifications.length),
  };
  const pendingBadges = student.badges.filter((b) => b.status === 'PENDING').length;

  return (
    <aside className="flex h-full flex-col rounded-[28px] bg-side p-4 text-sideInk transition-colors">
      <div className="flex items-center justify-between px-2 pb-4 pt-2">
        <Link href="/" className="flex items-center gap-2.5" onClick={onNavigate}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-sideInk/15 text-sm font-black">OJ</span>
          <span className="leading-tight">
            <span className="block text-base font-extrabold tracking-wide">ONLY JOBS</span>
            <span className="block text-[10px] uppercase tracking-[0.18em] opacity-60">KIET Campus</span>
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-sideInk/10 lg:hidden" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* identity block with trust ring (Flights-style) */}
      <div className="mb-4 flex flex-col items-center rounded-3xl bg-sideInk/10 px-4 py-5 text-center">
        <ProgressRing value={trust} size={92} stroke={4} color={student.isAccountFrozen ? 'bad' : 'accent2'}>
          <Avatar name={student.name} src={student.avatarUrl} size={74} />
        </ProgressRing>
        <p className="mt-3 text-sm font-bold tracking-wide">{student.name}</p>
        <p className="max-w-full truncate text-[11px] opacity-70">{student.email}</p>
        <span className={cn('mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold', student.isAccountFrozen ? 'bg-bad text-white' : 'bg-sideInk/15')}>
          {student.isAccountFrozen ? <ShieldAlert className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
          {student.isAccountFrozen ? 'Account frozen' : `Trust score ${trust}`}
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Profile sections">
        {NAV.map((item) => {
          const Icon = ICONS[item.icon];
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          const count = counts[item.href];
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                active ? 'bg-sideActive text-sideActiveInk shadow-sm' : 'opacity-80 hover:bg-sideInk/10 hover:opacity-100',
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.href === '/badges' && pendingBadges > 0 && (
                <span className="rounded-full bg-warn px-1.5 py-0.5 text-[10px] font-bold text-white" title="Pending review">
                  {pendingBadges}
                </span>
              )}
              {count && (
                <span className={cn('min-w-[24px] rounded-lg px-1.5 py-0.5 text-center text-[11px] font-semibold', active ? 'bg-accentSoft text-accent' : 'bg-sideInk/15')}>{count}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 rounded-2xl bg-sideInk/10 p-3.5 text-[11px] leading-relaxed opacity-90">
        <p className="font-semibold">Admin-locked fields</p>
        <p className="opacity-70">Name, roll number, branch and batch are managed by the TPO office.</p>
      </div>
    </aside>
  );
}
