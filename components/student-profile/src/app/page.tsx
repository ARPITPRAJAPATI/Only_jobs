'use client';

import Link from 'next/link';
import { Activity, ArrowRight, Award, BadgeCheck, Calendar, Code2, FolderGit2, GraduationCap, Hash, Lock, Mail, Pencil, Building2, Flame, ShieldCheck } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import { BadgeIcon } from '@/components/BadgeIcon';
import { GithubIcon, LinkedinIcon, XIcon } from '@/components/BrandIcons';
import { Heatmap } from '@/components/Heatmap';
import { ProjectCard } from '@/components/ProjectCard';
import { SgpaChart } from '@/components/SgpaChart';
import { useStudent } from '@/components/store';
import { TrustCard } from '@/components/TrustCard';
import { Card, CardHeader, Chip, EmptyState, PageGrid, Stat } from '@/components/ui';
import { MAX_PROJECTS, activityStats, formatDate, formatDateTime, githubDays, latestCgpa, leetcodeDays, totalBacklogs } from '@/lib/utils';

export default function OverviewPage() {
  const { student, catalog } = useStudent();
  const cgpa = latestCgpa(student);
  const backlogs = totalBacklogs(student);
  const gh = githubDays(student);
  const lc = leetcodeDays(student);
  const ghStats = activityStats(gh);
  const lcStats = activityStats(lc);
  const approved = student.badges.filter((b) => b.status === 'APPROVED');
  const verifiedSems = student.academics.filter((a) => a.auditStatus === 'VERIFIED').length;

  const socials = [
    { href: student.githubHandle && `https://github.com/${student.githubHandle}`, icon: <GithubIcon className="h-4 w-4" />, label: 'GitHub' },
    { href: student.leetcodeHandle && `https://leetcode.com/u/${student.leetcodeHandle}`, icon: <Code2 className="h-4 w-4" />, label: 'LeetCode' },
    { href: student.linkedinUrl, icon: <LinkedinIcon className="h-4 w-4" />, label: 'LinkedIn' },
    { href: student.xUrl, icon: <XIcon className="h-3.5 w-3.5" />, label: 'X' },
  ].filter((s) => s.href) as { href: string; icon: React.ReactNode; label: string }[];

  const rows: { icon: React.ReactNode; label: string; value: string }[] = [
    { icon: <Hash className="h-3.5 w-3.5" />, label: 'Roll number', value: student.rollNumber },
    { icon: <Mail className="h-3.5 w-3.5" />, label: 'Official email', value: student.email },
    { icon: <Building2 className="h-3.5 w-3.5" />, label: 'Branch', value: student.branch },
    { icon: <Calendar className="h-3.5 w-3.5" />, label: 'Semester · Batch', value: `Sem ${student.currentSemester} · ${student.batchYear}` },
  ];

  return (
    <PageGrid>
      <div className="grid gap-4 lg:gap-5 xl:grid-cols-3">
        {/* Hero */}
        <Card className="xl:col-span-2">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="shrink-0 self-center sm:self-start">
              <div className="rounded-full p-1.5" style={{ background: 'linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent2)))' }}>
                <div className="rounded-full bg-surface p-1">
                  <Avatar name={student.name} src={student.avatarUrl} size={128} />
                </div>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{student.name}</h2>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Chip tone={student.isAccountFrozen ? 'bad' : 'good'} icon={<ShieldCheck className="h-3 w-3" />}>
                      {student.isAccountFrozen ? 'Frozen' : 'Active'}
                    </Chip>
                    <Chip tone="accent" icon={<Lock className="h-3 w-3" />}>
                      College verified
                    </Chip>
                  </div>
                </div>
                <Link href="/settings" aria-label="Edit profile" className="grid h-9 w-9 place-items-center rounded-full bg-surface2 text-muted transition hover:bg-accent hover:text-accentInk">
                  <Pencil className="h-4 w-4" />
                </Link>
              </div>

              <dl className="mt-4 grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
                {rows.map((r) => (
                  <div key={r.label} className="flex items-center gap-2.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-surface2 text-muted">{r.icon}</span>
                    <div className="min-w-0">
                      <dt className="text-[11px] text-muted">{r.label}</dt>
                      <dd className="truncate font-medium">{r.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              {student.bio && <p className="mt-4 text-sm leading-relaxed text-muted">{student.bio}</p>}

              <div className="mt-4 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label} className="grid h-9 w-9 place-items-center rounded-full bg-accent text-accentInk transition hover:scale-110">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <TrustCard />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-4">
        <Stat label="CGPA" value={cgpa ? cgpa.toFixed(2) : '—'} sub={`${verifiedSems}/${student.academics.length} sems verified · ${backlogs.active} backlogs`} icon={<GraduationCap className="h-6 w-6" />} />
        <Stat label="Featured projects" value={`${student.projects.length}/${MAX_PROJECTS}`} sub={`${student.projects.filter((p) => p.isTeacherApproved).length} teacher approved`} icon={<FolderGit2 className="h-6 w-6" />} tone="accent2" />
        <Stat label="Active streak" value={`${Math.max(ghStats.current, lcStats.current)} days`} sub={`Longest ${Math.max(ghStats.longest, lcStats.longest)} days`} icon={<Flame className="h-6 w-6" />} tone="warn" />
        <Stat label="Verified badges" value={approved.length} sub={`${student.certifications.length} certifications`} icon={<BadgeCheck className="h-6 w-6" />} tone="good" />
      </div>

      <div className="grid gap-4 lg:gap-5 xl:grid-cols-3">
        {/* GitHub */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="GitHub activity"
            subtitle={`${student.codingStats?.github?.totalContributions ?? 0} contributions in the last year · synced ${formatDateTime(student.lastStatsSync)}`}
            icon={<GithubIcon className="h-4 w-4" />}
            action={
              <Link href="/coding" className="flex items-center gap-1 text-xs font-semibold text-accent">
                Details <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          {gh.length ? (
            <>
              <Heatmap days={gh} tone="accent" unit="contributions" />
              <p className="mt-3 rounded-xl bg-surface2 px-3.5 py-2.5 text-xs text-muted">
                <span className="font-semibold text-ink">Latest · </span>
                {student.codingStats?.github?.latestActivity}
              </p>
            </>
          ) : (
            <EmptyState icon={<Activity className="h-5 w-5" />} title="No GitHub data yet" body="Add your GitHub handle in Settings — stats sync every night at midnight." action={<Link href="/settings" className="text-sm font-semibold text-accent">Add handle</Link>} />
          )}
        </Card>

        {/* Academics mini */}
        <Card>
          <CardHeader title="Academics" subtitle="SGPA by semester" icon={<GraduationCap className="h-4 w-4" />} action={<Link href="/academics" className="flex items-center gap-1 text-xs font-semibold text-accent">Open <ArrowRight className="h-3.5 w-3.5" /></Link>} />
          <SgpaChart semesters={student.academics} cgpa={cgpa} height={120} compact />
        </Card>
      </div>

      <div className="grid gap-4 lg:gap-5 xl:grid-cols-3">
        {/* LeetCode */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="LeetCode submissions"
            subtitle={`${lcStats.active} active days · current streak ${lcStats.current} · longest ${lcStats.longest}`}
            icon={<Code2 className="h-4 w-4" />}
          />
          {lc.length ? (
            <>
              <Heatmap days={lc} tone="accent2" unit="submissions" />
              <p className="mt-3 rounded-xl bg-surface2 px-3.5 py-2.5 text-xs text-muted">
                <span className="font-semibold text-ink">Latest · </span>
                {student.codingStats?.leetcode?.latestActivity}
              </p>
            </>
          ) : (
            <EmptyState icon={<Code2 className="h-5 w-5" />} title="No LeetCode data yet" body="Add your LeetCode handle in Settings." />
          )}
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader title="Verified badges" subtitle={`${approved.length} approved`} icon={<BadgeCheck className="h-4 w-4" />} action={<Link href="/badges" className="flex items-center gap-1 text-xs font-semibold text-accent">All <ArrowRight className="h-3.5 w-3.5" /></Link>} />
          {approved.length ? (
            <ul className="space-y-3">
              {approved.map((b) => {
                const badge = catalog.find((c) => c.id === b.badgeId);
                if (!badge) return null;
                return (
                  <li key={b.id} className="flex items-center gap-3">
                    <BadgeIcon iconUrl={badge.iconUrl} className="!h-11 !w-11" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{badge.title}</p>
                      <p className="text-xs text-muted">Verified {formatDate(b.verifiedAt)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState icon={<BadgeCheck className="h-5 w-5" />} title="No badges yet" body="Request a badge with proof and a reviewer will verify it." action={<Link href="/badges" className="text-sm font-semibold text-accent">Browse badges</Link>} />
          )}
        </Card>
      </div>

      {/* Projects + certs */}
      <div className="grid gap-4 lg:gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader title="Featured projects" subtitle={`Top ${MAX_PROJECTS} pinned`} icon={<FolderGit2 className="h-4 w-4" />} action={<Link href="/projects" className="flex items-center gap-1 text-xs font-semibold text-accent">Manage <ArrowRight className="h-3.5 w-3.5" /></Link>} />
            {student.projects.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {student.projects.slice(0, 2).map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i} />
                ))}
              </div>
            ) : (
              <EmptyState icon={<FolderGit2 className="h-5 w-5" />} title="Pin your best work" body="Recruiters read these first." action={<Link href="/projects" className="text-sm font-semibold text-accent">Add a project</Link>} />
            )}
          </Card>
        </div>
        <Card>
          <CardHeader title="Certifications" subtitle={`${student.certifications.length} on record`} icon={<Award className="h-4 w-4" />} action={<Link href="/certifications" className="flex items-center gap-1 text-xs font-semibold text-accent">All <ArrowRight className="h-3.5 w-3.5" /></Link>} />
          <ul className="space-y-3">
            {student.certifications.slice(0, 4).map((c) => (
              <li key={c.id} className="flex items-start gap-3 rounded-2xl bg-surface2 p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface text-accent">
                  <Award className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{c.title}</p>
                  <p className="text-xs text-muted">
                    {c.issuingOrg} · {formatDate(c.issueDate, { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </li>
            ))}
            {!student.certifications.length && <p className="text-sm text-muted">No certifications added.</p>}
          </ul>
        </Card>
      </div>
    </PageGrid>
  );
}
