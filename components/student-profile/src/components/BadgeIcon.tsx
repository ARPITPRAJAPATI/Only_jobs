/* eslint-disable @next/next/no-img-element */
import { Award, Cloud, Code2, Flame, GitMerge, Layers, Star, Trophy, Zap, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS: Record<string, LucideIcon> = {
  code: Code2,
  trophy: Trophy,
  'git-merge': GitMerge,
  zap: Zap,
  flame: Flame,
  layers: Layers,
  star: Star,
  cloud: Cloud,
};

/** Badge.iconUrl is either "lucide:<key>" or a real image URL. */
export function BadgeIcon({ iconUrl, className, muted }: { iconUrl: string; className?: string; muted?: boolean }) {
  const wrap = cn('grid h-12 w-12 place-items-center rounded-2xl', muted ? 'bg-surface2 text-muted' : 'bg-accentSoft text-accent', className);
  if (iconUrl.startsWith('lucide:')) {
    const Icon = ICONS[iconUrl.slice(7)] ?? Award;
    return (
      <span className={wrap}>
        <Icon className="h-6 w-6" />
      </span>
    );
  }
  return (
    <span className={wrap}>
      <img src={iconUrl} alt="" className="h-7 w-7 object-contain" />
    </span>
  );
}
