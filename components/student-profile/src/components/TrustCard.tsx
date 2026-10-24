'use client';

import { Info } from 'lucide-react';
import { trustBreakdown } from '@/lib/utils';
import { useStudent } from './store';
import { Card, CardHeader, ProgressRing } from './ui';

export function TrustCard() {
  const { student } = useStudent();
  const { total, parts } = trustBreakdown(student);
  const color = student.isAccountFrozen ? 'bad' : total >= 75 ? 'good' : total >= 45 ? 'accent' : 'warn';

  return (
    <Card className="flex flex-col">
      <CardHeader title="Trust score" subtitle="How recruiters see your credibility" />
      <div className="flex items-center gap-5">
        <ProgressRing value={total} size={104} stroke={10} color={color}>
          <div className="text-center">
            <p className="text-2xl font-extrabold leading-none">{total}</p>
            <p className="text-[10px] text-muted">/ 100</p>
          </div>
        </ProgressRing>
        <ul className="flex-1 space-y-2.5">
          {parts.map((p) => (
            <li key={p.key} title={p.hint}>
              <div className="mb-1 flex justify-between text-[11px]">
                <span className="font-medium">{p.label}</span>
                <span className="text-muted">
                  {Math.round(p.score)}/{p.max}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted/15">
                <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${(p.score / p.max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-muted">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Illustrative breakdown computed in the browser. Verified data (audits, teacher approvals, badges) raises it; a fraud flag caps it.
      </p>
    </Card>
  );
}
