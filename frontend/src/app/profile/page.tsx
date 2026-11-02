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
    <div className="min-h-screen pb-16 animate-fade-in relative overflow-x-hidden">

      {/* ── Background: true horizontally rotated (landscape) vortex image ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/profile-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Dark glassmorphic scrim on top of bg */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-black/55 backdrop-blur-[1px]"
      />

      {/* ── All UI above the bg ── */}
      <div className="relative z-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

          {/* ════════════════════════════════════
              HORIZONTAL PROFILE HERO BANNER
          ════════════════════════════════════ */}
          <div className="rounded-2xl border border-white/[0.14] bg-white/[0.07] backdrop-blur-2xl shadow-[0_8px_48px_rgba(0,0,0,0.45)] overflow-hidden">

            {/* Top strip: avatar | name & meta | actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 px-7 pt-7 pb-5">

              {/* Avatar */}
              <div className="relative shrink-0 self-start sm:self-center">
                <Avatar
                  name={student.name}
                  src={student.avatarUrl}
                  size={100}
                  className="ring-[3px] ring-white/25 shadow-xl text-2xl border border-white/10 rounded-full"
                />
                <span
                  className="absolute -bottom-1 -right-1 grid h-[26px] w-[26px] place-items-center rounded-full bg-[#238636] text-white shadow ring-2 ring-black/50"
                  title="TPO Verified Student Identity"
                >
                  <CheckCircle2 className="h-[14px] w-[14px]" />
                </span>
              </div>

              {/* Identity block */}
              <div className="flex-1 min-w-0 space-y-2">
                {/* Name + badges inline */}
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[1.6rem] font-extrabold tracking-tight text-white leading-none">
                    {student.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#238636]/25 px-2.5 py-[3px] text-[11px] font-semibold text-[#3fb950] border border-[#3fb950]/30">
                    <CheckCircle2 className="h-3 w-3" />
                    TPO Verified
                  </span>
                  <span className="rounded-full bg-white/[0.08] px-2.5 py-[3px] text-[11px] font-medium text-white/55 border border-white/10">
                    {backlogs.active} Active Backlogs
                  </span>
                </div>

                {/* Handle + PRN */}
                <p className="text-[13px] font-mono text-white/50 leading-none">
                  @{student.githubHandle || 'student'}
                  <span className="mx-2 text-white/20">·</span>
                  PRN: {student.rollNumber}
                </p>

                {/* Meta pills row */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-0.5">
                  <span className="flex items-center gap-1.5 text-[12.5px] text-white/60">
                    <Building2 className="h-3.5 w-3.5 text-white/30 shrink-0" />
                    KIET Group of Institutions
                  </span>
                  <span className="flex items-center gap-1.5 text-[12.5px] text-white/60">
                    <GraduationCap className="h-3.5 w-3.5 text-white/30 shrink-0" />
                    B.Tech · {student.branch} · Sem {student.currentSemester}
                  </span>
                  <span className="flex items-center gap-1.5 text-[12.5px] text-white/60">
                    <Calendar className="h-3.5 w-3.5 text-white/30 shrink-0" />
                    Batch {student.batchYear}
                  </span>
                  <span className="flex items-center gap-1.5 text-[12.5px] text-white/60">
                    <Mail className="h-3.5 w-3.5 text-white/30 shrink-0" />
                    <span className="font-mono truncate max-w-[230px]">{student.email}</span>
                  </span>
                </div>
              </div>

              {/* Action buttons — right edge */}
              <div className="flex flex-row sm:flex-col items-center gap-2 shrink-0 self-start sm:self-center">
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.14] bg-white/[0.09] hover:bg-white/[0.16] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors backdrop-blur-sm shadow-sm whitespace-nowrap"
                >
                  <Pencil className="h-3.5 w-3.5 text-white/55" />
                  Edit profile
                </Link>
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.14] bg-white/[0.09] hover:bg-white/[0.16] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors backdrop-blur-sm shadow-sm whitespace-nowrap"
                >
                  <Copy className="h-3.5 w-3.5 text-white/55" />
                  {copied ? 'Copied!' : 'Copy email'}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-7 border-t border-white/[0.08]" />

            {/* Bottom strip: bio | social links | trust */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-7 py-4">
              {student.bio ? (
                <p className="text-[13px] leading-relaxed text-white/65 max-w-xl flex-1">
                  {student.bio}
                </p>
              ) : (
                <p className="text-xs text-white/30 italic flex-1">No bio added — edit profile to add one.</p>
              )}

              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.13] bg-white/[0.08] hover:bg-white/[0.15] px-2.5 py-[5px] text-[11.5px] font-semibold text-white/75 transition-colors backdrop-blur-sm"
                    title={s.handle ? `${s.label} (${s.handle})` : s.label}
                  >
                    <span className="text-[#58a6ff]">{s.icon}</span>
                    {s.label}
                  </a>
                ))}
                <div className="opacity-70 ml-0.5">
                  <TrustCard compact />
                </div>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════
              KPI STATS — 4 across
          ════════════════════════════════════ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
              value={`${Math.max(ghStats.current, lcStats.current)}d`}
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

          {/* ════════════════════════════════════
              PINNED REPOSITORIES
          ════════════════════════════════════ */}
          <section className="rounded-2xl border border-white/[0.1] bg-white/[0.06] backdrop-blur-xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                Pinned Repositories
                <span className="text-xs text-white/45 font-normal">· {student.projects.length} verified</span>
              </h2>
              <Link href="/projects" className="text-xs font-medium text-[#58a6ff] hover:underline inline-flex items-center gap-1">
                Manage all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {student.projects.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.projects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FolderGit2 className="h-5 w-5" />}
                title="No projects pinned"
                body="Pin your best engineering work with a live demo and audited code repository."
                action={<Link href="/projects" className="text-xs font-bold text-[#58a6ff] hover:underline">Add a project</Link>}
              />
            )}
          </section>

          {/* ════════════════════════════════════
              GITHUB ACTIVITY HEATMAP
          ════════════════════════════════════ */}
          <section className="rounded-2xl border border-white/[0.1] bg-white/[0.06] backdrop-blur-xl shadow-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <GithubIcon className="h-4 w-4 text-[#58a6ff] shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {student.codingStats?.github?.totalContributions ?? 0} contributions in the last year
                  </h3>
                  <p className="text-xs text-white/45 mt-0.5">
                    Synced nightly via KIET TPO · Last: {formatDateTime(student.lastStatsSync)}
                  </p>
                </div>
              </div>
              <Link href="/coding" className="text-xs font-medium text-[#58a6ff] hover:underline shrink-0">
                Detailed metrics →
              </Link>
            </div>
            {gh.length ? (
              <>
                <div className="overflow-x-auto">
                  <Heatmap days={gh} tone="github" unit="contributions" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/[0.09] bg-white/[0.04] px-4 py-2 text-xs">
                  <span className="text-white/55 truncate">
                    <span className="font-semibold text-white/80">Latest commit: </span>
                    {student.codingStats?.github?.latestActivity}
                  </span>
                  <span className="ml-3 shrink-0 text-[10px] font-mono font-bold text-[#58a6ff] bg-[#58a6ff]/10 border border-[#58a6ff]/25 px-2 py-0.5 rounded">
                    main
                  </span>
                </div>
              </>
            ) : (
              <EmptyState
                icon={<Activity className="h-5 w-5" />}
                title="No GitHub sync yet"
                body="Link your GitHub username in Settings — commits sync nightly via campus webhook."
                action={<Link href="/settings" className="text-xs font-bold text-[#58a6ff] hover:underline">Connect GitHub</Link>}
              />
            )}
          </section>

          {/* ════════════════════════════════════
              LEETCODE HEATMAP
          ════════════════════════════════════ */}
          <section className="rounded-2xl border border-white/[0.1] bg-white/[0.06] backdrop-blur-xl shadow-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Code2 className="h-4 w-4 text-[#ffa116] shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    LeetCode — {lcStats.active} active practice days
                  </h3>
                  <p className="text-xs text-white/45 mt-0.5">
                    Current streak: {lcStats.current}d · Longest: {lcStats.longest}d
                  </p>
                </div>
              </div>
              {student.leetcodeHandle && (
                <a
                  href={`https://leetcode.com/u/${student.leetcodeHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-[#58a6ff] hover:underline inline-flex items-center gap-1 shrink-0"
                >
                  @{student.leetcodeHandle} <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            {lc.length ? (
              <>
                <div className="overflow-x-auto">
                  <Heatmap days={lc} tone="leetcode" unit="submissions" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/[0.09] bg-white/[0.04] px-4 py-2 text-xs">
                  <span className="text-white/55 truncate">
                    <span className="font-semibold text-white/80">Recent solution: </span>
                    {student.codingStats?.leetcode?.latestActivity}
                  </span>
                  <span className="ml-3 shrink-0 text-[10px] font-mono font-bold text-[#ffa116] bg-[#ffa116]/10 border border-[#ffa116]/25 px-2 py-0.5 rounded">
                    Accepted
                  </span>
                </div>
              </>
            ) : (
              <EmptyState
                icon={<Code2 className="h-5 w-5" />}
                title="No LeetCode profile linked"
                body="Connect your LeetCode handle in Settings to showcase DSA consistency."
                action={<Link href="/settings" className="text-xs font-bold text-[#58a6ff] hover:underline">Connect LeetCode</Link>}
              />
            )}
          </section>

          {/* ════════════════════════════════════
              SGPA CHART + ENDORSEMENTS (2-col)
          ════════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
            {/* SGPA */}
            <div className="rounded-2xl border border-white/[0.1] bg-white/[0.06] backdrop-blur-xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-[#58a6ff]" />
                  <h3 className="text-sm font-bold text-white">SGPA Trajectory</h3>
                </div>
                <Link href="/academics" className="text-xs font-medium text-[#58a6ff] hover:underline">
                  All semesters →
                </Link>
              </div>
              <p className="text-xs text-white/45 mb-4">
                {student.academics.length} semesters · cumulative record
              </p>
              <SgpaChart semesters={student.academics} cgpa={cgpa} height={140} compact />
            </div>

            {/* Endorsements */}
            <div className="rounded-2xl border border-white/[0.1] bg-white/[0.06] backdrop-blur-xl shadow-xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-[#3fb950]" />
                  <h3 className="text-sm font-bold text-white">Faculty Endorsements</h3>
                </div>
                <Link href="/badges" className="text-xs font-medium text-[#58a6ff] hover:underline">
                  Catalog →
                </Link>
              </div>

              <div className="flex-1">
                {approved.length ? (
                  <ul className="space-y-2">
                    {approved.map((b) => {
                      const badge = catalog.find((c) => c.id === b.badgeId);
                      if (!badge) return null;
                      return (
                        <li key={b.id} className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] p-2.5 hover:bg-white/[0.08] transition-colors">
                          <BadgeIcon iconUrl={badge.iconUrl} className="!h-9 !w-9 rounded-lg shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-white">{badge.title}</p>
                            <p className="text-[10.5px] text-white/45 mt-0.5">Verified {formatDate(b.verifiedAt)}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-xs text-white/40 mt-1">No faculty badges endorsed yet.</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.08]">
                <Link href="/certifications" className="flex items-center justify-between text-xs font-medium text-white/45 hover:text-white/80 transition-colors">
                  <span>{student.certifications.length} verified professional certifications</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
