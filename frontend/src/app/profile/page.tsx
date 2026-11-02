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
    <div
      className="min-h-screen pb-16 animate-fade-in relative"
      style={{
        backgroundImage: "url('/profile-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark scrim */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] pointer-events-none" aria-hidden />

      <div className="relative z-10">
        {/* Subnav */}
        <div className="bg-white/5 backdrop-blur-md border-b border-white/10">
          <ProfileSubnav />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

          {/* ── HORIZONTAL PROFILE HERO BANNER ── */}
          <div className="rounded-2xl border border-white/15 bg-white/[0.08] backdrop-blur-xl shadow-2xl p-6">
            {/* Top row: Avatar + Identity + Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <Avatar
                  name={student.name}
                  src={student.avatarUrl}
                  size={96}
                  className="ring-4 ring-white/20 shadow-lg text-2xl border border-white/10"
                />
                <span
                  className="absolute bottom-0.5 right-0.5 grid h-6 w-6 place-items-center rounded-full bg-[#1a7f37] text-white shadow-sm ring-2 ring-black/40"
                  title="TPO Verified Student Identity"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold tracking-tight text-white font-sans drop-shadow">
                    {student.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#1a7f37]/30 px-2.5 py-0.5 text-[11px] font-semibold text-[#4ac26b] border border-[#4ac26b]/30">
                    <CheckCircle2 className="h-3 w-3" />
                    TPO Verified
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/60 border border-white/10">
                    0 Active Backlogs
                  </span>
                </div>

                <p className="text-sm font-mono text-white/55 mb-3">
                  @{student.githubHandle || 'student'} · PRN: {student.rollNumber}
                </p>

                {/* Inline meta pills */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/65">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-white/35 shrink-0" />
                    KIET Group of Institutions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-white/35 shrink-0" />
                    B.Tech · {student.branch} · Sem {student.currentSemester}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-white/35 shrink-0" />
                    Batch {student.batchYear}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-white/35 shrink-0" />
                    <span className="font-mono truncate max-w-[220px]">{student.email}</span>
                  </span>
                </div>
              </div>

              {/* Action buttons — far right */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-semibold text-white transition-all active:scale-[.98] backdrop-blur-sm shadow"
                >
                  <Pencil className="h-3.5 w-3.5 text-white/60" />
                  Edit profile
                </Link>
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-semibold text-white transition-all active:scale-[.98] backdrop-blur-sm shadow"
                >
                  <Copy className="h-3.5 w-3.5 text-white/60" />
                  {copied ? 'Copied!' : 'Copy email'}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 my-4" />

            {/* Bottom row: Bio + Socials + Trust */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Bio */}
              {student.bio ? (
                <p className="text-[13px] leading-relaxed text-white/70 max-w-2xl">
                  {student.bio}
                </p>
              ) : (
                <span className="text-xs text-white/35 italic">No bio added yet.</span>
              )}

              {/* Social links + trust card */}
              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 hover:bg-white/20 px-2.5 py-1 text-xs font-semibold text-white/80 transition-all backdrop-blur-sm shadow-sm"
                    title={s.handle ? `${s.label} (${s.handle})` : s.label}
                  >
                    <span className="text-[#58a6ff]">{s.icon}</span>
                    <span className="text-[11.5px]">{s.label}</span>
                  </a>
                ))}
                <div className="opacity-75 ml-1">
                  <TrustCard compact />
                </div>
              </div>
            </div>
          </div>

          {/* ── KPI STATS ROW ── */}
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

          {/* ── PINNED REPOSITORIES ── */}
          <section className="rounded-2xl border border-white/12 bg-white/[0.07] backdrop-blur-xl shadow-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                Pinned Repositories
                <span className="text-xs text-white/50 font-normal">({student.projects.length} verified)</span>
              </h2>
              <Link href="/projects" className="text-xs font-medium text-[#58a6ff] hover:underline inline-flex items-center gap-1">
                Manage all projects <ArrowRight className="h-3 w-3" />
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
                action={<Link href="/projects" className="text-xs font-bold text-[#58a6ff] hover:underline">Add a project</Link>}
              />
            )}
          </section>

          {/* ── GITHUB HEATMAP ── */}
          <section className="rounded-2xl border border-white/12 bg-white/[0.07] backdrop-blur-xl shadow-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <GithubIcon className="h-4 w-4 text-[#58a6ff]" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {student.codingStats?.github?.totalContributions ?? 0} verified contributions in past year
                  </h3>
                  <p className="text-xs text-white/50">
                    Synced nightly via KIET TPO webhooks · Last update {formatDateTime(student.lastStatsSync)}
                  </p>
                </div>
              </div>
              <Link href="/coding" className="text-xs font-medium text-[#58a6ff] hover:underline self-start sm:self-auto">
                Detailed metrics &rarr;
              </Link>
            </div>
            {gh.length ? (
              <>
                <div className="pt-1 overflow-x-auto">
                  <Heatmap days={gh} tone="github" unit="contributions" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs">
                  <span className="text-white/60 font-medium truncate">
                    <span className="font-semibold text-white">Latest commit: </span>
                    {student.codingStats?.github?.latestActivity}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#58a6ff] bg-[#58a6ff]/10 border border-[#58a6ff]/30 px-2 py-0.5 rounded-md shrink-0">
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

          {/* ── LEETCODE HEATMAP ── */}
          <section className="rounded-2xl border border-white/12 bg-white/[0.07] backdrop-blur-xl shadow-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Code2 className="h-4 w-4 text-[#ffa116]" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    LeetCode Problem Solving ({lcStats.active} active practice days)
                  </h3>
                  <p className="text-xs text-white/50">
                    Current streak: {lcStats.current} days · Longest streak: {lcStats.longest} days
                  </p>
                </div>
              </div>
              {student.leetcodeHandle && (
                <a
                  href={`https://leetcode.com/u/${student.leetcodeHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-[#58a6ff] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  @{student.leetcodeHandle} <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            {lc.length ? (
              <>
                <div className="pt-1 overflow-x-auto">
                  <Heatmap days={lc} tone="leetcode" unit="submissions" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs">
                  <span className="text-white/60 font-medium truncate">
                    <span className="font-semibold text-white">Recent solution: </span>
                    {student.codingStats?.leetcode?.latestActivity}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#ffa116] bg-[#ffa116]/10 border border-[#ffa116]/30 px-2 py-0.5 rounded-md shrink-0">
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

          {/* ── SGPA + ENDORSEMENTS ROW ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
            {/* SGPA Trajectory */}
            <div className="rounded-2xl border border-white/12 bg-white/[0.07] backdrop-blur-xl shadow-xl p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-[#58a6ff]" />
                  <h3 className="text-sm font-bold text-white">SGPA Trajectory</h3>
                </div>
                <Link href="/academics" className="text-xs font-medium text-[#58a6ff] hover:underline">
                  All semesters &rarr;
                </Link>
              </div>
              <p className="text-xs text-white/50 mb-3">
                Consistent cumulative record across {student.academics.length} semesters.
              </p>
              <SgpaChart semesters={student.academics} cgpa={cgpa} height={140} compact />
            </div>

            {/* Faculty Endorsements */}
            <div className="rounded-2xl border border-white/12 bg-white/[0.07] backdrop-blur-xl shadow-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-[#4ac26b]" />
                    <h3 className="text-sm font-bold text-white">Faculty Endorsements</h3>
                  </div>
                  <Link href="/badges" className="text-xs font-medium text-[#58a6ff] hover:underline">
                    Catalog &rarr;
                  </Link>
                </div>
                {approved.length ? (
                  <ul className="space-y-2">
                    {approved.map((b) => {
                      const badge = catalog.find((c) => c.id === b.badgeId);
                      if (!badge) return null;
                      return (
                        <li key={b.id} className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition-all">
                          <BadgeIcon iconUrl={badge.iconUrl} className="!h-8 !w-8 rounded-md shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-white">{badge.title}</p>
                            <p className="text-[10.5px] text-white/50 font-medium">Verified {formatDate(b.verifiedAt)}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-xs text-white/50">No faculty badges endorsed yet.</p>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-white/10">
                <Link href="/certifications" className="flex items-center justify-between text-xs font-medium text-white/50 hover:text-white">
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
