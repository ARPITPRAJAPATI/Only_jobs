'use client';

import { useState } from 'react';
import {
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  Send,
  CheckCircle2,
  Code2,
  MessageSquare,
  Star,
} from 'lucide-react';
import { useToast } from '@/components/toast';
import { useStudent } from '@/components/store';
import { cn } from '@/lib/utils';

type TicketCategory =
  | 'COURSE_DOUBT'
  | 'LAB_PROJECT_HELP'
  | 'EXAM_ISSUE'
  | 'TPO_DRIVE'
  | 'BUG_REPORT';

type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
type TicketStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';

interface SupportTicket {
  id: string;
  category: TicketCategory;
  courseContext: string;
  title: string;
  description: string;
  codeSnippet?: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedHelper: string;
  createdAt: string;
  rating?: number;
}

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TICK-9021',
    category: 'LAB_PROJECT_HELP',
    courseContext: 'DevOps & Cloud Native — Phase 1: Docker Containerization',
    title: 'Docker daemon permission denied during multi-stage build',
    description:
      'Got permission denied when running `docker build -t app .` inside the campus Linux lab workstation. Needs socket permissions check.',
    codeSnippet: '$ docker build -t myapp .\nGot permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock',
    priority: 'HIGH',
    status: 'ASSIGNED',
    assignedHelper: 'Prof. V. Sharma (Faculty Mentor)',
    createdAt: 'Today, 2:15 PM',
  },
  {
    id: 'TICK-8842',
    category: 'TPO_DRIVE',
    courseContext: 'Amazon SDE-1 Campus Placement Drive 2026',
    title: 'Eligibility criteria verification for 7th Sem SGPA',
    description:
      'Submitted marksheet for 6th Sem audit. Requesting expedited TPO clearance for upcoming Amazon shortlisted student list.',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    assignedHelper: 'Er. R. K. Dixit (TPO Officer)',
    createdAt: 'Yesterday, 11:30 AM',
    rating: 5,
  },
];

