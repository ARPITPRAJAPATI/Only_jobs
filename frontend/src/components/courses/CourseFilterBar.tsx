'use client';

import { LayoutGrid, List, ChevronDown, Zap } from 'lucide-react';
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
  return (
    <div className="space-y-6 pt-8 pb-5 border-b border-line">
      {/* Top Controls Toolbar: Grid/List + Count + Recommendation Button + Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: View Mode Toggle & Counter */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-1.5 bg-surface2 p-0.5 rounded-md border border-line">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer',
                viewMode === 'grid'
                  ? 'bg-surface text-ink shadow-2xs font-bold border border-line'
                  : 'text-muted hover:text-ink'
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer',
                viewMode === 'list'
                  ? 'bg-surface text-ink shadow-2xs font-bold border border-line'
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
              onClick={onToggleRecommended}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer shadow-2xs border',
                isRecommendedOnly
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/40 ring-1 ring-amber-500/30'
                  : 'bg-surface hover:bg-surface2 text-muted hover:text-ink border-line'
              )}
            >
              <Zap className={cn('h-3.5 w-3.5', isRecommendedOnly ? 'text-amber-500 fill-current' : 'text-amber-500')} />
              <span>Recommended For You</span>
              <span className="rounded-full bg-surface2 px-1.5 py-0.2 text-[10px] font-mono border border-line text-ink">
                AI Match
              </span>
            </button>
          )}

          <span className="text-xs sm:text-sm font-semibold text-muted">
            Showing <strong className="text-ink">{courseCount}</strong> Courses
          </span>
        </div>

        {/* Right: GitHub-style Rounded Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none rounded-md border border-line bg-surface2 px-3.5 py-1.5 pr-8 text-xs font-semibold text-ink hover:border-[#8c959f] focus:outline-none focus:border-[#0969da] shadow-2xs cursor-pointer min-w-[160px]"
          >
            <option value="default">Default Sorting</option>
            <option value="placement">Placement Demand</option>
            <option value="rating">Highest Faculty Rating</option>
            <option value="enrolled">Most Popular</option>
            <option value="newest">Recently Added</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
        </div>
      </div>

      {/* Bottom Category Filter Row (GitHub Underline Nav Style) */}
      <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto pb-1 scrollbar-none text-xs sm:text-sm font-semibold text-muted">
        {COURSE_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'whitespace-nowrap transition-colors py-1 cursor-pointer relative',
                isActive
                  ? 'text-ink font-bold'
                  : 'hover:text-ink'
              )}
            >
              {cat.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0969da] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
