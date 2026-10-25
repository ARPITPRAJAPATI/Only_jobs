/* eslint-disable @next/next/no-img-element */
import { cn, initials } from '@/lib/utils';

export function Avatar({ name, src, size = 64, className }: { name: string; src?: string | null; size?: number; className?: string }) {
  const style = { width: size, height: size, fontSize: size * 0.36 };
  if (src) {
    return <img src={src} alt={name} style={style} className={cn('rounded-full object-cover', className)} />;
  }
  return (
    <span
      style={style}
      className={cn('grid shrink-0 place-items-center rounded-full font-extrabold bg-surface2 text-ink border border-line select-none shadow-2xs', className)}
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}
