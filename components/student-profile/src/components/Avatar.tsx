/* eslint-disable @next/next/no-img-element */
import { cn, initials } from '@/lib/utils';

export function Avatar({ name, src, size = 64, className }: { name: string; src?: string | null; size?: number; className?: string }) {
  const style = { width: size, height: size, fontSize: size * 0.36 };
  if (src) {
    return <img src={src} alt={name} style={style} className={cn('rounded-full object-cover', className)} />;
  }
  return (
    <span
      style={{ ...style, background: 'linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent2)))' }}
      className={cn('grid shrink-0 place-items-center rounded-full font-semibold text-white', className)}
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}
