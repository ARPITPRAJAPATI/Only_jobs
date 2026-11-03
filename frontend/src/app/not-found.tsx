import Link from 'next/link';
import { ArrowLeft, Compass, Home, ShieldCheck } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-5 rounded-2xl border border-line bg-surface p-8 shadow-card">
        <div className="h-12 w-12 rounded-xl bg-surface2 border border-line flex items-center justify-center mx-auto text-muted">
          <Compass className="h-6 w-6 text-[#0969da]" />
        </div>

        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
            404 · Page Not Found
          </span>
          <h1 className="text-2xl font-extrabold text-ink mt-1">
            Looking for a section?
          </h1>
          <p className="text-xs text-muted mt-2 leading-relaxed">
            The page you requested might have been renamed or moved. Use the shortcuts below to continue:
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <Link
            href="/profile"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#0969da] hover:bg-[#0860ca] text-white text-xs font-semibold py-2.5 px-4 shadow-sm transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Profile (Overview)</span>
          </Link>

          <Link
            href="/feed"
            className="flex items-center justify-center gap-2 rounded-lg border border-line bg-surface2 hover:bg-surface text-ink text-xs font-semibold py-2.5 px-4 transition-colors"
          >
            <Home className="h-3.5 w-3.5 text-muted" />
            <span>Campus Feed</span>
          </Link>
        </div>

        <div className="pt-3 border-t border-line text-[11px] text-muted flex items-center justify-between">
          <Link href="/projects" className="hover:text-ink transition-colors">Projects →</Link>
          <Link href="/academics" className="hover:text-ink transition-colors">Academics →</Link>
          <Link href="/coding" className="hover:text-ink transition-colors">Coding →</Link>
          <Link href="/certifications" className="hover:text-ink transition-colors">Certifications →</Link>
        </div>
      </div>
    </div>
  );
}

