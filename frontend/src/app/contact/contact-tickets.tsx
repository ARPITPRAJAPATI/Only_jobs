'use client';

import { CheckCircle2, MessageSquare, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SupportTicket, TicketFilter } from './contact-types';

export function TicketList({
  tickets,
  filter,
  onFilterChange,
  onResolve,
}: {
  tickets: SupportTicket[];
  filter: TicketFilter;
  onFilterChange: (filter: TicketFilter) => void;
  onResolve: (ticketId: string) => void;
}) {
  const visibleTickets = tickets.filter((ticket) => {
    if (filter === 'ALL') return true;
    return filter === 'RESOLVED'
      ? ticket.status === 'RESOLVED'
      : ticket.status !== 'RESOLVED';
  });
  const filters: { value: TicketFilter; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'OPEN', label: 'Open' },
    { value: 'RESOLVED', label: 'Resolved' },
  ];

  return (
    <section className="mt-10" aria-labelledby="tickets-heading">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-accent" aria-hidden="true" />
            <h2 id="tickets-heading" className="text-lg font-semibold">
              Your requests
            </h2>
            <span className="rounded-full bg-surface2 px-2 py-0.5 text-xs tabular-nums text-muted">
              {tickets.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">Check the status of requests you have submitted.</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-line bg-surface p-1">
          {filters.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filter === option.value}
              onClick={() => onFilterChange(option.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                filter === option.value
                  ? 'bg-accent text-accent-ink'
                  : 'text-muted hover:bg-surface2 hover:text-ink'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {visibleTickets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-surface px-4 py-10 text-center text-sm text-muted">
          No {filter === 'ALL' ? '' : `${filter.toLowerCase()} `}requests yet.
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {visibleTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onResolve={onResolve} />
          ))}
        </div>
      )}
    </section>
  );
}

function TicketCard({
  ticket,
  onResolve,
}: {
  ticket: SupportTicket;
  onResolve: (ticketId: string) => void;
}) {
  const isResolved = ticket.status === 'RESOLVED';

  return (
    <article className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-muted">{ticket.id}</span>
        <span
          className={cn(
            'rounded-full border px-2 py-0.5 text-[11px] font-medium',
            isResolved
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : 'border-accent/20 bg-accent/10 text-accent'
          )}
        >
          {isResolved ? 'Resolved' : ticket.status.replace('_', ' ').toLowerCase()}
        </span>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[11px] font-medium',
            ticket.priority === 'HIGH' || ticket.priority === 'URGENT'
              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
              : 'bg-surface2 text-muted'
          )}
        >
          {ticket.priority.toLowerCase()} priority
        </span>
        <span className="ml-auto text-xs text-muted">{ticket.createdAt}</span>
      </div>

      <h3 className="mt-3 text-sm font-semibold leading-snug">{ticket.title}</h3>
      <p className="mt-1 text-xs font-medium text-muted">{ticket.courseContext}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{ticket.description}</p>

      {ticket.codeSnippet && (
        <details className="mt-3 rounded-lg border border-line bg-surface2/60">
          <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-muted hover:text-ink">
            View attached logs
          </summary>
          <pre className="overflow-x-auto border-t border-line p-3 font-mono text-xs text-ink">
            {ticket.codeSnippet}
          </pre>
        </details>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
        <p className="text-xs text-muted">
          Assigned to <span className="font-medium text-ink">{ticket.assignedHelper}</span>
        </p>
        {isResolved ? (
          <div
            className="flex items-center gap-1 text-amber-500"
            aria-label={`${ticket.rating ?? 5} out of 5 stars`}
          >
            {Array.from({ length: ticket.rating ?? 5 }, (_, index) => (
              <Star key={index} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            ))}
            <span className="ml-1 text-xs font-medium text-muted">Feedback received</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onResolve(ticket.id)}
            className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-500/15 dark:text-emerald-400"
          >
            Mark resolved
          </button>
        )}
      </div>
    </article>
  );
}

export function RatingDialog({
  ticketId,
  starCount,
  onStarCountChange,
  onCancel,
  onSubmit,
}: {
  ticketId: string;
  starCount: number;
  onStarCountChange: (rating: number) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="rating-dialog-title"
        className="w-full max-w-sm rounded-xl border border-line bg-surface p-6 text-center text-ink shadow-xl"
      >
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 id="rating-dialog-title" className="mt-3 text-base font-semibold">
          Rate your support
        </h2>
        <p className="mt-1 text-sm text-muted">
          How was the resolution for request {ticketId}?
        </p>

        <div className="my-5 flex justify-center gap-2 text-amber-500">
          {Array.from({ length: 5 }, (_, index) => {
            const rating = index + 1;
            return (
              <button
                key={rating}
                type="button"
                onClick={() => onStarCountChange(rating)}
                aria-label={`${rating} ${rating === 1 ? 'star' : 'stars'}`}
                aria-pressed={rating === starCount}
                className="rounded p-1 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                <Star
                  className={cn(
                    'h-6 w-6',
                    rating <= starCount ? 'fill-current' : 'text-muted/40'
                  )}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-surface2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-ink hover:opacity-90"
          >
            Submit rating
          </button>
        </div>
      </section>
    </div>
  );
}
