'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight, BadgeCheck, Clock, Lock, Undo2 } from 'lucide-react';
import { BadgeIcon } from '@/components/BadgeIcon';
import { BadgeRequestModal } from '@/components/forms/BadgeRequestModal';
import { BadgeStatusChip } from '@/components/StatusChips';
import { useStudent } from '@/components/store';
import { useToast } from '@/components/toast';
import { Button, Card, Chip, PageGrid, Stat } from '@/components/ui';
import { ProfileSubnav } from '@/components/ProfileSubnav';
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
    <ProfileSubnav>
      <div className="pb-16 animate-fade-in">
      <PageGrid className="!max-w-none !px-0 !py-0">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">
        <Stat label="Approved" value={count('APPROVED')} sub="Visible to recruiters" icon={<BadgeCheck className="h-6 w-6" />} tone="good" />
        <Stat label="Pending review" value={count('PENDING')} sub="In the TPO queue" icon={<Clock className="h-6 w-6" />} tone="warn" />
        <Stat label="Available" value={catalog.length - student.badges.length} sub="Not yet requested" icon={<Lock className="h-6 w-6" />} />
      </div>

      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold tracking-tight text-white">Badge catalog</h2>
            <p className="text-xs text-white/50 mt-0.5">Submit proof, an admin approves in one click — no spreadsheets.</p>
          </div>
          <div className="profile-filter-group flex flex-wrap gap-1 rounded-xl border border-white/[0.1] bg-white/[0.04] p-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  'profile-filter-option rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  filter === f.id
                    ? 'is-active text-white bg-white/[0.12] font-semibold'
                    : 'text-white/55 hover:text-white hover:bg-white/[0.06]'
                )}
              >
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
              <div
                key={badge.id}
                className={cn(
                  'profile-glass-tile flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-md p-5 transition-all shadow-lg hover:bg-white/[0.08] hover:border-white/[0.18]',
                  approved && 'border-[#3fb950]/35 bg-[#3fb950]/10',
                )}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <BadgeIcon iconUrl={badge.iconUrl} muted={!approved} className={approved ? '' : 'opacity-80'} />
                  {mine ? <BadgeStatusChip status={mine.status} /> : <Chip>Not requested</Chip>}
                </div>
                <h3 className="font-bold tracking-tight text-white">{badge.title}</h3>
                <p className="mt-1 flex-1 text-sm text-white/55">{badge.description}</p>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">{badge.category.replace('_', ' ')}</p>

                {mine?.status === 'REJECTED' && mine.rejectionReason && (
                  <p className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">{mine.rejectionReason}</p>
                )}
                {approved && <p className="mt-3 text-xs text-[#56d364]">Verified {formatDate(mine?.verifiedAt)}</p>}

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
                    <a href={mine.proofUrl} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#58a6ff] hover:underline">
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
      </div>
    </ProfileSubnav>
  );
}
