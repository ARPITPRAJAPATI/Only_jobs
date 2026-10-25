'use client';

import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { trustBreakdown } from '@/lib/utils';
import { useStudent } from './store';
import { Card, ProgressRing } from './ui';

export function TrustCard({ compact = false }: { compact?: boolean }) {
  const { student } = useStudent();
  const { total, parts } = trustBreakdown(student);
  const color = student.isAccountFrozen ? 'bad' : total >= 75 ? 'good' : total >= 45 ? 'accent' : 'warn';
  const tier = total >= 80 ? 'Tier-A Elite' : total >= 60 ? 'Tier-B Verified' : 'Under Review';

  if (compact) {
    return (
      <div className="rounded-xl border border-line bg-surface p-4 shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">Campus Trust</span>
            <span className="text-sm font-bold text-ink">Audit Index</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#dafbe1] px-2 py-0.5 text-[10.5px] font-bold text-[#1a7f37] border border-[#4ac26b]/40">
            <CheckCircle2 className="h-3 w-3 shrink-0" />
            <span>{tier}</span>
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-ink">{total}</span>
            <span className="text-xs font-bold text-muted">/ 100</span>
          </div>
          <span className="text-[11px] font-mono font-semibold text-[#1a7f37]">Institutional Good</span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-surface2 border border-line/60 mb-3.5">
          <div
            className="h-full rounded-full bg-[#1a7f37] transition-all duration-700"
            style={{ width: `${total}%` }}
          />
        </div>

        <ul className="space-y-2 text-xs">
          {parts.map((p) => (
            <li key={p.key} title={p.hint}>
              <div className="flex items-center justify-between text-[11px] mb-0.5">
                <span className="text-muted font-medium">{p.label}</span>
                <span className="font-mono font-bold text-ink/80">
                  {Math.round(p.score)}<span className="text-muted/60">/{p.max}</span>
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-surface2">
                <div
                  className="h-full rounded-full bg-[#1a7f37]/80"
                  style={{ width: `${(p.score / p.max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-3.5 pt-2.5 border-t border-line/60 flex items-center gap-1.5 text-[10.5px] text-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-[#1a7f37] shrink-0" />
          <span>Audited by KIET TPO System</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="flex flex-col justify-between">
      <div>
        {/* Header with Institutional Status */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-muted block">Audit Index</span>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-ink">Campus Trust Score</h2>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#dafbe1] px-2.5 py-0.5 text-[11px] font-bold text-[#1a7f37] border border-[#4ac26b]/40">
            <CheckCircle2 className="h-3 w-3 shrink-0" />
            <span>{tier}</span>
          </span>
        </div>

        {/* Circular Gauge + Compact Breakdown */}
        <div className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row items-center gap-4 py-1">
          <div className="shrink-0">
            <ProgressRing value={total} size={92} stroke={8} color={color}>
              <div className="text-center">
                <p className="text-2xl font-black tracking-tight text-ink leading-none">{total}</p>
                <p className="text-[9.5px] font-bold uppercase tracking-wider text-muted mt-0.5">/ 100</p>
              </div>
            </ProgressRing>
          </div>

          <ul className="w-full flex-1 space-y-2">
            {parts.map((p) => (
              <li key={p.key} title={p.hint}>
                <div className="mb-0.5 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-ink/80 text-[11.5px]">{p.label}</span>
                  <span className="font-mono text-[11px] font-bold text-muted">
                    {Math.round(p.score)}<span className="text-muted/50">/{p.max}</span>
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface2 border border-line/60">
                  <div
                    className="h-full rounded-full bg-[#1a7f37] transition-all duration-700"
                    style={{ width: `${(p.score / p.max) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Institutional Assurance Footnote */}
      <div className="mt-4 pt-3 border-t border-line/60">
        <p className="flex items-center gap-1.5 text-[10.5px] leading-relaxed text-muted font-medium">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
          <span>Audited by KIET TPO System. All marksheet and AST hashes verified.</span>
        </p>
      </div>
    </Card>
  );
}
