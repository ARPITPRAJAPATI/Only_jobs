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
  const wrap = cn(
    'grid h-10 w-10 place-items-center rounded-xl shadow-2xs',
    muted ? 'bg-[#f6f8fa] text-[#656d76] border border-[#d0d7de]' : 'bg-[#ddf4ff] text-[#0969da] border border-[#54aeff]/40',
    className,
  );

  if (iconUrl.startsWith('lucide:')) {
    const Icon = ICONS[iconUrl.slice(7)] ?? Award;
    return (
      <span className={wrap}>
        <Icon className="h-5 w-5" />
      </span>
    );
  }
  return (
    <span className={wrap}>
      <img src={iconUrl} alt="" className="h-6 w-6 object-contain" />
    </span>
  );
}
