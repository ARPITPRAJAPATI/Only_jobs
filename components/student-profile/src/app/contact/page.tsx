'use client';

import { useState } from 'react';
import {
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Code2,
  MessageSquare,
  Star,
  Sparkles,
  ChevronRight,
  Filter,
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

const CATEGORY_LABELS: Record<TicketCategory, string> = {
  COURSE_DOUBT: 'Course Conceptual Doubt',
  LAB_PROJECT_HELP: 'Lab & Project Runtime Help',
  EXAM_ISSUE: 'Phase Exam & Gatekeeper Test',
  TPO_DRIVE: 'Placement Drive & Eligibility',
  BUG_REPORT: 'Platform Bug & Audit Query',
};

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

  return (
    <div className="min-h-screen bg-bg text-ink pb-20 transition-colors">
      {/* Clean, Airy Theme-Aware Header */}
      <div className="border-b border-line bg-surface/50 py-8 sm:py-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface2 px-2.5 py-0.5 text-[11px] font-semibold text-muted border border-line">
              Helper & Mentor Support Engine
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              <span>Smart Load-Balanced Helper Routing</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink font-sans">
            Campus Helpdesk & Mentor Support Engine
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted max-w-2xl font-normal leading-relaxed">
            Spam-proof structured doubt tickets and direct institutional channels. Raise course errors, phase exam verification requests, and placement drive inquiries directly to faculty and senior TAs.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-muted">
            <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-[#1a7f37]" />
              <span className="text-ink font-medium">8 Active TAs & Faculty Online</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 shadow-2xs">
              <Clock className="h-3.5 w-3.5 text-muted" />
              <span className="text-muted font-medium">Average Resolution: &lt; 2 hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ============================================================ */}
          {/* ── LEFT COLUMN: Official Channels & Active Tickets ── */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Phone Card */}
              <div className="rounded-md border border-line bg-surface p-4 shadow-2xs">
                <div className="h-8 w-8 rounded-md bg-surface2 border border-line flex items-center justify-center text-ink shrink-0 mb-2.5">
                  <PhoneCall className="h-4 w-4 text-[#1a7f37]" />
                </div>
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted">
                  TPO Helpline
                </div>
                <a
                  href="tel:+911202974300"
                  className="text-sm font-bold text-ink hover:text-[#0969da] transition-colors block mt-0.5"
                >
                  +91-120-297-4300
                </a>
                <p className="text-[11px] text-muted mt-0.5">
                  Mon – Sat: 9:00 AM – 5:30 PM
                </p>
              </div>

              {/* Email Card */}
              <div className="rounded-md border border-line bg-surface p-4 shadow-2xs">
                <div className="h-8 w-8 rounded-md bg-surface2 border border-line flex items-center justify-center text-ink shrink-0 mb-2.5">
                  <Mail className="h-4 w-4 text-[#0969da]" />
                </div>
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-muted">
                  Academic Desks
                </div>
                <a
                  href="mailto:placement@kiet.edu"
                  className="text-xs font-semibold text-ink hover:text-[#0969da] block mt-0.5"
                >
                  placement@kiet.edu
                </a>
                <a
                  href="mailto:academics@kiet.edu"
                  className="text-xs font-semibold text-ink hover:text-[#0969da] block mt-0.5"
                >
                  academics@kiet.edu
                </a>
              </div>
            </div>

            {/* Location Banner */}
            <div className="rounded-md border border-line bg-surface p-3.5 shadow-2xs flex items-start gap-3">
              <div className="h-7 w-7 rounded-md bg-surface2 border border-line flex items-center justify-center text-ink shrink-0 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-[#0969da]" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-ink block">Corporate Relations & Placement Cell (CRPC)</span>
                <span className="text-muted leading-relaxed block">
                  KIET Group of Institutions, Delhi-NCR, Ghaziabad, UP 201206
                </span>
              </div>
            </div>

            {/* Active Tickets Queue Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#0969da]" />
                  <span>Your Support Tickets</span>
                  <span className="rounded-full bg-surface2 px-2 py-0.5 text-xs font-mono font-bold text-muted border border-line">
                    {tickets.length}
                  </span>
                </h3>

                {/* Filter */}
                <div className="flex items-center gap-1.5 text-xs">
                  {['ALL', 'ASSIGNED', 'RESOLVED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      className={cn(
                        'px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer',
                        filterStatus === st
                          ? 'bg-[#0969da] text-white'
                          : 'bg-surface2 text-muted hover:text-ink'
                      )}
                    >
                      {st}
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
                      className="rounded-md border border-line bg-surface p-4 shadow-2xs hover:border-[#8c959f] transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[11px] font-bold text-muted">
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

                          <h4 className="text-xs sm:text-sm font-bold text-ink leading-snug">
                            {t.title}
                          </h4>

                          <p className="text-[11px] text-muted mt-1 font-medium">
                            {t.courseContext}
                          </p>
                        </div>

                        <span className="text-[11px] text-muted shrink-0">{t.createdAt}</span>
                      </div>

                      <p className="text-xs text-ink/90 mt-2.5 leading-relaxed bg-surface2/40 p-2 rounded border border-line/60">
                        {t.description}
                      </p>

                      {t.codeSnippet && (
                        <div className="mt-2.5 rounded bg-surface2 p-2.5 border border-line text-[11px] font-mono overflow-x-auto text-ink">
                          <pre>{t.codeSnippet}</pre>
                        </div>
                      )}

                      <div className="mt-3 pt-2.5 border-t border-line flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-muted text-[11px]">
                          Assigned to: <strong className="text-ink">{t.assignedHelper}</strong>
                        </span>

                        {t.status !== 'RESOLVED' ? (
                          <button
                            onClick={() => handleResolve(t.id)}
                            className="rounded px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
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
          <div className="lg:col-span-6">
            <div className="rounded-md border border-line bg-surface p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldCheck className="h-4 w-4 text-[#0969da]" />
                <h2 className="text-base font-bold text-ink">
                  Raise Structured Doubt Ticket
                </h2>
              </div>
              <p className="text-xs text-muted mb-5 leading-relaxed">
                Tickets are automatically routed to the least-busy faculty or TA mentor. Code snippets, error messages, and course context are analyzed.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Auto Student Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      Student Name
                    </label>
                    <input
                      type="text"
                      disabled
                      value={student.name}
                      className="w-full rounded-md border border-line bg-surface2 px-3 py-1.5 text-xs font-semibold text-ink cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      disabled
                      value={student.rollNumber}
                      className="w-full rounded-md border border-line bg-surface2 px-3 py-1.5 text-xs font-mono font-semibold text-ink cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Category & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      Ticket Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as TicketCategory)}
                      className="w-full rounded-md border border-line bg-surface2 px-3 py-1.5 text-xs font-semibold text-ink outline-none focus:border-[#0969da]"
                    >
                      <option value="COURSE_DOUBT">Course Conceptual Doubt</option>
                      <option value="LAB_PROJECT_HELP">Lab & Project Runtime Help</option>
                      <option value="EXAM_ISSUE">Phase Exam / Gatekeeper Evaluation</option>
                      <option value="TPO_DRIVE">Placement Drive Eligibility</option>
                      <option value="BUG_REPORT">Academic Audit / SGPA Discrepancy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      Priority Level
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TicketPriority)}
                      className="w-full rounded-md border border-line bg-surface2 px-3 py-1.5 text-xs font-semibold text-ink outline-none focus:border-[#0969da]"
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
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Course / Placement Drive Context
                  </label>
                  <input
                    type="text"
                    required
                    value={courseContext}
                    onChange={(e) => setCourseContext(e.target.value)}
                    placeholder="e.g., DevOps Phase 1: Docker Containerization"
                    className="w-full rounded-md border border-line bg-surface2 px-3 py-1.5 text-xs font-medium text-ink outline-none focus:border-[#0969da]"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Issue Title / Error Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Socket permission denied when building container image"
                    className="w-full rounded-md border border-line bg-surface2 px-3 py-1.5 text-xs font-medium text-ink outline-none focus:border-[#0969da]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Detailed Problem Description
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Explain what steps you took, expected result, and what went wrong..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-md border border-line bg-surface2 p-3 text-xs text-ink outline-none focus:border-[#0969da]"
                  />
                </div>

                {/* Code Snippet Toggle */}
                <div>
                  {!showCodeInput ? (
                    <button
                      type="button"
                      onClick={() => setShowCodeInput(true)}
                      className="text-xs font-semibold text-[#0969da] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Code2 className="h-3.5 w-3.5" />
                      <span>+ Attach code snippet or terminal error logs</span>
                    </button>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-ink flex items-center gap-1">
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
                        className="w-full rounded-md border border-line bg-surface2 p-3 text-xs font-mono text-ink outline-none focus:border-[#0969da]"
                      />
                    </div>
                  )}
                </div>

                {/* Submit Row */}
                <div className="flex items-center justify-between pt-2 border-t border-line">
                  <span className="text-[11px] text-muted">
                    Auto-dispatched to least-busy mentor
                  </span>

                  <button
                    type="submit"
                    className="rounded-md bg-[#1f883d] hover:bg-[#1a7f37] text-white font-semibold text-xs px-4 py-1.5 flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Dispatch Ticket</span>
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

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
