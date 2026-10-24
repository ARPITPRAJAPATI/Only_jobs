'use client';

import { useState } from 'react';
import { Award, Check, Copy, ExternalLink, Fingerprint, GraduationCap, Plus, Trash2 } from 'lucide-react';
import { CertificationModal } from '@/components/forms/CertificationModal';
import { useStudent } from '@/components/store';
import { useToast } from '@/components/toast';
import { Button, Card, Chip, EmptyState, IconButton, PageGrid, Stat } from '@/components/ui';
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
    <PageGrid>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">
        <Stat label="Total certifications" value={student.certifications.length} icon={<Award className="h-6 w-6" />} />
        <Stat label="Platform-issued" value={internal} sub="Hash-verified automatically" icon={<Fingerprint className="h-6 w-6" />} tone="good" />
        <Stat label="External" value={student.certifications.length - internal} sub="AWS, NPTEL, Coursera…" icon={<GraduationCap className="h-6 w-6" />} tone="accent2" />
      </div>

      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1.5 rounded-full bg-surface2 p-1">
            {(['ALL', 'INTERNAL', 'EXTERNAL'] as Filter[]).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={cn('rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition', filter === f ? 'bg-accent text-accentInk' : 'text-muted hover:text-ink')}>
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
              <div key={c.id} className="flex gap-4 rounded-3xl border border-line p-5">
                <span className={cn('grid h-14 w-14 shrink-0 place-items-center rounded-2xl', c.isInternalCourse ? 'bg-good/10 text-good' : 'bg-accentSoft text-accent')}>
                  {c.isInternalCourse ? <Fingerprint className="h-7 w-7" /> : <Award className="h-7 w-7" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    {c.isInternalCourse ? <Chip tone="good">Hash verified</Chip> : <Chip>External</Chip>}
                    <span className="text-xs text-muted">{formatDate(c.issueDate, { month: 'short', year: 'numeric' })}</span>
                  </div>
                  <h3 className="font-bold leading-snug tracking-tight">{c.title}</h3>
                  <p className="text-sm text-muted">{c.issuingOrg}</p>

                  {c.certificateHash && (
                    <button onClick={() => copy(c.certificateHash!, c.id)} className="mt-3 inline-flex max-w-full items-center gap-2 rounded-xl bg-surface2 px-3 py-1.5 font-mono text-[11px] text-muted transition hover:text-ink" title="Copy certificate hash">
                      <span className="truncate">{c.certificateHash}</span>
                      {copied === c.id ? <Check className="h-3.5 w-3.5 shrink-0 text-good" /> : <Copy className="h-3.5 w-3.5 shrink-0" />}
                    </button>
                  )}

                  <div className="mt-3 flex items-center gap-1">
                    {c.credentialUrl && (
                      <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline">
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
  );
}
