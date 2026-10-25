'use client';

import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin, ShieldCheck } from 'lucide-react';

export function CourseTopBar() {
  return (
    <div className="bg-surface2/60 text-muted text-[11px] sm:text-xs border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Welcome & Contact Info */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5 font-medium text-ink">
            <ShieldCheck className="h-3.5 w-3.5 text-[#1f883d]" />
            <span>Welcome to KIET Placement & Skill Academy</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-muted">
            <a
              href="tel:+911202974300"
              className="flex items-center gap-1.5 hover:text-ink transition-colors"
            >
              <Phone className="h-3 w-3 text-[#1f883d]" />
              <span>+91-120-297-4300</span>
            </a>

            <span className="opacity-30">|</span>

            <a
              href="mailto:placement@kiet.edu"
              className="flex items-center gap-1.5 hover:text-ink transition-colors"
            >
              <Mail className="h-3 w-3 text-[#1f883d]" />
              <span>placement@kiet.edu</span>
            </a>
          </div>
        </div>

        {/* Right: Social Links & Helpdesk */}
        <div className="flex items-center gap-3">
          <span className="text-muted hidden lg:inline text-[11px]">Delhi-NCR, Ghaziabad</span>
          <div className="flex items-center gap-2.5 text-muted">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-ink transition-colors p-1"
            >
              <Facebook className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="hover:text-ink transition-colors p-1"
            >
              <Twitter className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-ink transition-colors p-1"
            >
              <Instagram className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-ink transition-colors p-1"
            >
              <Linkedin className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
