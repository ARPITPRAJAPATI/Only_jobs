'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export function CourseFooter() {
  return (
    <footer className="bg-surface text-muted pt-14 pb-10 border-t border-line transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* 4-Column Footer Grid (GitHub Primer Palette) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-10 border-b border-line">
          {/* Column 1: Brand & About */}
          <div className="space-y-3.5">
            <Link href="/feed" className="inline-flex items-center gap-2">
              <span className="text-xl font-bold text-ink tracking-tight">Only Jobs</span>
              <span className="text-[11px] font-bold text-muted bg-surface2 px-2 py-0.5 rounded-full border border-line">
                KIET
              </span>
            </Link>

            <p className="text-xs text-muted leading-relaxed max-w-sm">
              Empowering KIET engineering graduates with verified skills, 3-phase gatekeeper defenses, and direct recruitment pipelines to leading tech firms.
            </p>

            <div className="pt-1">
              <Link
                href="/profile"
                className="inline-flex items-center gap-1.5 rounded-md bg-surface2 hover:bg-surface text-ink border border-line font-semibold text-xs px-3.5 py-1.5 transition-all shadow-2xs"
              >
                <span>About Institutional Portal</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink mb-4">
              Quick Navigation
            </h3>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <Link href="/feed" className="hover:text-ink transition-colors flex items-center gap-1.5">
                <span className="opacity-40">&gt;</span> Home
              </Link>
              <Link href="/jobs" className="hover:text-ink transition-colors flex items-center gap-1.5">
                <span className="opacity-40">&gt;</span> Placement Jobs
              </Link>
              <Link href="/courses" className="hover:text-ink transition-colors flex items-center gap-1.5">
                <span className="opacity-40">&gt;</span> Courses / Labs
              </Link>
              <Link href="/alumni" className="hover:text-ink transition-colors flex items-center gap-1.5">
                <span className="opacity-40">&gt;</span> Alumni Network
              </Link>
              <Link href="/class" className="hover:text-ink transition-colors flex items-center gap-1.5">
                <span className="opacity-40">&gt;</span> Class Rooms
              </Link>
              <Link href="/contact" className="hover:text-ink transition-colors flex items-center gap-1.5">
                <span className="opacity-40">&gt;</span> Contact Helpdesk
              </Link>
              <Link href="/profile" className="hover:text-ink transition-colors flex items-center gap-1.5">
                <span className="opacity-40">&gt;</span> Student Profile
              </Link>
              <Link href="/projects" className="hover:text-ink transition-colors flex items-center gap-1.5">
                <span className="opacity-40">&gt;</span> Project Repos
              </Link>
            </div>
          </div>

          {/* Column 3: Accredited Campus Hiring Partners */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink mb-4">
              Placement Partners
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {[
                'Cisco Systems',
                'Microsoft',
                'Amazon',
                'Atlassian',
                'Swiggy',
                'Red Hat',
                'TCS Digital',
                'Infosys Wings1',
                'Morgan Stanley',
              ].map((comp, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-surface2 border border-line text-[11px] font-medium text-ink hover:border-[#0969da]/40 transition-colors"
                >
                  {comp}
                </span>
              ))}
            </div>

            <p className="text-[11px] text-muted mt-3 leading-relaxed">
              Companies evaluating verified 3-phase course credentials during campus placement shortlisting.
            </p>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink mb-4">
              TPO Contact
            </h3>

            <div className="space-y-3 text-xs">
              {/* Phone */}
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-md bg-surface2 border border-line flex items-center justify-center text-ink shrink-0">
                  <Phone className="h-3.5 w-3.5 text-[#1f883d]" />
                </div>
                <div>
                  <span className="text-[10.5px] text-muted block">TPO Helpline</span>
                  <a href="tel:+911202974300" className="font-semibold text-ink hover:text-[#0969da]">
                    +91-120-297-4300
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-md bg-surface2 border border-line flex items-center justify-center text-ink shrink-0">
                  <Mail className="h-3.5 w-3.5 text-[#1f883d]" />
                </div>
                <div>
                  <span className="text-[10.5px] text-muted block">Academic Helpdesk</span>
                  <a href="mailto:placement@kiet.edu" className="font-semibold text-ink hover:text-[#0969da]">
                    placement@kiet.edu
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-md bg-surface2 border border-line flex items-center justify-center text-ink shrink-0 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-[#1f883d]" />
                </div>
                <div>
                  <span className="text-[10.5px] text-muted block">Campus</span>
                  <span className="text-muted leading-snug block">
                    KIET Group of Institutions, Delhi-NCR, Ghaziabad, UP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subfooter */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted text-center sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} KIET Group of Institutions &times; Only Jobs. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-[11px]">
            <Link href="/contact" className="hover:text-ink">Privacy</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-ink">Terms</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-ink">TPO Audit Standard</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
