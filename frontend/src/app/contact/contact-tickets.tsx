'use client';

import { CheckCircle2, ChevronDown, Clock3, FileText, MessageSquare, Star, UserRound } from 'lucide-react';
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
    <article className="group overflow-hidden rounded-xl border border-line bg-surface shadow-sm transition-all duration-200 hover:border-accent/30 hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-surface2/30 px-4 py-3 sm:px-5">
        <span className="font-mono text-[11px] font-medium tracking-wide text-muted">{ticket.id}</span>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-semibold',
            isResolved
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : 'border-accent/20 bg-accent/10 text-accent'
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', isResolved ? 'bg-emerald-500' : 'bg-accent')} aria-hidden="true" />
          {isResolved
            ? 'Resolved'
            : ticket.status.toLowerCase().replace('_', ' ').replace(/^\w/, (letter) => letter.toUpperCase())}
        </span>
        <span
          className={cn(
            'rounded-full border px-2 py-1 text-[10px] font-semibold',
            ticket.priority === 'URGENT'
              ? 'border-bad/20 bg-bad/10 text-bad'
              : ticket.priority === 'HIGH'
                ? 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                : 'border-line bg-surface text-muted'
          )}
        >
          {ticket.priority.toLowerCase()} priority
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-muted">
          <Clock3 aria-hidden="true" className="h-3 w-3" />
          {ticket.createdAt}
        </span>
      </div>

      <div className="px-4 py-4 sm:px-5">
        <h3 className="text-sm font-bold leading-5 text-ink">{ticket.title}</h3>
        <p className="mt-1 text-xs font-medium leading-5 text-accent">{ticket.courseContext}</p>
        <p className="mt-3 text-[13px] leading-6 text-muted">{ticket.description}</p>

        {ticket.codeSnippet && (
          <details className="group/logs mt-3 overflow-hidden rounded-lg border border-line bg-surface2/50">
            <summary className="flex min-h-9 cursor-pointer list-none items-center gap-2 px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface2 hover:text-ink [&::-webkit-details-marker]:hidden">
              <FileText aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
              View attached logs
              <ChevronDown aria-hidden="true" className="ml-auto h-3.5 w-3.5 transition-transform group-open/logs:rotate-180" />
            </summary>
            <pre className="max-h-40 overflow-auto border-t border-line bg-bg/50 p-3 font-mono text-[11px] leading-5 text-ink">
              {ticket.codeSnippet}
            </pre>
          </details>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface2/20 px-4 py-3 sm:px-5">
        <p className="inline-flex min-w-0 items-center gap-1.5 text-xs text-muted">
          <UserRound aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          <span>Assigned to</span>
          <span className="truncate font-semibold text-ink">{ticket.assignedHelper}</span>
        </p>
        {isResolved ? (
          <div className="inline-flex items-center gap-1 text-amber-500" aria-label={`${ticket.rating ?? 5} out of 5 stars`}>
            {Array.from({ length: ticket.rating ?? 5 }, (_, index) => (
              <Star key={index} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            ))}
            <span className="ml-1 text-[11px] font-medium text-muted">Feedback received</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onResolve(ticket.id)}
            className="inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 dark:text-emerald-400"
          >
            <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
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
