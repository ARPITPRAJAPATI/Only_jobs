'use client';

import Link from 'next/link';
import {
  Briefcase,
  BookOpen,
  GraduationCap,
  Award,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Code2,
  Layers,
  FolderGit2,
  Users,
  Flame,
  TrendingUp,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { CourseFooter } from '@/components/courses/CourseFooter';
import { useStudent } from '@/components/store';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const { student } = useStudent();

  return (
    <div className="min-h-screen bg-bg text-ink font-sans flex flex-col transition-colors selection:bg-[#0969da]/20 selection:text-[#0969da]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-line bg-surface/50 py-16 sm:py-24 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface2 border border-line text-xs font-semibold text-muted shadow-2xs">
            <span className="flex h-2 w-2 rounded-full bg-[#1a7f37]" />
            <span className="text-[#0969da] font-bold">Only Jobs &times; KIET</span>
            <span className="opacity-40">•</span>
            <span>Campus Placement & Proof-of-Work Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-ink tracking-tight leading-tight max-w-4xl mx-auto font-sans">
            Find Your Tribe. Prove Your Work. <br className="hidden sm:inline" />
            <span className="text-[#0969da]">Secure Your Placement.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted leading-relaxed font-normal">
            The unified campus network where KIET engineering students showcase tamper-proof project repositories, complete 3-phase gatekeeper certifications, and get directly recruited by top tier-1 tech firms.
          </p>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/jobs"
              className="px-5 py-2.5 rounded-md bg-[#1f883d] hover:bg-[#1a7f37] text-white text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center gap-2 active:scale-95"
            >
              <Briefcase className="h-4 w-4" />
              <span>Explore Placement Drives</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/courses"
              className="px-5 py-2.5 rounded-md bg-surface border border-line hover:bg-surface2 text-ink text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4 text-[#0969da]" />
              <span>Courses & 3-Phase Labs</span>
            </Link>

            <Link
              href="/profile"
              className="px-4 py-2.5 rounded-md bg-surface2 hover:bg-surface border border-line text-xs sm:text-sm font-semibold text-muted hover:text-ink transition-all"
            >
              <span>View Student Profile &rarr;</span>
            </Link>
          </div>

          {/* Verified Student Social Proof Tag */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-muted font-mono">
            <ShieldCheck className="h-4 w-4 text-[#1a7f37]" />
            <span>Logged in as <strong>{student.name}</strong> ({student.branch} · {student.batchYear})</span>
          </div>
        </div>
      </section>

      {/* 2. STATS & METRICS MATRIX */}
      <section className="border-b border-line bg-surface py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-4 rounded-xl border border-line bg-surface2/40 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
                Highest Campus CTC
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-ink font-mono mt-1">
                ₹52.0 LPA
              </div>
              <span className="text-[11px] text-[#1a7f37] font-semibold mt-0.5 block">
                Atlassian (Remote)
              </span>
            </div>

            <div className="p-4 rounded-xl border border-line bg-surface2/40 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
                Tier-1 Average Package
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0969da] font-mono mt-1">
                ₹14.8 LPA
              </div>
              <span className="text-[11px] text-muted font-medium mt-0.5 block">
                Cisco, Amazon, Microsoft
              </span>
            </div>

            <div className="p-4 rounded-xl border border-line bg-surface2/40 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
                Audited Placement Rate
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1a7f37] font-mono mt-1">
                96.4%
              </div>
              <span className="text-[11px] text-muted font-medium mt-0.5 block">
                CSE, IT & Circuit Branches
              </span>
            </div>

            <div className="p-4 rounded-xl border border-line bg-surface2/40 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
                Verified Credentials
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-ink font-mono mt-1">
                100%
              </div>
              <span className="text-[11px] text-muted font-medium mt-0.5 block">
                Cryptographic SHA-256 Hashes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE PLATFORM PILLARS (4 EQUAL TILES) */}
      <section className="py-14 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight font-sans">
            Built for Modern Engineering Placements
          </h2>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            Every feature is calibrated strictly against college TPO policies and tier-1 recruitment loops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Tile 1: Placement Engine */}
          <Link
            href="/jobs"
            className="group rounded-2xl border border-line bg-surface p-6 sm:p-7 shadow-2xs hover:border-[#0969da] hover:shadow-md transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2.5 rounded-xl bg-[#0969da]/10 text-[#0969da] border border-[#0969da]/20">
                  <Briefcase className="h-6 w-6" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-[#0969da] bg-[#0969da]/10 px-2.5 py-0.5 rounded-full border border-[#0969da]/30">
                  Live Drives Active
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-ink group-hover:text-[#0969da] transition-colors">
                Placement Drives & Superset Eligibility
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Official KIET on-campus recruitment drives with strict CGPA and backlog rule evaluations, dream company multiplier allowances, verified off-campus job aggregator, and real-time multi-round application tracking.
              </p>
            </div>
            <div className="pt-4 border-t border-line flex items-center justify-between text-xs font-bold text-[#0969da]">
              <span>Explore Jobs & Placement Drives</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Tile 2: 3-Phase Gatekeeper Courses */}
          <Link
            href="/courses"
            className="group rounded-2xl border border-line bg-surface p-6 sm:p-7 shadow-2xs hover:border-[#1a7f37] hover:shadow-md transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2.5 rounded-xl bg-[#dafbe1] text-[#1a7f37] border border-[#4ac26b]/40">
                  <BookOpen className="h-6 w-6" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-[#1a7f37] bg-[#dafbe1] px-2.5 py-0.5 rounded-full border border-[#4ac26b]/40">
                  Gatekeeper Engine
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-ink group-hover:text-[#1a7f37] transition-colors">
                3-Phase Gatekeeper Certifications & Labs
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Sequential mastery tracks for DevOps, FullStack, and Systems. Pass proctored certification exams (&ge; 70%) to unlock subsequent phases, read kernel revision cheatsheets, build production project ideas, and mint verified credentials.
              </p>
            </div>
            <div className="pt-4 border-t border-line flex items-center justify-between text-xs font-bold text-[#1a7f37]">
              <span>Explore Courses & Labs</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Tile 3: Class Project Rooms */}
          <Link
            href="/class"
            className="group rounded-2xl border border-line bg-surface p-6 sm:p-7 shadow-2xs hover:border-purple-500 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  <GraduationCap className="h-6 w-6" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                  Faculty Review
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-ink group-hover:text-purple-600 transition-colors">
                Classroom Collaboration & Project Rooms
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Subject-specific classroom channels for real-time project submissions, screenshot proofs, live AST plagiarism scoring, and one-click faculty marksheet sign-offs.
              </p>
            </div>
            <div className="pt-4 border-t border-line flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>Enter Class Project Rooms</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Tile 4: Student Identity & Alumni */}
          <Link
            href="/profile"
            className="group rounded-2xl border border-line bg-surface p-6 sm:p-7 shadow-2xs hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Award className="h-6 w-6" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Proof of Work
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-ink group-hover:text-amber-500 transition-colors">
                Student Profile & Verified Proof of Work
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                TPO-audited cumulative CGPA records, GitHub commit activity heatmaps, LeetCode submission streaks, pinned production repositories, and verified alumni referral networking.
              </p>
            </div>
            <div className="pt-4 border-t border-line flex items-center justify-between text-xs font-bold text-amber-500">
              <span>View Verified Student Portfolio</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* 4. RECRUITMENT PARTNERS TICKER */}
      <section className="border-t border-line bg-surface2/30 py-10 text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted font-mono">
            Direct Campus Recruitment Drives & Placement Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {[
              'Cisco Systems',
              'Microsoft',
              'Amazon Web Services',
              'Atlassian',
              'Swiggy',
              'Red Hat',
              'TCS Digital',
              'Infosys Wings1',
              'Morgan Stanley',
              'Razorpay',
              'CRED',
              'Cognizant Elevate',
            ].map((comp, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-md bg-surface border border-line text-xs font-semibold text-ink shadow-2xs hover:border-[#0969da]/40 transition-colors"
              >
                {comp}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GLOBAL FOOTER */}
      <CourseFooter />
    </div>
  );
}
