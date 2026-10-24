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
  neutral: 'bg-surface2 text-muted',
  accent: 'bg-accentSoft text-accent',
  good: 'bg-good/10 text-good',
  warn: 'bg-warn/10 text-warn',
  bad: 'bg-bad/10 text-bad',
};

export function Chip({ tone = 'neutral', icon, children, className }: { tone?: Tone; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold', toneCls[tone], className)}>
      {icon}
      {children}
    </span>
  );
}

/* ---------- Button ---------- */
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
const variantCls: Record<Variant, string> = {
  primary: 'bg-accent text-accentInk hover:brightness-110 shadow-sm',
  secondary: 'bg-surface2 text-ink hover:bg-line',
  ghost: 'text-muted hover:bg-surface2 hover:text-ink',
  danger: 'bg-bad/10 text-bad hover:bg-bad/20',
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
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:scale-[.98] disabled:pointer-events-none disabled:opacity-50',
        size === 'sm' ? 'px-3.5 py-1.5 text-xs' : 'px-5 py-2.5 text-sm',
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
      className={cn('grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-surface2 hover:text-ink disabled:opacity-40', className)}
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
      <div className={cn('relative flex max-h-[92vh] w-full animate-fade-up flex-col rounded-3xl bg-surface shadow-pop', wide ? 'max-w-3xl' : 'max-w-lg')}>
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
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
  stroke = 9,
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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} style={{ stroke: 'rgb(var(--muted) / .18)' }} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          style={{ stroke: `rgb(var(--${color}))`, transition: 'stroke-dashoffset .8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/* ---------- Stat tile ---------- */
export function Stat({ label, value, sub, icon, tone = 'accent' }: { label: string; value: ReactNode; sub?: ReactNode; icon?: ReactNode; tone?: 'accent' | 'accent2' | 'good' | 'warn' }) {
  const toneBg = { accent: 'bg-accentSoft text-accent', accent2: 'bg-accent2/15 text-accent2', good: 'bg-good/10 text-good', warn: 'bg-warn/10 text-warn' }[tone];
  return (
    <div className="card flex items-center gap-4 !p-5">
      {icon && <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl', toneBg)}>{icon}</span>}
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted">{label}</p>
        <p className="text-2xl font-bold leading-tight tracking-tight">{value}</p>
        {sub && <p className="mt-0.5 truncate text-xs text-muted">{sub}</p>}
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line px-6 py-10 text-center">
      <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-accentSoft text-accent">{icon}</span>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function PageGrid({ children }: { children: ReactNode }) {
  return <div className="grid animate-fade-up gap-4 lg:gap-5">{children}</div>;
}
