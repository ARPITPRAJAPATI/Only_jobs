'use client';

import { useState } from 'react';
import { AlertTriangle, FileText, GraduationCap, Gavel, Lock, Pencil, Plus, ScanSearch, ShieldCheck, Trash2, Upload } from 'lucide-react';
import { SemesterModal } from '@/components/forms/SemesterModal';
import { SgpaChart } from '@/components/SgpaChart';
import { AuditChip } from '@/components/StatusChips';
import { useStudent } from '@/components/store';
import { useToast } from '@/components/toast';
import { Button, Card, CardHeader, Chip, EmptyState, IconButton, PageGrid, Stat } from '@/components/ui';
import type { AcademicSemester } from '@/lib/types';
import { latestCgpa, totalBacklogs } from '@/lib/utils';

export default function AcademicsPage() {
  const { student, removeSemester } = useStudent();
  const toast = useToast();
  const [modal, setModal] = useState<{ open: boolean; initial: AcademicSemester | null }>({ open: false, initial: null });

  const sems = student.academics;
  const cgpa = latestCgpa(student);
  const backlogs = totalBacklogs(student);
  const verified = sems.filter((s) => s.auditStatus === 'VERIFIED').length;
  const flagged = sems.filter((s) => s.auditStatus === 'FLAGGED_FRAUD').length;
  const nextSem = Array.from({ length: 8 }, (_, i) => i + 1).find((n) => !sems.some((s) => s.semesterNumber === n));
  const latest = [...sems].sort((a, b) => b.semesterNumber - a.semesterNumber)[0];

  return (
    <PageGrid>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-4">
        <Stat label="Cumulative CGPA" value={cgpa ? cgpa.toFixed(2) : '—'} sub={`Across ${sems.length} semesters`} icon={<GraduationCap className="h-6 w-6" />} />
        <Stat label="Latest SGPA" value={latest ? latest.sgpa.toFixed(2) : '—'} sub={latest ? `Semester ${latest.semesterNumber}` : 'Nothing declared'} icon={<ScanSearch className="h-6 w-6" />} tone="accent2" />
        <Stat label="Backlogs" value={`${backlogs.active} active`} sub={`${backlogs.dead} cleared`} icon={<AlertTriangle className="h-6 w-6" />} tone="warn" />
        <Stat label="Audit status" value={`${verified}/${sems.length}`} sub={flagged ? `${flagged} flagged` : 'semesters verified'} icon={<ShieldCheck className="h-6 w-6" />} tone="good" />
      </div>

      <div className="grid gap-4 lg:gap-5 xl:grid-cols-3">
        <div className="grid gap-4 lg:gap-5 xl:col-span-2">
          <Card>
            <CardHeader
              title="SGPA trend"
              subtitle="Solid bars are TPO-verified, faded bars are self-declared"
              icon={<GraduationCap className="h-4 w-4" />}
              action={
                <Button size="sm" disabled={!nextSem} onClick={() => setModal({ open: true, initial: null })}>
                  <Plus className="h-4 w-4" /> Declare semester
                </Button>
              }
            />
            <SgpaChart semesters={sems} cgpa={cgpa} />
          </Card>

          <Card>
            <CardHeader title="Semester records" subtitle="Sem 1 – 8 · marksheets are stored in secure object storage" icon={<FileText className="h-4 w-4" />} />
            {sems.length === 0 ? (
              <EmptyState icon={<Upload className="h-5 w-5" />} title="No semesters declared" body="Self-declare your SGPA and upload the marksheet PDF for each semester." action={<Button onClick={() => setModal({ open: true, initial: null })}>Declare Semester 1</Button>} />
            ) : (
              <div className="-mx-2 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="text-xs text-muted">
                      {['Sem', 'SGPA', 'CGPA', 'Backlogs', 'Marksheet', 'Audit', ''].map((h) => (
                        <th key={h} className="px-2 pb-3 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sems.map((s) => {
                      const locked = s.auditStatus !== 'SELF_DECLARED';
                      const local = s.resultPdfUrl.startsWith('local://');
                      return (
                        <tr key={s.id} className="border-t border-line">
                          <td className="px-2 py-3 font-semibold">Sem {s.semesterNumber}</td>
                          <td className="px-2 py-3">{s.sgpa.toFixed(2)}</td>
                          <td className="px-2 py-3">{s.cgpaCumulative.toFixed(2)}</td>
                          <td className="px-2 py-3 text-muted">
                            {s.activeBacklogs} active · {s.deadBacklogs} cleared
                          </td>
                          <td className="px-2 py-3">
                            {local ? (
                              <span className="inline-flex max-w-[140px] items-center gap-1.5 truncate text-xs text-muted" title={s.resultPdfUrl.slice(8)}>
                                <FileText className="h-3.5 w-3.5 shrink-0" /> {s.resultPdfUrl.slice(8)}
                              </span>
                            ) : (
                              <a href={s.resultPdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline">
                                <FileText className="h-3.5 w-3.5" /> View PDF
                              </a>
                            )}
                          </td>
                          <td className="px-2 py-3">
                            <AuditChip status={s.auditStatus} />
                          </td>
                          <td className="px-2 py-3">
                            <div className="flex justify-end gap-0.5">
                              {locked ? (
                                <span className="grid h-9 w-9 place-items-center text-muted" title="Locked after TPO audit">
                                  <Lock className="h-4 w-4" />
                                </span>
                              ) : (
                                <>
                                  <IconButton aria-label={`Edit semester ${s.semesterNumber}`} onClick={() => setModal({ open: true, initial: s })}>
                                    <Pencil className="h-4 w-4" />
                                  </IconButton>
                                  <IconButton
                                    aria-label={`Delete semester ${s.semesterNumber}`}
                                    onClick={() => {
                                      if (removeSemester(s.id)) toast(`Semester ${s.semesterNumber} removed.`, 'info');
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </IconButton>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Trust + Penalty */}
        <div className="grid content-start gap-4 lg:gap-5">
          <Card>
            <CardHeader title="Trust + Penalty model" subtitle="Why there is no upfront paperwork queue" icon={<Gavel className="h-4 w-4" />} />
            <ol className="space-y-4 text-sm">
              {[
                ['Self-declare', 'You enter SGPA, CGPA and backlogs for Sem 1–8.'],
                ['Upload proof', 'Marksheet PDFs go straight from your browser to secure storage.'],
                ['Spot audit', 'The TPO audits randomly and before sending names to recruiters.'],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accentSoft text-xs font-bold text-accent">{i + 1}</span>
                  <div>
                    <p className="font-semibold">{t}</p>
                    <p className="text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-5 rounded-2xl bg-bad/10 p-4 text-sm">
              <p className="flex items-center gap-2 font-semibold text-bad">
                <AlertTriangle className="h-4 w-4" /> If fraud is found
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-ink/80">
                <li>Account freezes instantly</li>
                <li>₹500 fine is levied</li>
                <li>Dean’s disciplinary notice is generated</li>
              </ul>
            </div>
          </Card>

          <Card>
            <CardHeader title="Legend" />
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-3">
                <AuditChip status="SELF_DECLARED" /> <span className="text-muted">Editable until audited</span>
              </div>
              <div className="flex items-center gap-3">
                <AuditChip status="VERIFIED" /> <span className="text-muted">Confirmed by TPO — locked</span>
              </div>
              <div className="flex items-center gap-3">
                <AuditChip status="FLAGGED_FRAUD" /> <span className="text-muted">Triggers freeze + fine</span>
              </div>
              {nextSem && (
                <Chip tone="accent" className="mt-1">
                  Next up: Semester {nextSem}
                </Chip>
              )}
            </div>
          </Card>
        </div>
      </div>

      <SemesterModal key={modal.initial?.id ?? 'new'} open={modal.open} initial={modal.initial} defaultSem={nextSem} onClose={() => setModal({ open: false, initial: null })} />
    </PageGrid>
  );
}
