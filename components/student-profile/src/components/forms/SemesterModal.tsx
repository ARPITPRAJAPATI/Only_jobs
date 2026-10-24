'use client';

import { useRef, useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import { getUploadUrl, isLive, putToPresignedUrl } from '@/lib/api';
import type { AcademicSemester } from '@/lib/types';
import { meanSgpa } from '@/lib/utils';
import { useStudent } from '../store';
import { useToast } from '../toast';
import { Button, Field, Modal } from '../ui';

export function SemesterModal({ open, onClose, initial, defaultSem }: { open: boolean; onClose: () => void; initial?: AcademicSemester | null; defaultSem?: number }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? `Edit Semester ${initial.semesterNumber}` : 'Declare semester result'}
      description="Self-declare your marks. The TPO may audit them — false data freezes your account and carries a fine."
    >
      <SemesterForm onClose={onClose} initial={initial} defaultSem={defaultSem} />
    </Modal>
  );
}

function SemesterForm({ onClose, initial, defaultSem }: { onClose: () => void; initial?: AcademicSemester | null; defaultSem?: number }) {
  const { student, saveSemester } = useStudent();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [sem, setSem] = useState(initial?.semesterNumber ?? defaultSem ?? 1);
  const [sgpa, setSgpa] = useState(initial ? String(initial.sgpa) : '');
  const [cgpa, setCgpa] = useState(initial ? String(initial.cgpaCumulative) : '');
  const [cgpaTouched, setCgpaTouched] = useState(!!initial);
  const [active, setActive] = useState(String(initial?.activeBacklogs ?? 0));
  const [dead, setDead] = useState(String(initial?.deadBacklogs ?? 0));
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const taken = new Set(student.academics.map((a) => a.semesterNumber));

  const onSgpa = (v: string) => {
    setSgpa(v);
    const n = Number(v);
    if (!cgpaTouched && v !== '' && n >= 0 && n <= 10) {
      const others = student.academics.filter((a) => a.semesterNumber !== sem).map((a) => ({ sgpa: a.sgpa }));
      setCgpa(String(meanSgpa([...others, { sgpa: n }])));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    const s = Number(sgpa);
    const c = Number(cgpa);
    if (sgpa === '' || Number.isNaN(s) || s < 0 || s > 10) err.sgpa = 'Enter a value between 0 and 10';
    if (cgpa === '' || Number.isNaN(c) || c < 0 || c > 10) err.cgpa = 'Enter a value between 0 and 10';
    if (!Number.isInteger(Number(active)) || Number(active) < 0) err.active = 'Must be 0 or more';
    if (!Number.isInteger(Number(dead)) || Number(dead) < 0) err.dead = 'Must be 0 or more';
    if (!file && !initial?.resultPdfUrl) err.file = 'Marksheet PDF is required';
    if (file && file.type !== 'application/pdf') err.file = 'Only PDF files are accepted';
    if (file && file.size > 5 * 1024 * 1024) err.file = 'Max file size is 5 MB';
    setErrors(err);
    if (Object.keys(err).length) return;

    setBusy(true);
    let url = initial?.resultPdfUrl ?? '';
    if (file) {
      if (isLive) {
        // Direct-to-S3/R2 presigned upload: file never touches the API server.
        const presign = await getUploadUrl(sem);
        if (!presign || !(await putToPresignedUrl(presign.uploadUrl, file))) {
          setBusy(false);
          setErrors({ file: 'Upload failed. Please try again.' });
          return;
        }
        url = presign.fileUrl;
      } else {
        url = `local://${file.name}`;
      }
    }
    const ok = saveSemester({
      id: initial?.id,
      semesterNumber: sem,
      sgpa: s,
      cgpaCumulative: c,
      activeBacklogs: Number(active),
      deadBacklogs: Number(dead),
      resultPdfUrl: url,
    });
    setBusy(false);
    if (ok) {
      toast(`Semester ${sem} saved as self-declared.`);
      onClose();
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Semester">
          <select className="input" value={sem} disabled={!!initial} onChange={(e) => setSem(Number(e.target.value))}>
            {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n} disabled={!initial && taken.has(n)}>
                Semester {n}
                {!initial && taken.has(n) ? ' (declared)' : ''}
              </option>
            ))}
          </select>
        </Field>
        <Field label="SGPA" error={errors.sgpa}>
          <input className="input" inputMode="decimal" placeholder="8.42" value={sgpa} onChange={(e) => onSgpa(e.target.value)} />
        </Field>
        <Field label="Cumulative CGPA" error={errors.cgpa} hint={cgpaTouched ? undefined : 'Auto-filled from your SGPAs'}>
          <input
            className="input"
            inputMode="decimal"
            placeholder="8.10"
            value={cgpa}
            onChange={(e) => {
              setCgpa(e.target.value);
              setCgpaTouched(true);
            }}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Active backlogs" error={errors.active}>
            <input className="input" inputMode="numeric" value={active} onChange={(e) => setActive(e.target.value)} />
          </Field>
          <Field label="Cleared" error={errors.dead}>
            <input className="input" inputMode="numeric" value={dead} onChange={(e) => setDead(e.target.value)} />
          </Field>
        </div>
      </div>

      <Field label="Marksheet (PDF)" error={errors.file} hint={isLive ? 'Uploaded straight to secure storage via a presigned URL.' : 'Demo mode: the file name is stored, not the file.'}>
        <input ref={fileRef} type="file" accept="application/pdf" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex w-full items-center gap-3 rounded-xl border border-dashed border-line bg-surface2 px-4 py-3 text-left text-sm transition hover:border-accent"
        >
          {file || initial?.resultPdfUrl ? <FileText className="h-5 w-5 text-accent" /> : <Upload className="h-5 w-5 text-muted" />}
          <span className="min-w-0 flex-1 truncate">{file ? file.name : initial?.resultPdfUrl ? 'Current marksheet on file — click to replace' : 'Choose a PDF (max 5 MB)'}</span>
        </button>
      </Field>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save semester'}
        </Button>
      </div>
    </form>
  );
}
