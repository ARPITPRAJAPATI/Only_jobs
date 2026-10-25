'use client';

import Link from 'next/link';
import { Star, FileText, Users, Eye, ArrowRight, Zap } from 'lucide-react';
import { CourseItem } from './coursesData';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: CourseItem;
  viewMode?: 'grid' | 'list';
  onSelect?: (course: CourseItem) => void;
}

export function CourseCard({ course, viewMode = 'grid', onSelect }: CourseCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="group relative flex flex-col md:flex-row items-stretch rounded-md border border-line bg-surface overflow-hidden shadow-2xs hover:shadow-md hover:border-[#8c959f] transition-all duration-200">
        {/* List Thumbnail */}
        <Link href={`/courses/${course.slug}`} className="relative md:w-72 shrink-0 aspect-[16/10] overflow-hidden bg-surface2 block">
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* GitHub Style Pill Tag */}
          <span className="absolute top-2.5 right-2.5 rounded-md bg-[#dafbe1] text-[#1a7f37] border border-[#4ac26b]/40 px-2 py-0.5 text-xs font-mono font-bold shadow-2xs">
            {course.priceTag}
          </span>
          <span className="absolute bottom-2.5 left-2.5 rounded bg-[#161b22]/80 backdrop-blur-xs px-2 py-0.5 text-[9px] font-mono font-bold text-white uppercase tracking-wider">
            {course.currentPhase}
          </span>
        </Link>

        {/* List Body */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <img
                  src={course.mentor.avatarUrl}
                  alt={course.mentor.name}
                  className="h-6 w-6 rounded-full object-cover border border-line"
                />
                <span className="text-xs font-semibold text-ink">{course.mentor.name}</span>
                <span className="text-muted/60">•</span>
                <span className="text-[11px] text-muted">{course.mentor.department}</span>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1.5 text-[#9a6700]">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current text-[#9a6700]" />
                  ))}
                </div>
                <span className="text-xs font-bold text-ink">{course.rating.toFixed(2)}</span>
              </div>
            </div>

            <Link href={`/courses/${course.slug}`}>
              <h3 className="text-base sm:text-lg font-bold text-ink group-hover:text-[#0969da] transition-colors leading-snug mb-1.5">
                {course.title}
              </h3>
            </Link>

            <p className="text-xs text-muted line-clamp-2 leading-relaxed">
              {course.overview}
            </p>
          </div>

          {/* List Footer Stats */}
          <div className="pt-3.5 mt-3 border-t border-line flex items-center justify-between text-xs text-muted">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-muted" />
                <span>Lesson {course.lessonsCount}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-muted" />
                <span>Students {course.studentsCount}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-muted" />
                <span>View {course.viewsCount}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onSelect && (
                <button
                  onClick={() => onSelect(course)}
                  className="px-2.5 py-1 text-xs font-semibold text-muted hover:text-ink hover:bg-surface2 rounded border border-line cursor-pointer"
                >
                  Quick Preview
                </button>
              )}
              <Link
                href={`/courses/${course.slug}`}
                className="text-xs font-bold text-[#0969da] hover:underline inline-flex items-center gap-1"
              >
                <span>Enter Course</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GitHub Default 4-Column Grid Card
  return (
    <div className="group relative flex flex-col justify-between rounded-md border border-line bg-surface overflow-hidden shadow-2xs hover:shadow-md hover:border-[#8c959f] transition-all duration-200">
      <div>
        {/* 1. Thumbnail + GitHub Pill Badge */}
        <Link href={`/courses/${course.slug}`} className="relative aspect-[16/10] w-full overflow-hidden bg-surface2 block">
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Floating Pill Tag (GitHub style) */}
          <span className="absolute top-2.5 right-2.5 rounded-md bg-[#dafbe1] text-[#1a7f37] border border-[#4ac26b]/40 px-2 py-0.5 text-xs font-mono font-bold shadow-2xs">
            {course.priceTag}
          </span>

          {/* Phase Badge */}
          <span className="absolute bottom-2 left-2 rounded bg-[#161b22]/80 backdrop-blur-xs px-2 py-0.5 text-[9px] font-mono font-bold text-white uppercase tracking-wider">
            {course.currentPhase}
          </span>
        </Link>

        {/* 2. Content Body */}
        <div className="p-4">
          {/* Mentor Row & Rating */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={course.mentor.avatarUrl}
                alt={course.mentor.name}
                className="h-5 w-5 rounded-full object-cover border border-line shrink-0"
              />
              <span className="truncate text-xs font-semibold text-muted">
                {course.mentor.name}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 shrink-0 text-[#9a6700]">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-current text-[#9a6700]" />
                ))}
              </div>
              <span className="text-[11px] font-bold text-ink ml-0.5">
                {course.rating.toFixed(2)}
              </span>
            </div>
          </div>

          {/* 3. Title */}
          <Link href={`/courses/${course.slug}`}>
            <h3 className="line-clamp-2 text-[14px] font-bold leading-snug tracking-tight text-ink group-hover:text-[#0969da] transition-colors">
              {course.title}
            </h3>
          </Link>
        </div>
      </div>

      {/* 4. Footer Metrics Row */}
      <div className="px-4 py-2.5 border-t border-line bg-surface2 flex items-center justify-between text-[11px] font-medium text-muted">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" title={`${course.lessonsCount} Total Lessons`}>
            <FileText className="h-3.5 w-3.5 text-muted" />
            <span>{course.lessonsCount}</span>
          </div>

          <div className="flex items-center gap-1" title={`${course.studentsCount} Active Students`}>
            <Users className="h-3.5 w-3.5 text-muted" />
            <span>{course.studentsCount}</span>
          </div>
        </div>

        <Link
          href={`/courses/${course.slug}`}
          className="text-xs font-bold text-[#0969da] hover:underline inline-flex items-center gap-1"
        >
          <span>Enter Course</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
