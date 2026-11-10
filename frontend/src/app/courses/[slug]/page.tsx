'use client';

import { useState, useEffect, useMemo, use } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Star,
  Award,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  Play,
  FileText,
  Lightbulb,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Clock,
  Layers,
  Sparkles,
  BookOpen,
  Github,
  Building2,
  TrendingUp,
  Download,
  Eye,
  MessageSquare,
  AlertCircle,
  Copy,
  Check,
  X,
  Share2,
  Quote,
} from 'lucide-react';
import {
  COURSES_DATA,
  CourseItem,
  PhaseData,
  CourseNote,
  ProjectIdea,
  JobProfile,
  StudentReview,
  getCourseBySlug,
  getCourseNotes,
  getCourseProjectIdeas,
  getCourseJobProfiles,
  getCourseReviews,
} from '@/components/courses/coursesData';
import { ExamPlayerModal } from '@/components/courses/ExamPlayerModal';
import { useStudent } from '@/components/store';
import { useToast } from '@/components/toast';
import { cn } from '@/lib/utils';

export default function CourseWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const { student, addCertification } = useStudent();

  const slug = params?.slug as string;

  // Resolve Course
  const course = useMemo(() => {
    if (!slug) return undefined;
    return (
      getCourseBySlug(slug) ||
      COURSES_DATA.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) ||
      COURSES_DATA.find((c) => c.slug.toLowerCase().includes(slug.toLowerCase()))
    );
  }, [slug]);

  // Phase Progress State
  const [phase1Passed, setPhase1Passed] = useState<boolean>(false);
  const [phase2Passed, setPhase2Passed] = useState<boolean>(false);
  const [phase3Passed, setPhase3Passed] = useState<boolean>(false);
  const [certHashes, setCertHashes] = useState<Record<number, string>>({});

  // Active Selected Phase for viewing details
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number>(0);

  // Exam Player Modal State
  const [examModalOpen, setExamModalOpen] = useState<boolean>(false);
  const [examMode, setExamMode] = useState<'PRACTICE_MOCK' | 'OFFICIAL_EXAM'>('OFFICIAL_EXAM');
  const [examTargetPhase, setExamTargetPhase] = useState<PhaseData | null>(null);

  // Interactive Note Reader Modal State
  const [selectedNote, setSelectedNote] = useState<CourseNote | null>(null);

  // Interactive Write Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [customReviews, setCustomReviews] = useState<StudentReview[]>([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    placedCompany: '',
    placedPackage: '',
    reviewText: '',
  });

  // Copied State for code snippets
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Load progress from localStorage on mount
  useEffect(() => {
    if (!course) return;
    try {
      const stored = localStorage.getItem(`kiet_course_phase_${course.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPhase1Passed(!!parsed.phase1Passed);
        setPhase2Passed(!!parsed.phase2Passed);
        setPhase3Passed(!!parsed.phase3Passed);
        if (parsed.certHashes) setCertHashes(parsed.certHashes);
      }
    } catch {
      // ignore
    }
  }, [course]);

  // Persist progress to localStorage
  const saveProgress = (p1: boolean, p2: boolean, p3: boolean, hashes: Record<number, string>) => {
    if (!course) return;
    try {
      localStorage.setItem(
        `kiet_course_phase_${course.id}`,
        JSON.stringify({
          phase1Passed: p1,
          phase2Passed: p2,
          phase3Passed: p3,
          certHashes: hashes,
        })
      );
    } catch {
      // ignore
    }
  };

  // If Course Not Found
  if (!course) {
    return (
      <div className="min-h-screen bg-bg text-ink flex flex-col justify-between font-sans">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-surface2 border border-line mb-6">
            <AlertCircle className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink mb-3">
            Course Not Found
          </h1>
          <p className="text-sm text-muted max-w-md mx-auto mb-8">
            The course &quot;{slug}&quot; could not be located in the curriculum database.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-xs font-bold text-accentInk shadow-2xs transition-all hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Courses</span>
          </Link>
        </div>
      </div>
    );
  }

  // Related Resources
  const notes = getCourseNotes(course);
  const projectIdeas = getCourseProjectIdeas(course);
  const jobProfiles = getCourseJobProfiles(course);
  const allReviews = [...customReviews, ...getCourseReviews(course)];

  // Phase Unlocking Logic
  // Phase 1 is always unlocked
  // Phase 2 unlocks when Phase 1 exam is passed
  // Phase 3 unlocks when Phase 2 exam is passed
  const isPhaseUnlocked = (phaseIndex: number) => {
    if (phaseIndex === 0) return true;
    if (phaseIndex === 1) return phase1Passed;
    if (phaseIndex === 2) return phase1Passed && phase2Passed;
    return false;
  };

  const isPhasePassed = (phaseIndex: number) => {
    if (phaseIndex === 0) return phase1Passed;
    if (phaseIndex === 1) return phase2Passed;
    if (phaseIndex === 2) return phase3Passed;
    return false;
  };

  // Trigger Exam Modal
  const handleOpenExam = (phaseIndex: number, mode: 'PRACTICE_MOCK' | 'OFFICIAL_EXAM') => {
    const targetPhase = course.phases[phaseIndex];
    if (!targetPhase) return;
    if (!isPhaseUnlocked(phaseIndex)) {
      toast(`Phase ${phaseIndex + 1} is locked. You must complete and pass the previous phase exam first.`, 'info');
      return;
    }
    setExamTargetPhase(targetPhase);
    setExamMode(mode);
    setExamModalOpen(true);
  };

  // Exam Pass Handler
  const handleExamPassed = (certHash: string) => {
    if (!examTargetPhase) return;
    const phaseIdx = course.phases.findIndex((p) => p.title === examTargetPhase.title);
    if (phaseIdx === -1) return;

    const newHashes = { ...certHashes, [phaseIdx]: certHash };
    setCertHashes(newHashes);

    if (phaseIdx === 0) {
      setPhase1Passed(true);
      saveProgress(true, phase2Passed, phase3Passed, newHashes);
      toast('🎉 Phase 1 Exam Passed! Phase 2 is now UNLOCKED.', 'success');
      setSelectedPhaseIndex(1); // Auto move to Phase 2
    } else if (phaseIdx === 1) {
      setPhase2Passed(true);
      saveProgress(phase1Passed, true, phase3Passed, newHashes);
      toast('🎉 Phase 2 Exam Passed! Phase 3 Capstone is now UNLOCKED.', 'success');
      setSelectedPhaseIndex(2); // Auto move to Phase 3
    } else if (phaseIdx === 2) {
      setPhase3Passed(true);
      saveProgress(phase1Passed, phase2Passed, true, newHashes);
      toast('🏆 Outstanding! Master Track Completed with Verifiable Institutional Honor.', 'success');
    }
  };

  // Copy Snippet Handler
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    toast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  // Submit Review Handler
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.reviewText.trim()) {
      toast('Please write a brief review testimonial.', 'info');
      return;
    }

    const reviewObj: StudentReview = {
      id: `custom-rev-${Date.now()}`,
      studentName: student.name || 'Aditya Sharma',
      rollNumber: student.rollNumber || '2100290100042',
      batchYear: 'Batch 2026',
      rating: newReview.rating,
      date: 'Just now',
      placedCompany: newReview.placedCompany.trim() || 'KIET Placement Pool',
      placedPackage: newReview.placedPackage.trim() || 'Verified Candidate',
      reviewText: newReview.reviewText.trim(),
      verifiedCertificateHash: phase1Passed ? certHashes[0] || 'CERT-KIET-VERIFIED' : undefined,
    };

    setCustomReviews((prev) => [reviewObj, ...prev]);
    setReviewModalOpen(false);
    setNewReview({
      rating: 5,
      placedCompany: '',
      placedPackage: '',
      reviewText: '',
    });
    toast('Thank you! Your verified student review was published successfully.', 'success');
  };

  return (
    <div className="min-h-screen bg-bg text-ink font-sans flex flex-col transition-colors selection:bg-accent/20 selection:text-accent">
      {/* 1. Top Breadcrumb & Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 truncate text-xs text-muted">
            <Link
              href="/courses"
              className="flex shrink-0 items-center gap-1.5 font-medium text-ink transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>All Courses</span>
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
            <Link
              href={`/courses?category=${encodeURIComponent(course.categoryLabel)}`}
              className="shrink-0 rounded px-1.5 py-1 uppercase tracking-[0.18em] text-[10px] font-semibold text-muted transition-colors hover:bg-surface2 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              aria-label={`Browse ${course.categoryLabel} courses`}
            >
              {course.categoryLabel}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40 hidden sm:inline-block" />
            <span className="hidden max-w-[280px] truncate text-ink font-semibold sm:inline-block md:max-w-[480px]">
              {course.title}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  navigator.clipboard.writeText(window.location.href);
                  toast('Course workspace link copied to clipboard!', 'success');
                }
              }}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors hover:bg-surface2 hover:text-ink"
              title="Share Course Link"
              aria-label="Share course"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-surface2"
            >
              Catalog
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Course Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* HERO SECTION */}
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-7 lg:p-8">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="min-w-0 space-y-4 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                  <Sparkles className="h-3 w-3" />
                  <span>{course.categoryLabel} Track</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface2 px-2.5 py-1 text-[10px] font-medium text-muted">
                  <Clock className="h-3 w-3" />
                  <span>{course.labHours} Hands-On Lab Hours</span>
                </span>
              </div>

              <h1 className="max-w-3xl text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl">
                {course.title}
              </h1>

              <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-[15px]">
                {course.overview}
              </p>

              <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface2/60 p-3.5 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink">TPO Placement Partner Accreditation</p>
                    <p className="text-[11px] text-muted">{course.tpoPartner}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
                  <div className="flex items-center gap-1 text-warn">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="font-bold text-ink">{course.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-muted">({course.reviewCount} reviews)</span>
                  </div>
                  <span className="hidden text-muted sm:inline-block">•</span>
                  <span>{course.studentsCount} Students Enrolled</span>
                </div>
              </div>
            </div>

            <div className="w-full min-w-0 rounded-xl border border-line bg-surface2/40 p-4 sm:p-5 lg:col-span-5">
              <div className="flex items-center gap-3">
                <img
                  src={course.mentor.avatarUrl}
                  alt={course.mentor.name}
                  className="h-11 w-11 rounded-full border border-line object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-ink">{course.mentor.name}</h4>
                  <p className="text-xs text-muted">{course.mentor.title}</p>
                  <p className="text-[11px] text-muted">Dept of {course.mentor.department}</p>
                </div>
              </div>

              <div className="mt-5 space-y-2 border-t border-line pt-4">
                <div className="flex items-center justify-between gap-4 text-xs">
                  <span className="font-medium text-muted">Certification Status</span>
                  <span className="text-right font-bold text-ink font-mono text-[11px]">
                    {phase3Passed
                      ? '100% (Mastery)'
                      : phase2Passed
                      ? '66% (Phase 2 Passed)'
                      : phase1Passed
                      ? '33% (Phase 1 Passed)'
                      : '0% (Phase 1 In-Progress)'}
                  </span>
                </div>

                <div
                  className="h-1.5 w-full overflow-hidden rounded-full border border-line bg-surface2"
                  role="progressbar"
                  aria-label="Certification progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={phase3Passed ? 100 : phase2Passed ? 66 : phase1Passed ? 33 : 0}
                >
                  <div
                    className="h-full rounded-full bg-good transition-all duration-500"
                    style={{
                      width: phase3Passed ? '100%' : phase2Passed ? '66%' : phase1Passed ? '33%' : '5%',
                    }}
                  />
                </div>
              </div>

              {phase1Passed && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-good/30 bg-good/10 p-3 text-xs">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-good" />
                  <div>
                    <p className="font-bold text-good">Verified Credential Active</p>
                    <p className="mt-0.5 font-mono text-muted">Hash: {certHashes[0] || 'CERT-KIET-VERIFIED'}</p>
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-col gap-2 pt-1">
                <a
                  href="#phases-section"
                  className="w-full rounded-lg bg-accent px-3 py-2.5 text-center text-xs font-semibold text-accentInk shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95"
                >
                  Go to 3-Phase Gatekeeper ↓
                </a>
                <a
                  href="#notes-section"
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-center text-xs font-semibold text-ink transition-colors hover:bg-surface2"
                >
                  View Notes & Cheatsheets
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3-PHASE GATEKEEPER ENGINE (THE CORE USER REQUIREMENT)                     */}
        {/* ========================================================================= */}
        <section id="phases-section" className="scroll-mt-20 space-y-6 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6 lg:p-7">
          <div className="flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                  <Layers className="h-4 w-4" />
                </span>
                <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                  3-Phase Gatekeeper Certification Engine
                </h2>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                Mandatory sequential mastery. Pass each timed exam to unlock the next phase, mint cryptographic institutional certificates, and unlock top campus placement shortlists.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-line bg-surface2 px-3 py-2 text-xs font-semibold text-muted">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Pass the phase cutoff to unlock the next phase</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {course.phases.map((ph, idx) => {
              const unlocked = isPhaseUnlocked(idx);
              const passed = isPhasePassed(idx);
              const isSelected = selectedPhaseIndex === idx;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedPhaseIndex(idx)}
                  aria-pressed={isSelected}
                  aria-label={`Phase ${idx + 1}: ${ph.title}${passed ? ', certified' : unlocked ? ', unlocked' : ', locked'}`}
                  className={cn(
                    'group relative flex min-h-[168px] cursor-pointer flex-col justify-between overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                    isSelected
                      ? 'border-accent bg-accent/5 shadow-sm'
                      : 'border-line bg-surface hover:border-accent/40 hover:bg-surface2/60',
                    !unlocked && !isSelected && 'bg-surface2/40'
                  )}
                >
                  <span
                    className={cn(
                      'absolute inset-x-0 top-0 h-1 transition-colors',
                      passed ? 'bg-good' : isSelected ? 'bg-accent' : 'bg-transparent'
                    )}
                  />
                  <div className="mb-3 flex items-center justify-between gap-2 pt-1">
                    <span className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-muted">
                      <span className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full border text-[10px]',
                        passed ? 'border-good/30 bg-good/10 text-good' : isSelected ? 'border-accent/30 bg-accent/10 text-accent' : 'border-line bg-surface2'
                      )}>
                        {passed ? <CheckCircle2 className="h-3.5 w-3.5" /> : `0${idx + 1}`}
                      </span>
                      Phase {idx + 1}
                    </span>

                    {passed ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-good/30 bg-good/10 px-2.5 py-1 text-[10px] font-bold text-good">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Certified</span>
                      </span>
                    ) : unlocked ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-bold text-accent">
                        <Unlock className="h-3 w-3" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface2 px-2.5 py-1 text-[10px] font-bold text-muted">
                        <Lock className="h-3 w-3" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-ink">
                      {ph.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted">
                      {ph.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3 text-[11px] text-muted">
                    <span>{ph.duration}</span>
                    <span className="rounded-md bg-surface2 px-2 py-1 font-semibold text-ink">Cutoff {ph.examCutoff}%</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Phase Deep Dive Card */}
          {(() => {
            const currentPhase = course.phases[selectedPhaseIndex];
            const unlocked = isPhaseUnlocked(selectedPhaseIndex);
            const passed = isPhasePassed(selectedPhaseIndex);
            const certHash = certHashes[selectedPhaseIndex];

            return (
              <div className="space-y-6 rounded-2xl border border-line bg-surface2/40 p-5 sm:p-7">
                <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-bold text-accent">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        Phase {selectedPhaseIndex + 1} of {course.phases.length}
                      </span>
                      <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                        {currentPhase.level}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                      {currentPhase.title}
                    </h3>
                  </div>

                  {/* Certified Hash Pill */}
                  {passed && certHash && (
                    <div className="flex items-center gap-2 rounded-lg border border-good/30 bg-good/10 p-2.5 text-xs">
                      <Award className="h-4 w-4 text-good" />
                      <div>
                        <span className="font-bold text-good">Exam Cleared</span>
                        <p className="font-mono text-[11px] text-muted">{certHash}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lock Screen if Phase is locked */}
                {!unlocked ? (
                  <div className="py-12 text-center rounded-xl bg-surface2/40 border border-dashed border-line space-y-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface border border-line text-muted">
                      <Lock className="h-6 w-6" />
                    </div>
                    <div className="max-w-md mx-auto">
                      <h4 className="text-base font-bold text-ink">
                        Phase {selectedPhaseIndex + 1} is Currently Locked
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        Complete Phase {selectedPhaseIndex} and score at least {course.phases[selectedPhaseIndex - 1]?.examCutoff}% on its certification exam to unlock this phase.
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedPhaseIndex(selectedPhaseIndex - 1)}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-accent px-4 py-2 text-xs font-bold text-accentInk shadow-2xs transition-all hover:opacity-90"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Switch to Phase {selectedPhaseIndex} Exam</span>
                    </button>
                  </div>
                ) : (
                  /* Unlocked Phase Content & Actions */
                  <div className="space-y-6">
                    <p className="max-w-4xl text-sm leading-relaxed text-muted sm:text-base">
                      {currentPhase.description}
                    </p>

                    {/* Competency & Skills Chips */}
                    <div>
                      <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">
                        Key Competencies & Tested Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentPhase.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-medium text-ink shadow-2xs"
                          >
                            <Check className="h-3 w-3 text-good" />
                            <span>{skill}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Phase Syllabus Modules */}
                    <div className="space-y-4 rounded-xl border border-line bg-surface p-4 sm:p-5">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <span className="flex items-center gap-2 text-sm font-bold text-ink">
                          <BookOpen className="h-4 w-4 text-accent" />
                          <span>Curriculum Modules ({currentPhase.modulesCount} modules)</span>
                        </span>
                        <span className="text-xs text-muted">Self-paced with mandatory lab checks</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface2/50 p-3">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <CheckCircle2 className="h-4 w-4 text-good" />
                            <span className="font-semibold text-ink">Module 1.1: Core Architecture & Theory</span>
                          </div>
                          <span className="shrink-0 rounded-full bg-good/10 px-2 py-1 text-[10px] font-semibold text-good">Completed</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface2/50 p-3">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <CheckCircle2 className="h-4 w-4 text-good" />
                            <span className="font-semibold text-ink">Module 1.2: Terminal Commands & Hands-on Diagnostics</span>
                          </div>
                          <span className="shrink-0 rounded-full bg-good/10 px-2 py-1 text-[10px] font-semibold text-good">Completed</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface2/50 p-3">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <Clock className="h-4 w-4 text-warn" />
                            <span className="font-semibold text-ink">Module 1.3: Production Hardening & Troubleshooting</span>
                          </div>
                          <span className="shrink-0 rounded-full bg-warn/10 px-2 py-1 text-[10px] font-semibold text-warn">Ready for exam</span>
                        </div>
                      </div>
                    </div>

                    {/* EXAM CALL TO ACTION BUTTONS (THE CORE REQUIREMENT) */}
                    <div className="flex flex-col justify-between gap-4 rounded-xl border border-accent/30 bg-accent/5 p-4 sm:flex-row sm:items-center sm:p-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-accent" />
                          <h4 className="text-sm font-bold text-ink">
                            Phase {selectedPhaseIndex + 1} Certification Assessment
                          </h4>
                        </div>
                        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted">
                          Server-timed assessment ({currentPhase.examCutoff}% cutoff). Anti-cheating proctoring active.
                          {passed
                            ? ' You have already passed this phase!'
                            : selectedPhaseIndex < 2
                            ? ' Passing unlocks Phase ' + (selectedPhaseIndex + 2) + '.'
                            : ' Passing completes the full master track!'}
                        </p>
                      </div>

                      <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                        {/* Practice Mock Button */}
                        <button
                          onClick={() => handleOpenExam(selectedPhaseIndex, 'PRACTICE_MOCK')}
                          className="flex items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-3.5 py-2.5 text-xs font-bold text-ink transition-all hover:bg-surface2 cursor-pointer"
                        >
                          <Play className="h-3.5 w-3.5 text-muted" />
                          <span>Practice Mock</span>
                        </button>

                        {/* Official Exam Button */}
                        <button
                          onClick={() => handleOpenExam(selectedPhaseIndex, 'OFFICIAL_EXAM')}
                          className={cn(
                            'flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold text-white transition-all cursor-pointer shadow-2xs active:scale-[0.98]',
                            passed
                              ? 'bg-good hover:opacity-90'
                              : 'bg-accent hover:opacity-90'
                          )}
                        >
                          <Award className="h-3.5 w-3.5" />
                          <span>
                            {passed
                              ? 'Retake Official Exam'
                              : `Take Phase ${selectedPhaseIndex + 1} Exam for Certification`}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </section>

        {/* ========================================================================= */}
        {/* 3 BOTTOM SECTIONS: 1. NOTES, 2. PROJECT IDEAS, 3. JOB PROFILES            */}
        {/* ========================================================================= */}

        {/* 1. NOTES & REVISION CHEATSHEETS */}
        <section id="notes-section" className="space-y-6 pt-6 border-t border-line">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <BookOpen className="h-4 w-4" />
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
                  {course.category === 'DEVOPS' || course.slug.includes('devops') || course.slug.includes('kubernetes')
                    ? 'DevOps Notes & Revision Cheatsheets'
                    : `${course.categoryLabel} Notes & Revision Cheatsheets`}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted mt-1">
                Verified high-yield revision summaries, kernel mechanics, and interview cheat sheets curated by TPO mentors.
              </p>
            </div>

            <span className="text-xs font-mono font-medium text-muted">
              {notes.length} Revision Guides Available
            </span>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              >
                <div className="h-1 w-full bg-gradient-to-r from-warn/70 via-warn/20 to-transparent" />
                <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        'rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
                        note.format === 'CHEATSHEET'
                          ? 'border border-warn/30 bg-warn/10 text-warn'
                          : note.format === 'PDF'
                          ? 'border border-bad/30 bg-bad/10 text-bad'
                          : 'border border-accent/30 bg-accent/10 text-accent'
                      )}
                    >
                      {note.format}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full bg-surface2 px-2.5 py-1 text-[11px] text-muted">
                      <Clock className="h-3 w-3" />
                      <span>{note.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent">
                    {note.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted">
                    {note.contentSummary}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {note.topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="rounded-md border border-line bg-surface2 px-2.5 py-1 text-[11px] font-medium text-ink"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4 text-xs sm:px-6">
                  <button
                    onClick={() => setSelectedNote(note)}
                    className="inline-flex cursor-pointer items-center gap-2 font-semibold text-accent transition-colors hover:opacity-80"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Read Cheatsheet</span>
                  </button>

                  <button
                    onClick={() => {
                      toast(`Downloaded "${note.title}" offline copy.`, 'success');
                    }}
                    className="rounded-md p-2 text-muted transition-colors hover:bg-surface2 hover:text-ink cursor-pointer"
                    title="Download Note PDF"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. PROJECT IDEAS & PRODUCTION CAPSTONES */}
        <section id="projects-section" className="space-y-6 pt-6 border-t border-line">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <Lightbulb className="h-4 w-4" />
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
                  Production-Grade Project Ideas & Capstones
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted mt-1">
                Full-scale portfolio capstones evaluated in tier-1 technical interviews (Cisco, Amazon, Microsoft).
              </p>
            </div>

            <span className="text-xs font-mono font-medium text-muted">
              {projectIdeas.length} Capstone Blueprints
            </span>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
            {projectIdeas.map((project) => (
              <div
                key={project.id}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              >
                <div className="h-1 w-full bg-gradient-to-r from-accent/70 via-accent/20 to-transparent" />
                <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                          'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
                          project.difficulty === 'Production Capstone'
                            ? 'border border-good/30 bg-good/10 text-good'
                          : project.difficulty === 'Advanced'
                            ? 'border border-warn/30 bg-warn/10 text-warn'
                            : 'border border-accent/30 bg-accent/10 text-accent'
                      )}
                    >
                      {project.difficulty}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full bg-surface2 px-2.5 py-1 text-[11px] font-medium text-muted">
                      <Clock className="h-3 w-3" />
                      <span>{project.estimatedHours}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent sm:text-xl">
                    {project.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted">
                    {project.brief}
                  </p>

                  <div className="space-y-3 rounded-xl border border-line bg-surface2/60 p-4">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-ink">
                      Architecture & Implementation Highlights:
                    </span>
                    <ul className="space-y-2 text-sm text-muted">
                      {project.architectureHighlights.map((hl, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-2">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-good" />
                            <span className="leading-relaxed">{hl}</span>
                          </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, tIdx) => (
                      <span
                          key={tIdx}
                          className="rounded-md border border-line bg-surface2 px-2.5 py-1 text-[11px] font-semibold text-ink"
                      >
                          {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4 text-xs sm:px-6">
                  <a
                    href={project.githubTemplateUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      if (!project.githubTemplateUrl || project.githubTemplateUrl === '#') {
                        e.preventDefault();
                        toast('Starter repository template cloned into your IDE project workspace.', 'success');
                      }
                    }}
                    className="inline-flex items-center gap-2 font-semibold text-accent transition-colors hover:opacity-80"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>Clone Starter Template</span>
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>

                  <button
                    onClick={() => handleCopy(project.brief, project.id)}
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-muted transition-colors hover:bg-surface2 hover:text-ink"
                  >
                    {copiedSnippet === project.id ? (
                      <>
                        <Check className="h-3 w-3 text-good" />
                        <span className="text-good">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Spec</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. TARGET JOB PROFILES & CAMPUS RECRUITMENT MATRIX */}
        <section id="jobs-section" className="space-y-6 pt-6 border-t border-line">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-purple-500/10 text-purple-500 border border-purple-500/20">
                  <Briefcase className="h-4 w-4" />
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
                  Target Job Profiles & Campus Hiring Matrix
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted mt-1">
                Verified high-paying campus placement roles, compensation ranges (CTC), and recruiting partner requirements.
              </p>
            </div>

            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
            >
              <span>Explore Live Placement Drives</span>
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
            {jobProfiles.map((job) => (
              <div
                key={job.id}
                className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              >
                <div className="h-1 w-full bg-gradient-to-r from-purple-500/70 via-purple-500/20 to-transparent" />
                <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {job.demandTier}
                    </span>
                    <span className="rounded-lg border border-good/25 bg-good/10 px-3 py-1.5 text-xs font-bold font-mono text-good">
                      {job.ctcRange}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent sm:text-xl">
                    {job.roleTitle}
                  </h3>

                  <div className="space-y-2">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">
                      Top Campus Recruiters:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {job.topHiringCompanies.map((comp, cIdx) => (
                        <span
                          key={cIdx}
                          className="rounded-md border border-line bg-surface2 px-2.5 py-1 text-xs font-medium text-ink"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-line bg-surface2/60 p-3.5">
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink">Placement Eligibility</span>
                    <span className="text-sm leading-relaxed text-muted">{job.placementEligibility}</span>
                  </div>

                  <div className="space-y-2.5 text-sm text-muted">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-ink">
                      Core Responsibilities:
                    </span>
                    {job.keyResponsibilities.map((resp, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-2">
                        <span className="mt-0.5 text-accent">•</span>
                        <span className="leading-relaxed">{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-line px-5 py-4 sm:px-6">
                  <Link
                    href="/jobs"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-surface2 px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent/40 hover:bg-accent/5 hover:text-accent"
                  >
                    <span>View Placement Drives</span>
                    <ChevronRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. VERIFIED STUDENT REVIEWS & PLACEMENT WALL (AT THE VERY BOTTOM)          */}
        {/* ========================================================================= */}
        <section id="reviews-section" className="scroll-mt-20 space-y-6 border-t border-line pt-7 pb-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-warn/20 bg-warn/10 text-warn">
                  <Star className="h-4 w-4 fill-current" />
                </span>
                <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                  Verified Student Reviews & Placement Stories
                </h2>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Real feedback from KIET students and placed alumni who cleared campus placement drives using this track.
              </p>
            </div>

            <button
              onClick={() => setReviewModalOpen(true)}
              className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accentInk shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Write a Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
            {allReviews.map((rev) => (
              <div
                key={rev.id}
                className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all duration-200 hover:border-accent/40 hover:shadow-md"
              >
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent ring-1 ring-accent/20">
                        {rev.studentName
                          .split(/\s+/)
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0]?.toUpperCase())
                          .join('')}
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-bold text-ink">{rev.studentName}</h4>
                        <p className="mt-0.5 truncate text-xs text-muted">
                          {rev.batchYear}
                          {rev.rollNumber && <span className="font-mono"> · {rev.rollNumber}</span>}
                        </p>
                      </div>
                    </div>
                    <Quote aria-hidden="true" className="h-7 w-7 shrink-0 text-accent/25" />
                  </div>

                  <blockquote className="my-5 flex-1 text-sm leading-relaxed text-ink/90">
                    “{rev.reviewText}”
                  </blockquote>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      {rev.placedCompany && (
                        <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-good/20 bg-good/10 px-2.5 py-1.5 text-xs font-semibold text-good">
                          <Building2 className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{rev.placedCompany}</span>
                        </span>
                      )}
                      {rev.placedPackage && (
                        <span className="rounded-lg bg-surface2 px-2.5 py-1.5 text-xs font-medium text-muted">
                          {rev.placedPackage}
                        </span>
                      )}
                    </div>
                    <div
                      className="flex shrink-0 items-center gap-1.5 rounded-full border border-warn/20 bg-warn/10 px-2.5 py-1"
                      aria-label={`${rev.rating} out of 5 stars`}
                    >
                      <Star className="h-3.5 w-3.5 fill-current text-warn" />
                      <span className="text-xs font-bold text-ink">{rev.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex min-w-0 items-center gap-1.5 text-good">
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate font-mono font-medium" title={rev.verifiedCertificateHash || undefined}>
                        {rev.verifiedCertificateHash || 'Verified Student'}
                      </span>
                    </div>
                    <time className="shrink-0 text-muted">{rev.date}</time>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      {/* ========================================================================= */}
      {/* MODALS: EXAM PLAYER, NOTE VIEWER, WRITE REVIEW                            */}
      {/* ========================================================================= */}

      {/* EXAM PLAYER MODAL */}
      {examModalOpen && examTargetPhase && (
        <ExamPlayerModal
          course={course}
          phase={examTargetPhase}
          mode={examMode}
          onClose={() => {
            setExamModalOpen(false);
            setExamTargetPhase(null);
          }}
          onPass={handleExamPassed}
        />
      )}

      {/* NOTE / CHEATSHEET VIEWER MODAL */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl border border-line bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-line flex items-center justify-between gap-3 bg-surface2/40">
              <div className="flex items-center gap-2.5 truncate">
                <BookOpen className="h-5 w-5 shrink-0 text-accent" />
                <div className="truncate">
                  <h3 className="text-sm sm:text-base font-bold text-ink truncate">
                    {selectedNote.title}
                  </h3>
                  <p className="text-xs text-muted">
                    {selectedNote.format} • {selectedNote.readTime}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="p-1 rounded-md text-muted hover:text-ink hover:bg-surface2 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-ink leading-relaxed font-sans">
              <div className="p-3 rounded-lg bg-surface2 border border-line text-xs font-mono">
                <span className="mb-1 block font-bold text-accent">Cheatsheet Overview:</span>
                {selectedNote.contentSummary}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  Key Topics & Tested Formulas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedNote.topics.map((top, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-surface2 border border-line text-xs font-mono font-medium text-ink"
                    >
                      {top}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-surface2/60 p-4 border border-line space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-muted">
                  <span>Syntax Reference Snippet</span>
                  <button
                    onClick={() => handleCopy('cat /proc/self/cgroup && ls -la /sys/fs/cgroup/memory', 'cmd-1')}
                    className="hover:text-ink flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-3 rounded bg-bg border border-line text-ink overflow-x-auto">
{`# 1. Inspect namespace isolation for active PID
lsns -p $$

# 2. Check cgroups v2 memory limits
cat /sys/fs/cgroup/memory.max

# 3. Docker distroless multi-stage build template
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-w -s" -o main .

FROM gcr.io/distroless/static-debian12
COPY --from=builder /app/main /main
USER nonroot:nonroot
ENTRYPOINT ["/main"]`}
                </pre>
              </div>

              <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-ink space-y-1">
                <span className="font-bold text-amber-600 dark:text-amber-400 block">
                  Campus Placement Interview Pro-Tip:
                </span>
                <p className="text-muted leading-relaxed">
                  When asked how containers isolate resources, explicitly differentiate between Linux namespaces (provides view isolation) and cgroups (provides resource ceiling enforcement).
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-line bg-surface2/30 flex items-center justify-between">
              <button
                onClick={() => {
                  toast(`Downloaded offline PDF for ${selectedNote.title}`, 'success');
                }}
                className="px-3.5 py-1.5 rounded-md border border-line bg-surface hover:bg-surface2 text-xs font-semibold text-ink flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Save Offline PDF</span>
              </button>
              <button
                onClick={() => setSelectedNote(null)}
                className="cursor-pointer rounded-md bg-accent px-4 py-1.5 text-xs font-bold text-accentInk hover:opacity-90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WRITE A REVIEW MODAL */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-surface shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-line flex items-center justify-between bg-surface2/40">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-accent" />
                <h3 className="text-base font-bold text-ink">Write a Student Review</h3>
              </div>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="p-1 rounded text-muted hover:text-ink cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-ink block mb-1.5">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewReview((prev) => ({ ...prev, rating: s }))}
                      className="cursor-pointer p-1 text-warn transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          'h-6 w-6',
                          s <= newReview.rating ? 'fill-current text-warn' : 'text-line'
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-muted ml-2">
                    {newReview.rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">
                    Placed Company / Role (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cisco Systems or Intern"
                    value={newReview.placedCompany}
                    onChange={(e) =>
                      setNewReview((prev) => ({ ...prev, placedCompany: e.target.value }))
                    }
                    className="w-full rounded-md border border-line bg-surface2 px-3 py-2 text-xs text-ink focus:border-accent focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">
                    Package / CTC (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹18.0 LPA"
                    value={newReview.placedPackage}
                    onChange={(e) =>
                      setNewReview((prev) => ({ ...prev, placedPackage: e.target.value }))
                    }
                    className="w-full rounded-md border border-line bg-surface2 px-3 py-2 text-xs text-ink focus:border-accent focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  Your Review & Placement Experience
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share how the 3-phase progression, hands-on labs, and exams helped your placement rounds..."
                  value={newReview.reviewText}
                  onChange={(e) =>
                    setNewReview((prev) => ({ ...prev, reviewText: e.target.value }))
                  }
                  className="w-full resize-none rounded-md border border-line bg-surface2 px-3 py-2 text-xs text-ink focus:border-accent focus:outline-hidden"
                />
              </div>

              <div className="p-3 rounded-lg bg-surface2/60 border border-line text-[11px] text-muted flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-good" />
                <span>
                  Posting as <strong>{student.name}</strong> (Roll: {student.rollNumber || '2100290100042'}). Verified certificate hash will automatically be attached if Phase 1 is passed.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-line text-xs font-semibold text-muted hover:text-ink cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-md bg-accent px-5 py-2 text-xs font-bold text-accentInk shadow-2xs transition-all hover:opacity-90"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
