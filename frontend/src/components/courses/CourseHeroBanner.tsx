'use client';

interface CourseHeroBannerProps {
  courseCount: number;
  categoryCount: number;
}

export function CourseHeroBanner({ courseCount, categoryCount }: CourseHeroBannerProps) {
  return (
    <header className="border-b border-line bg-surface/40 text-ink">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Learning</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Explore courses
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Find a focused path, build practical skills, and learn through hands-on projects.
          </p>
        </div>

        <dl className="flex items-center gap-6 border-t border-line pt-4 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <div>
            <dt className="text-xs text-muted">Courses</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-ink">{courseCount}</dd>
          </div>
          <div className="h-8 border-l border-line" aria-hidden="true" />
          <div>
            <dt className="text-xs text-muted">Subject areas</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-ink">{categoryCount}</dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
