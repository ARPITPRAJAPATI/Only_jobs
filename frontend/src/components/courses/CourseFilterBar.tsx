'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, LayoutGrid, List, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CategoryOption {
  id: string;
  label: string;
}

export const COURSE_CATEGORIES: CategoryOption[] = [
  { id: 'ALL', label: 'All Tracks' },
  { id: 'DEVOPS', label: 'Cloud & DevOps' },
  { id: 'FULLSTACK', label: 'Full Stack & Web' },
  { id: 'DSA', label: 'DSA & Algorithms' },
  { id: 'SYSTEMS', label: 'Distributed Systems' },
  { id: 'AIML', label: 'AI & Machine Learning' },
  { id: 'SECURITY', label: 'CyberSecurity' },
  { id: 'MOBILE', label: 'Mobile Engineering' },
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'placement', label: 'Placement demand' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'enrolled', label: 'Most popular' },
  { value: 'newest', label: 'Recently added' },
] as const;

interface CourseFilterBarProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  courseCount: number;
  sortBy: string;
  setSortBy: (sort: string) => void;
  isRecommendedOnly?: boolean;
  onToggleRecommended?: () => void;
}

export function CourseFilterBar({
  viewMode,
  setViewMode,
  selectedCategory,
  setSelectedCategory,
  courseCount,
  sortBy,
  setSortBy,
  isRecommendedOnly = false,
  onToggleRecommended,
}: CourseFilterBarProps) {
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sortMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !sortMenuRef.current?.contains(event.target)) {
        setSortMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSortMenuOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [sortMenuOpen]);

  const selectedSort = SORT_OPTIONS.find((option) => option.value === sortBy) ?? SORT_OPTIONS[0];

  return (
    <div className="space-y-5 border-b border-line py-5 sm:py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: View Mode Toggle & Counter */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-1 rounded-lg border border-line bg-surface2 p-1">
            <button
              type="button"
              aria-pressed={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors',
                viewMode === 'grid'
                  ? 'bg-surface text-ink shadow-2xs'
                  : 'text-muted hover:text-ink'
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>

            <button
              type="button"
              aria-pressed={viewMode === 'list'}
              onClick={() => setViewMode('list')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors',
                viewMode === 'list'
                  ? 'bg-surface text-ink shadow-2xs'
                  : 'text-muted hover:text-ink'
              )}
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
          </div>

          {/* AI Recommendation Filter Button */}
          {onToggleRecommended && (
            <button
              type="button"
              aria-pressed={isRecommendedOnly}
              onClick={onToggleRecommended}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors',
                isRecommendedOnly
                  ? 'border-accent/40 bg-accent/10 text-ink'
                  : 'border-line bg-surface text-muted hover:bg-surface2 hover:text-ink'
              )}
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Recommended</span>
            </button>
          )}

          <span aria-live="polite" className="text-xs font-medium text-muted sm:text-sm">
            <strong className="font-semibold text-ink">{courseCount}</strong> {courseCount === 1 ? 'course' : 'courses'}
          </span>
        </div>

        <div ref={sortMenuRef} className="relative">
          <button
            type="button"
            aria-label={`Sort courses: ${selectedSort.label}`}
            aria-haspopup="menu"
            aria-expanded={sortMenuOpen}
            onClick={() => setSortMenuOpen((open) => !open)}
            className="inline-flex min-w-40 items-center justify-between gap-5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-medium text-ink shadow-2xs transition-colors hover:bg-surface2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            <span className="text-muted">Sort:</span>
            <span className="flex-1 text-left">{selectedSort.label}</span>
            <ChevronDown className={cn('h-3.5 w-3.5 text-muted transition-transform', sortMenuOpen && 'rotate-180')} />
          </button>
          {sortMenuOpen && (
            <div role="menu" aria-label="Sort courses" className="absolute right-0 top-full z-30 mt-2 w-52 rounded-xl border border-line bg-surface p-1.5 shadow-lg">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={sortBy === option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setSortMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-medium text-ink transition-colors hover:bg-surface2"
                >
                  {option.label}
                  {sortBy === option.value && <Check className="h-3.5 w-3.5 text-accent" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div role="group" aria-label="Filter by course category" className="flex items-center gap-5 overflow-x-auto pb-1 text-xs font-medium text-muted scrollbar-none sm:gap-7 sm:text-sm">
        {COURSE_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'relative whitespace-nowrap py-1 transition-colors',
                isActive
                  ? 'font-semibold text-ink'
                  : 'hover:text-ink'
              )}
            >
              {cat.label}
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