export default function ContactPage() {
  const toast = useToast();
  const { student } = useStudent();

  // Active tickets state
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // New Ticket Form State
  const [category, setCategory] = useState<TicketCategory>('COURSE_DOUBT');
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const [courseContext, setCourseContext] = useState(
    'Full Stack Web Development — Phase 2: Next.js & Server Actions'
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);

  // Rating Modal / State
  const [ratingTicketId, setRatingTicketId] = useState<string | null>(null);
  const [starCount, setStarCount] = useState<number>(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newTicket: SupportTicket = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      courseContext,
      title: title.trim(),
      description: description.trim(),
      codeSnippet: codeSnippet.trim() ? codeSnippet.trim() : undefined,
      priority,
      status: 'ASSIGNED',
      assignedHelper: 'Siddharth Sen (Senior TA / Peer Mentor)',
      createdAt: 'Just now',
    };

    setTickets([newTicket, ...tickets]);
    toast('Support ticket submitted! Assigned to least-busy mentor.', 'success');

    // Reset Form
    setTitle('');
    setDescription('');
    setCodeSnippet('');
    setShowCodeInput(false);
  };

  const handleResolve = (ticketId: string) => {
    setRatingTicketId(ticketId);
  };

  const submitResolutionRating = () => {
    if (!ratingTicketId) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ratingTicketId ? { ...t, status: 'RESOLVED', rating: starCount } : t
      )
    );
    toast('Ticket marked as resolved! Feedback recorded.', 'success');
    setRatingTicketId(null);
  };

  const filteredTickets = tickets.filter(
    (t) => filterStatus === 'ALL' || t.status === filterStatus
  );
  const openTicketCount = tickets.filter((ticket) => ticket.status !== 'RESOLVED').length;

  return (
    <div className="min-h-screen bg-bg text-ink pb-20 transition-colors">
      <header className="border-b border-line bg-surface/40 text-ink">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 md:flex-row md:items-end md:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Support</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Contact &amp; helpdesk
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              Get help with courses, lab work, exams, and placements, or contact the campus support teams directly.
            </p>
          </div>

          <dl className="flex items-center gap-6 border-t border-line pt-4 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <div>
              <dt className="text-xs text-muted">Your tickets</dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums text-ink">{tickets.length}</dd>
            </div>
            <div className="h-8 border-l border-line" aria-hidden="true" />
            <div>
              <dt className="text-xs text-muted">Open</dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums text-ink">{openTicketCount}</dd>
            </div>
          </dl>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-[1280px] px-4 pt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          
          {/* ============================================================ */}
          {/* ── LEFT COLUMN: Official Channels & Active Tickets ── */}
          {/* ============================================================ */}
          <div className="space-y-7 lg:col-span-5">
            
            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Phone Card */}
              <div className="rounded-lg border border-line bg-surface p-4">
                <div className="mb-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface2">
                  <PhoneCall className="h-4 w-4 text-[#1a7f37]" />
                </div>
                <h2 className="text-sm font-semibold text-ink">TPO Helpline</h2>
                <a
                  href="tel:+911202974300"
                  className="mt-1 block text-sm font-medium text-ink transition-colors hover:text-accent"
                >
                  +91-120-297-4300
                </a>
                <p className="mt-1 text-xs text-muted">
                  Mon – Sat: 9:00 AM – 5:30 PM
                </p>
              </div>

              {/* Email Card */}
              <div className="rounded-lg border border-line bg-surface p-4">
                <div className="mb-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface2">
                  <Mail className="h-4 w-4 text-[#0969da]" />
                </div>
                <h2 className="text-sm font-semibold text-ink">Email support</h2>
                <a
                  href="mailto:placement@kiet.edu"
                  className="mt-1 block break-all text-sm text-ink transition-colors hover:text-accent"
                >
                  placement@kiet.edu
                </a>
                <a
                  href="mailto:academics@kiet.edu"
                  className="mt-1 block break-all text-sm text-ink transition-colors hover:text-accent"
                >
                  academics@kiet.edu
                </a>
              </div>
            </div>

            {/* Location Banner */}
            <div className="flex items-start gap-3 rounded-lg border border-line bg-surface p-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface2">
                <MapPin className="h-3.5 w-3.5 text-[#0969da]" />
              </div>
              <div className="text-sm">
                <span className="block font-semibold text-ink">Corporate Relations &amp; Placement Cell</span>
                <span className="mt-1 block leading-relaxed text-muted">
                  KIET Group of Institutions, Delhi-NCR, Ghaziabad, UP 201206
                </span>
              </div>
            </div>

            {/* Active Tickets Queue Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
                  <MessageSquare className="h-4 w-4 text-[#0969da]" />
                  <span>Your tickets</span>
                  <span className="rounded-md border border-line bg-surface px-2 py-0.5 text-xs font-medium tabular-nums text-muted">
                    {tickets.length}
                  </span>
                </h2>

                {/* Filter */}
                <div className="flex items-center gap-1.5 text-xs">
                  {['ALL', 'ASSIGNED', 'RESOLVED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      aria-pressed={filterStatus === st}
                      onClick={() => setFilterStatus(st)}
                      className={cn(
                        'rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors',
                        filterStatus === st
                          ? 'bg-accent text-accent-ink'
                          : 'text-muted hover:bg-surface2 hover:text-ink'
                      )}
                    >
                      {st === 'ALL' ? 'All' : st === 'ASSIGNED' ? 'Assigned' : 'Resolved'}
                    </button>
                  ))}
                </div>
              </div>

              {filteredTickets.length === 0 ? (
                <div className="p-8 text-center rounded-md bg-surface border border-line text-xs text-muted">
                  No tickets found with status &quot;{filterStatus}&quot;.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTickets.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-lg border border-line bg-surface p-4 transition-colors hover:border-muted"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[11px] font-medium text-muted">
                              {t.id}
                            </span>
                            <span
                              className={cn(
                                'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                                t.status === 'RESOLVED'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                  : 'bg-[#0969da]/10 text-[#0969da] border-[#0969da]/20'
                              )}
                            >
                              {t.status}
                            </span>
                            <span
                              className={cn(
                                'text-[10px] font-bold px-2 py-0.5 rounded border',
                                t.priority === 'HIGH' || t.priority === 'URGENT'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                  : 'bg-surface2 text-muted border-line'
                              )}
                            >
                              {t.priority}
                            </span>
                          </div>

                          <h3 className="text-sm font-semibold leading-snug text-ink">
                            {t.title}
                          </h3>

                          <p className="text-[11px] text-muted mt-1 font-medium">
                            {t.courseContext}
                          </p>
                        </div>

                        <span className="text-[11px] text-muted shrink-0">{t.createdAt}</span>
                      </div>

                      <p className="mt-3 rounded-md bg-surface2/60 p-3 text-xs leading-relaxed text-ink">
                        {t.description}
                      </p>

                      {t.codeSnippet && (
                        <div className="mt-3 overflow-x-auto rounded-md border border-line bg-surface2 p-3 font-mono text-[11px] text-ink">
                          <pre>{t.codeSnippet}</pre>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-xs">
                        <span className="text-muted text-[11px]">
                          Assigned to: <strong className="text-ink">{t.assignedHelper}</strong>
                        </span>

                        {t.status !== 'RESOLVED' ? (
                          <button
                            type="button"
                            onClick={() => handleResolve(t.id)}
                            className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-500/15 dark:text-emerald-400"
                          >
                            Mark Resolved
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(t.rating || 5)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                            <span className="text-[11px] font-bold text-muted ml-1">Resolved</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* ── RIGHT COLUMN: Raise Structured Doubt Ticket Form ── */}
          {/* ============================================================ */}
          <div className="lg:col-span-7">
            <section className="rounded-lg border border-line bg-surface p-4 sm:p-5">
              <div className="mb-4 border-b border-line pb-4">
                <h2 className="text-lg font-semibold text-ink">Submit a support request</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  Share the issue and its course or placement context so the support team can follow up.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Auto Student Info */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg bg-surface2/60 px-3.5 py-3 text-sm">
                  <div>
                    <span className="block text-[11px] text-muted">Student</span>
                    <span className="font-medium text-ink">{student.name}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-muted">Roll number</span>
                    <span className="font-mono text-xs font-medium text-ink">{student.rollNumber}</span>
                  </div>
                </div>

                {/* Category & Priority */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">
                      Ticket Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as TicketCategory)}
                      className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-[13px] text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    >
                      <option value="COURSE_DOUBT">Course Conceptual Doubt</option>
                      <option value="LAB_PROJECT_HELP">Lab & Project Runtime Help</option>
                      <option value="EXAM_ISSUE">Phase Exam / Gatekeeper Evaluation</option>
                      <option value="TPO_DRIVE">Placement Drive Eligibility</option>
                      <option value="BUG_REPORT">Academic Audit / SGPA Discrepancy</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">
                      Priority Level
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TicketPriority)}
                      className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-[13px] text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    >
                      <option value="LOW">Low (Conceptual enquiry)</option>
                      <option value="MEDIUM">Medium (General lab doubt)</option>
                      <option value="HIGH">High (Blocking compilation error)</option>
                      <option value="URGENT">Urgent (Live exam or drive deadline)</option>
                    </select>
                  </div>
                </div>

                {/* Course Context */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    Course or placement context
                  </label>
                  <input
                    type="text"
                    required
                    value={courseContext}
                    onChange={(e) => setCourseContext(e.target.value)}
                    placeholder="e.g., DevOps Phase 1: Docker Containerization"
                    className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-[13px] text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Socket permission denied when building container image"
                    className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-[13px] text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Explain what steps you took, expected result, and what went wrong..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-[13px] text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                {/* Code Snippet Toggle */}
                <div>
                  {!showCodeInput ? (
                    <button
                      type="button"
                      onClick={() => setShowCodeInput(true)}
                      className="flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                    >
                      <Code2 className="h-3.5 w-3.5" />
                      <span>+ Attach code snippet or terminal error logs</span>
                    </button>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="flex items-center gap-1.5 text-xs font-medium text-muted">
                          <Code2 className="h-3.5 w-3.5 text-[#0969da]" />
                          <span>Code Snippet / Terminal Error Logs</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCodeInput(false);
                            setCodeSnippet('');
                          }}
                          className="text-[11px] text-muted hover:text-ink cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        placeholder="Paste terminal logs or offending code snippet here..."
                        value={codeSnippet}
                        onChange={(e) => setCodeSnippet(e.target.value)}
                        className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 font-mono text-xs text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                      />
                    </div>
                  )}
                </div>

                {/* Submit Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                  <button
                    type="submit"
                    className="ml-auto inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-opacity hover:opacity-90"
                  >
                    <span>Submit request</span>
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>

      {/* ── Rating Modal upon Resolution ── */}
      {ratingTicketId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm rounded-md bg-surface p-5 border border-line shadow-xl animate-fade-up text-ink text-center">
            <div className="mx-auto h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-3">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <h3 className="text-base font-bold text-ink">Rate Mentor Support</h3>
            <p className="text-xs text-muted mt-1">
              How satisfied are you with the resolution provided for {ratingTicketId}?
            </p>

            {/* Stars */}
            <div className="flex items-center justify-center gap-2 my-4 text-amber-500">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setStarCount(val)}
                  className="p-1 hover:scale-125 transition-transform cursor-pointer"
                  aria-label={`${val} Star`}
                >
                  <Star
                    className={cn(
                      'h-6 w-6',
                      val <= starCount ? 'fill-current' : 'text-gray-300 dark:text-gray-600'
                    )}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRatingTicketId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface2 rounded-md transition-colors border border-line cursor-pointer"
              >
                Skip
              </button>

              <button
                type="button"
                onClick={submitResolutionRating}
                className="px-4 py-1.5 text-xs font-semibold bg-[#1f883d] hover:bg-[#1a7f37] text-white rounded-md shadow-2xs active:scale-95 transition-all cursor-pointer"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
