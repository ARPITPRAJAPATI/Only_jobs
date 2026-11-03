'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function ProfileSubnav() {
  return (
    <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
      <Link
        href="/profile"
        className="inline-flex items-center gap-2 rounded-lg border border-white/[0.14] bg-white/[0.09] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-white/[0.16]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Overview
      </Link>
    </div>
  );
}
