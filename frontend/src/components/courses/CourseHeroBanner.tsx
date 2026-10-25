'use client';

import Link from 'next/link';

export function CourseHeroBanner() {
  return (
    <div className="relative overflow-hidden border-b border-line bg-surface/50 py-10 sm:py-14 text-center text-ink transition-colors animate-fade-in">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface2 border border-line text-xs font-semibold text-muted mb-3">
          <span className="text-[#0969da] font-bold">KIET Verified Curricula</span>
          <span className="opacity-40">•</span>
          <span>Proof-of-Work Syllabi</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink font-sans">
          Courses & Learning Tracks
        </h1>

        <p className="mt-2.5 text-xs sm:text-sm text-muted max-w-xl mx-auto font-normal leading-relaxed">
          Faculty-curated 3-Phase syllabi. Pass rigorous phase exams (&ge; 70%) to earn cryptographically verifiable credentials.
        </p>

        {/* Clean Breadcrumbs */}
        <nav className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-muted">
          <Link href="/feed" className="hover:text-ink transition-colors">
            Home
          </Link>
          <span className="opacity-40">&gt;</span>
          <span className="text-ink font-bold">Courses</span>
        </nav>
      </div>
    </div>
  );
}
