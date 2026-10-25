import clsx, { type ClassValue } from 'clsx';
import type { Project, ProjectVerification, Student } from './types';

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const MAX_PROJECTS = 6;

export function uid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function formatDate(iso?: string | null, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', ...opts });
}

export function formatDateTime(iso?: string | null) {
  if (!iso) return 'Never';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Never';
  return d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function isHttpUrl(v: string) {
  try {
    const u = new URL(v);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/* ---------- Academics ---------- */
export function latestCgpa(student: Student): number | null {
  if (!student.academics.length) return null;
  const last = [...student.academics].sort((a, b) => b.semesterNumber - a.semesterNumber)[0];
  return last.cgpaCumulative;
}

export function totalBacklogs(student: Student) {
  const sorted = [...student.academics].sort((a, b) => b.semesterNumber - a.semesterNumber);
  // active backlogs are cumulative as of the latest semester; dead = ever cleared
  return {
    active: sorted[0]?.activeBacklogs ?? 0,
    dead: student.academics.reduce((s, a) => s + a.deadBacklogs, 0),
  };
}

export function meanSgpa(sems: { sgpa: number }[]) {
  if (!sems.length) return 0;
  return Math.round((sems.reduce((s, x) => s + x.sgpa, 0) / sems.length) * 100) / 100;
}

/* ---------- Projects ---------- */
export function projectVerification(p: Project): ProjectVerification {
  if (p.isTeacherApproved) return 'TEACHER_APPROVED';
  if (p.aiPlagScore !== null && p.aiPlagScore !== undefined) return 'AI_ANALYZED';
  return 'UNVERIFIED';
}

/* ---------- Coding activity ---------- */
export interface Day {
  date: string;
  count: number;
}

export function githubDays(student: Student): Day[] {
  const weeks = student.codingStats?.github?.graphWeeks ?? [];
  return weeks.flatMap((w) => w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })));
}

export function leetcodeDays(student: Student): Day[] {
  const cal = student.codingStats?.leetcode?.submissionCalendar;
  if (!cal) return [];
  const gh = githubDays(student);
  const endDate = gh.length ? gh[gh.length - 1].date : new Date().toISOString().slice(0, 10);
  const end = Date.parse(endDate + 'T00:00:00Z');
  const map = new Map<string, number>();
  for (const [ts, count] of Object.entries(cal)) {
    map.set(new Date(Number(ts) * 1000).toISOString().slice(0, 10), count);
  }
  const out: Day[] = [];
  for (let i = 364; i >= 0; i--) {
    const date = new Date(end - i * 86400000).toISOString().slice(0, 10);
    out.push({ date, count: map.get(date) ?? 0 });
  }
  return out;
}

export function activityStats(days: Day[]) {
  let longest = 0;
  let run = 0;
  let total = 0;
  let active = 0;
  for (const d of days) {
    total += d.count;
    if (d.count > 0) {
      active++;
      run++;
      longest = Math.max(longest, run);
    } else run = 0;
  }
  // current streak: walk back from the last day (allow today to be empty)
  let current = 0;
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  for (; i >= 0 && days[i].count > 0; i--) current++;
  return { total, active, longest, current };
}

/* ---------- Trust score (illustrative — the real one is computed server-side) ---------- */
export interface TrustPart {
  key: string;
  label: string;
  score: number;
  max: number;
  hint: string;
}

export function trustBreakdown(s: Student): { total: number; parts: TrustPart[] } {
  const declared = s.academics.length;
  const verified = s.academics.filter((a) => a.auditStatus === 'VERIFIED').length;
  const selfDeclared = s.academics.filter((a) => a.auditStatus === 'SELF_DECLARED').length;
  const academics = declared ? ((verified + selfDeclared * 0.4) / declared) * 30 : 0;

  const projectWeight = s.projects.reduce((sum, p) => {
    const v = projectVerification(p);
    return sum + (v === 'TEACHER_APPROVED' ? 1 : v === 'AI_ANALYZED' ? 0.5 : 0.2);
  }, 0);
  const projects = Math.min(projectWeight / 3, 1) * 25;

  const approvedBadges = s.badges.filter((b) => b.status === 'APPROVED').length;
  const badges = Math.min(approvedBadges / 3, 1) * 15;

  const coding = (s.codingStats?.github ? 10 : 0) + (s.codingStats?.leetcode ? 10 : 0);

  const certs = Math.min(s.certifications.length / 2, 1) * 10;

  const parts: TrustPart[] = [
    { key: 'academics', label: 'Academics', score: academics, max: 30, hint: 'Verified semesters count fully, self-declared at 40%' },
    { key: 'projects', label: 'Projects', score: projects, max: 25, hint: 'Teacher-approved > AI-analyzed > unverified' },
    { key: 'coding', label: 'Coding activity', score: coding, max: 20, hint: 'GitHub + LeetCode synced nightly' },
    { key: 'badges', label: 'Badges', score: badges, max: 15, hint: '3 approved badges for full marks' },
    { key: 'certs', label: 'Certifications', score: certs, max: 10, hint: '2 certifications for full marks' },
  ];
  let total = Math.round(parts.reduce((x, p) => x + p.score, 0));
  if (s.isAccountFrozen) total = Math.min(total, 10);
  return { total, parts };
}
