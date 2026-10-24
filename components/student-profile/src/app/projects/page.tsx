'use client';

import { useState } from 'react';
import { FolderGit2, Pencil, Pin, Plus, Trash2 } from 'lucide-react';
import { ProjectModal } from '@/components/forms/ProjectModal';
import { ProjectCard } from '@/components/ProjectCard';
import { useStudent } from '@/components/store';
import { useToast } from '@/components/toast';
import { Button, Card, Chip, EmptyState, IconButton, PageGrid } from '@/components/ui';
import type { Project } from '@/lib/types';
import { MAX_PROJECTS, cn } from '@/lib/utils';

export default function ProjectsPage() {
  const { student, removeProject } = useStudent();
  const toast = useToast();
  const [modal, setModal] = useState<{ open: boolean; initial: Project | null }>({ open: false, initial: null });
  const count = student.projects.length;
  const full = count >= MAX_PROJECTS;

  return (
    <PageGrid>
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accentSoft text-accent">
            <Pin className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Pinned projects</h2>
            <p className="text-sm text-muted">Max {MAX_PROJECTS} — quality over quantity. Each README is rendered as safe Markdown.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1" aria-label={`${count} of ${MAX_PROJECTS} slots used`}>
            {Array.from({ length: MAX_PROJECTS }, (_, i) => (
              <span key={i} className={cn('h-2.5 w-6 rounded-full', i < count ? 'bg-accent' : 'bg-muted/20')} />
            ))}
            <Chip tone={full ? 'warn' : 'accent'} className="ml-2">
              {count}/{MAX_PROJECTS}
            </Chip>
          </div>
          <Button disabled={full} onClick={() => setModal({ open: true, initial: null })} title={full ? 'Remove a project to add another' : undefined}>
            <Plus className="h-4 w-4" /> Add project
          </Button>
        </div>
      </Card>

      {count === 0 ? (
        <Card>
          <EmptyState icon={<FolderGit2 className="h-5 w-5" />} title="No projects pinned" body="Showcase your best work with a full README, live demo and tech stack." action={<Button onClick={() => setModal({ open: true, initial: null })}>Add your first project</Button>} />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:gap-5 2xl:grid-cols-3">
          {student.projects.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              actions={
                <div className="flex items-center">
                  <IconButton aria-label={`Edit ${p.title}`} onClick={() => setModal({ open: true, initial: p })}>
                    <Pencil className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    aria-label={`Delete ${p.title}`}
                    onClick={() => {
                      if (window.confirm(`Remove “${p.title}” from your profile?`) && removeProject(p.id)) toast('Project removed.', 'info');
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              }
            />
          ))}
        </div>
      )}

      <Card>
        <h3 className="h-section mb-3">Verification pipeline</h3>
        <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center">
          {[
            ['Unverified', 'Freshly pinned — visible but unmarked.'],
            ['AI analyzed', 'Plagiarism / similarity score attached by the AI service.'],
            ['Teacher approved', 'A faculty member reviewed and vouched for it.'],
          ].map(([t, d], i, arr) => (
            <div key={t} className="flex flex-1 items-center gap-3">
              <div className="flex-1 rounded-2xl bg-surface2 p-4">
                <p className="font-semibold">{t}</p>
                <p className="text-xs text-muted">{d}</p>
              </div>
              {i < arr.length - 1 && <span className="hidden text-muted sm:block">→</span>}
            </div>
          ))}
        </div>
      </Card>

      <ProjectModal key={modal.initial?.id ?? 'new'} open={modal.open} initial={modal.initial} onClose={() => setModal({ open: false, initial: null })} />
    </PageGrid>
  );
}
