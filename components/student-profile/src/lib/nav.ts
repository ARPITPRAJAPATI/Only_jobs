export const NAV = [
  { href: '/profile', label: 'Overview', title: 'Student Profile', icon: 'overview' },
  { href: '/courses', label: 'Courses', title: 'Courses & Learning Hub', icon: 'courses' },
  { href: '/jobs', label: 'Jobs', title: 'Placement Drives & Jobs', icon: 'jobs' },
  { href: '/feed', label: 'Campus Feed', title: 'Campus Community Feed', icon: 'feed' },
  { href: '/academics', label: 'Class / Academics', title: 'Academics & Audit', icon: 'academics' },
  { href: '/alumni', label: 'Alumni', title: 'Alumni Network & Referrals', icon: 'alumni' },
  { href: '/projects', label: 'Projects', title: 'Featured Projects', icon: 'projects' },
  { href: '/coding', label: 'Coding Activity', title: 'Coding Activity', icon: 'coding' },
  { href: '/badges', label: 'Badges', title: 'Verified Badges', icon: 'badges' },
  { href: '/certifications', label: 'Certifications', title: 'Certifications Hub', icon: 'certs' },
  { href: '/contact', label: 'Contact', title: 'TPO & Helpdesk Contact', icon: 'contact' },
  { href: '/settings', label: 'Settings', title: 'Profile Settings', icon: 'settings' },
] as const;

export type NavItem = (typeof NAV)[number];

export function titleFor(pathname: string) {
  if (pathname.startsWith('/projects/')) return 'Project';
  const hit = NAV.find((n) => (n.href === '/profile' ? pathname === '/profile' : pathname.startsWith(n.href)));
  return hit?.title ?? 'Student Profile';
}
