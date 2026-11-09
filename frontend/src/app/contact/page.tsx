'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
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

            <div className="w-full max-w-[420px] rounded-2xl border border-[#2d3c52] bg-[#111c2d] p-4 shadow-[0_18px_40px_rgba(15,23,42,0.35)] sm:p-5">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="min-w-0 text-left">
                  <p className="text-xs font-medium text-slate-300/90">Open requests</p>
                  <p className="mt-2 text-4xl font-medium leading-none tracking-[-0.04em] text-white tabular-nums">
                    {openTicketCount}
                  </p>
                </div>
                <div className="h-14 w-px bg-white/10" aria-hidden="true" />
                <div className="min-w-0 text-left">
                  <p className="text-xs font-medium text-slate-300/90">Total requests</p>
                  <p className="mt-2 text-4xl font-medium leading-none tracking-[-0.04em] text-white tabular-nums">
                    {tickets.length}
                  </p>
                </div>
              </div>

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
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-[#5ea3f5] px-3 py-2.5 text-sm font-semibold text-[#0e1a2a] shadow-[0_6px_16px_rgba(94,163,245,0.28)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#73b0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7cb7ff]"
              >
                Create a request
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
