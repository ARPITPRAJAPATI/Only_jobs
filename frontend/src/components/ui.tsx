'use client';

import { useEffect, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ---------- Card (Signature /profile Translucent Glass Container) ---------- */
export function Card({ className, children, ...rest }: { className?: string; children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'card profile-glass-panel rounded-2xl border border-white/[0.1] bg-white/[0.06] backdrop-blur-xl shadow-xl transition-all',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, icon }: { title: string; subtitle?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {icon && (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.08] text-[#58a6ff] border border-white/[0.1]">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-base font-bold tracking-tight text-white truncate">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-white/50 font-medium">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ---------- Chip ---------- */
export type Tone = 'neutral' | 'accent' | 'good' | 'warn' | 'bad';
const toneCls: Record<Tone, string> = {
  neutral: 'bg-white/[0.08] text-white/75 border border-white/[0.14]',
  accent: 'bg-[#58a6ff]/15 text-[#79c0ff] border border-[#58a6ff]/30',
  good: 'bg-[#3fb950]/15 text-[#56d364] border border-[#3fb950]/30',
  warn: 'bg-[#d29922]/15 text-[#e3b341] border border-[#d29922]/30',
  bad: 'bg-[#f85149]/15 text-[#f85149] border border-[#f85149]/30',
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
  primary: 'border border-white/20 bg-white text-black shadow-xs hover:bg-white/90',
  secondary: 'border border-white/[0.14] bg-white/[0.08] text-white shadow-2xs hover:bg-white/[0.14]',
  ghost: 'text-white/60 hover:bg-white/[0.08] hover:text-white',
  danger: 'border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20',
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
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58a6ff]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'px-3 py-1.5 text-[13px]' : 'px-4 py-2.5 text-sm',
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
      className={cn(
        'grid h-9 w-9 place-items-center rounded-lg border border-transparent text-white/60 transition-colors hover:border-white/[0.12] hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40',
        className
      )}
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
      <div className="absolute inset-0 animate-fade-in bg-black/65 backdrop-blur-md" onClick={onClose} />
      <div className={cn('relative flex max-h-[92vh] w-full animate-fade-up flex-col rounded-2xl bg-[#0d1117] border border-white/[0.14] shadow-2xl backdrop-blur-2xl text-white', wide ? 'max-w-3xl' : 'max-w-lg')}>
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.1] px-6 py-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-white">{title}</h3>
            {description && <p className="mt-0.5 text-xs text-white/50 font-medium">{description}</p>}
          </div>
          <IconButton onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="overflow-y-auto px-6 py-5 text-white">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Form bits ---------- */
export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-white/60">{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-red-400">{error}</p> : hint ? <p className="mt-1 text-xs text-white/45">{hint}</p> : null}
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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-white/10" />
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

/* ---------- Stat tile (Signature /profile Translucent Glass Card) ---------- */
export function Stat({ label, value, sub, icon, tone = 'accent' }: { label: string; value: ReactNode; sub?: ReactNode; icon?: ReactNode; tone?: 'accent' | 'accent2' | 'good' | 'warn' }) {
  const toneIconColor = {
    accent: 'text-[#58a6ff]',
    accent2: 'text-white/60',
    good: 'text-[#3fb950]',
    warn: 'text-[#d29922]',
  }[tone];

  return (
    <div className="card profile-glass-stat rounded-2xl border border-white/[0.1] bg-white/[0.06] backdrop-blur-xl shadow-xl !p-4 sm:!p-5 flex flex-col justify-between group hover:border-white/[0.18] transition-all">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold tracking-wider uppercase text-white/45">{label}</p>
        {icon && <span className={cn('shrink-0 opacity-80 group-hover:opacity-100 transition-opacity', toneIconColor)}>{icon}</span>}
      </div>
      <div className="mt-2.5">
        <p className="text-2xl font-bold leading-tight tracking-tight text-white font-sans">{value}</p>
        {sub && <p className="mt-1 text-[12px] font-medium text-white/45 truncate">{sub}</p>}
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.03] px-6 py-10 text-center">
      <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] text-white/70 border border-white/[0.1]">{icon}</span>
      <p className="font-bold text-sm text-white">{title}</p>
      <p className="mt-1 max-w-sm text-xs text-white/50">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function PageGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 grid animate-fade-up gap-5 lg:gap-6', className)}>{children}</div>;
}
