'use client';

import { useState } from 'react';
import {
  X,
  Star,
  FileText,
  Users,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import { CourseItem } from './coursesData';
import { useStudent } from '../store';
import { useToast } from '../toast';
import { ExamPlayerModal } from './ExamPlayerModal';

interface CourseGatekeeperModalProps {
  course: CourseItem | null;
  onClose: () => void;
}

export function CourseGatekeeperModal({ course, onClose }: CourseGatekeeperModalProps) {
  const { student, addCertification } = useStudent();
  const toast = useToast();
  const [enrolled, setEnrolled] = useState(false);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [activeExamMode, setActiveExamMode] = useState<'PRACTICE_MOCK' | 'OFFICIAL_EXAM' | null>(null);
  const [passedPhases, setPassedPhases] = useState<Record<number, { certHash: string; passedAt: string }>>({});
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({
    'mod-0': true,
  });

  if (!course) return null;

  const handleEnroll = () => {
    setEnrolled(true);
    addCertification({
      title: `${course.title} (Phase 1: Foundation)`,
      issuingOrg: `KIET Academy · ${course.mentor.department}`,
      issueDate: new Date().toISOString().slice(0, 10),
      credentialUrl: `https://kiet.edu/credentials/${course.slug}`,
      isInternalCourse: true,
      certificateHash: `CERT-KIET-${course.category}-${Date.now().toString().slice(-6)}`,
    });
    toast(`Successfully enrolled in ${course.title}! Phase 1 unlocked.`, 'success');
  };

  const currentPhase = course.phases[activePhaseIndex] || course.phases[0];
  const passedPhaseData = passedPhases[activePhaseIndex];
  const isPassed = !!passedPhaseData;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
          onClick={onClose}
        />

        {/* Modal Dialog */}
        <div className="relative w-full max-w-3xl rounded-md bg-surface shadow-xl border border-line overflow-hidden z-10 my-auto animate-fade-up max-h-[90vh] flex flex-col text-ink">
          {/* Header Bar (Theme-Aware GitHub Primer Surface) */}
          <div className="relative p-5 sm:p-6 bg-surface border-b border-line text-ink">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-7 w-7 rounded-md bg-surface2 hover:bg-surface border border-line text-muted hover:text-ink flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-xs font-mono font-bold">
                {course.priceTag}
              </span>
              <span className="rounded-md bg-surface2 border border-line px-2 py-0.5 text-xs font-semibold text-muted">
                {course.categoryLabel}
              </span>
              <span className="rounded-md bg-[#0969da]/10 border border-[#0969da]/20 text-[#0969da] text-xs px-2 py-0.5 font-bold">
                TPO Verified Track
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold leading-snug tracking-tight text-ink pr-8">
              {course.title}
            </h2>

            {/* Mentor Row */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-line text-xs text-muted">
              <div className="flex items-center gap-2.5">
                <img
                  src={course.mentor.avatarUrl}
                  alt={course.mentor.name}
                  className="h-6 w-6 rounded-full object-cover border border-line"
                />
                <div>
                  <span className="font-semibold text-ink block">{course.mentor.name}</span>
                  <span className="text-[11px] text-muted">{course.mentor.title} • {course.mentor.department}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-amber-500">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-ink">{course.rating.toFixed(2)}</span>
                <span className="text-muted">({course.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-md bg-surface2 border border-line flex items-center gap-3">
                <FileText className="h-4 w-4 text-[#0969da]" />
                <div>
                  <div className="text-[11px] text-muted">Curriculum</div>
                  <div className="text-xs font-bold text-ink">{course.lessonsCount} Modules</div>
                </div>
              </div>

              <div className="p-3 rounded-md bg-surface2 border border-line flex items-center gap-3">
                <Users className="h-4 w-4 text-[#0969da]" />
                <div>
                  <div className="text-[11px] text-muted">Students</div>
                  <div className="text-xs font-bold text-ink">{course.studentsCount} Peers</div>
                </div>
              </div>

              <div className="p-3 rounded-md bg-surface2 border border-line flex items-center gap-3">
                <Clock className="h-4 w-4 text-[#9a6700]" />
                <div>
                  <div className="text-[11px] text-muted">Lab Duration</div>
                  <div className="text-xs font-bold text-ink">{course.labHours} Hours</div>
                </div>
              </div>

              <div className="p-3 rounded-md bg-surface2 border border-line flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-[#1a7f37]" />
                <div>
                  <div className="text-[11px] text-muted">Certification</div>
                  <div className="text-xs font-bold text-ink">3-Phase Gate</div>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                Course Overview
              </h4>
              <p className="text-xs sm:text-sm text-ink leading-relaxed">
                {course.overview}
              </p>
            </div>

            {/* 3-Phase Gatekeeper Architecture */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#0969da]" />
                  <span>3-Phase Gatekeeper Learning Engine</span>
                </h4>
                <span className="text-[11px] text-muted">
                  Cutoff: &ge; 70% per Phase
                </span>
              </div>

              <div className="space-y-2.5">
                {course.phases.map((phase, idx) => {
                  const isSelected = activePhaseIndex === idx;
                  const phasePassed = !!passedPhases[idx];

                  return (
                    <div
                      key={phase.title}
                      onClick={() => setActivePhaseIndex(idx)}
                      className={`rounded-md border p-3.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#0969da] bg-[#ddf4ff]/20 dark:bg-[#388bfd]/20 ring-1 ring-[#0969da]'
                          : 'border-line bg-surface hover:border-[#8c959f]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                              phasePassed
                                ? 'bg-[#1f883d] text-white'
                                : idx === 0
                                ? 'bg-[#0969da] text-white'
                                : 'bg-surface2 text-muted border border-line'
                            }`}
                          >
                            {phasePassed ? '✓' : idx + 1}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-ink">{phase.title}</span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-surface2 border border-line text-ink">
                                {phase.level}
                              </span>
                              {phasePassed && (
                                <span className="text-[9.5px] font-bold text-[#1a7f37] bg-[#dafbe1] px-1.5 py-0.2 rounded border border-[#4ac26b]/30">
                                  Passed
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted mt-1 leading-relaxed">
                              {phase.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {phase.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="text-[10.5px] font-medium px-2 py-0.5 rounded bg-surface2 border border-line text-ink"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-medium text-muted block">
                            {phase.duration}
                          </span>
                          <span className="text-[10px] font-bold text-[#1a7f37] block mt-0.5">
                            Cutoff: {phase.examCutoff}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Embedded In-Phase Assessment & Module Checklist */}
            <div className="rounded-lg border border-line bg-surface2/40 p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-line">
                <div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted block">
                    Active Interactive Phase
                  </span>
                  <h5 className="text-sm font-bold text-ink flex items-center gap-2 mt-0.5">
                    <span>{currentPhase.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-line font-mono font-semibold">
                      {currentPhase.level}
                    </span>
                  </h5>
                </div>

                {isPassed ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#dafbe1] text-[#1a7f37] border border-[#4ac26b]/40 text-xs font-bold font-mono">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    PASSED ({passedPhaseData.certHash})
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-muted font-mono">
                    Passing Cutoff: &ge; {currentPhase.examCutoff}%
                  </span>
                )}
              </div>

              {/* Modular Curriculum Checklist */}
              <div>
                <span className="text-xs font-bold text-muted block mb-2">
                  Phase Practical Labs & Milestones
                </span>
                <div className="space-y-1.5">
                  {currentPhase.skills.map((skill, sIdx) => {
                    const modKey = `p${activePhaseIndex}-m${sIdx}`;
                    const isDone = !!completedLessons[modKey] || sIdx === 0;
                    return (
                      <label
                        key={skill}
                        className="flex items-center justify-between p-2 rounded-md bg-surface border border-line/70 hover:border-line text-xs cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={(e) =>
                              setCompletedLessons((prev) => ({ ...prev, [modKey]: e.target.checked }))
                            }
                            className="h-3.5 w-3.5 rounded border-line text-[#0969da] focus:ring-0"
                          />
                          <span className={isDone ? 'text-muted line-through font-medium' : 'text-ink font-medium'}>
                            Module {sIdx + 1}: {skill} Hands-on Lab
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-muted">
                          {isDone ? 'Completed' : 'Pending'}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Assessment Station */}
              <div className="p-3.5 rounded-md bg-surface border border-line space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h6 className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-[#0969da]" />
                      <span>In-Phase Assessment & Anti-Cheating Telemetry</span>
                    </h6>
                    <p className="text-[11px] text-muted mt-0.5 leading-relaxed">
                      Practice with unlimited attempts or take the official 15-minute server-timed exam (3 tab exits limit, &ge;70% cutoff) to mint an official tamper-proof certificate.
                    </p>
                  </div>
                </div>

                {/* Exam Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={() => setActiveExamMode('PRACTICE_MOCK')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface2 hover:bg-surface border border-line text-ink font-semibold text-xs transition-all active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <span>🧪 Start Practice Mock</span>
                  </button>

                  <button
                    onClick={() => setActiveExamMode('OFFICIAL_EXAM')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#0969da] hover:bg-[#0860ca] text-white font-semibold text-xs transition-all active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <span>🎯 Take Official Phase Exam (&ge;70%)</span>
                  </button>

                  <Link
                    href={`/contact?category=COURSE_DOUBT&course=${encodeURIComponent(course.title)}&phase=${encodeURIComponent(currentPhase.title)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface2 hover:bg-surface border border-line text-muted hover:text-ink font-medium text-xs transition-all cursor-pointer shadow-2xs ml-auto"
                  >
                    <span>🎫 Raise Doubt Ticket</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Institutional Partner Banner */}
            <div className="p-3 rounded-md bg-surface2 border border-line flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-[#0969da] shrink-0" />
                <span className="font-medium text-ink">
                  Eligible Shortlists: <strong className="text-[#0969da]">{course.tpoPartner}</strong>
                </span>
              </div>
              <span className="text-[11px] text-muted hidden sm:inline">KIET Placement Track</span>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 sm:p-5 border-t border-line bg-surface2 flex items-center justify-between gap-3">
            <div className="text-xs text-muted">
              {enrolled ? (
                <span className="flex items-center gap-1.5 text-[#1a7f37] font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  Enrolled with {student.email}
                </span>
              ) : (
                <span>Free for all enrolled KIET engineering students</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-semibold text-ink hover:bg-surface rounded-md transition-colors border border-line cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleEnroll}
                disabled={enrolled}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#1f883d] hover:bg-[#1a7f37] disabled:bg-[#d0d7de] disabled:cursor-not-allowed text-white font-semibold text-xs px-4 py-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
              >
                <span>{enrolled ? 'Already Enrolled' : 'Enroll In Track'}</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Exam Engine Modal */}
      {activeExamMode && (
        <ExamPlayerModal
          course={course}
          phase={currentPhase}
          mode={activeExamMode}
          onClose={() => setActiveExamMode(null)}
          onPass={(certHash) => {
            setPassedPhases((prev) => ({
              ...prev,
              [activePhaseIndex]: {
                certHash,
                passedAt: new Date().toLocaleDateString(),
              },
            }));
            setActiveExamMode(null);
            if (activePhaseIndex < course.phases.length - 1) {
              setActivePhaseIndex(activePhaseIndex + 1);
            }
          }}
        />
      )}
    </>
  );
}
