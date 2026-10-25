'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">

      {/* Background — students fill the frame, white sky sits above them naturally */}
      <Image
        src="/bg.png"
        alt="KIET students"
        fill
        priority
        className="object-cover object-bottom"
      />

      {/* Minimal white wash — just enough to keep headline readable over the light sky.
          Not a heavy gradient, not an overlay. The image breathes. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-white/85 via-white/40 to-transparent" />

      {/* ── NAV ── */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-8 py-6 sm:px-12">

        {/* Logo — wordmark, no icon gimmick */}
        <Link href="/" className="flex items-baseline gap-1.5">
          <span
            className="text-[17px] text-[#1f2328]"
            style={{ fontWeight: 800, letterSpacing: '-0.3px' }}
          >
            Only Jobs
          </span>
          <span
            className="text-[12px] text-[#0969da]"
            style={{ fontWeight: 700 }}
          >
            × KIET
          </span>
        </Link>

        {/* One nav link + one CTA — no duplicates */}
        <nav className="flex items-center gap-5">
          <Link
            href="/profile"
            className="hidden text-[14px] text-[#656d76] transition hover:text-[#0969da] sm:block"
            style={{ fontWeight: 600 }}
          >
            Student Login
          </Link>
          <Link
            href="/profile"
            className="rounded-full bg-[#1f883d] px-5 py-2.5 text-[14px] text-white transition hover:bg-[#1a7f37] shadow-xs"
            style={{ fontWeight: 700 }}
          >
            Enter Portal →
          </Link>
        </nav>
      </header>

      {/* ── HERO COPY ──
          Positioned in the upper-centre where the image has natural white sky.
          Eyebrow pill → gone.
          Trust badge chips → gone.
          Fake avatar circles → gone.
          Just: headline + one line + one CTA.
      */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-start px-6 pt-[110px] text-center sm:pt-[130px]">

        <h1
          className="max-w-2xl text-[#1f2328]"
          style={{
            fontWeight: 800,
            fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
            lineHeight: 1.08,
            letterSpacing: '-1.5px',
          }}
        >
          Find Your Tribe,<br />
          Build Your Network.
        </h1>

        <p
          className="mt-4 max-w-[420px] text-[#656d76]"
          style={{
            fontWeight: 600,
            fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
            lineHeight: 1.6,
          }}
        >
          Connect with like-minded students for fun,
          friendships, and future opportunities.
        </p>

        {/* Single primary CTA — no duplicates, no colour-swapped ghost clone */}
        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-full bg-[#1f883d] px-8 py-3.5 text-[14px] text-white shadow-md transition hover:bg-[#1a7f37] active:scale-[0.98]"
            style={{ fontWeight: 700, borderRadius: '9999px' }}
          >
            Enter Portal →
          </Link>
        </div>

      </div>

    </div>
  );
}
