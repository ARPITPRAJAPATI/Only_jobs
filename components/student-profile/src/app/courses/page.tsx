'use client';

import { useState, useMemo } from 'react';
import { CourseHeroBanner } from '@/components/courses/CourseHeroBanner';
import { CourseFilterBar } from '@/components/courses/CourseFilterBar';
import { CourseCard } from '@/components/courses/CourseCard';
import { CourseGatekeeperModal } from '@/components/courses/CourseGatekeeperModal';
import { CourseFooter } from '@/components/courses/CourseFooter';
import { COURSES_DATA, CourseItem } from '@/components/courses/coursesData';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CoursesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('default');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [isRecommendedOnly, setIsRecommendedOnly] = useState<boolean>(false);

  // Filter & Sort Logic
  const filteredCourses = useMemo(() => {
    let list = [...COURSES_DATA];

    // Filter by Recommended
    if (isRecommendedOnly) {
      list = list.filter(
        (c) =>
          c.slug.includes('kubernetes') ||
          c.slug.includes('nextjs') ||
          c.slug.includes('postgresql') ||
          c.slug.includes('python') ||
          c.category === 'DEVOPS' ||
          c.category === 'FULLSTACK'
      );
    }

    // Filter by Category
    if (selectedCategory !== 'ALL') {
      list = list.filter(
        (c) =>
          c.category === selectedCategory ||
          c.categoryLabel.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort
    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    } else if (sortBy === 'enrolled') {
      list.sort((a, b) => b.studentsCount - a.studentsCount);
    } else if (sortBy === 'placement') {
      list.sort((a, b) => b.labHours - a.labHours);
    }

    return list;
  }, [selectedCategory, sortBy, isRecommendedOnly]);

  // Pagination (8 or 12 per page)
  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / itemsPerPage));
  const displayedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink font-sans transition-colors selection:bg-[#0969da]/20 selection:text-[#0969da]">
      {/* 1. Chalkboard Hero Banner */}
      <CourseHeroBanner />

      {/* 4. Main Course Catalog Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-20">
        {/* Controls Toolbar & Category Filter Tabs */}
        <CourseFilterBar
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedCategory={selectedCategory}
          setSelectedCategory={(cat) => {
            setSelectedCategory(cat);
            setCurrentPage(1);
          }}
          courseCount={filteredCourses.length}
          sortBy={sortBy}
          setSortBy={setSortBy}
          isRecommendedOnly={isRecommendedOnly}
          onToggleRecommended={() => {
            setIsRecommendedOnly((prev) => !prev);
            setCurrentPage(1);
          }}
        />

        {/* Course Cards Container */}
        <div className="mt-8">
          {displayedCourses.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-surface2 border border-line">
              <p className="text-sm font-bold text-muted">
                No courses found in category &quot;{selectedCategory}&quot;.
              </p>
              <button
                onClick={() => setSelectedCategory('ALL')}
                className="mt-3 text-xs font-black text-[#0969da] hover:underline cursor-pointer"
              >
                View All Courses
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Aduki 4-Column Responsive Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  viewMode="grid"
                  onSelect={setSelectedCourse}
                />
              ))}
            </div>
          ) : (
            /* List Mode */
            <div className="space-y-4">
              {displayedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  viewMode="list"
                  onSelect={setSelectedCourse}
                />
              ))}
            </div>
          )}
        </div>

        {/* 5. Aduki Pagination Controls */}
        <div className="mt-14 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            className={cn(
              'h-9 w-9 rounded-md text-xs font-black transition-all cursor-pointer flex items-center justify-center',
              currentPage === 1
                ? 'bg-[#1f883d] text-white shadow-xs'
                : 'border border-line text-ink hover:border-[#8c959f] hover:bg-surface2'
            )}
          >
            1
          </button>

          <button
            onClick={() => setCurrentPage(2)}
            className={cn(
              'h-9 w-9 rounded-md text-xs font-black transition-all cursor-pointer flex items-center justify-center',
              currentPage === 2
                ? 'bg-[#1f883d] text-white shadow-xs'
                : 'border border-line text-ink hover:border-[#8c959f] hover:bg-surface2'
            )}
          >
            2
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(2, p + 1))}
            className="h-9 px-4 rounded-md border border-line text-xs font-black text-ink hover:border-[#8c959f] hover:bg-surface2 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </main>

      {/* 6. Interactive 3-Phase Gatekeeper Modal */}
      <CourseGatekeeperModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />

      {/* 7. Aduki 4-Column Footer */}
      <CourseFooter />
    </div>
  );
}
