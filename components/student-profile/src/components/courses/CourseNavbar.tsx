'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, User, ShoppingBag, Menu, X, ChevronDown, Sparkles, BookOpen } from 'lucide-react';

export function CourseNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-surface2 border border-line p-0.5 shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-xl font-black text-ink">
              A
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="text-2xl font-black tracking-tight text-[#1f2328]">Aduki</span>
              <span className="h-2 w-2 rounded-full bg-[#1f883d] ml-0.5 mb-2" />
              <span className="text-xs font-black text-[#0969da] ml-1.5 px-1.5 py-0.5 rounded bg-[#ddf4ff] border border-[#54aeff]/40">
                KIET
              </span>
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#656d76] -mt-1">
              Online Academy Courses
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-7 text-[13.5px] font-bold text-[#656d76]">
          <Link href="/" className="hover:text-[#0969da] transition-colors flex items-center gap-1">
            <span>Home</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Link>
          <Link href="/profile" className="hover:text-[#0969da] transition-colors">
            About
          </Link>
          <Link
            href="/courses"
            className="text-[#1f2328] flex items-center gap-1 font-extrabold relative after:absolute after:bottom-[-22px] after:left-0 after:right-0 after:h-0.5 after:bg-[#fd8c73]"
          >
            <span>Course</span>
            <ChevronDown className="h-3 w-3" />
          </Link>
          <Link href="/feed" className="hover:text-[#0969da] transition-colors flex items-center gap-1">
            <span>Blog</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Link>
          <Link href="/certifications" className="hover:text-[#0969da] transition-colors flex items-center gap-1">
            <span>Pages</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Link>
          <Link href="/settings" className="hover:text-[#0969da] transition-colors">
            Contact
          </Link>
        </nav>

        {/* Right Action Icons & Primary Green Button */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Wishlist Heart Icon */}
          <Link
            href="/courses"
            className="relative h-10 w-10 rounded-full border border-[#d0d7de] hover:border-[#8c959f] flex items-center justify-center text-[#656d76] hover:text-[#cf222e] hover:bg-[#f6f8fa] transition-all"
            title="Wishlist (3)"
          >
            <Heart className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#cf222e] text-white text-[9.5px] font-black flex items-center justify-center shadow-xs">
              3
            </span>
          </Link>

          {/* User Account Icon */}
          <Link
            href="/profile"
            className="h-10 w-10 rounded-full border border-[#d0d7de] hover:border-[#8c959f] flex items-center justify-center text-[#656d76] hover:text-[#0969da] hover:bg-[#f6f8fa] transition-all"
            title="Student Profile"
          >
            <User className="h-4 w-4" />
          </Link>

          {/* Cart / Enrolled Bag Icon */}
          <Link
            href="/courses"
            className="relative h-10 w-10 rounded-full border border-[#d0d7de] hover:border-[#8c959f] flex items-center justify-center text-[#656d76] hover:text-[#1f883d] hover:bg-[#f6f8fa] transition-all"
            title="Enrolled Tracks (0)"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#1f883d] text-white text-[9.5px] font-black flex items-center justify-center shadow-xs">
              0
            </span>
          </Link>

          {/* Primary Button */}
          <Link
            href="/courses"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#1f883d] hover:bg-[#1a7f37] active:scale-95 text-white font-extrabold text-xs tracking-wider uppercase px-5 py-3 shadow-xs transition-all"
          >
            <span>REGISTER FOR FREE</span>
            <span>&rarr;</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-5 space-y-3 animate-fade-in shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-gray-800 hover:bg-gray-50"
          >
            Home
          </Link>
          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-gray-800 hover:bg-gray-50"
          >
            About
          </Link>
          <Link
            href="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-[#1a7f37] bg-[#dafbe1]"
          >
            Course (Active)
          </Link>
          <Link
            href="/feed"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-[#1f2328] hover:bg-[#f6f8fa]"
          >
            Campus Feed
          </Link>
          <Link
            href="/certifications"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-[#1f2328] hover:bg-[#f6f8fa]"
          >
            Certifications
          </Link>
          <Link
            href="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-[#1f2328] hover:bg-[#f6f8fa]"
          >
            Contact
          </Link>
          <div className="pt-2">
            <Link
              href="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#1f883d] hover:bg-[#1a7f37] text-white font-extrabold text-xs uppercase px-5 py-3 shadow-xs"
            >
              <span>REGISTER FOR FREE</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
