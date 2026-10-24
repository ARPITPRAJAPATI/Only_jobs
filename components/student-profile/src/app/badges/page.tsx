'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight, BadgeCheck, Clock, Lock, Undo2 } from 'lucide-react';
import { BadgeIcon } from '@/components/BadgeIcon';
import { BadgeRequestModal } from '@/components/forms/BadgeRequestModal';
import { BadgeStatusChip } from '@/components/StatusChips';
import { useStudent } from '@/components/store';
import { useToast } from '@/components/toast';
import { Button, Card, Chip, PageGrid, Stat } from '@/components/ui';
import type { Badge, BadgeCategory } from '@/lib/types';
import { cn, formatDate } from '@/lib/utils';

const FILTERS: { id: 'ALL' | BadgeCategory; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'DSA', label: 'DSA' },
  { id: 'DEV', label: 'Development' },
  { id: 'OPEN_SOURCE', label: 'Open source' },
  { id: 'COMPETITIVE', label: 'Competitive' },
];

export default function BadgesPage() {
  const { student, catalog, withdrawBadge } = useStudent();
  const toast = useToast();
  const [filter, setFilter] = useState<'ALL' | BadgeCategory>('ALL');
  const [requesting, setRequesting] = useState<Badge | null>(null);

  const byBadge = useMemo(() => new Map(student.badges.map((b) => [b.badgeId, b])), [student.badges]);
  const list = catalog.filter((b) => filter === 'ALL' || b.category === filter);
  const count = (s: 'APPROVED' | 'PENDING' | 'REJECTED') => student.badges.filter((b) => b.status === s).length;

  return (
    <PageGrid>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">
        <Stat label="Approved" value={count('APPROVED')} sub="Visible to recruiters" icon={<BadgeCheck className="h-6 w-6" />} tone="good" />
        <Stat label="Pending review" value={count('PENDING')} sub="In the TPO queue" icon={<Clock className="h-6 w-6" />} tone="warn" />
        <Stat label="Available" value={catalog.length - student.badges.length} sub="Not yet requested" icon={<Lock className="h-6 w-6" />} />
      </div>

      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="h-section">Badge catalog</h2>
            <p className="text-xs text-muted">Submit proof, an admin approves in one click — no spreadsheets.</p>
          </div>
          <div className="flex flex-wrap gap-1.5 rounded-full bg-surface2 p-1">
            {FILTERS.map((f) => (
              <button key={f.id} onClick={() => setFilter(f.id)} className={cn('rounded-full px-3.5 py-1.5 text-xs font-semibold transition', filter === f.id ? 'bg-accent text-accentInk' : 'text-muted hover:text-ink')}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((badge) => {
            const mine = byBadge.get(badge.id);
            const approved = mine?.status === 'APPROVED';
            return (
              <div key={badge.id} className={cn('flex flex-col rounded-3xl border p-5 transition', approved ? 'border-good/30 bg-good/5' : 'border-line bg-surface')}>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <BadgeIcon iconUrl={badge.iconUrl} muted={!approved} className={approved ? '' : 'opacity-80'} />
                  {mine ? <BadgeStatusChip status={mine.status} /> : <Chip>Not requested</Chip>}
                </div>
                <h3 className="font-bold tracking-tight">{badge.title}</h3>
                <p className="mt-1 flex-1 text-sm text-muted">{badge.description}</p>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-muted">{badge.category.replace('_', ' ')}</p>

                {mine?.status === 'REJECTED' && mine.rejectionReason && <p className="mt-3 rounded-xl bg-bad/10 p-3 text-xs text-bad">{mine.rejectionReason}</p>}
                {approved && <p className="mt-3 text-xs text-good">Verified {formatDate(mine?.verifiedAt)}</p>}

                <div className="mt-4 flex items-center gap-2">
                  {!mine && (
                    <Button size="sm" onClick={() => setRequesting(badge)}>
                      Request badge
                    </Button>
                  )}
                  {mine?.status === 'REJECTED' && (
                    <Button size="sm" onClick={() => setRequesting(badge)}>
                      Re-apply
                    </Button>
                  )}
                  {mine?.status === 'PENDING' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        if (withdrawBadge(badge.id)) toast('Request withdrawn.', 'info');
                      }}
                    >
                      <Undo2 className="h-3.5 w-3.5" /> Withdraw
                    </Button>
                  )}
                  {mine && (
                    <a href={mine.proofUrl} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
                      Proof <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <BadgeRequestModal badge={requesting} onClose={() => setRequesting(null)} />
    </PageGrid>
  );
}
