import type { AcademicSemester } from '@/lib/types';
import { cn } from '@/lib/utils';

/** Pill-bar chart (à la Fenco): SGPA per semester + dashed running-CGPA marker. */
export function SgpaChart({ semesters, cgpa, height = 150, compact }: { semesters: AcademicSemester[]; cgpa?: number | null; height?: number; compact?: boolean }) {
  const byNum = new Map(semesters.map((s) => [s.semesterNumber, s]));
  return (
    <div className="relative" style={{ height: height + 34 }}>
      {cgpa ? (
        <div className="pointer-events-none absolute left-0 right-0 z-10 border-t border-dashed border-accent2/70" style={{ bottom: 34 + (cgpa / 10) * height }}>
          <span className="absolute -top-2.5 right-0 rounded-full bg-accent2 px-2 py-0.5 text-[10px] font-semibold text-white">CGPA {cgpa.toFixed(2)}</span>
        </div>
      ) : null}
      <div className="flex h-full items-end justify-between gap-1.5 sm:gap-3">
        {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => {
          const s = byNum.get(n);
          const h = s ? Math.max(10, (s.sgpa / 10) * height) : 0;
          const tone = s?.auditStatus === 'FLAGGED_FRAUD' ? 'bg-bad' : s?.auditStatus === 'VERIFIED' ? 'bg-accent' : 'bg-accent/45';
          return (
            <div key={n} className="flex h-full flex-1 flex-col items-center justify-end">
              {s ? (
                <>
                  {!compact && <span className="mb-1 text-[11px] font-semibold">{s.sgpa.toFixed(2)}</span>}
                  <div className={cn('w-full max-w-[34px] rounded-full transition-all duration-700', tone)} style={{ height: h }} title={`Sem ${n}: SGPA ${s.sgpa}`} />
                </>
              ) : (
                <div className="w-full max-w-[34px] rounded-full border border-dashed border-line" style={{ height: 28 }} title={`Sem ${n}: not declared`} />
              )}
              <span className="mt-2 text-[11px] font-medium text-muted">S{n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
