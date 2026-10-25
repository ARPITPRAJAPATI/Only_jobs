'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Bot, ExternalLink, FolderGit2, GraduationCap, MessageSquareQuote } from 'lucide-react';
import { GithubIcon } from '@/components/BrandIcons';
import { Markdown } from '@/components/Markdown';
import { ProjectVerificationChip } from '@/components/StatusChips';
import { useStudent } from '@/components/store';
import { Button, Card, CardHeader, Chip, EmptyState, PageGrid } from '@/components/ui';
import { formatDate, projectVerification } from '@/lib/utils';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { student, ready } = useStudent();
  const project = student.projects.find((p) => p.id === id);

  if (!project) {
    return (
      <Card>
        <EmptyState
          icon={<FolderGit2 className="h-5 w-5" />}
          title={ready ? 'Project not found' : 'Loading…'}
          body="It may have been removed from your pinned list."
          action={
            <Link href="/projects">
              <Button>Back to projects</Button>
            </Link>
          }
        />
      </Card>
    );
  }

  const v = projectVerification(project);

  return (
    <PageGrid>
      <Link href="/projects" className="inline-flex w-fit items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-muted shadow-card transition hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>

      <div className="grid gap-4 lg:gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <ProjectVerificationChip status={v} />
            <span className="text-xs text-muted">Added {formatDate(project.createdAt)}</span>
          </div>
          <Markdown>{project.markdownContent}</Markdown>
        </Card>

        <div className="grid content-start gap-4 lg:gap-5">
          <Card>
            <CardHeader title={project.title} subtitle={project.shortTagline} icon={<FolderGit2 className="h-4 w-4" />} />
            <div className="flex flex-col gap-2">
              {project.githubRepoUrl && (
                <a href={project.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl bg-surface2 px-4 py-3 text-sm font-semibold transition hover:bg-accentSoft">
                  <GithubIcon className="h-4 w-4" /> Source code
                </a>
              )}
              {project.liveDemoUrl && (
                <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl bg-surface2 px-4 py-3 text-sm font-semibold transition hover:bg-accentSoft">
                  <ExternalLink className="h-4 w-4" /> Live demo
                </a>
              )}
              {!project.githubRepoUrl && !project.liveDemoUrl && <p className="text-sm text-muted">No links attached.</p>}
            </div>
            {project.techStack.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.techStack.map((t) => (
                  <Chip key={t} tone="accent">
                    {t}
                  </Chip>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Verification" icon={<GraduationCap className="h-4 w-4" />} />
            <div className="space-y-4 text-sm">
              <div>
                <p className="mb-1 flex items-center gap-2 text-xs font-medium text-muted">
                  <Bot className="h-3.5 w-3.5" /> AI similarity score
                </p>
                {project.aiPlagScore !== null && project.aiPlagScore !== undefined ? (
                  <>
                    <p className="text-2xl font-bold">{project.aiPlagScore}%</p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted/15">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${project.aiPlagScore}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-muted">Lower is better. Under 15% is considered original.</p>
                  </>
                ) : (
                  <p className="text-muted">Analysis hasn’t run yet.</p>
                )}
              </div>
              <div>
                <p className="mb-1 flex items-center gap-2 text-xs font-medium text-muted">
                  <MessageSquareQuote className="h-3.5 w-3.5" /> Teacher remarks
                </p>
                <p className="text-muted">{project.teacherRemarks ?? 'Awaiting faculty review.'}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageGrid>
  );
}
