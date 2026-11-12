'use client';

import { useState } from 'react';
import { ArrowRight, CircleDot, MessageSquare, Plus } from 'lucide-react';
import { useToast } from '@/components/toast';
import { useStudent } from '@/components/store';
import { ContactDetails, SupportRequestForm } from './contact-form';
import { RatingDialog, TicketList } from './contact-tickets';
import { INITIAL_TICKETS, type NewTicket, type SupportTicket, type TicketFilter } from './contact-types';

export default function ContactPage() {
  const toast = useToast();
  const { student } = useStudent();
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [filter, setFilter] = useState<TicketFilter>('ALL');
  const [ratingTicketId, setRatingTicketId] = useState<string | null>(null);
  const [starCount, setStarCount] = useState(5);
  const openTicketCount = tickets.filter((ticket) => ticket.status !== 'RESOLVED').length;

  const handleSubmit = (details: NewTicket) => {
    const newTicket: SupportTicket = {
      ...details,
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'ASSIGNED',
      assignedHelper: 'Siddharth Sen (Senior TA / Peer Mentor)',
      createdAt: 'Just now',
    };

    setTickets((current) => [newTicket, ...current]);
    toast('Support ticket submitted! Assigned to least-busy mentor.', 'success');
  };

  const handleResolve = (ticketId: string) => {
    setStarCount(5);
    setRatingTicketId(ticketId);
  };

  const submitResolutionRating = () => {
    if (!ratingTicketId) return;

    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === ratingTicketId
          ? { ...ticket, status: 'RESOLVED', rating: starCount }
          : ticket
      )
    );
    toast('Ticket marked as resolved! Feedback recorded.', 'success');
    setRatingTicketId(null);
  };

  return (
    <main className="min-h-screen bg-bg pb-16 text-ink">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <header className="relative mb-8 overflow-hidden rounded-2xl border border-line bg-surface px-5 py-7 sm:px-8 sm:py-9">
          <div
            className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative grid items-center gap-7 md:grid-cols-[minmax(0,1fr)_auto]">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-accent">
                <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                Student support
              </p>
              <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Support that gets you unstuck.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                Tell us what you need help with and we’ll connect you with the right campus team.
                For urgent questions, contact the support desk directly.
              </p>
            </div>

            <div className="w-full max-w-[420px] rounded-2xl border border-line bg-surface2/70 p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <span className="grid h-8 w-8 place-items-center rounded-lg border border-accent/20 bg-accent/10 text-accent">
                    <MessageSquare aria-hidden="true" className="h-4 w-4" />
                  </span>
                  Request overview
                </div>
                <span
                  aria-live="polite"
                  className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold text-accent"
                >
                  <CircleDot aria-hidden="true" className="h-3 w-3" />
                  {openTicketCount} open
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 divide-x divide-line rounded-xl border border-line bg-surface px-3 py-3.5">
                <div className="pr-3">
                  <dt className="text-[11px] font-medium text-muted">Open requests</dt>
                  <dd className="mt-1 text-3xl font-bold leading-none tracking-tight text-accent tabular-nums">
                    {openTicketCount}
                  </dd>
                </div>
                <div className="pl-4">
                  <dt className="text-[11px] font-medium text-muted">Total requests</dt>
                  <dd className="mt-1 text-3xl font-bold leading-none tracking-tight text-ink tabular-nums">
                    {tickets.length}
                  </dd>
                </div>
              </dl>

              <a
                href="#new-request"
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById('new-request')?.scrollIntoView({
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                      ? 'auto'
                      : 'smooth',
                    block: 'start',
                  });
                  window.history.replaceState(null, '', '#new-request');
                }}
                className="group mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2.5 text-sm font-semibold text-accent-ink shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
              >
                <Plus aria-hidden="true" className="h-4 w-4" />
                Create a request
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.8fr)]">
          <SupportRequestForm id="new-request" student={student} onSubmit={handleSubmit} />
          <ContactDetails />
        </div>

        <TicketList
          tickets={tickets}
          filter={filter}
          onFilterChange={setFilter}
          onResolve={handleResolve}
        />
      </div>

      {ratingTicketId && (
        <RatingDialog
          ticketId={ratingTicketId}
          starCount={starCount}
          onStarCountChange={setStarCount}
          onCancel={() => setRatingTicketId(null)}
          onSubmit={submitResolutionRating}
        />
      )}
    </main>
  );
}
