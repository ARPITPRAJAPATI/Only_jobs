'use client';

import { useEffect, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ---------- Card ---------- */
export function Card({ className, children, ...rest }: { className?: string; children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('card', className)} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, icon }: { title: string; subtitle?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {icon && <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accentSoft text-accent">{icon}</span>}
        <div className="min-w-0">
          <h2 className="h-section truncate">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ---------- Chip ---------- */
export type Tone = 'neutral' | 'accent' | 'good' | 'warn' | 'bad';
const toneCls: Record<Tone, string> = {
  neutral: 'bg-[#f6f8fa] text-[#656d76] border border-[#d0d7de]',
  accent: 'bg-[#ddf4ff] text-[#0969da] border border-[#54aeff]/40',
  good: 'bg-[#dafbe1] text-[#1a7f37] border border-[#4ac26b]/40',
  warn: 'bg-[#fff8c5] text-[#9a6700] border border-[#d4a72c]/40',
  bad: 'bg-[#ffebe9] text-[#cf222e] border border-[#ff8182]/40',
};

export function Chip({ tone = 'neutral', icon, children, className }: { tone?: Tone; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-colors', toneCls[tone], className)}>
      {icon}
      {children}
    </span>
  );
}

/* ---------- Button ---------- */
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
const variantCls: Record<Variant, string> = {
  primary: 'bg-[#1f883d] text-white hover:bg-[#1a7f37] border border-[#1b1f24]/15 shadow-2xs active:scale-[.98]',
  secondary: 'bg-[#f6f8fa] text-[#1f2328] hover:bg-[#eaeef2] border border-[#d0d7de] active:scale-[.98]',
  ghost: 'text-[#656d76] hover:bg-[#f6f8fa] hover:text-[#1f2328] active:scale-[.98]',
  danger: 'bg-[#f6f8fa] text-[#cf222e] border border-[#d0d7de] hover:bg-[#ffebe9] active:scale-[.98]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md' }) {
  return (
    <button
      {...rest}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all disabled:pointer-events-none disabled:opacity-50',
        size === 'sm' ? 'px-3.5 py-1.5 text-xs' : 'px-4 py-2 text-[13px]',
        variantCls[variant],
        className,
      )}
    />
  );
}

export function IconButton({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cn('grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-surface2 hover:text-ink disabled:opacity-40', className)}
    />
  );
}

/* ---------- Modal ---------- */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 animate-fade-in bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative flex max-h-[92vh] w-full animate-fade-up flex-col rounded-2xl bg-surface border border-line shadow-2xl', wide ? 'max-w-3xl' : 'max-w-lg')}>
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-ink">{title}</h3>
            {description && <p className="mt-0.5 text-xs text-muted font-medium">{description}</p>}
          </div>
          <IconButton onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Form bits ---------- */
export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-bad">{error}</p> : hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

/* ---------- Progress ring ---------- */
export function ProgressRing({
  value,
  size = 96,
  stroke = 8,
  children,
  color = 'accent',
}: {
  value: number; // 0..100
  size?: number;
  stroke?: number;
  children?: ReactNode;
  color?: 'accent' | 'accent2' | 'good' | 'warn' | 'bad';
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} style={{ stroke: 'rgb(var(--line) / .9)' }} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          style={{ stroke: `rgb(var(--${color}))`, transition: 'stroke-dashoffset .8s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/* ---------- Stat tile (Typography-led, anti-slop) ---------- */
export function Stat({ label, value, sub, icon, tone = 'accent' }: { label: string; value: ReactNode; sub?: ReactNode; icon?: ReactNode; tone?: 'accent' | 'accent2' | 'good' | 'warn' }) {
  const toneIconColor = {
    accent: 'text-[#0969da]',
    accent2: 'text-[#656d76]',
    good: 'text-[#1a7f37]',
    warn: 'text-[#9a6700]',
  }[tone];

  return (
    <div className="card !p-4 sm:!p-5 flex flex-col justify-between group hover:border-black/15 transition-all">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold tracking-wider uppercase text-muted">{label}</p>
        {icon && <span className={cn('shrink-0 opacity-80 group-hover:opacity-100 transition-opacity', toneIconColor)}>{icon}</span>}
      </div>
      <div className="mt-2.5">
        <p className="text-[26px] font-black leading-tight tracking-tight text-ink font-sans">{value}</p>
        {sub && <p className="mt-1 text-[12px] font-medium text-muted truncate">{sub}</p>}
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line/90 bg-surface2/30 px-6 py-10 text-center">
      <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-surface text-muted border border-line">{icon}</span>
      <p className="font-bold text-sm text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-xs text-muted">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function PageGrid({ children }: { children: ReactNode }) {
  return <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 grid animate-fade-up gap-5 lg:gap-6">{children}</div>;
}
