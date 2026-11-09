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
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]">
                Support that gets you unstuck.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                Tell us what you need help with and we’ll connect you with the right campus team.
                For urgent questions, contact the support desk directly.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-line bg-bg/80 p-4 sm:flex-row sm:items-center md:min-w-64 md:flex-col md:items-stretch">
              <div className="flex flex-1 items-center justify-between gap-6 sm:justify-start md:justify-between">
                <div>
                  <p className="text-xs text-muted">Open requests</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">{openTicketCount}</p>
                </div>
                <div className="h-9 border-l border-line sm:mx-2" aria-hidden="true" />
                <div>
                  <p className="text-xs text-muted">Total requests</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">{tickets.length}</p>
                </div>
              </div>
              <a
                href="#new-request"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
