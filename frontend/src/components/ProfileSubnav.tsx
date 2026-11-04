'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Award, BadgeCheck, Code2, FolderGit2, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProfileSubnav() {
  const pathname = usePathname();

  const tabs = [
    { label: 'Projects', href: '/projects', icon: FolderGit2, color: '#c084fc' },
    { label: 'Academics & SGPA', href: '/academics', icon: GraduationCap, color: '#4ade80' },
    { label: 'Coding Activities', href: '/coding', icon: Code2, color: '#fb923c' },
    { label: 'Badges', href: '/badges', icon: BadgeCheck, color: '#facc15' },
    { label: 'Certificates', href: '/certifications', icon: Award, color: '#f472b6' },
  ];

  return (
    <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.1] bg-white/[0.06] backdrop-blur-xl p-2.5 shadow-xl">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/[0.12] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Profile Overview</span>
        </Link>

        {/* Section tabs with active route pill */}
        <div className="flex flex-wrap items-center gap-1">
          {tabs.map((tab) => {
            const active = pathname.startsWith(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all',
                  active
                    ? 'border border-white/[0.16] bg-white/[0.12] text-white shadow-sm font-semibold'
                    : 'text-white/55 hover:text-white hover:bg-white/[0.06]'
                )}
              >
                <Icon className="h-3.5 w-3.5" style={{ color: active ? tab.color : undefined }} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
