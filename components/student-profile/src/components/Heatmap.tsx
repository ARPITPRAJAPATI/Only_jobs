'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { Day } from '@/lib/utils';

const CELL = 12;
const GAP = 3;
const STEP = CELL + GAP;
const LEFT = 26;
const TOP = 18;
const LEVELS = [0, 0.22, 0.42, 0.68, 0.95];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function level(count: number, max: number) {
  if (count <= 0) return 0;
  const r = count / max;
  return r > 0.75 ? 4 : r > 0.5 ? 3 : r > 0.25 ? 2 : 1;
}

/** GitHub-style yearly calendar. Colours come from theme tokens, so it re-themes automatically. */
export function Heatmap({ days, tone = 'accent', unit = 'contributions' }: { days: Day[]; tone?: 'accent' | 'accent2'; unit?: string }) {
  const scroller = useRef<HTMLDivElement>(null);

  const { cells, weeks, labels } = useMemo(() => {
    const max = Math.max(1, ...days.map((d) => d.count));
    let w = 0;
    let lastMonth = -1;
    let lastLabelW = -10;
    const cells: { x: number; y: number; lvl: number; title: string }[] = [];
    const labels: { x: number; text: string }[] = [];
    days.forEach((d, i) => {
      const dt = new Date(d.date + 'T00:00:00Z');
      const dow = dt.getUTCDay();
      if (i > 0 && dow === 0) w++;
      const m = dt.getUTCMonth();
      if (m !== lastMonth && w - lastLabelW >= 3) {
        labels.push({ x: LEFT + w * STEP, text: MONTHS[m] });
        lastLabelW = w;
      }
      if (m !== lastMonth) lastMonth = m;
      cells.push({
        x: LEFT + w * STEP,
        y: TOP + dow * STEP,
        lvl: level(d.count, max),
        title: `${d.count} ${unit} on ${dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}`,
      });
    });
    return { cells, weeks: w + 1, labels };
  }, [days, unit]);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollLeft = scroller.current.scrollWidth;
  }, [days]);

  const width = LEFT + weeks * STEP;
  const height = TOP + 7 * STEP;
  const fill = (lvl: number) => (lvl === 0 ? 'rgb(var(--muted) / .14)' : `rgb(var(--${tone}) / ${LEVELS[lvl]})`);

  return (
    <div>
      <div ref={scroller} className="overflow-x-auto pb-2">
        <svg width={width} height={height} role="img" aria-label={`Activity calendar, ${unit}`} className="block">
          {labels.map((l) => (
            <text key={l.x} x={l.x} y={10} fontSize="10" style={{ fill: 'rgb(var(--muted))' }}>
              {l.text}
            </text>
          ))}
          {['Mon', 'Wed', 'Fri'].map((t, i) => (
            <text key={t} x={0} y={TOP + (i * 2 + 1) * STEP + 10} fontSize="9" style={{ fill: 'rgb(var(--muted))' }}>
              {t}
            </text>
          ))}
          {cells.map((c, i) => (
            <rect key={i} x={c.x} y={c.y} width={CELL} height={CELL} rx={3} style={{ fill: fill(c.lvl) }}>
              <title>{c.title}</title>
            </rect>
          ))}
        </svg>
      </div>
      <div className="mt-1 flex items-center justify-end gap-1.5 text-[10px] text-muted">
        Less
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: fill(l) }} />
        ))}
        More
      </div>
    </div>
  );
}
