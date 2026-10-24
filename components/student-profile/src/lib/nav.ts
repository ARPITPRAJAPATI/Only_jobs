export const NAV = [
  { href: '/', label: 'Overview', title: 'Student Profile', icon: 'overview' },
  { href: '/academics', label: 'Academics', title: 'Academics & Audit', icon: 'academics' },
  { href: '/projects', label: 'Projects', title: 'Featured Projects', icon: 'projects' },
  { href: '/coding', label: 'Coding Activity', title: 'Coding Activity', icon: 'coding' },
  { href: '/badges', label: 'Badges', title: 'Verified Badges', icon: 'badges' },
  { href: '/certifications', label: 'Certifications', title: 'Certifications Hub', icon: 'certs' },
  { href: '/settings', label: 'Settings', title: 'Profile Settings', icon: 'settings' },
] as const;

export type NavItem = (typeof NAV)[number];

export function titleFor(pathname: string) {
  if (pathname.startsWith('/projects/')) return 'Project';
  const hit = NAV.find((n) => (n.href === '/' ? pathname === '/' : pathname.startsWith(n.href)));
  return hit?.title ?? 'Student Profile';
}
