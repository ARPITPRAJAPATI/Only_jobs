import Link from 'next/link';
import { ArrowUpRight, Bot, ExternalLink, FolderGit2 } from 'lucide-react';
import type { Project } from '@/lib/types';
import { projectVerification } from '@/lib/utils';
import { GithubIcon } from './BrandIcons';
import { ProjectVerificationChip } from './StatusChips';
import { Chip } from './ui';
import type { ReactNode } from 'react';

export function ProjectCard({ project, index = 0, actions }: { project: Project; index?: number; actions?: ReactNode }) {
  const v = projectVerification(project);
  return (
    <div className="profile-glass-tile group relative flex flex-col justify-between rounded-2xl border border-white/[0.1] bg-white/[0.05] backdrop-blur-xl p-5 shadow-xl transition-all hover:border-white/[0.22] hover:bg-white/[0.08] hover:shadow-2xl">
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
          <span className="text-[11px] font-mono text-white/45">v{index + 1}.0</span>
        </div>

        {/* Project Title + Repo Link */}
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-white/70 border border-white/[0.1]">
            <FolderGit2 className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <Link href={`/projects/${project.id}`} className="focus:outline-none">
              <h3 className="text-[15px] font-bold tracking-tight text-white group-hover:text-[#58a6ff] transition-colors truncate">
                {project.title}
              </h3>
            </Link>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/55 font-medium">
              {project.shortTagline}
            </p>
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 5).map((t) => (
            <span key={t} className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] font-semibold text-white/80 border border-white/[0.08]">
              {t}
            </span>
          ))}
          {project.techStack.length > 5 && (
            <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] font-semibold text-white/45 border border-white/[0.08]">
              +{project.techStack.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {project.githubRepoUrl && (
            <a
              href={project.githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              title="GitHub repository"
              className="grid h-7 w-7 place-items-center rounded-lg border border-white/[0.1] bg-white/[0.06] text-white/70 transition hover:bg-white/[0.12] hover:text-white"
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
              className="grid h-7 w-7 place-items-center rounded-lg border border-white/[0.1] bg-white/[0.06] text-white/70 transition hover:bg-white/[0.12] hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {actions ?? (
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#58a6ff] hover:underline"
          >
            <span>Details</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
