'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  FolderGit2,
  GraduationCap,
  Code2,
  Award,
  BadgeCheck,
  Pencil,
} from 'lucide-react';
import { useStudent } from '@/components/store';
import { cn } from '@/lib/utils';

export function ProfileSubnav() {
  const pathname = usePathname();
  const { student } = useStudent();
  const approvedBadges = student.badges.filter((b) => b.status === 'APPROVED').length;

  const tabs = [
    {
      label: 'Overview',
      href: '/profile',
      icon: BookOpen,
      isActive: pathname === '/profile',
    },
    {
      label: 'Projects',
      href: '/projects',
      icon: FolderGit2,
      count: student.projects.length,
      isActive: pathname.startsWith('/projects'),
    },
    {
      label: 'Academics & SGPA',
      href: '/academics',
      icon: GraduationCap,
      count: `${student.academics.length} Sems`,
      isActive: pathname.startsWith('/academics'),
    },
    {
      label: 'Coding Activity',
      href: '/coding',
      icon: Code2,
      isActive: pathname.startsWith('/coding'),
    },
    {
      label: 'Badges',
      href: '/badges',
      icon: Award,
      count: approvedBadges,
      isActive: pathname.startsWith('/badges'),
    },
    {
      label: 'Certifications',
      href: '/certifications',
      icon: BadgeCheck,
      count: student.certifications.length,
      isActive: pathname.startsWith('/certifications'),
    },
    {
      label: 'Edit Profile',
      href: '/settings',
      icon: Pencil,
      isRight: true,
      isActive: pathname.startsWith('/settings'),
    },
  ];

  return (
    <div className="border-b border-line mb-6 sm:mb-8 bg-surface/50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer',
                  tab.isActive
                    ? 'border-[#0969da] text-ink'
                    : 'border-transparent text-muted hover:text-ink hover:border-line',
                  tab.isRight && 'ml-auto'
                )}
              >
                <Icon className={cn('h-4 w-4', tab.isActive ? 'text-[#0969da]' : 'text-muted')} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[11px] font-mono font-medium',
                      tab.isActive
                        ? 'bg-[#0969da]/10 text-[#0969da]'
                        : 'bg-surface2 text-muted'
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
