import type { AcademicSemester } from '@/lib/types';
import { cn } from '@/lib/utils';

/** Clean institutional bar chart: SGPA per semester + dashed running-CGPA marker. */
export function SgpaChart({ semesters, cgpa, height = 150, compact }: { semesters: AcademicSemester[]; cgpa?: number | null; height?: number; compact?: boolean }) {
  const byNum = new Map(semesters.map((s) => [s.semesterNumber, s]));
  return (
    <div className="relative pt-3" style={{ height: height + 38 }}>
      {cgpa ? (
        <div className="pointer-events-none absolute left-0 right-0 z-10 border-t border-dashed border-[#0969da]/50" style={{ bottom: 34 + (cgpa / 10) * height }}>
          <span className="absolute -top-2.5 right-0 rounded-md bg-[#1f2328] px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs">
            CGPA {cgpa.toFixed(2)}
          </span>
        </div>
      ) : null}
      <div className="flex h-full items-end justify-between gap-1.5 sm:gap-2.5">
        {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => {
          const s = byNum.get(n);
          const h = s ? Math.max(12, (s.sgpa / 10) * height) : 0;
          const tone = s?.auditStatus === 'FLAGGED_FRAUD' ? 'bg-[#cf222e]' : s?.auditStatus === 'VERIFIED' ? 'bg-[#1f883d]' : 'bg-[#0969da]/70';
          return (
            <div key={n} className="flex h-full flex-1 flex-col items-center justify-end group">
              {s ? (
                <>
                  {!compact && <span className="mb-1 text-[11px] font-bold text-ink/90 font-mono">{s.sgpa.toFixed(2)}</span>}
                  <div
                    className={cn('w-full max-w-[32px] rounded-t-lg transition-all duration-500 group-hover:brightness-110', tone)}
                    style={{ height: h }}
                    title={`Semester ${n}: SGPA ${s.sgpa} (${s.auditStatus === 'VERIFIED' ? 'TPO Verified' : 'Self-declared'})`}
                  />
                </>
              ) : (
                <div
                  className="w-full max-w-[32px] rounded-t-lg border-t border-dashed border-line bg-surface2/40"
                  style={{ height: 24 }}
                  title={`Semester ${n}: not declared`}
                />
              )}
              <span className="mt-2 text-[11px] font-bold text-muted">S{n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
