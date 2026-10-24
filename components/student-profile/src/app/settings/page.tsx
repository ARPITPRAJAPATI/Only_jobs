'use client';

import { useState } from 'react';
import { FlaskConical, Lock, Palette, RotateCcw, ShieldAlert, UserRound } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import { useStudent } from '@/components/store';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { useToast } from '@/components/toast';
import { Button, Card, CardHeader, Chip, Field, PageGrid } from '@/components/ui';
import { isHttpUrl } from '@/lib/utils';

const HANDLE_RE = /^[A-Za-z0-9_.-]{1,39}$/;

export default function SettingsPage() {
  const { ready } = useStudent();
  // remount the form once persisted data has been loaded so inputs start with real values
  return <SettingsView key={ready ? 'ready' : 'loading'} />;
}

function SettingsView() {
  const { student, updateProfile, setFrozen, resetDemo, source } = useStudent();
  const toast = useToast();

  const [bio, setBio] = useState(student.bio ?? '');
  const [avatarUrl, setAvatarUrl] = useState(student.avatarUrl ?? '');
  const [linkedinUrl, setLinkedinUrl] = useState(student.linkedinUrl ?? '');
  const [xUrl, setXUrl] = useState(student.xUrl ?? '');
  const [handles, setHandles] = useState({
    githubHandle: student.githubHandle ?? '',
    leetcodeHandle: student.leetcodeHandle ?? '',
    codeforcesHandle: student.codeforcesHandle ?? '',
    codechefHandle: student.codechefHandle ?? '',
    gfgHandle: student.gfgHandle ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const locked: [string, string][] = [
    ['Full name', student.name],
    ['Roll number / PRN', student.rollNumber],
    ['Official email', student.email],
    ['Department / branch', student.branch],
    ['Current semester', `Semester ${student.currentSemester}`],
    ['Batch', student.batchYear],
  ];

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (avatarUrl && !isHttpUrl(avatarUrl)) err.avatarUrl = 'Must be a valid http(s) URL';
    if (linkedinUrl && !isHttpUrl(linkedinUrl)) err.linkedinUrl = 'Must be a valid http(s) URL';
    if (xUrl && !isHttpUrl(xUrl)) err.xUrl = 'Must be a valid http(s) URL';
    (Object.keys(handles) as (keyof typeof handles)[]).forEach((k) => {
      if (handles[k] && !HANDLE_RE.test(handles[k])) err[k] = 'Letters, numbers, . _ - only';
    });
    setErrors(err);
    if (Object.keys(err).length) return;

    const n = (v: string) => v.trim() || null;
    const ok = updateProfile({
      bio: n(bio),
      avatarUrl: n(avatarUrl),
      linkedinUrl: n(linkedinUrl),
      xUrl: n(xUrl),
      githubHandle: n(handles.githubHandle),
      leetcodeHandle: n(handles.leetcodeHandle),
      codeforcesHandle: n(handles.codeforcesHandle),
      codechefHandle: n(handles.codechefHandle),
      gfgHandle: n(handles.gfgHandle),
    });
    if (ok) toast('Profile saved. New coding handles sync at midnight.');
  };

  const handleField = (key: keyof typeof handles, label: string, placeholder: string) => (
    <Field label={label} error={errors[key]}>
      <input className="input" value={handles[key]} placeholder={placeholder} onChange={(e) => setHandles({ ...handles, [key]: e.target.value })} />
    </Field>
  );

  return (
    <PageGrid>
      <div className="grid gap-4 lg:gap-5 xl:grid-cols-3">
        <form onSubmit={save} className="grid gap-4 lg:gap-5 xl:col-span-2">
          <Card>
            <CardHeader title="Public profile" subtitle="What recruiters and peers see" icon={<UserRound className="h-4 w-4" />} />
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="flex flex-col items-center gap-2">
                <Avatar name={student.name} src={isHttpUrl(avatarUrl) ? avatarUrl : null} size={96} />
                <span className="text-[11px] text-muted">Preview</span>
              </div>
              <div className="flex-1 space-y-4">
                <Field label="Avatar URL" error={errors.avatarUrl} hint="Link to a square image. Leave empty to use your initials.">
                  <input className="input" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://…" />
                </Field>
                <Field label={`Bio (${bio.length}/300)`}>
                  <textarea className="input min-h-[96px] resize-y" maxLength={300} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A line or two about what you build and what you’re looking for." />
                </Field>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Social & coding handles" subtitle="GitHub and LeetCode are synced nightly" icon={<UserRound className="h-4 w-4" />} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="LinkedIn URL" error={errors.linkedinUrl}>
                <input className="input" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/…" />
              </Field>
              <Field label="X (Twitter) URL" error={errors.xUrl}>
                <input className="input" value={xUrl} onChange={(e) => setXUrl(e.target.value)} placeholder="https://x.com/…" />
              </Field>
              {handleField('githubHandle', 'GitHub username', 'octocat')}
              {handleField('leetcodeHandle', 'LeetCode username', 'neal_wu')}
              {handleField('codeforcesHandle', 'Codeforces handle', 'tourist')}
              {handleField('codechefHandle', 'CodeChef handle', 'gennady')}
              {handleField('gfgHandle', 'GeeksforGeeks handle', 'username')}
            </div>
            <div className="mt-5 flex justify-end">
              <Button type="submit">Save changes</Button>
            </div>
          </Card>
        </form>

        <div className="grid content-start gap-4 lg:gap-5">
          <Card>
            <CardHeader title="College records" subtitle="Managed by the TPO office — read-only" icon={<Lock className="h-4 w-4" />} />
            <dl className="space-y-3">
              {locked.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3 rounded-2xl bg-surface2 px-4 py-3">
                  <div className="min-w-0">
                    <dt className="text-[11px] text-muted">{k}</dt>
                    <dd className="truncate text-sm font-semibold">{v}</dd>
                  </div>
                  <Lock className="h-3.5 w-3.5 shrink-0 text-muted" />
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-muted">Spotted a mistake? Contact the TPO office — locking these prevents falsified roll numbers or branches.</p>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader title="Appearance" subtitle="Four themes inspired by your reference dashboards" icon={<Palette className="h-4 w-4" />} />
        <ThemeSwitcher variant="cards" />
      </Card>

      <Card>
        <CardHeader
          title="Demo controls"
          subtitle="Only for previewing the UI without a backend"
          icon={<FlaskConical className="h-4 w-4" />}
          action={<Chip tone={source === 'api' ? 'good' : 'warn'}>{source === 'api' ? 'Live API' : 'Mock data'}</Chip>}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface2 p-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <ShieldAlert className="h-4 w-4 text-bad" /> Simulate fraud flag
              </p>
              <p className="text-xs text-muted">Freezes the account, adds a ₹500 fine and disables editing — like a TPO click.</p>
            </div>
            <Button size="sm" variant={student.isAccountFrozen ? 'secondary' : 'danger'} onClick={() => setFrozen(!student.isAccountFrozen)}>
              {student.isAccountFrozen ? 'Unfreeze' : 'Freeze'}
            </Button>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface2 p-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <RotateCcw className="h-4 w-4" /> Reset demo data
              </p>
              <p className="text-xs text-muted">Discards your local edits and restores the sample student.</p>
            </div>
            <Button size="sm" variant="secondary" onClick={resetDemo}>
              Reset
            </Button>
          </div>
        </div>
      </Card>
    </PageGrid>
  );
}
