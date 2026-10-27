'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStudent } from '@/components/store';
import { useTheme } from '@/components/theme';
import {
  Home,
  BookOpen,
  Briefcase,
  GraduationCap,
  Users,
  PhoneCall,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function FeedNavbar() {
  const pathname = usePathname();
  const { student } = useStudent();
  const { isDark, toggleDark } = useTheme();
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  const pendingBadges = student.badges.filter((b) => b.status === 'PENDING').length;

  // The 7 Exact Navbar Items (Styled in GitHub Primer design tokens):
  // 1: Home
  // 2: Courses / Learning
  // 3: Jobs
  // 4: Class
  // 5: Alumni
  // 6: Contact
  // 7: Notification
  const navItems = [
    {
      id: '1',
      label: 'Home',
      href: '/feed',
      isActive: pathname.startsWith('/feed'),
      icon: Home,
    },
    {
      id: '2',
      label: 'Courses / Learning',
      href: '/courses',
      isActive: pathname.startsWith('/courses'),
      icon: BookOpen,
    },
    {
      id: '3',
      label: 'Jobs',
      href: '/jobs',
      isActive: pathname.startsWith('/jobs'),
      icon: Briefcase,
    },
    {
      id: '4',
      label: 'Class',
      href: '/class',
      isActive: pathname.startsWith('/class'),
      icon: GraduationCap,
    },
    {
      id: '5',
      label: 'Alumni',
      href: '/alumni',
      isActive: pathname.startsWith('/alumni'),
      icon: Users,
    },
    {
      id: '6',
      label: 'Contact',
      href: '/contact',
      isActive: pathname.startsWith('/contact'),
      icon: PhoneCall,
    },
  ];

  // Quick search directory
  const searchResults = [
    { title: 'Campus Placement & Internship Drives', href: '/jobs', category: 'Placements', icon: Briefcase },
    { title: 'Courses & 3-Phase Learning Tracks', href: '/courses', category: 'Skill Academies', icon: BookOpen },
    { title: 'Campus Community Feed & Notices', href: '/feed', category: 'Announcements', icon: Home },
    { title: 'Class Academics, SGPA & Audits', href: '/academics', category: 'Class Records', icon: GraduationCap },
    { title: 'KIET Alumni Mentorship Directory', href: '/alumni', category: 'Alumni Network', icon: Users },
    { title: 'TPO Helpline & Contact Support', href: '/contact', category: 'Campus Helpdesk', icon: PhoneCall },
    { title: 'Student Identity Portfolio', href: '/profile', category: 'Verified Profile', icon: ShieldCheck },
  ].filter(
    (item) =>
      search.trim() === '' ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-surface border-b border-line transition-colors">
      <div className="max-w-[1440px] mx-auto h-[56px] sm:h-[60px] px-3 sm:px-6 flex items-center justify-between gap-2 lg:gap-4">
        {/* Left: Brand Logo + GitHub-style Search Bar */}
        <div className="flex items-center gap-3 lg:gap-5 min-w-0 shrink-0">
          {/* Brand Logo (GitHub style: clean dark typography + subtle badge) */}
          <Link href="/feed" className="flex items-baseline gap-2 focus:outline-none group shrink-0">
            <span className="text-[18px] sm:text-[20px] font-black tracking-tight text-ink group-hover:text-[#0969da] transition-colors">
              Only Jobs
            </span>
            <span className="text-[11px] font-bold text-ink bg-surface2 px-2 py-0.5 rounded-full border border-line">
              KIET
            </span>
          </Link>

          {/* GitHub-style Search Box */}
          <div ref={searchRef} className="relative hidden xl:block">
            <div className="flex items-center h-8 w-[230px] rounded-md bg-surface2 px-3 gap-2 transition-all border border-line focus-within:border-[#0969da] focus-within:bg-surface focus-within:ring-2 focus-within:ring-[#0969da]/20">
              <Search className="w-3.5 h-3.5 text-muted shrink-0" />
              <input
                type="text"
                placeholder="Search jobs, courses, alumni..."
                value={search}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchOpen(true);
                }}
                className="w-full bg-transparent text-[12px] text-ink placeholder-muted outline-none font-medium"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-muted hover:text-ink text-xs font-bold"
                >
                  ×
                </button>
              )}
            </div>

            {/* Quick Search Dropdown */}
            {searchOpen && (
              <div className="absolute top-10 left-0 w-[320px] rounded-md bg-surface border border-line shadow-lg p-2 z-50 animate-fade-up">
                <div className="px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-muted">
                  Campus Shortcuts
                </div>
                <div className="space-y-0.5 mt-1">
                  {searchResults.slice(0, 5).map((res) => {
                    const Icon = res.icon;
                    return (
                      <Link
                        key={res.href}
                        href={res.href}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-surface2 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-6 w-6 rounded bg-surface2 border border-line text-ink flex items-center justify-center shrink-0">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-ink truncate">{res.title}</div>
                            <div className="text-[10.5px] text-muted">{res.category}</div>
                          </div>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted group-hover:text-[#0969da] transition-all" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: The 7 Enumerated Navbar Items (GitHub Primer Tab Styles) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {/* 1 Home, 2 Courses/Learning, 3 Jobs, 4 Class, 5 Alumni, 6 Contact */}
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'h-8 px-2.5 xl:px-3 rounded-md flex items-center gap-1.5 text-[12.5px] font-semibold transition-all whitespace-nowrap',
                  item.isActive
                    ? 'bg-surface2 text-ink font-bold border border-line shadow-2xs'
                    : 'text-muted hover:bg-surface2 hover:text-ink'
                )}
              >
                <Icon className={cn('w-3.5 h-3.5 shrink-0', item.isActive ? 'text-ink' : 'text-muted')} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* 7: Notification Bell with Flyout */}
          <div ref={notifRef} className="relative ml-0.5">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              aria-label="Campus Notifications"
              className={cn(
                'relative h-8 rounded-md flex items-center gap-1.5 text-[12.5px] font-semibold transition-all cursor-pointer',
                notifOpen
                  ? 'px-2.5 xl:px-3 text-ink bg-surface2 font-bold border border-line shadow-2xs'
                  : 'px-2 sm:px-2.5 text-muted hover:bg-surface2 hover:text-ink'
              )}
            >
              <Bell className={cn('w-3.5 h-3.5 shrink-0', notifOpen ? 'text-ink' : 'text-muted')} />
              {notifOpen && (
                <span className="text-ink animate-fade-in">Notification</span>
              )}
              {pendingBadges > 0 && (
                <span className="text-[10px] font-bold bg-[#cf222e] text-white px-1.5 py-0.5 rounded-full leading-none">
                  {pendingBadges}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {notifOpen && (
              <div className="absolute right-0 top-10 w-[320px] rounded-md bg-surface border border-line shadow-lg p-3 z-50 animate-fade-up">
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <span className="text-xs font-bold text-ink">Notifications</span>
                  <span className="text-[10.5px] font-semibold text-ink bg-surface2 border border-line px-2 py-0.5 rounded-full">
                    {pendingBadges} Pending
                  </span>
                </div>

                <div className="space-y-2 mt-2 max-h-[300px] overflow-y-auto">
                  <div className="p-2.5 rounded-md bg-surface2 border border-line text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-ink">
                      <Briefcase className="h-3.5 w-3.5 text-[#0969da]" />
                      <span>Microsoft 2026 Drive Open</span>
                    </div>
                    <p className="text-[11px] text-muted mt-1">
                      Registration closes Tuesday 5 PM for SDE 1 placement shortlist.
                    </p>
                    <Link
                      href="/jobs"
                      onClick={() => setNotifOpen(false)}
                      className="text-[11px] font-semibold text-[#0969da] hover:underline mt-1 inline-block"
                    >
                      View Job Details &rarr;
                    </Link>
                  </div>

                  <div className="p-2.5 rounded-md bg-surface2 border border-line text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-ink">
                      <BookOpen className="h-3.5 w-3.5 text-[#1a7f37]" />
                      <span>Courses & Labs</span>
                    </div>
                    <p className="text-[11px] text-muted mt-1">
                      12 verified 3-Phase Gatekeeper tracks released for placement readiness.
                    </p>
                    <Link
                      href="/courses"
                      onClick={() => setNotifOpen(false)}
                      className="text-[11px] font-semibold text-[#0969da] hover:underline mt-1 inline-block"
                    >
                      Explore Courses &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Avatar + User Name + Theme Toggle + GitHub Button + Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* One-Click Theme Switcher (Sun / Moon) */}
          <button
            type="button"
            onClick={toggleDark}
            className="h-8 w-8 rounded-md border border-line bg-surface2 hover:bg-surface flex items-center justify-center text-ink transition-all cursor-pointer shadow-2xs"
            title={isDark ? 'Switch to GitHub Light mode' : 'Switch to GitHub Dark mode'}
            aria-label={isDark ? 'Switch to GitHub Light mode' : 'Switch to GitHub Dark mode'}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-[#e3b341] transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-[#656d76] transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Student Profile Shortcut (GitHub clean avatar) */}
          <Link
            href="/profile"
            className={cn(
              'flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-md transition-all group border border-transparent',
              pathname.startsWith('/profile')
                ? 'bg-surface2 border-line'
                : 'hover:bg-surface2'
            )}
            title="View Student Profile"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-line overflow-hidden bg-surface2 flex items-center justify-center shrink-0">
              {student.avatarUrl ? (
                <img src={student.avatarUrl} alt={student.name} className="h-full w-full object-cover" />
              ) : (
                <span className="font-bold text-[11px] text-ink">
                  {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
            <span className="hidden sm:inline-block text-[12.5px] font-semibold text-ink group-hover:text-[#0969da] transition-colors max-w-[110px] truncate">
              {student.name.split(' ')[0]}
            </span>
          </Link>


          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-8 w-8 rounded-md border border-line bg-surface2 flex items-center justify-center text-ink hover:bg-surface transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (GitHub palette) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-line bg-surface px-4 py-3 space-y-1 animate-fade-in shadow-md max-h-[85vh] overflow-y-auto">
          <div className="px-2 py-1 text-[10.5px] font-bold uppercase tracking-wider text-muted">
            Campus Navigation (1–7)
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-colors',
                  item.isActive
                    ? 'bg-surface2 text-ink font-bold border border-line'
                    : 'text-muted hover:bg-surface2 hover:text-ink'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.id}. {item.label}</span>
              </Link>
            );
          })}

          {/* Notification Button */}
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold text-muted hover:bg-surface2 hover:text-ink text-left"
          >
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4" />
              <span>7. Notifications</span>
            </div>
            {pendingBadges > 0 && (
              <span className="text-[10px] font-bold bg-[#cf222e] text-white px-1.5 py-0.2 rounded-full">
                {pendingBadges} Pending
              </span>
            )}
          </button>

          {/* Profile Shortcut */}
          <div className="pt-2 border-t border-line">
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors',
                pathname.startsWith('/profile')
                  ? 'bg-surface2 text-ink font-bold border border-line'
                  : 'text-muted hover:bg-surface2 hover:text-ink'
              )}
            >
              <span>Student Profile & Portfolio</span>
              <span className="text-[10.5px] font-bold text-[#0969da]">View &rarr;</span>
            </Link>
          </div>

          {/* Mobile Theme Toggle */}
          <div className="pt-2 border-t border-line">
            <button
              type="button"
              onClick={() => {
                toggleDark();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold bg-surface2 border border-line text-ink cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {isDark ? <Sun className="h-4 w-4 text-[#e3b341]" /> : <Moon className="h-4 w-4 text-[#656d76]" />}
                <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
              </span>
              <span className="text-[10.5px] font-mono text-muted">{isDark ? 'GitHub Dark' : 'GitHub Light'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
