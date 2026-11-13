'use client';

import { useState } from 'react';
import { Award, Check, Copy, ExternalLink, Fingerprint, GraduationCap, Plus, Trash2 } from 'lucide-react';
import { CertificationModal } from '@/components/forms/CertificationModal';
import { useStudent } from '@/components/store';
import { useToast } from '@/components/toast';
import { Button, Card, Chip, EmptyState, IconButton, PageGrid, Stat } from '@/components/ui';
import { ProfileSubnav } from '@/components/ProfileSubnav';
import { cn, formatDate } from '@/lib/utils';

type Filter = 'ALL' | 'INTERNAL' | 'EXTERNAL';

export default function CertificationsPage() {
  const { student, removeCertification } = useStudent();
  const toast = useToast();
  const [filter, setFilter] = useState<Filter>('ALL');
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const certs = [...student.certifications]
    .sort((a, b) => +new Date(b.issueDate) - +new Date(a.issueDate))
    .filter((c) => filter === 'ALL' || (filter === 'INTERNAL' ? c.isInternalCourse : !c.isInternalCourse));
  const internal = student.certifications.filter((c) => c.isInternalCourse).length;

  const copy = async (hash: string, id: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(id);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      toast('Could not copy to clipboard.', 'error');
    }
  };

  return (
    <ProfileSubnav>
      <div className="pb-16 animate-fade-in">
      <PageGrid className="!max-w-none !px-0 !py-0">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">
        <Stat label="Total certifications" value={student.certifications.length} icon={<Award className="h-6 w-6" />} />
        <Stat label="Platform-issued" value={internal} sub="Hash-verified automatically" icon={<Fingerprint className="h-6 w-6" />} tone="good" />
        <Stat label="External" value={student.certifications.length - internal} sub="AWS, NPTEL, Coursera…" icon={<GraduationCap className="h-6 w-6" />} tone="accent2" />
      </div>

      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="profile-filter-group flex gap-1 rounded-xl border border-white/[0.1] bg-white/[0.04] p-1">
            {(['ALL', 'INTERNAL', 'EXTERNAL'] as Filter[]).map((f) => (
              <button
                key={f}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  'profile-filter-option rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                  filter === f
                    ? 'is-active text-white bg-white/[0.12] font-semibold'
                    : 'text-white/55 hover:text-white hover:bg-white/[0.06]'
                )}
              >
                {f.toLowerCase()}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Add external
          </Button>
        </div>

        {certs.length === 0 ? (
          <EmptyState icon={<Award className="h-5 w-5" />} title="Nothing here yet" body="Complete a 3-phase platform assessment or add an external credential." action={<Button onClick={() => setOpen(true)}>Add certification</Button>} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {certs.map((c) => (
              <div
                key={c.id}
                className="profile-glass-tile flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-md p-5 shadow-lg transition-all hover:bg-white/[0.08] hover:border-white/[0.18]"
              >
                <span
                  className={cn(
                    'grid h-10 w-10 shrink-0 place-items-center rounded-xl border',
                    c.isInternalCourse
                      ? 'border-[#3fb950]/40 bg-[#3fb950]/15 text-[#56d364]'
                      : 'border-[#58a6ff]/40 bg-[#58a6ff]/15 text-[#79c0ff]'
                  )}
                >
                  {c.isInternalCourse ? <Fingerprint className="h-5 w-5" /> : <Award className="h-5 w-5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    {c.isInternalCourse ? <Chip tone="good">Hash verified</Chip> : <Chip>External</Chip>}
                    <span className="text-xs text-white/45">{formatDate(c.issueDate, { month: 'short', year: 'numeric' })}</span>
                  </div>
                  <h3 className="font-bold leading-snug tracking-tight text-white">{c.title}</h3>
                  <p className="text-sm text-white/55 mt-0.5">{c.issuingOrg}</p>

                  {c.certificateHash && (
                    <button
                      onClick={() => copy(c.certificateHash!, c.id)}
                      className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.05] px-3 py-1.5 font-mono text-[11px] text-white/60 transition-colors hover:border-white/[0.2] hover:bg-white/[0.1] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58a6ff]/40"
                      title="Copy certificate hash"
                    >
                      <span className="truncate">{c.certificateHash}</span>
                      {copied === c.id ? <Check className="h-3.5 w-3.5 shrink-0 text-[#56d364]" /> : <Copy className="h-3.5 w-3.5 shrink-0" />}
                    </button>
                  )}

                  <div className="mt-3 flex items-center gap-1">
                    {c.credentialUrl && (
                      <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#58a6ff] hover:underline">
                        View credential <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {!c.isInternalCourse && (
                      <IconButton
                        className="ml-auto"
                        aria-label={`Remove ${c.title}`}
                        onClick={() => {
                          if (window.confirm(`Remove “${c.title}”?`) && removeCertification(c.id)) toast('Certification removed.', 'info');
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <CertificationModal open={open} onClose={() => setOpen(false)} />
      </PageGrid>
      </div>
    </ProfileSubnav>
  );
}
