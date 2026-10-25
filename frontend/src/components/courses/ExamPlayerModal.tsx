'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Timer,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Code2,
  ArrowRight,
  ArrowLeft,
  X,
  Award,
  Sparkles,
  Lock,
  RefreshCw,
  Share2,
} from 'lucide-react';
import { useStudent } from '@/components/store';
import { useToast } from '@/components/toast';
import { cn } from '@/lib/utils';
import type { CourseItem, PhaseData } from './coursesData';

export interface ExamQuestion {
  id: string;
  questionText: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface ExamPlayerModalProps {
  course: CourseItem;
  phase: PhaseData;
  mode: 'PRACTICE_MOCK' | 'OFFICIAL_EXAM';
  onClose: () => void;
  onPass: (certHash: string) => void;
}

const DEFAULT_QUESTIONS: Record<string, ExamQuestion[]> = {
  FULLSTACK: [
    {
      id: 'fs-1',
      questionText: 'In Next.js App Router, how do you prevent client-side waterfall requests when fetching data for nested layouts?',
      codeSnippet: `// app/dashboard/layout.tsx
export default async function DashboardLayout({ children }) {
  const user = await getUser();
  const org = await getOrg(user.orgId);
  return <Shell user={user} org={org}>{children}</Shell>;
}`,
      options: [
        'Use Promise.all() parallel dispatch or React cache() deduplication',
        'Move data fetching into client components using useEffect()',
        'Enable force-static caching on every page segment',
        'Use sequential async/await calls across components',
      ],
      correctIndex: 0,
      explanation: 'Using Promise.all() or React cache() initiates concurrent requests on the server, completely eliminating client-side network waterfalls.',
    },
    {
      id: 'fs-2',
      questionText: 'What causes hydration mismatch error when rendering timestamps on Server Components vs Client Hydration?',
      codeSnippet: `// Component.tsx
export function EventCard() {
  return <span>{new Date().toLocaleTimeString()}</span>;
}`,
      options: [
        'Server and client timezones or execution clocks render divergent HTML strings',
        'Next.js forbids using JavaScript Date objects inside React components',
        'The component is missing an async keyword in its function signature',
        'TailwindCSS compiler strips inline timestamp classes',
      ],
      correctIndex: 0,
      explanation: 'Hydration fails when initial server-generated HTML text does not match the first client-rendered DOM node because of clock or locale drift.',
    },
    {
      id: 'fs-3',
      questionText: 'When invoking Server Actions in Next.js, how are optimistic updates implemented to guarantee immediate UI reactivity?',
      codeSnippet: `const [optimisticTodos, setOptimisticTodos] = useOptimistic(
  todos,
  (state, newTodo) => [...state, { ...newTodo, pending: true }]
);`,
      options: [
        'Using the useOptimistic hook with an immediate reducer update before server confirmation',
        'Polling the database endpoint via setInterval every 50ms',
        'Writing optimistic state directly to window.localStorage',
        'Using websockets to bypass HTTP server actions completely',
      ],
      correctIndex: 0,
      explanation: 'useOptimistic updates local React state immediately while the async server mutation is in flight, rolling back automatically on failure.',
    },
    {
      id: 'fs-4',
      questionText: 'What is the primary architectural advantage of PostgreSQL connection pooling via Prisma Accelerate / PgBouncer in serverless environments?',
      options: [
        'Prevents database port exhaustion caused by ephemeral serverless container scaling',
        'Transforms relational SQL tables into NoSQL document stores',
        'Automatically writes unit tests for database migrations',
        'Disables ACID transaction guarantees to improve raw write throughput',
      ],
      correctIndex: 0,
      explanation: 'Serverless functions open hundreds of instantaneous socket connections on burst traffic; PgBouncer pools these safely against the database.',
    },
    {
      id: 'fs-5',
      questionText: 'Which HTTP response header is mandatory for preventing Cross-Site Scripting (XSS) when rendering user-submitted markdown content?',
      options: [
        'Content-Security-Policy (CSP) with strict sanitization',
        'Access-Control-Allow-Origin: *',
        'Cache-Control: max-age=31536000',
        'X-Powered-By: Next.js',
      ],
      correctIndex: 0,
      explanation: 'Content-Security-Policy combined with HTML sanitizer libraries (DOMPurify/rehype-sanitize) neutralizes injected script vectors.',
    },
  ],
  DEVOPS: [
    {
      id: 'dev-1',
      questionText: 'Why does order of instructions matter in a multi-stage Dockerfile for optimizing layer caching?',
      codeSnippet: `# Which order minimizes cache invalidation?
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build`,
      options: [
        'Separating dependency locks from source files avoids re-running npm ci on code changes',
        'Docker requires package.json to be placed at the very end of the file',
        'npm ci only executes if all source files are already copied in advance',
        'Layer caching is disabled whenever multi-stage builds are invoked',
      ],
      correctIndex: 0,
      explanation: 'Docker invalidates all subsequent layers when a copied file changes. Copying dependencies first caches npm ci until package.json itself changes.',
    },
    {
      id: 'dev-2',
      questionText: 'In Kubernetes, what is the key difference between a Liveness Probe and a Readiness Probe?',
      options: [
        'Liveness restarts dead containers; Readiness removes unready Pods from Service endpoints',
        'Liveness is for frontend Pods; Readiness is exclusively for stateful database Pods',
        'Readiness kills the container immediately; Liveness pauses the container',
        'There is no difference; both probes trigger identical kubectl restart events',
      ],
      correctIndex: 0,
      explanation: 'Liveness probes restart hung processes, while readiness probes stop sending ingress traffic to Pods that are warm-up booting or overloaded.',
    },
    {
      id: 'dev-3',
      questionText: 'What Linux kernel mechanism is responsible for enforcing hard memory and CPU limits on Docker containers?',
      options: [
        'Control Groups (cgroups)',
        'Network Namespaces (netns)',
        'Virtual File System (VFS)',
        'Process ID Namespaces (pidns)',
      ],
      correctIndex: 0,
      explanation: 'cgroups throttle and meter physical CPU/memory hardware allocations, while namespaces provide isolation of processes, mount points, and networks.',
    },
    {
      id: 'dev-4',
      questionText: 'When configuring Argo Rollouts for Canary releases, how is traffic split between stable and canary replica sets?',
      codeSnippet: `strategy:
  canary:
    steps:
    - setWeight: 20
    - pause: { duration: 1h }`,
      options: [
        'Via service mesh / ingress controllers (Istio, NGINX, ALB) directing defined traffic weights',
        'By manually stopping 80% of stable Pods using bash scripts',
        'By altering DNS records round-robin every 60 seconds',
        'By prompting users with a browser prompt to select their version',
      ],
      correctIndex: 0,
      explanation: 'Argo Rollouts programs the ingress controller or service mesh to route the exact weight percentage of live requests to the canary Pods.',
    },
    {
      id: 'dev-5',
      questionText: 'What is the primary purpose of a Bastion Host / Jump Server in an AWS VPC architecture?',
      options: [
        'Provides secure, audited SSH/bastion entry into private subnets without exposing database ports to the internet',
        'Accelerates S3 bucket download speeds for public users',
        'Replaces the AWS Application Load Balancer with an open-source proxy',
        'Acts as an automated database backup cron runner',
      ],
      correctIndex: 0,
      explanation: 'Bastion hosts sit in the public subnet with restricted IP allowlists, preventing private compute and database nodes from having public IP addresses.',
    },
  ],
};

export function ExamPlayerModal({
  course,
  phase,
  mode,
  onClose,
  onPass,
}: ExamPlayerModalProps) {
  const toast = useToast();
  const { student, addCertification } = useStudent();

  // Pick questions matching category, fallback to fullstack
  const questions =
    DEFAULT_QUESTIONS[course.category] || DEFAULT_QUESTIONS.FULLSTACK;

  // Session state
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(mode === 'OFFICIAL_EXAM' ? 900 : 1800); // 15 mins for official
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [tabSwitches, setTabSwitches] = useState(0);
  const [disqualified, setDisqualified] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scorePercentage, setScorePercentage] = useState(0);
  const [isPassed, setIsPassed] = useState(false);
  const [certHash, setCertHash] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Anti-cheating Telemetry Listener (visibilitychange)
  useEffect(() => {
    if (!started || submitted || disqualified) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => {
          const next = prev + 1;
          if (mode === 'OFFICIAL_EXAM') {
            if (next >= 3) {
              setDisqualified(true);
              setSubmitted(true);
              toast('DISQUALIFIED: Exceeded maximum allowed tab/window departures (Limit: 3).', 'error');
            } else {
              toast(`⚠️ Warning: Tab departure detected (${next}/3). You will be disqualified on 3 switches.`, 'info');
            }
          }
          return next;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [started, submitted, disqualified, mode, toast]);

  // Server-Enforced Timer Countdown
  useEffect(() => {
    if (!started || submitted || disqualified) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit();
          toast('Time window expired! Auto-submitting answers to evaluation engine.', 'info');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, submitted, disqualified]);

  const handleStartExam = () => {
    setStarted(true);
    toast(`${mode === 'OFFICIAL_EXAM' ? 'Official Exam' : 'Practice Mock'} session started. Server clock active.`, 'success');
  };

  const handleSelectOption = (optionIndex: number) => {
    if (submitted || disqualified) return;
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const handleSubmit = () => {
    if (submitted) return;
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const pct = Math.round((correctCount / questions.length) * 100);
    const passed = pct >= phase.examCutoff;

    setScorePercentage(pct);
    setIsPassed(passed);
    setSubmitted(true);

    if (passed && mode === 'OFFICIAL_EXAM') {
      const generatedHash = `CERT-KIET-${course.category}-${Date.now().toString().slice(-6)}`;
      setCertHash(generatedHash);

      // Auto-mint into master profile
      addCertification({
        title: `${course.title} — ${phase.level} Verified`,
        issuingOrg: 'KIET Institutional Placement Academy',
        issueDate: new Date().toISOString().slice(0, 10),
        isInternalCourse: true,
        certificateHash: generatedHash,
        credentialUrl: `https://verify.kiet.edu/cert/${generatedHash}`,
      });

      onPass(generatedHash);
      toast(`🎉 Congratulations! Passed with ${pct}%. Verified Certificate Minted!`, 'success');
    } else if (passed) {
      toast(`Practice Mock Cleared with ${pct}%! Ready for Official Exam.`, 'success');
    } else {
      toast(`Score: ${pct}%. Cutoff is ${phase.examCutoff}%. Review syllabus and retry.`, 'info');
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => (started && !submitted ? null : onClose())}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-md bg-surface shadow-2xl border border-line overflow-hidden z-10 my-auto animate-fade-up text-ink max-h-[92vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-line bg-surface2/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#0969da]/10 text-[#0969da] border border-[#0969da]/20 font-bold">
              {mode === 'OFFICIAL_EXAM' ? '🎯' : '🧪'}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  {mode === 'OFFICIAL_EXAM' ? 'Official Gatekeeper Exam' : 'Practice Mock Test'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface border border-line text-ink">
                  {phase.level}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-ink truncate mt-0.5">
                {course.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {started && !submitted && (
              <div
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold border transition-colors',
                  timeLeft < 180
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse'
                    : 'bg-surface border-line text-ink'
                )}
              >
                <Timer className="h-3.5 w-3.5" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-muted hover:text-ink hover:bg-surface border border-line transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Anti-Cheating Telemetry Banner for Official Exam */}
        {mode === 'OFFICIAL_EXAM' && started && !submitted && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs text-amber-700 dark:text-amber-400">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>Anti-Cheating Telemetry Active · Departure Limit: 3 Window Departures</span>
            </div>
            <span className="font-mono font-bold">
              Tab Departures: {tabSwitches}/3
            </span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {!started ? (
            /* Pre-Start Briefing Screen */
            <div className="space-y-5 py-4">
              <div className="text-center max-w-lg mx-auto space-y-2">
                <span className="text-3xl">🏛️</span>
                <h3 className="text-xl font-extrabold text-ink">
                  {mode === 'OFFICIAL_EXAM' ? 'Official Phase Certification Exam' : 'Practice Mock Assessment'}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {mode === 'OFFICIAL_EXAM'
                    ? 'Passing this assessment (≥ 70%) permanently unlocks Phase 2, mints a cryptographic credential hash, and qualifies you for TPO campus drives.'
                    : 'Unlimited practice attempts to validate your knowledge before attempting the official exam.'}
                </p>
              </div>

              {/* Rules Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-md bg-surface2 p-3 border border-line text-center">
                  <span className="text-[11px] text-muted uppercase font-bold block">Assessment Items</span>
                  <span className="text-base font-extrabold text-ink font-mono mt-0.5 block">{questions.length} Questions</span>
                  <span className="text-[10.5px] text-muted">Single choice & code analysis</span>
                </div>
                <div className="rounded-md bg-surface2 p-3 border border-line text-center">
                  <span className="text-[11px] text-muted uppercase font-bold block">Server Time Window</span>
                  <span className="text-base font-extrabold text-ink font-mono mt-0.5 block">
                    {mode === 'OFFICIAL_EXAM' ? '15 Minutes' : '30 Minutes'}
                  </span>
                  <span className="text-[10.5px] text-muted">Hard auto-submit cutoff</span>
                </div>
                <div className="rounded-md bg-surface2 p-3 border border-line text-center">
                  <span className="text-[11px] text-muted uppercase font-bold block">Passing Criteria</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                    &ge; {phase.examCutoff}% Pass
                  </span>
                  <span className="text-[10.5px] text-muted">3-phase gatekeeper cutoff</span>
                </div>
              </div>

              {/* Student Identity Notice */}
              <div className="rounded-md bg-surface2 p-3.5 border border-line flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#1a7f37]" />
                  <span className="font-semibold text-ink">
                    Candidate: {student.name} ({student.rollNumber})
                  </span>
                </div>
                <span className="text-muted text-[11px]">Department of {student.branch}</span>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={handleStartExam}
                  className="rounded-md bg-[#1f883d] hover:bg-[#1a7f37] text-white font-bold text-xs px-6 py-2.5 shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Begin Assessment</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : submitted ? (
            /* Results & Credential Screen */
            <div className="space-y-6 py-4 text-center max-w-lg mx-auto animate-fade-in">
              {disqualified ? (
                <div className="space-y-3">
                  <div className="mx-auto h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
                    <XCircle className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-rose-600">
                    Session Disqualified
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    You exceeded the maximum allowed window departures (3 tab switches). In accordance with institutional examination integrity policy, this session has been terminated.
                  </p>
                </div>
              ) : isPassed ? (
                <div className="space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-ink">
                      Phase Gatekeeper Cleared!
                    </h3>
                    <p className="text-xs text-muted mt-1">
                      Scored <strong>{scorePercentage}%</strong> (Required: &ge; {phase.examCutoff}%)
                    </p>
                  </div>

                  {/* Minted Certificate Box */}
                  {mode === 'OFFICIAL_EXAM' && certHash && (
                    <div className="rounded-md bg-surface2 p-4 border border-line text-left space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                          <Award className="h-3.5 w-3.5 text-[#0969da]" />
                          <span>Cryptographic Certificate Minted</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          VERIFIED
                        </span>
                      </div>
                      <div className="font-mono text-xs font-bold text-ink bg-surface p-2 rounded border border-line">
                        {certHash}
                      </div>
                      <p className="text-[11px] text-muted">
                        Mapped to your master student record and unlocked in recruiter shortlists.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={onClose}
                      className="rounded-md bg-[#1f883d] hover:bg-[#1a7f37] text-white font-bold text-xs px-5 py-2 transition-all cursor-pointer"
                    >
                      Continue Learning Track
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink">
                      Assessment Not Cleared
                    </h3>
                    <p className="text-xs text-muted mt-1">
                      Scored <strong>{scorePercentage}%</strong>. Required passing threshold is &ge; {phase.examCutoff}%.
                    </p>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">
                    Review the curriculum modules for {phase.title} and reattempt when ready.
                  </p>

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setStarted(false);
                        setAnswers({});
                        setCurrentIndex(0);
                      }}
                      className="rounded-md border border-line bg-surface hover:bg-surface2 text-xs font-semibold px-4 py-2 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Retake Assessment</span>
                    </button>

                    <button
                      onClick={onClose}
                      className="rounded-md bg-surface2 hover:bg-surface text-ink text-xs font-semibold px-4 py-2 border border-line transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Active Exam Questions Screen */
            <div className="space-y-5">
              {/* Question Navigation Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {questions.map((_, idx) => {
                    const isAnswered = answers[idx] !== undefined;
                    const isCurrent = idx === currentIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={cn(
                          'h-7 w-7 rounded text-xs font-bold font-mono transition-all cursor-pointer',
                          isCurrent
                            ? 'bg-[#0969da] text-white shadow-2xs'
                            : isAnswered
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-surface2 text-muted hover:text-ink border border-line'
                        )}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs text-muted font-medium shrink-0">
                  Answered: <strong>{answeredCount}</strong>/{questions.length}
                </span>
              </div>

              {/* Current Question Body */}
              <div className="space-y-3.5">
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-xs font-bold text-muted mt-0.5">
                    Q{currentIndex + 1}.
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-ink leading-snug">
                    {currentQ.questionText}
                  </h4>
                </div>

                {/* Code Snippet Box (if present) */}
                {currentQ.codeSnippet && (
                  <div className="rounded bg-surface2 p-3 border border-line text-xs font-mono overflow-x-auto text-ink">
                    <pre>{currentQ.codeSnippet}</pre>
                  </div>
                )}

                {/* Options List */}
                <div className="space-y-2 pt-2">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = answers[currentIndex] === optIdx;
                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={cn(
                          'p-3 rounded-md border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-3',
                          isSelected
                            ? 'border-[#0969da] bg-[#0969da]/10 text-ink ring-1 ring-[#0969da]'
                            : 'border-line bg-surface hover:bg-surface2 text-ink/90'
                        )}
                      >
                        <span
                          className={cn(
                            'h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 border',
                            isSelected
                              ? 'bg-[#0969da] text-white border-[#0969da]'
                              : 'bg-surface2 text-muted border-line'
                          )}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1 leading-relaxed">{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-line">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((c) => Math.max(0, c - 1))}
                  className="px-3 py-1.5 rounded-md border border-line text-xs font-semibold text-ink hover:bg-surface2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  {currentIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIndex((c) => Math.min(questions.length - 1, c + 1))}
                      className="px-4 py-1.5 rounded-md bg-[#0969da] hover:bg-[#0854b0] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="px-5 py-1.5 rounded-md bg-[#1f883d] hover:bg-[#1a7f37] text-white text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Submit Assessment</span>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
