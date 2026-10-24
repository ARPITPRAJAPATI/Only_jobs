import Link from 'next/link';
import { ArrowUpRight, Bot, ExternalLink } from 'lucide-react';
import type { Project } from '@/lib/types';
import { projectVerification } from '@/lib/utils';
import { GithubIcon } from './BrandIcons';
import { ProjectVerificationChip } from './StatusChips';
import { Chip } from './ui';
import type { ReactNode } from 'react';

const gradients = [
  'from-accent/25 to-accent2/20',
  'from-accent2/25 to-accent/15',
  'from-accent/15 to-accent2/30',
];

export function ProjectCard({ project, index = 0, actions }: { project: Project; index?: number; actions?: ReactNode }) {
  const v = projectVerification(project);
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-surface shadow-card transition hover:-translate-y-0.5">
      <div className={`h-20 bg-gradient-to-br ${gradients[index % gradients.length]}`} />
      <div className="flex flex-1 flex-col p-5 pt-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <ProjectVerificationChip status={v} />
          {project.aiPlagScore !== null && project.aiPlagScore !== undefined && (
            <Chip tone={project.aiPlagScore < 15 ? 'good' : project.aiPlagScore < 40 ? 'warn' : 'bad'} icon={<Bot className="h-3 w-3" />}>
              {project.aiPlagScore}% similarity
            </Chip>
          )}
        </div>
        <Link href={`/projects/${project.id}`} className="after:absolute after:inset-0">
          <h3 className="text-lg font-bold tracking-tight">{project.title}</h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{project.shortTagline}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 5).map((t) => (
            <span key={t} className="rounded-full bg-surface2 px-2.5 py-1 text-[11px] font-medium text-muted">
              {t}
            </span>
          ))}
          {project.techStack.length > 5 && <span className="rounded-full bg-surface2 px-2.5 py-1 text-[11px] font-medium text-muted">+{project.techStack.length - 5}</span>}
        </div>
        <div className="relative z-10 mt-auto flex items-center justify-between pt-4">
          <div className="flex items-center gap-1">
            {project.githubRepoUrl && (
              <a href={project.githubRepoUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" className="grid h-8 w-8 place-items-center rounded-full bg-surface2 text-muted transition hover:bg-accent hover:text-accentInk">
                <GithubIcon className="h-4 w-4" />
              </a>
            )}
            {project.liveDemoUrl && (
              <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" aria-label="Live demo" className="grid h-8 w-8 place-items-center rounded-full bg-surface2 text-muted transition hover:bg-accent hover:text-accentInk">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          {actions ?? (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-accentInk transition group-hover:scale-110">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
