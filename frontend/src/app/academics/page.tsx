'use client';

import { AlertTriangle, FileText, GraduationCap, Gavel, Lock, ScanSearch, ShieldCheck } from 'lucide-react';
import { SgpaChart } from '@/components/SgpaChart';
import { AuditChip } from '@/components/StatusChips';
import { useStudent } from '@/components/store';
import { Card, CardHeader, EmptyState, PageGrid, Stat } from '@/components/ui';
import { ProfileSubnav } from '@/components/ProfileSubnav';
import { latestCgpa, totalBacklogs } from '@/lib/utils';

export default function AcademicsPage() {
  const { student } = useStudent();

  const sems = student.academics;
  const cgpa = latestCgpa(student);
  const backlogs = totalBacklogs(student);
  const verified = sems.filter((s) => s.auditStatus === 'VERIFIED').length;
  const flagged = sems.filter((s) => s.auditStatus === 'FLAGGED_FRAUD').length;
  const latest = [...sems].sort((a, b) => b.semesterNumber - a.semesterNumber)[0];

  return (
    <ProfileSubnav>
      <div className="pb-16 animate-fade-in">
      <PageGrid className="!max-w-none !px-0 !py-0">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-4">
          <Stat label="Cumulative CGPA" value={cgpa ? cgpa.toFixed(2) : '—'} sub={`Across ${sems.length} semesters`} icon={<GraduationCap className="h-6 w-6" />} />
          <Stat label="Latest SGPA" value={latest ? latest.sgpa.toFixed(2) : '—'} sub={latest ? `Semester ${latest.semesterNumber}` : 'No records found'} icon={<ScanSearch className="h-6 w-6" />} tone="accent2" />
          <Stat label="Backlogs" value={`${backlogs.active} active`} sub={`${backlogs.dead} cleared`} icon={<AlertTriangle className="h-6 w-6" />} tone="warn" />
          <Stat label="Audit status" value={`${verified}/${sems.length}`} sub={flagged ? `${flagged} flagged` : 'semesters verified'} icon={<ShieldCheck className="h-6 w-6" />} tone="good" />
        </div>

        <div className="grid gap-4 lg:gap-5 xl:grid-cols-3">
          <div className="grid gap-4 lg:gap-5 xl:col-span-2">
            <Card>
              <CardHeader
                title="SGPA trend"
                subtitle="Official semester records verified by Examination Cell & TPO"
                icon={<GraduationCap className="h-4 w-4" />}
              />
              <SgpaChart semesters={sems} cgpa={cgpa} />
            </Card>

            <Card>
              <CardHeader
                title="Semester records"
                subtitle="Sem 1 – 8 · Official university records (Read-Only for Students)"
                icon={<FileText className="h-4 w-4" />}
              />
              {sems.length === 0 ? (
                <EmptyState
                  icon={<GraduationCap className="h-5 w-5" />}
                  title="No academic records entered yet"
                  body="Your official academic marks are updated directly by the Examination Cell and TPO office."
                />
              ) : (
                <div className="-mx-2 overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead>
                      <tr className="text-xs text-white/45">
                        {['Semester', 'SGPA', 'CGPA', 'Backlogs', 'Verification Status', 'Access'].map((h) => (
                          <th key={h} className="px-3 pb-3 font-medium">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sems.map((s) => (
                        <tr key={s.id} className="border-t border-white/[0.08] text-white">
                          <td className="px-3 py-3 font-semibold">Sem {s.semesterNumber}</td>
                          <td className="px-3 py-3 font-mono">{s.sgpa.toFixed(2)}</td>
                          <td className="px-3 py-3 font-mono">{s.cgpaCumulative.toFixed(2)}</td>
                          <td className="px-3 py-3 text-white/60">
                            {s.activeBacklogs === 0 ? (
                              <span className="text-emerald-400 font-medium">Clean record</span>
                            ) : (
                              <span className="text-amber-400 font-medium">{s.activeBacklogs} active</span>
                            )}
                            {s.deadBacklogs > 0 && ` · ${s.deadBacklogs} cleared`}
                          </td>
                          <td className="px-3 py-3">
                            <AuditChip status={s.auditStatus} />
                          </td>
                          <td className="px-3 py-3 text-right">
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white/40" title="Locked official record">
                              <Lock className="h-3.5 w-3.5" /> Locked
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          {/* Official Policy Card */}
          <div className="grid content-start gap-4 lg:gap-5">
            <Card>
              <CardHeader title="Academic Record Policy" subtitle="Official records managed by University Administration" icon={<Gavel className="h-4 w-4" />} />
              <ol className="space-y-4 text-sm">
                {[
                  ['Admin Verified', 'All SGPA, CGPA, and backlog metrics are synced directly from the University Examination Cell.'],
                  ['Read-Only for Students', 'Students cannot alter, create, or delete academic records. This ensures 100% integrity for placement drives.'],
                  ['Corporate Recruiter Proof', 'Verified academic standings are shared directly with recruiters during on-campus hiring.'],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/[0.08] text-xs font-bold text-[#58a6ff] border border-white/[0.1]">{i + 1}</span>
                    <div>
                      <p className="font-semibold text-white">{t}</p>
                      <p className="text-white/50 text-xs mt-0.5">{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-xs text-white/60">
                <p className="flex items-center gap-2 font-semibold text-white/90">
                  <Lock className="h-4 w-4 text-[#58a6ff]" /> Grade Discrepancy?
                </p>
                <p className="mt-1.5 leading-relaxed">
                  If you believe there is an error in your grades or backlogs, please contact the Dean of Academics or the TPO office for resolution.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </PageGrid>
      </div>
    </ProfileSubnav>
  );
}
