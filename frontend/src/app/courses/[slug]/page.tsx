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
import { CourseFooter } from '@/components/courses/CourseFooter';
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#0969da] hover:bg-[#0854b0] text-white text-xs font-bold transition-all shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Courses</span>
          </Link>
        </div>
        <CourseFooter />
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
    <div className="min-h-screen bg-bg text-ink font-sans flex flex-col transition-colors selection:bg-[#0969da]/20 selection:text-[#0969da]">
      {/* 1. Top Breadcrumb & Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted truncate">
            <Link
              href="/courses"
              className="hover:text-ink flex items-center gap-1.5 transition-colors font-medium shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>All Courses</span>
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
            <span className="font-semibold text-muted shrink-0 uppercase tracking-wider text-[11px]">
              {course.categoryLabel}
            </span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40 hidden sm:inline-block" />
            <span className="text-ink font-semibold truncate hidden sm:inline-block max-w-[260px] md:max-w-[400px]">
              {course.title}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Share / Back */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  navigator.clipboard.writeText(window.location.href);
                  toast('Course workspace link copied to clipboard!', 'success');
                }
              }}
              className="p-1.5 rounded-md border border-line bg-surface hover:bg-surface2 text-muted hover:text-ink transition-colors cursor-pointer"
              title="Share Course Link"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <Link
              href="/courses"
              className="px-3 py-1.5 rounded-md border border-line bg-surface hover:bg-surface2 text-xs font-semibold text-ink transition-colors"
            >
              Catalog
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Course Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* HERO SECTION */}
        <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#0969da]/10 text-[#0969da] border border-[#0969da]/30">
                  <Sparkles className="h-3 w-3" />
                  <span>{course.categoryLabel} Track</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#dafbe1] text-[#1a7f37] border border-[#4ac26b]/40">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{course.priceTag}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface2 text-muted border border-line">
                  <Clock className="h-3 w-3" />
                  <span>{course.labHours} Hands-On Lab Hours</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
                {course.overview}
              </p>

              {/* TPO Partner & Accreditation Callout */}
              <div className="p-3.5 rounded-xl bg-surface2/60 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-[#0969da]/10 border border-[#0969da]/20 flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4 text-[#0969da]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink">
                      TPO Placement Partner Accreditation
                    </p>
                    <p className="text-[11px] text-muted">
                      {course.tpoPartner}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted">
                  <div className="flex items-center gap-1 text-[#9a6700]">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="font-bold text-ink">{course.rating.toFixed(1)}</span>
                    <span className="text-[11px] text-muted">({course.reviewCount} reviews)</span>
                  </div>
                  <span>•</span>
                  <span>{course.studentsCount} Students Enrolled</span>
                </div>
              </div>
            </div>

            {/* Right Mentor & Quick Status Card */}
            <div className="lg:col-span-4 rounded-xl border border-line bg-surface2/40 p-5 space-y-5">
              <div className="flex items-center gap-3">
                <img
                  src={course.mentor.avatarUrl}
                  alt={course.mentor.name}
                  className="h-12 w-12 rounded-full object-cover border border-line shadow-2xs"
                />
                <div>
                  <h4 className="text-sm font-bold text-ink">{course.mentor.name}</h4>
                  <p className="text-xs text-muted">{course.mentor.title}</p>
                  <p className="text-[11px] text-muted/80">{course.mentor.department}</p>
                </div>
              </div>

              {/* Overall Track Progression Mini Dashboard */}
              <div className="pt-3 border-t border-line space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted">Certification Status</span>
                  <span className="font-bold text-ink font-mono">
                    {phase3Passed
                      ? '100% (Mastery)'
                      : phase2Passed
                      ? '66% (Phase 2 Passed)'
                      : phase1Passed
                      ? '33% (Phase 1 Passed)'
                      : '0% (Phase 1 In-Progress)'}
                  </span>
                </div>
                {/* Visual Progress Bar */}
                <div className="h-2 w-full rounded-full bg-surface2 overflow-hidden border border-line">
                  <div
                    className="h-full bg-[#1f883d] transition-all duration-500 rounded-full"
                    style={{
                      width: phase3Passed ? '100%' : phase2Passed ? '66%' : phase1Passed ? '33%' : '5%',
                    }}
                  />
                </div>
              </div>

              {/* Verified Certificate Minted Badge if any */}
              {phase1Passed && (
                <div className="p-3 rounded-lg bg-[#dafbe1]/40 border border-[#4ac26b]/30 flex items-start gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-[#1a7f37] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-[#1a7f37]">Verified Credential Active</p>
                    <p className="text-[11px] font-mono text-muted mt-0.5">
                      Hash: {certHashes[0] || 'CERT-KIET-VERIFIED'}
                    </p>
                  </div>
                </div>
              )}

              {/* Quick Jump Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href="#phases-section"
                  className="w-full py-2 px-3 rounded-md bg-[#0969da] hover:bg-[#0854b0] text-white text-xs font-bold text-center transition-all shadow-2xs"
                >
                  Go to 3-Phase Gatekeeper ↓
                </a>
                <a
                  href="#notes-section"
                  className="w-full py-2 px-3 rounded-md bg-surface border border-line hover:bg-surface2 text-ink text-xs font-semibold text-center transition-all"
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
        <section id="phases-section" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-line pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-[#0969da]/10 text-[#0969da] border border-[#0969da]/20">
                  <Layers className="h-4 w-4" />
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
                  3-Phase Gatekeeper Certification Engine
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl">
                Mandatory sequential mastery. Pass each timed exam to unlock the next phase, mint cryptographic institutional certificates, and unlock top campus placement shortlists.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-muted">
              <span>Cutoff Policy: 70%+ To Unlock Next Phase</span>
            </div>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {course.phases.map((ph, idx) => {
              const unlocked = isPhaseUnlocked(idx);
              const passed = isPhasePassed(idx);
              const isSelected = selectedPhaseIndex === idx;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedPhaseIndex(idx)}
                  className={cn(
                    'p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer',
                    isSelected
                      ? 'border-[#0969da] bg-surface ring-2 ring-[#0969da]/20 shadow-xs'
                      : 'border-line bg-surface hover:bg-surface2/60',
                    !unlocked && 'opacity-70 bg-surface2/20'
                  )}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
                      Phase 0{idx + 1}
                    </span>

                    {/* Status Badge */}
                    {passed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1a7f37] bg-[#dafbe1] px-2 py-0.5 rounded-full border border-[#4ac26b]/40">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Certified</span>
                      </span>
                    ) : unlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0969da] bg-[#0969da]/10 px-2 py-0.5 rounded-full border border-[#0969da]/30">
                        <Unlock className="h-3 w-3" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-muted bg-surface2 px-2 py-0.5 rounded-full border border-line">
                        <Lock className="h-3 w-3" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-ink leading-snug line-clamp-1">
                      {ph.title}
                    </h3>
                    <p className="text-xs text-muted mt-1 line-clamp-2">
                      {ph.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-line/60 flex items-center justify-between text-[11px] text-muted">
                    <span>{ph.duration}</span>
                    <span className="font-semibold text-ink">Cutoff {ph.examCutoff}%</span>
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
              <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-[#0969da]/10 text-[#0969da] border border-[#0969da]/30">
                        Phase {selectedPhaseIndex + 1} of 3
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted">
                        Level: {currentPhase.level}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight mt-1.5">
                      {currentPhase.title}
                    </h3>
                  </div>

                  {/* Certified Hash Pill */}
                  {passed && certHash && (
                    <div className="p-2.5 rounded-lg bg-[#dafbe1] border border-[#4ac26b]/40 text-xs flex items-center gap-2">
                      <Award className="h-4 w-4 text-[#1a7f37]" />
                      <div>
                        <span className="font-bold text-[#1a7f37]">Exam Cleared</span>
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
                      <p className="text-xs text-muted mt-1 leading-relaxed">
                        To unlock this phase, you must complete Phase {selectedPhaseIndex} syllabus and score $\ge${course.phases[selectedPhaseIndex - 1]?.examCutoff}% on the Phase {selectedPhaseIndex} Certification Exam.
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedPhaseIndex(selectedPhaseIndex - 1)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#0969da] hover:bg-[#0854b0] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Switch to Phase {selectedPhaseIndex} Exam</span>
                    </button>
                  </div>
                ) : (
                  /* Unlocked Phase Content & Actions */
                  <div className="space-y-6">
                    <p className="text-sm text-ink leading-relaxed">
                      {currentPhase.description}
                    </p>

                    {/* Competency & Skills Chips */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2.5">
                        Key Competencies & Tested Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentPhase.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-surface2 border border-line text-xs font-medium text-ink"
                          >
                            <Check className="h-3 w-3 text-[#1a7f37]" />
                            <span>{skill}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Phase Syllabus Modules */}
                    <div className="rounded-xl border border-line bg-surface2/30 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-ink flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-[#0969da]" />
                          <span>Curriculum Modules ({currentPhase.modulesCount} modules)</span>
                        </span>
                        <span className="text-[11px] text-muted">Self-Paced with Mandatory Lab Checks</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-surface border border-line flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="h-4 w-4 text-[#1a7f37]" />
                            <span className="font-semibold text-ink">Module 1.1: Core Architecture & Theory</span>
                          </div>
                          <span className="text-muted font-mono text-[11px]">Completed</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-surface border border-line flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="h-4 w-4 text-[#1a7f37]" />
                            <span className="font-semibold text-ink">Module 1.2: Terminal Commands & Hands-on Diagnostics</span>
                          </div>
                          <span className="text-muted font-mono text-[11px]">Completed</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-surface border border-line flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <Clock className="h-4 w-4 text-[#9a6700]" />
                            <span className="font-semibold text-ink">Module 1.3: Production Hardening & Troubleshooting</span>
                          </div>
                          <span className="text-muted font-mono text-[11px]">Ready for Exam</span>
                        </div>
                      </div>
                    </div>

                    {/* EXAM CALL TO ACTION BUTTONS (THE CORE REQUIREMENT) */}
                    <div className="p-5 rounded-xl border border-[#0969da]/30 bg-[#0969da]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-[#0969da]" />
                          <h4 className="text-sm font-bold text-ink">
                            Phase {selectedPhaseIndex + 1} Certification Assessment
                          </h4>
                        </div>
                        <p className="text-xs text-muted mt-1">
                          Server-timed assessment ({currentPhase.examCutoff}% cutoff). Anti-cheating proctoring active.
                          {passed
                            ? ' You have already passed this phase!'
                            : selectedPhaseIndex < 2
                            ? ' Passing unlocks Phase ' + (selectedPhaseIndex + 2) + '.'
                            : ' Passing completes the full master track!'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Practice Mock Button */}
                        <button
                          onClick={() => handleOpenExam(selectedPhaseIndex, 'PRACTICE_MOCK')}
                          className="px-3.5 py-2 rounded-md border border-line bg-surface hover:bg-surface2 text-ink text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Play className="h-3.5 w-3.5 text-muted" />
                          <span>Practice Mock</span>
                        </button>

                        {/* Official Exam Button */}
                        <button
                          onClick={() => handleOpenExam(selectedPhaseIndex, 'OFFICIAL_EXAM')}
                          className={cn(
                            'px-4 py-2 rounded-md text-white text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-2 active:scale-95',
                            passed
                              ? 'bg-[#1f883d] hover:bg-[#1a7f37]'
                              : 'bg-[#0969da] hover:bg-[#0854b0]'
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group rounded-xl border border-line bg-surface p-5 hover:border-[#8c959f] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase',
                        note.format === 'CHEATSHEET'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                          : note.format === 'PDF'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/30'
                          : 'bg-[#0969da]/10 text-[#0969da] border border-[#0969da]/30'
                      )}
                    >
                      {note.format}
                    </span>
                    <span className="text-[11px] text-muted flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{note.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-ink group-hover:text-[#0969da] transition-colors leading-snug">
                    {note.title}
                  </h3>

                  <p className="text-xs text-muted leading-relaxed line-clamp-2">
                    {note.contentSummary}
                  </p>

                  {/* Topics Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {note.topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-surface2 text-[11px] font-mono text-ink/80 border border-line"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-line flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedNote(note)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0969da] hover:underline cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Read Cheatsheet</span>
                  </button>

                  <button
                    onClick={() => {
                      toast(`Downloaded "${note.title}" offline copy.`, 'success');
                    }}
                    className="p-1.5 rounded hover:bg-surface2 text-muted hover:text-ink transition-colors cursor-pointer"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projectIdeas.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-line bg-surface p-6 space-y-4 hover:border-[#8c959f] transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                        project.difficulty === 'Production Capstone'
                          ? 'bg-[#dafbe1] text-[#1a7f37] border border-[#4ac26b]/40'
                          : project.difficulty === 'Advanced'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                          : 'bg-[#0969da]/10 text-[#0969da] border border-[#0969da]/30'
                      )}
                    >
                      {project.difficulty}
                    </span>
                    <span className="text-xs font-mono text-muted flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{project.estimatedHours}</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-ink leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-xs text-muted leading-relaxed">
                    {project.brief}
                  </p>

                  {/* Architecture Highlights */}
                  <div className="p-3 rounded-lg bg-surface2/60 border border-line space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink block">
                      Architecture & Implementation Highlights:
                    </span>
                    <ul className="space-y-1.5 text-xs text-muted">
                      {project.architectureHighlights.map((hl, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-[#1a7f37] shrink-0 mt-0.5" />
                          <span className="leading-snug">{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded bg-surface2 text-[11px] font-semibold text-ink border border-line"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-line flex items-center justify-between text-xs">
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
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0969da] hover:underline cursor-pointer"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>Clone Starter Template</span>
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>

                  <button
                    onClick={() => handleCopy(project.brief, project.id)}
                    className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-ink cursor-pointer"
                  >
                    {copiedSnippet === project.id ? (
                      <>
                        <Check className="h-3 w-3 text-[#1a7f37]" />
                        <span className="text-[#1a7f37]">Copied!</span>
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0969da] hover:underline"
            >
              <span>Explore Live Placement Drives</span>
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {jobProfiles.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-line bg-surface p-5 space-y-4 hover:border-[#8c959f] transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                      {job.demandTier}
                    </span>
                    <span className="text-xs font-bold font-mono text-[#1a7f37]">
                      {job.ctcRange}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-ink leading-snug">
                    {job.roleTitle}
                  </h3>

                  {/* Top Recruiters */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1.5">
                      Top Campus Recruiters:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.topHiringCompanies.map((comp, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-2 py-0.5 rounded bg-surface2 text-[11px] font-medium text-ink border border-line"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Placement Eligibility */}
                  <div className="p-2.5 rounded-lg bg-surface2/60 border border-line text-xs">
                    <span className="font-semibold text-ink block">Placement Eligibility:</span>
                    <span className="text-muted text-[11px]">{job.placementEligibility}</span>
                  </div>

                  {/* Key Responsibilities */}
                  <div className="space-y-1.5 text-xs text-muted">
                    <span className="font-semibold text-ink text-[11px] uppercase tracking-wider block">
                      Core Responsibilities:
                    </span>
                    {job.keyResponsibilities.map((resp, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-1.5">
                        <span className="text-muted mt-0.5">•</span>
                        <span className="leading-snug">{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-line">
                  <Link
                    href="/jobs"
                    className="w-full py-2 px-3 rounded-md bg-surface border border-line hover:bg-surface2 text-xs font-bold text-ink flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Placement Drives</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. VERIFIED STUDENT REVIEWS & PLACEMENT WALL (AT THE VERY BOTTOM)          */}
        {/* ========================================================================= */}
        <section id="reviews-section" className="space-y-6 pt-6 border-t border-line pb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-[#9a6700]/10 text-[#9a6700] border border-[#9a6700]/20">
                  <Star className="h-4 w-4 fill-current" />
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
                  Verified Student Reviews & Placement Stories
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted mt-1">
                Real feedback from KIET students and placed alumni who cleared campus placement drives using this track.
              </p>
            </div>

            <button
              onClick={() => setReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#0969da] hover:bg-[#0854b0] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer shrink-0"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Write a Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {allReviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-xl border border-line bg-surface p-5 space-y-3.5 hover:border-[#8c959f] transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Reviewer Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-ink">{rev.studentName}</h4>
                      <p className="text-[11px] font-mono text-muted">
                        Roll: {rev.rollNumber} • {rev.batchYear}
                      </p>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-0.5 text-[#9a6700]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-3 w-3',
                            i < rev.rating ? 'fill-current text-[#9a6700]' : 'text-line'
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Placed Company Pill */}
                  {rev.placedCompany && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-[#1a7f37] border border-emerald-500/20 text-xs font-semibold">
                      <Building2 className="h-3 w-3" />
                      <span>{rev.placedCompany}</span>
                      {rev.placedPackage && (
                        <span className="font-mono text-[11px] text-muted">({rev.placedPackage})</span>
                      )}
                    </div>
                  )}

                  {/* Review Text */}
                  <p className="text-xs text-ink/90 leading-relaxed italic">
                    &quot;{rev.reviewText}&quot;
                  </p>
                </div>

                {/* Verified Credential Tag */}
                <div className="pt-3 border-t border-line flex items-center justify-between text-[11px] text-muted">
                  <div className="flex items-center gap-1.5 text-[#1a7f37]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span className="font-mono font-medium">
                      {rev.verifiedCertificateHash || 'Verified Student'}
                    </span>
                  </div>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 3. Global Footer */}
      <CourseFooter />

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
                <BookOpen className="h-5 w-5 text-[#0969da] shrink-0" />
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
                <span className="font-bold text-[#0969da] block mb-1">Cheatsheet Overview:</span>
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
                className="px-4 py-1.5 rounded-md bg-[#0969da] hover:bg-[#0854b0] text-white text-xs font-bold cursor-pointer"
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
                <MessageSquare className="h-5 w-5 text-[#0969da]" />
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
                      className="p-1 text-[#9a6700] hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={cn(
                          'h-6 w-6',
                          s <= newReview.rating ? 'fill-current text-[#9a6700]' : 'text-line'
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
                    className="w-full px-3 py-2 rounded-md bg-surface2 border border-line text-xs text-ink focus:outline-hidden focus:border-[#0969da]"
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
                    className="w-full px-3 py-2 rounded-md bg-surface2 border border-line text-xs text-ink focus:outline-hidden focus:border-[#0969da]"
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
                  className="w-full px-3 py-2 rounded-md bg-surface2 border border-line text-xs text-ink focus:outline-hidden focus:border-[#0969da] resize-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-surface2/60 border border-line text-[11px] text-muted flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#1a7f37] shrink-0" />
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
                  className="px-5 py-2 rounded-md bg-[#0969da] hover:bg-[#0854b0] text-white text-xs font-bold cursor-pointer transition-all shadow-2xs"
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
