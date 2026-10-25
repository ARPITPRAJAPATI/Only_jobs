'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Award,
  BadgeCheck,
  BookOpen,
  FolderGit2,
  GraduationCap,
  LayoutDashboard,
  Newspaper,
  Settings,
  ShieldCheck,
  X,
  type LucideIcon,
  Sparkles,
  Briefcase,
  Users,
  PhoneCall,
} from 'lucide-react';
import { NAV } from '@/lib/nav';
import { MAX_PROJECTS, cn, trustBreakdown } from '@/lib/utils';
import { Avatar } from './Avatar';
import { useStudent } from './store';

const ICONS: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  courses: BookOpen,
  jobs: Briefcase,
  feed: Newspaper,
  academics: GraduationCap,
  alumni: Users,
  projects: FolderGit2,
  coding: Activity,
  badges: BadgeCheck,
  certs: Award,
  contact: PhoneCall,
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
    <aside className="flex h-full flex-col rounded-2xl bg-surface border border-line/80 p-3.5 shadow-xs text-ink">
      {/* Brand Logo Header */}
      <div className="flex items-center justify-between px-2 pb-3 pt-1 border-b border-line/60">
        <Link href="/profile" className="flex items-center gap-2.5 focus:outline-none group" onClick={onNavigate}>
          <div className="grid h-8 w-8 place-items-center rounded-md bg-[#1f2328] text-white font-black text-xs shadow-2xs group-hover:scale-105 transition-transform">
            OJ
          </div>
          <div className="leading-tight">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[14.5px] font-bold tracking-tight text-ink group-hover:text-[#0969da] transition-colors">
                ONLY JOBS
              </span>
              <span className="rounded bg-surface2 border border-line px-1.5 py-0.2 text-[9.5px] font-bold tracking-wider text-ink uppercase">
                KIET
              </span>
            </div>
            <span className="block text-[10px] tracking-wider uppercase text-muted font-semibold mt-0.5">
              Campus Placement OS
            </span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-md hover:bg-surface2 lg:hidden text-muted hover:text-ink"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Compact Student Identity Card */}
      <div className="my-3 rounded-md bg-surface2 p-2.5 border border-line">
        <div className="flex items-center gap-2.5">
          <div className="relative shrink-0">
            <Avatar name={student.name} src={student.avatarUrl} size={36} className="border border-line" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#1a7f37] ring-2 ring-surface2" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-ink leading-tight">{student.name}</p>
            <p className="truncate text-[10.5px] text-muted font-mono">{student.rollNumber}</p>
          </div>
        </div>

        {/* Mini Trust Bar */}
        <div className="mt-2.5 pt-2 border-t border-line">
          <div className="flex items-center justify-between text-[10.5px]">
            <span className="font-semibold text-muted flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-[#1a7f37]" />
              <span>Trust Index</span>
            </span>
            <span className="font-bold font-mono text-ink">{trust}<span className="text-muted">/100</span></span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-surface overflow-hidden border border-line/40">
            <div
              className="h-full rounded-full bg-[#1a7f37] transition-all duration-700"
              style={{ width: `${trust}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto py-1" aria-label="Profile navigation">
        {NAV.map((item) => {
          const Icon = ICONS[item.icon];
          const active = item.href === '/profile' ? pathname === '/profile' : pathname.startsWith(item.href);
          const count = counts[item.href];
          const isFeed = item.href === '/feed';

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-semibold transition-all',
                active
                  ? 'bg-surface2 text-ink font-bold border border-line shadow-2xs'
                  : 'text-muted hover:bg-surface2 hover:text-ink',
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0 transition-colors', active ? 'text-ink' : 'text-muted group-hover:text-ink')} />
              <span className="flex-1 truncate">{item.label}</span>

              {isFeed && (
                <span className="flex items-center gap-1 rounded-md bg-[#dafbe1] px-1.5 py-0.5 text-[9px] font-bold text-[#1a7f37] border border-[#4ac26b]/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1a7f37]" />
                  Live
                </span>
              )}

              {item.href === '/badges' && pendingBadges > 0 && (
                <span className="rounded-full bg-[#fff8c5] border border-[#d4a72c]/40 px-1.5 py-0.2 text-[10px] font-bold text-[#9a6700]" title="Pending review">
                  {pendingBadges}
                </span>
              )}

              {count && !isFeed && (
                <span
                  className={cn(
                    'rounded-md px-1.5 py-0.2 text-center text-[10px] font-mono font-semibold',
                    active ? 'bg-surface border border-line text-ink' : 'bg-surface2 text-muted',
                  )}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Institutional Footer */}
      <div className="mt-auto pt-2.5 border-t border-line/60">
        <div className="rounded-xl bg-surface2/50 p-2 text-[10px] leading-relaxed text-muted border border-line/50">
          <span className="font-bold text-ink block flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" /> KIET Placement OS
          </span>
          TPO Verified Identity · Batch 2022–2026
        </div>
      </div>
    </aside>
  );
}
