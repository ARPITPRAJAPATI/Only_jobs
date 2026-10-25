import Link from 'next/link';
import { ArrowUpRight, Bot, ExternalLink, FolderGit2, GitFork, Star } from 'lucide-react';
import type { Project } from '@/lib/types';
import { projectVerification } from '@/lib/utils';
import { GithubIcon } from './BrandIcons';
import { ProjectVerificationChip } from './StatusChips';
import { Chip } from './ui';
import type { ReactNode } from 'react';

export function ProjectCard({ project, index = 0, actions }: { project: Project; index?: number; actions?: ReactNode }) {
  const v = projectVerification(project);
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-line/80 bg-surface p-5 shadow-2xs transition-all hover:border-black/20 hover:shadow-xs">
      <div>
        {/* Top Header: Verification + Plagiarism Audit */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <ProjectVerificationChip status={v} />
            {project.aiPlagScore !== null && project.aiPlagScore !== undefined && (
              <Chip tone={project.aiPlagScore < 15 ? 'good' : project.aiPlagScore < 40 ? 'warn' : 'bad'} icon={<Bot className="h-3 w-3" />}>
                {project.aiPlagScore}% similarity
              </Chip>
            )}
          </div>
          <span className="text-[11px] font-mono text-muted">v{index + 1}.0</span>
        </div>

        {/* Project Title + Repo Link */}
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-surface2 text-muted border border-line">
            <FolderGit2 className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <Link href={`/projects/${project.id}`} className="focus:outline-none">
              <h3 className="text-[15px] font-bold tracking-tight text-ink group-hover:text-[#0969da] transition-colors truncate">
                {project.title}
              </h3>
            </Link>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted font-medium">
              {project.shortTagline}
            </p>
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 5).map((t) => (
            <span key={t} className="rounded-md bg-surface2 px-2 py-0.5 text-[11px] font-semibold text-ink/80 border border-line/60">
              {t}
            </span>
          ))}
          {project.techStack.length > 5 && (
            <span className="rounded-md bg-surface2 px-2 py-0.5 text-[11px] font-semibold text-muted border border-line/60">
              +{project.techStack.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3.5 border-t border-line/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {project.githubRepoUrl && (
            <a
              href={project.githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              title="GitHub repository"
              className="grid h-7 w-7 place-items-center rounded-lg border border-line bg-surface text-muted transition hover:bg-surface2 hover:text-ink"
            >
              <GithubIcon className="h-3.5 w-3.5" />
            </a>
          )}
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Live demo"
              title="Live demo"
              className="grid h-7 w-7 place-items-center rounded-lg border border-line bg-surface text-muted transition hover:bg-surface2 hover:text-ink"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {actions ?? (
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0969da] hover:underline"
          >
            <span>Details</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
