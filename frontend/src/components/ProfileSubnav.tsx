'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RotatingArcNavbar } from '@/components/RotatingArcNavbar';

export function ProfileSubnav({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-[1536px] grid-cols-1 items-start gap-5 px-4 py-6 sm:px-6 lg:px-8 xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-6">
      <aside className="mx-auto h-fit w-full max-w-[320px] overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0b0d12]/85 p-2.5 shadow-xl backdrop-blur-xl xl:sticky xl:top-24">
        <Link
          href="/profile"
          className="mb-2 inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3.5 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/[0.12] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Profile Overview</span>
        </Link>
        <RotatingArcNavbar />
      </aside>

      <main className="min-w-0">{children}</main>
    </div>
  );
}
