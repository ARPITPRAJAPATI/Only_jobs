'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Activity, CalendarClock, Code2, Database, ExternalLink, Flame, Gauge, GitCommitHorizontal, Server, Trophy } from 'lucide-react';
import { GithubIcon } from '@/components/BrandIcons';
import { Heatmap } from '@/components/Heatmap';
import { useStudent } from '@/components/store';
import { Card, CardHeader, Chip, EmptyState, PageGrid, Stat } from '@/components/ui';
import { activityStats, cn, formatDateTime, githubDays, leetcodeDays, type Day } from '@/lib/utils';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function monthly(days: Day[]) {
  const map = new Map<string, number>();
  for (const d of days) {
    const k = d.date.slice(0, 7);
    map.set(k, (map.get(k) ?? 0) + d.count);
  }
  return [...map.entries()].slice(-12).map(([k, v]) => ({ label: MONTHS[Number(k.slice(5, 7)) - 1], value: v }));
}

export default function CodingPage() {
  const { student } = useStudent();
  const gh = useMemo(() => githubDays(student), [student]);
  const lc = useMemo(() => leetcodeDays(student), [student]);
  const ghS = activityStats(gh);
  const lcS = activityStats(lc);
  const bars = useMemo(() => monthly(gh), [gh]);
  const maxBar = Math.max(1, ...bars.map((b) => b.value));

  const handles = [
    { name: 'GitHub', handle: student.githubHandle, url: (h: string) => `https://github.com/${h}`, icon: <GithubIcon className="h-4 w-4" />, synced: true },
    { name: 'LeetCode', handle: student.leetcodeHandle, url: (h: string) => `https://leetcode.com/u/${h}`, icon: <Code2 className="h-4 w-4" />, synced: true },
    { name: 'Codeforces', handle: student.codeforcesHandle, url: (h: string) => `https://codeforces.com/profile/${h}`, icon: <Trophy className="h-4 w-4" />, synced: false },
    { name: 'CodeChef', handle: student.codechefHandle, url: (h: string) => `https://www.codechef.com/users/${h}`, icon: <Trophy className="h-4 w-4" />, synced: false },
    { name: 'GeeksforGeeks', handle: student.gfgHandle, url: (h: string) => `https://www.geeksforgeeks.org/user/${h}`, icon: <Code2 className="h-4 w-4" />, synced: false },
  ];

  return (
    <PageGrid>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-4">
        <Stat label="GitHub contributions" value={student.codingStats?.github?.totalContributions ?? 0} sub="Last 12 months" icon={<GitCommitHorizontal className="h-6 w-6" />} />
        <Stat label="Current streak" value={`${Math.max(ghS.current, lcS.current)} days`} sub={`GitHub ${ghS.current}d · LeetCode ${lcS.current}d`} icon={<Flame className="h-6 w-6" />} tone="warn" />
        <Stat label="Longest streak" value={`${Math.max(ghS.longest, lcS.longest)} days`} sub={`GitHub ${ghS.longest}d · LeetCode ${lcS.longest}d`} icon={<Gauge className="h-6 w-6" />} tone="accent2" />
        <Stat label="LeetCode submissions" value={lcS.total} sub={`${lcS.active} active days`} icon={<Code2 className="h-6 w-6" />} tone="good" />
      </div>

      <div className="grid gap-4 lg:gap-5 xl:grid-cols-3">
        <div className="grid gap-4 lg:gap-5 xl:col-span-2">
          <Card>
            <CardHeader title="GitHub contribution calendar" subtitle={`${ghS.active} active days · ${ghS.total} contributions`} icon={<GithubIcon className="h-4 w-4" />} action={student.githubHandle ? <Chip tone="accent">@{student.githubHandle}</Chip> : undefined} />
            {gh.length ? (
              <>
                <Heatmap days={gh} tone="accent" unit="contributions" />
                <p className="mt-3 rounded-xl bg-surface2 px-3.5 py-2.5 text-xs text-muted">
                  <span className="font-semibold text-ink">Latest activity · </span>
                  {student.codingStats?.github?.latestActivity}
                </p>
                <div className="mt-5">
                  <p className="mb-3 text-xs font-medium text-muted">Contributions per month</p>
                  <div className="flex h-28 items-end gap-2">
                    {bars.map((b, i) => (
                      <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1.5" title={`${b.label}: ${b.value}`}>
                        <div className={cn('w-full max-w-[28px] rounded-full', i === bars.length - 1 ? 'bg-accent' : 'bg-accent/40')} style={{ height: `${Math.max(8, (b.value / maxBar) * 84)}px` }} />
                        <span className="text-[10px] text-muted">{b.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <EmptyState icon={<Activity className="h-5 w-5" />} title="No GitHub data" body="Add your handle in Settings. The first sync runs at the next midnight." action={<Link href="/settings" className="text-sm font-semibold text-accent">Open settings</Link>} />
            )}
          </Card>

          <Card>
            <CardHeader title="LeetCode submission calendar" subtitle={`${lcS.active} active days · longest streak ${lcS.longest}`} icon={<Code2 className="h-4 w-4" />} action={student.leetcodeHandle ? <Chip tone="accent">@{student.leetcodeHandle}</Chip> : undefined} />
            {lc.length ? (
              <>
                <Heatmap days={lc} tone="accent2" unit="submissions" />
                <p className="mt-3 rounded-xl bg-surface2 px-3.5 py-2.5 text-xs text-muted">
                  <span className="font-semibold text-ink">Latest accepted · </span>
                  {student.codingStats?.leetcode?.latestActivity}
                </p>
              </>
            ) : (
              <EmptyState icon={<Code2 className="h-5 w-5" />} title="No LeetCode data" body="Add your LeetCode handle in Settings." action={<Link href="/settings" className="text-sm font-semibold text-accent">Open settings</Link>} />
            )}
          </Card>
        </div>

        <div className="grid content-start gap-4 lg:gap-5">
          <Card>
            <CardHeader title="Coding handles" subtitle="Edit in Settings" icon={<Trophy className="h-4 w-4" />} />
            <ul className="space-y-2.5">
              {handles.map((h) => (
                <li key={h.name} className="flex items-center gap-3 rounded-2xl bg-surface2 p-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface text-accent">{h.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{h.name}</p>
                    <p className="truncate text-xs text-muted">{h.handle ? `@${h.handle}` : 'Not linked'}</p>
                  </div>
                  {h.handle ? (
                    <a href={h.url(h.handle)} target="_blank" rel="noopener noreferrer" aria-label={`Open ${h.name} profile`} className="text-muted hover:text-accent">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                  {h.handle && (h.synced ? <Chip tone="good">Synced</Chip> : <Chip>Link only</Chip>)}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="How syncing works" icon={<Server className="h-4 w-4" />} />
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-accentSoft p-3.5">
              <CalendarClock className="h-5 w-5 text-accent" />
              <div className="text-sm">
                <p className="font-semibold text-accent">Last synced</p>
                <p className="text-xs text-ink/70">{formatDateTime(student.lastStatsSync)} · next at 12:00 AM</p>
              </div>
            </div>
            <ul className="space-y-3 text-xs text-muted">
              <li className="flex gap-3">
                <Database className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  <b className="text-ink">Zero live API hits.</b> This page reads cached stats from the database, so it loads in under 10 ms.
                </span>
              </li>
              <li className="flex gap-3">
                <Server className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  <b className="text-ink">Nightly queue.</b> A background worker processes students at a controlled pace to avoid GitHub / LeetCode rate limits.
                </span>
              </li>
              <li className="flex gap-3">
                <Activity className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  <b className="text-ink">Codeforces, CodeChef & GFG</b> are shown as profile links for now.
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </PageGrid>
  );
}
