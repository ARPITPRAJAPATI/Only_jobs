'use client';

import { useState, type FormEvent } from 'react';
import { Clock3, Code2, Mail, MapPin, PhoneCall, Send } from 'lucide-react';
import type { Student } from '@/lib/types';
import { cn } from '@/lib/utils';
import type { NewTicket, TicketCategory, TicketPriority } from './contact-types';

const CATEGORY_OPTIONS: { value: TicketCategory; label: string }[] = [
  { value: 'COURSE_DOUBT', label: 'Course question' },
  { value: 'LAB_PROJECT_HELP', label: 'Lab or project help' },
  { value: 'EXAM_ISSUE', label: 'Exam issue' },
  { value: 'TPO_DRIVE', label: 'Placement drive' },
  { value: 'BUG_REPORT', label: 'Academic record issue' },
];

const PRIORITY_OPTIONS: { value: TicketPriority; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Normal' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

const inputClassName =
  'w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20';

export function SupportRequestForm({
  id,
  student,
  onSubmit,
}: {
  id: string;
  student: Student;
  onSubmit: (ticket: NewTicket) => void;
}) {
  const [category, setCategory] = useState<TicketCategory>('COURSE_DOUBT');
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const [courseContext, setCourseContext] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !description.trim() || !courseContext.trim()) return;

    onSubmit({
      category,
      priority,
      courseContext: courseContext.trim(),
      title: title.trim(),
      description: description.trim(),
      codeSnippet: codeSnippet.trim() || undefined,
    });
    setCourseContext('');
    setTitle('');
    setDescription('');
    setCodeSnippet('');
  };

  return (
    <section id={id} className="scroll-mt-24 rounded-xl border border-line bg-surface p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Submit a support request</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Add a few details so your request reaches the right team.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-x-8 gap-y-3 rounded-lg bg-surface2/60 px-4 py-3">
          <div>
            <p className="text-xs text-muted">Student</p>
            <p className="mt-0.5 text-sm font-medium">{student.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Roll number</p>
            <p className="mt-0.5 font-mono text-sm">{student.rollNumber}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Topic
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as TicketCategory)}
              className={cn(inputClassName, 'mt-1.5')}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Priority
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value as TicketPriority)}
              className={cn(inputClassName, 'mt-1.5')}
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm font-medium">
          Course or placement context
          <input
            required
            value={courseContext}
            onChange={(event) => setCourseContext(event.target.value)}
            placeholder="e.g. Data Structures, Lab 2, or a placement drive"
            className={cn(inputClassName, 'mt-1.5')}
          />
        </label>

        <label className="block text-sm font-medium">
          Subject
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Briefly summarize the issue"
            className={cn(inputClassName, 'mt-1.5')}
          />
        </label>

        <label className="block text-sm font-medium">
          Description
          <textarea
            required
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What happened, and what have you tried so far?"
            className={cn(inputClassName, 'mt-1.5 resize-y')}
          />
        </label>

        <details className="group rounded-lg border border-line">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-sm font-medium text-muted marker:hidden hover:text-ink">
            <Code2 className="h-4 w-4" aria-hidden="true" />
            Add code or error logs <span className="text-xs font-normal">(optional)</span>
          </summary>
          <div className="border-t border-line p-3">
            <textarea
              rows={4}
              value={codeSnippet}
              onChange={(event) => setCodeSnippet(event.target.value)}
              placeholder="Paste relevant code or terminal output"
              className={cn(inputClassName, 'font-mono text-xs')}
            />
          </div>
        </details>

        <div className="flex justify-end border-t border-line pt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Send request
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </section>
  );
}

export function ContactDetails() {
  return (
    <aside className="space-y-4" aria-labelledby="contact-options-heading">
      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 id="contact-options-heading" className="text-base font-semibold">
          Contact the support desk
        </h2>
        <p className="mt-1 text-sm text-muted">For time-sensitive questions, reach us directly.</p>

        <div className="mt-5 divide-y divide-line">
          <div className="flex gap-3 py-4 first:pt-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface2 text-accent">
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">TPO helpline</p>
              <a className="mt-0.5 block text-sm text-accent hover:underline" href="tel:+911202974300">
                +91-120-297-4300
              </a>
              <p className="mt-1 text-xs text-muted">Mon–Sat, 9:00 AM–5:30 PM</p>
            </div>
          </div>
          <div className="flex gap-3 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface2 text-accent">
              <Mail className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">Email support</p>
              <a className="mt-0.5 block break-all text-sm text-accent hover:underline" href="mailto:placement@kiet.edu">
                placement@kiet.edu
              </a>
              <a className="mt-1 block break-all text-sm text-accent hover:underline" href="mailto:academics@kiet.edu">
                academics@kiet.edu
              </a>
            </div>
          </div>
          <div className="flex gap-3 py-4 last:pb-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface2 text-accent">
              <MapPin className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium">Placement Cell</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">
                KIET Group of Institutions, Ghaziabad, UP 201206
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-line bg-surface2/50 p-4">
        <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-muted">
          Requests are routed to a relevant mentor or support team. Include clear details to help us
          respond sooner.
        </p>
      </div>
    </aside>
  );
}
