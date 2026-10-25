'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { Project } from '@/lib/types';
import { cn, isHttpUrl } from '@/lib/utils';
import { Markdown } from '../Markdown';
import { useStudent } from '../store';
import { useToast } from '../toast';
import { Button, Field, Modal } from '../ui';

const TEMPLATE = `# Project name

One-paragraph summary of what it does and why you built it.

## Features
- Feature one
- Feature two

## Tech & architecture
Explain the stack and key design decisions.

## Run locally
\`\`\`bash
npm install && npm run dev
\`\`\`
`;

export function ProjectModal({ open, onClose, initial }: { open: boolean; onClose: () => void; initial?: Project | null }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      wide
      title={initial ? 'Edit project' : 'Pin a featured project'}
      description="Write the full README in Markdown — it is sanitised before rendering."
    >
      <ProjectForm onClose={onClose} initial={initial} />
    </Modal>
  );
}

function ProjectForm({ onClose, initial }: { onClose: () => void; initial?: Project | null }) {
  const { saveProject } = useStudent();
  const toast = useToast();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [tagline, setTagline] = useState(initial?.shortTagline ?? '');
  const [repo, setRepo] = useState(initial?.githubRepoUrl ?? '');
  const [demo, setDemo] = useState(initial?.liveDemoUrl ?? '');
  const [md, setMd] = useState(initial?.markdownContent ?? TEMPLATE);
  const [stack, setStack] = useState<string[]>(initial?.techStack ?? []);
  const [stackInput, setStackInput] = useState('');
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addTech = () => {
    const v = stackInput.trim().replace(/,$/, '');
    if (v && !stack.includes(v) && stack.length < 10) setStack([...stack, v]);
    setStackInput('');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!title.trim()) err.title = 'Title is required';
    if (!tagline.trim()) err.tagline = 'Add a one-line tagline';
    if (repo && !isHttpUrl(repo)) err.repo = 'Must be a valid http(s) URL';
    if (demo && !isHttpUrl(demo)) err.demo = 'Must be a valid http(s) URL';
    if (md.trim().length < 20) err.md = 'Write at least a short README';
    setErrors(err);
    if (Object.keys(err).length) return;

    const ok = saveProject({
      id: initial?.id,
      title: title.trim(),
      shortTagline: tagline.trim(),
      markdownContent: md,
      githubRepoUrl: repo.trim() || null,
      liveDemoUrl: demo.trim() || null,
      techStack: stack,
    });
    if (ok) {
      toast(initial ? 'Project updated.' : 'Project pinned. AI analysis will run shortly.');
      onClose();
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={`Title (${title.length}/120)`} error={errors.title}>
          <input className="input" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="KubePay" />
        </Field>
        <Field label={`Tagline (${tagline.length}/200)`} error={errors.tagline}>
          <input className="input" maxLength={200} value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Microservices payment gateway on Kubernetes" />
        </Field>
        <Field label="GitHub repository" error={errors.repo}>
          <input className="input" value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="https://github.com/you/repo" />
        </Field>
        <Field label="Live demo" error={errors.demo}>
          <input className="input" value={demo} onChange={(e) => setDemo(e.target.value)} placeholder="https://…" />
        </Field>
      </div>

      <Field label="Tech stack" hint="Press Enter or comma to add (max 10)">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-line bg-surface2 p-2 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
          {stack.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-full bg-accentSoft px-2.5 py-1 text-xs font-semibold text-accent">
              {t}
              <button type="button" aria-label={`Remove ${t}`} onClick={() => setStack(stack.filter((x) => x !== t))}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            value={stackInput}
            onChange={(e) => setStackInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addTech();
              }
              if (e.key === 'Backspace' && !stackInput) setStack(stack.slice(0, -1));
            }}
            onBlur={addTech}
            placeholder={stack.length ? '' : 'Next.js, Docker…'}
            className="min-w-[120px] flex-1 bg-transparent px-1.5 py-1 text-sm outline-none"
          />
        </div>
      </Field>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="label !mb-0">README (Markdown)</span>
          <div className="flex rounded-full bg-surface2 p-0.5 text-xs font-semibold">
            {(['write', 'preview'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn('rounded-full px-3 py-1 capitalize transition', tab === t ? 'bg-accent text-accentInk' : 'text-muted')}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        {tab === 'write' ? (
          <textarea className="input min-h-[260px] font-mono text-[13px] leading-relaxed" value={md} onChange={(e) => setMd(e.target.value)} spellCheck={false} />
        ) : (
          <div className="min-h-[260px] rounded-xl border border-line p-4">
            <Markdown>{md}</Markdown>
          </div>
        )}
        {errors.md && <p className="mt-1 text-xs text-bad">{errors.md}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{initial ? 'Save changes' : 'Pin project'}</Button>
      </div>
    </form>
  );
}
