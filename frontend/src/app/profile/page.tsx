'use client';

import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  Flame,
  FolderGit2,
  GraduationCap,
  Mail,
  Pencil,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { ProfileSubnav } from '@/components/ProfileSubnav';
import { Avatar } from '@/components/Avatar';
import { BadgeIcon } from '@/components/BadgeIcon';
import { GithubIcon, LinkedinIcon, XIcon } from '@/components/BrandIcons';
import { Heatmap } from '@/components/Heatmap';
import { ProjectCard } from '@/components/ProjectCard';
import { SgpaChart } from '@/components/SgpaChart';
import { useStudent } from '@/components/store';
import { useToast } from '@/components/toast';
import { TrustCard } from '@/components/TrustCard';
import { EmptyState, Stat } from '@/components/ui';
import {
  MAX_PROJECTS,
  activityStats,
  formatDate,
  formatDateTime,
  githubDays,
  latestCgpa,
  leetcodeDays,
  totalBacklogs,
} from '@/lib/utils';

export default function OverviewPage() {
  const { student, catalog } = useStudent();
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const cgpa = latestCgpa(student);
  const backlogs = totalBacklogs(student);
  const gh = githubDays(student);
  const lc = leetcodeDays(student);
  const ghStats = activityStats(gh);
  const lcStats = activityStats(lc);
  const approved = student.badges.filter((b) => b.status === 'APPROVED');
  const verifiedSems = student.academics.filter((a) => a.auditStatus === 'VERIFIED').length;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(student.email);
      setCopied(true);
      toast('Official email copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast('Failed to copy email', 'error');
    }
  };

  const socials = [
    {
      href: student.githubHandle && `https://github.com/${student.githubHandle}`,
      icon: <GithubIcon className="h-3.5 w-3.5" />,
      label: 'GitHub',
      handle: student.githubHandle ? `@${student.githubHandle}` : '',
    },
    {
      href: student.leetcodeHandle && `https://leetcode.com/u/${student.leetcodeHandle}`,
      icon: <Code2 className="h-3.5 w-3.5" />,
      label: 'LeetCode',
      handle: student.leetcodeHandle ? `@${student.leetcodeHandle}` : '',
    },
    {
      href: student.codeforcesHandle && `https://codeforces.com/profile/${student.codeforcesHandle}`,
      icon: <Code2 className="h-3.5 w-3.5" />,
      label: 'Codeforces',
      handle: student.codeforcesHandle ? `@${student.codeforcesHandle}` : '',
    },
    {
      href: student.codechefHandle && `https://www.codechef.com/users/${student.codechefHandle}`,
      icon: <Code2 className="h-3.5 w-3.5" />,
      label: 'CodeChef',
      handle: student.codechefHandle ? `@${student.codechefHandle}` : '',
    },
    {
      href: student.gfgHandle && `https://www.geeksforgeeks.org/user/${student.gfgHandle}`,
      icon: <Code2 className="h-3.5 w-3.5" />,
      label: 'GeeksforGeeks',
      handle: student.gfgHandle ? `@${student.gfgHandle}` : '',
    },
    {
      href: student.linkedinUrl,
      icon: <LinkedinIcon className="h-3.5 w-3.5" />,
      label: 'LinkedIn',
      handle: 'LinkedIn',
    },
    {
      href: student.xUrl,
      icon: <XIcon className="h-3 w-3" />,
      label: 'X',
      handle: student.xUrl?.split('/').pop() ? `@${student.xUrl.split('/').pop()}` : 'X',
    },
  ].filter((s) => s.href) as { href: string; icon: React.ReactNode; label: string; handle: string }[];

  return (
    <div className="pb-16 animate-fade-in">
      {/* GitHub Primer Underline Subnav */}
      <ProfileSubnav />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2-Column Responsive Layout: Left Sticky Identity Sidebar + Right Expansive Content Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Student Identity & Bio (~290px wide on lg) */}
        <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 space-y-5">
          {/* Avatar with TPO Verification Badge */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start gap-4">
            <div className="relative inline-block shrink-0">
              <Avatar
                name={student.name}
                src={student.avatarUrl}
                size={140}
                className="ring-4 ring-surface shadow-xs bg-surface text-3xl border border-line"
              />
              <span
                className="absolute bottom-1 right-1 grid h-7 w-7 place-items-center rounded-full bg-[#1a7f37] text-white shadow-sm ring-3 ring-surface"
                title="TPO Verified Student Identity"
              >
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>

            {/* Name & Handle */}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-ink font-sans">
                {student.name}
              </h1>
              <p className="text-sm font-mono text-muted mt-0.5">
                @{student.githubHandle || 'student'} · PRN: {student.rollNumber}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col gap-2 pt-1">
            <Link
              href="/settings"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-line bg-surface hover:bg-surface2 px-3 py-1.5 text-xs font-semibold text-ink transition-all active:scale-[.98] shadow-2xs"
            >
              <Pencil className="h-3.5 w-3.5 text-muted" />
              <span>Edit profile</span>
            </Link>
            <button
              onClick={handleCopyEmail}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-line bg-surface hover:bg-surface2 px-3 py-1.5 text-xs font-semibold text-ink transition-all active:scale-[.98] shadow-2xs"
            >
              <Copy className="h-3.5 w-3.5 text-muted" />
              <span>{copied ? 'Copied to clipboard!' : 'Copy official email'}</span>
            </button>
          </div>

          {/* Unboxed Honest Bio (Breathe!) */}
          {student.bio && (
            <p className="text-[13.5px] leading-relaxed text-ink/85 font-normal pt-1">
              {student.bio}
            </p>
          )}

          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#dafbe1] px-2.5 py-0.5 text-[11px] font-semibold text-[#1a7f37] border border-[#4ac26b]/40">
              <CheckCircle2 className="h-3 w-3" />
              <span>TPO Verified</span>
            </span>
            <span className="rounded-full bg-surface2 px-2.5 py-0.5 text-[11px] font-medium text-muted border border-line">
              0 Active Backlogs
            </span>
          </div>

          {/* Key Academic & Department Details */}
          <ul className="space-y-2.5 text-xs text-ink/90 border-t border-line/70 pt-4">
            <li className="flex items-center gap-2.5">
              <Building2 className="h-4 w-4 text-muted shrink-0" />
              <span>KIET Group of Institutions · Autonomous</span>
            </li>
            <li className="flex items-center gap-2.5">
              <GraduationCap className="h-4 w-4 text-muted shrink-0" />
              <span>B.Tech in {student.branch} · Sem {student.currentSemester}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-muted shrink-0" />
              <span>Batch {student.batchYear}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-muted shrink-0" />
              <span className="font-mono truncate">{student.email}</span>
            </li>
          </ul>

          {/* Developer Handles */}
          <div className="flex flex-wrap items-center gap-1.5 border-t border-line/70 pt-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface hover:bg-surface2 px-2.5 py-1 text-xs font-semibold text-ink/85 transition-all shadow-2xs"
                title={s.handle ? `${s.label} (${s.handle})` : s.label}
              >
                <span className="text-[#0969da]">{s.icon}</span>
                <span className="text-[11.5px]">{s.label}</span>
              </a>
            ))}
          </div>

          {/* Compact Institutional Trust Card */}
          <div className="pt-2">
            <TrustCard compact />
          </div>
        </aside>

        {/* Right Column: Expansive Workspace Canvas (~950px on xl) */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-7">
          {/* Typography-led Performance KPI Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Stat
              label="Cumulative CGPA"
              value={cgpa ? cgpa.toFixed(2) : '—'}
              sub={`${verifiedSems}/${student.academics.length} sems verified`}
              icon={<GraduationCap className="h-4 w-4" />}
              tone="accent"
            />
            <Stat
              label="Verified Projects"
              value={`${student.projects.length}/${MAX_PROJECTS}`}
              sub="Teacher approved AST"
              icon={<FolderGit2 className="h-4 w-4" />}
              tone="accent2"
            />
            <Stat
              label="Coding Streak"
              value={`${Math.max(ghStats.current, lcStats.current)} days`}
              sub={`Longest ${Math.max(ghStats.longest, lcStats.longest)}d`}
              icon={<Flame className="h-4 w-4" />}
              tone="warn"
            />
            <Stat
              label="Credential Badges"
              value={approved.length}
              sub={`${student.certifications.length} verified certs`}
              icon={<BadgeCheck className="h-4 w-4" />}
              tone="good"
            />
          </div>

          {/* Pinned Projects Section (Authentic GitHub Pinned Repos) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
                <span>Pinned Repositories</span>
                <span className="text-xs text-muted font-normal">({student.projects.length} verified)</span>
              </h2>
              <Link
                href="/projects"
                className="text-xs font-medium text-[#0969da] hover:underline inline-flex items-center gap-1"
              >
                <span>Manage all projects</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {student.projects.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {student.projects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FolderGit2 className="h-5 w-5" />}
                title="No projects pinned"
                body="Pin your best engineering work with a live demo and audited code repository."
                action={
                  <Link href="/projects" className="text-xs font-bold text-[#0969da] hover:underline">
                    Add a project
                  </Link>
                }
              />
            )}
          </section>

          {/* GitHub Activity Calendar & Contribution Heatmap */}
          <section className="rounded-xl border border-line bg-surface p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <GithubIcon className="h-4 w-4 text-[#0969da]" />
                <div>
                  <h3 className="text-sm font-bold text-ink">
                    {student.codingStats?.github?.totalContributions ?? 0} verified contributions in past year
                  </h3>
                  <p className="text-xs text-muted">
                    Synced nightly via KIET TPO webhooks · Last update {formatDateTime(student.lastStatsSync)}
                  </p>
                </div>
              </div>
              <Link href="/coding" className="text-xs font-medium text-[#0969da] hover:underline self-start sm:self-auto">
                Detailed metrics &rarr;
              </Link>
            </div>

            {gh.length ? (
              <>
                <div className="pt-1 overflow-x-auto">
                  <Heatmap days={gh} tone="github" unit="contributions" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-line/70 bg-surface2/50 px-3 py-2 text-xs">
                  <span className="text-muted font-medium truncate">
                    <span className="font-semibold text-ink">Latest commit: </span>
                    {student.codingStats?.github?.latestActivity}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#0969da] bg-[#ddf4ff] border border-[#54aeff]/40 px-2 py-0.5 rounded-md shrink-0">
                    main
                  </span>
                </div>
              </>
            ) : (
              <EmptyState
                icon={<Activity className="h-5 w-5" />}
                title="No GitHub sync yet"
                body="Link your GitHub username in Settings — commits sync nightly via campus webhook."
                action={<Link href="/settings" className="text-xs font-bold text-[#0969da] hover:underline">Connect GitHub</Link>}
              />
            )}
          </section>

          {/* LeetCode Problem Solving Heatmap */}
          <section className="rounded-xl border border-line bg-surface p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Code2 className="h-4 w-4 text-[#9a6700]" />
                <div>
                  <h3 className="text-sm font-bold text-ink">
                    LeetCode Problem Solving ({lcStats.active} active practice days)
                  </h3>
                  <p className="text-xs text-muted">
                    Current streak: {lcStats.current} days · Longest streak: {lcStats.longest} days
                  </p>
                </div>
              </div>
              {student.leetcodeHandle && (
                <a
                  href={`https://leetcode.com/u/${student.leetcodeHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-[#0969da] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>@{student.leetcodeHandle}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {lc.length ? (
              <>
                <div className="pt-1 overflow-x-auto">
                  <Heatmap days={lc} tone="leetcode" unit="submissions" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-line/70 bg-surface2/50 px-3 py-2 text-xs">
                  <span className="text-muted font-medium truncate">
                    <span className="font-semibold text-ink">Recent solution: </span>
                    {student.codingStats?.leetcode?.latestActivity}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#9a6700] bg-[#fff8c5] border border-[#d4a72c]/40 px-2 py-0.5 rounded-md shrink-0">
                    Accepted
                  </span>
                </div>
              </>
            ) : (
              <EmptyState
                icon={<Code2 className="h-5 w-5" />}
                title="No LeetCode profile linked"
                body="Connect your LeetCode handle in Settings to showcase DSA consistency."
                action={<Link href="/settings" className="text-xs font-bold text-[#0969da] hover:underline">Connect LeetCode</Link>}
              />
            )}
          </section>

          {/* Academics SGPA Trajectory & Endorsements Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SGPA Trajectory */}
            <div className="rounded-xl border border-line bg-surface p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-[#0969da]" />
                    <h3 className="text-sm font-bold text-ink">SGPA Trajectory</h3>
                  </div>
                  <Link href="/academics" className="text-xs font-medium text-[#0969da] hover:underline">
                    All semesters &rarr;
                  </Link>
                </div>
                <p className="text-xs text-muted mb-3">
                  Consistent cumulative record across {student.academics.length} semesters.
                </p>
                <SgpaChart semesters={student.academics} cgpa={cgpa} height={140} compact />
              </div>
            </div>

            {/* Badges & Certifications */}
            <div className="rounded-xl border border-line bg-surface p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-[#1a7f37]" />
                    <h3 className="text-sm font-bold text-ink">Faculty Endorsements</h3>
                  </div>
                  <Link href="/badges" className="text-xs font-medium text-[#0969da] hover:underline">
                    Catalog &rarr;
                  </Link>
                </div>

                {approved.length ? (
                  <ul className="space-y-2">
                    {approved.map((b) => {
                      const badge = catalog.find((c) => c.id === b.badgeId);
                      if (!badge) return null;
                      return (
                        <li key={b.id} className="flex items-center gap-2.5 rounded-lg border border-line/70 bg-surface2/40 p-2 hover:bg-surface2 transition-all">
                          <BadgeIcon iconUrl={badge.iconUrl} className="!h-8 !w-8 rounded-md shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-ink">{badge.title}</p>
                            <p className="text-[10.5px] text-muted font-medium">Verified {formatDate(b.verifiedAt)}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-xs text-muted">No faculty badges endorsed yet.</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-line/60">
                <Link href="/certifications" className="flex items-center justify-between text-xs font-medium text-muted hover:text-ink">
                  <span>{student.certifications.length} verified professional certifications</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
  );
}
