'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { Day } from '@/lib/utils';

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;
const LEFT = 24;
const TOP = 18;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function level(count: number, max: number) {
  if (count <= 0) return 0;
  const r = count / max;
  return r > 0.75 ? 4 : r > 0.5 ? 3 : r > 0.25 ? 2 : 1;
}

const GREEN_PALETTE = ['#EBEDF0', '#9BE9A8', '#40C463', '#30A14E', '#216E39'];
const ORANGE_PALETTE = ['#EBEDF0', '#FED7AA', '#FB923C', '#EA580C', '#C2410C'];
const BLUE_PALETTE = ['#EBEDF0', '#BAE6FD', '#60A5FA', '#2563EB', '#1D4ED8'];

export function Heatmap({
  days,
  tone = 'accent',
  unit = 'contributions',
}: {
  days: Day[];
  tone?: 'accent' | 'accent2' | 'github' | 'leetcode';
  unit?: string;
}) {
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
        title: `${d.count} ${unit} on ${dt.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          timeZone: 'UTC',
        })}`,
      });
    });
    return { cells, weeks: w + 1, labels };
  }, [days, unit]);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollLeft = scroller.current.scrollWidth;
  }, [days]);

  const width = LEFT + weeks * STEP;
  const height = TOP + 7 * STEP;

  const palette =
    tone === 'github' || tone === 'accent'
      ? GREEN_PALETTE
      : tone === 'leetcode' || tone === 'accent2'
      ? ORANGE_PALETTE
      : BLUE_PALETTE;

  const fill = (lvl: number) => {
    if (lvl === 0) return 'rgba(0, 0, 0, 0.06)';
    return palette[lvl] ?? palette[4];
  };

  return (
    <div>
      <div ref={scroller} className="overflow-x-auto pb-2 scrollbar-none">
        <svg width={width} height={height} role="img" aria-label={`Activity calendar, ${unit}`} className="block">
          {labels.map((l) => (
            <text key={l.x} x={l.x} y={11} fontSize="9.5" fontWeight="600" style={{ fill: 'rgb(var(--muted))' }}>
              {l.text}
            </text>
          ))}
          {['Mon', 'Wed', 'Fri'].map((t, i) => (
            <text key={t} x={0} y={TOP + (i * 2 + 1) * STEP + 9} fontSize="9" fontWeight="600" style={{ fill: 'rgb(var(--muted))' }}>
              {t}
            </text>
          ))}
          {cells.map((c, i) => (
            <rect key={i} x={c.x} y={c.y} width={CELL} height={CELL} rx={2.5} style={{ fill: fill(c.lvl) }}>
              <title>{c.title}</title>
            </rect>
          ))}
        </svg>
      </div>
      <div className="mt-2 flex items-center justify-end gap-1.5 text-[11px] font-semibold text-muted">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className="inline-block h-2.5 w-2.5 rounded-[2.5px] border border-black/5" style={{ background: fill(l) }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
