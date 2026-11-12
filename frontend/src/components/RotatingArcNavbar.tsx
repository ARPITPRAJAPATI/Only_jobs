'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FolderGit2,
  GraduationCap,
  Code2,
  Award,
  BadgeCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ArcNavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  pastelColor: string;
}

export function RotatingArcNavbar() {
  const pathname = usePathname();

  // 5 Sections with their distinct pastel accent colors
  const items: ArcNavItem[] = [
    {
      id: 'projects',
      label: 'Projects',
      href: '/projects',
      icon: FolderGit2,
      pastelColor: '#c084fc', // Pastel Purple
    },
    {
      id: 'academics',
      label: 'Academics & SGPA',
      href: '/academics',
      icon: GraduationCap,
      pastelColor: '#4ade80', // Pastel Green
    },
    {
      id: 'coding',
      label: 'Coding Activities',
      href: '/coding',
      icon: Code2,
      pastelColor: '#fb923c', // Pastel Orange
    },
    {
      id: 'badges',
      label: 'Badges',
      href: '/badges',
      icon: Award,
      pastelColor: '#facc15', // Pastel Yellow
    },
    {
      id: 'certifications',
      label: 'Certificates',
      href: '/certifications',
      icon: BadgeCheck,
      pastelColor: '#f472b6', // Pastel Pink
    },
  ];

  // Route detection
  const getActiveIndexFromRoute = () => {
    if (pathname.startsWith('/academics')) return 1;
    if (pathname.startsWith('/coding')) return 2;
    if (pathname.startsWith('/badges')) return 3;
    if (pathname.startsWith('/certifications')) return 4;
    return 0; // Default to Projects if on /profile or /projects
  };

  const activeRouteIndex = getActiveIndexFromRoute();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentIndex = hoveredIndex !== null ? hoveredIndex : activeRouteIndex;
  const currentItem = items[currentIndex] ?? items[0];

  // ── Geometry & Layout Alignment ──
  // Container: Height = 280px
  // 1. All 5 icons in ONE perfectly straight vertical column (identical left: 68px).
  // 2. All 5 labels aligned horizontally (identical starting position).
  // 3. Consistent 54px vertical spacing between items.
  // 4. Arc curves on the left as a decorative guide with quadratic bezier Q 76 140.
  // 5. Charcoal indicator positioned directly on the arc, tracking the active item.
  // 6. Arc never overlaps or touches icons.
  const H = 280;
  const Qx = 76;
  const iconColumnLeft = 68; // Straight vertical alignment for all 5 icons
  const yPositions = [32, 86, 140, 194, 248]; // Equal 54px vertical spacing

  // Exact mathematical point on the quadratic bezier arc: Q 76 140 (peak x = 38 at y = 140)
  const itemCoords = yPositions.map((y) => {
    const t = y / H;
    const arcX = Math.round(2 * (1 - t) * t * Qx * 10) / 10;
    return { y, arcX };
  });

  const activeCoord = itemCoords[currentIndex] ?? itemCoords[0];

  return (
    <div
      onMouseLeave={() => setHoveredIndex(null)}
      className="relative w-full max-w-[320px] h-[280px] select-none flex items-center"
    >
      {/* ── Background SVG: Thin Subtle Arc Guide + Charcoal Indicator ── */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full overflow-visible z-10"
        viewBox="0 0 320 280"
        fill="none"
      >
        {/* Subtle decorative arc guide attached to the left edge */}
        <path
          d="M 0 0 Q 76 140 0 280"
          stroke="rgba(255, 255, 255, 0.16)"
          strokeWidth="1.25"
          strokeLinecap="round"
        />

        {/* ── Dark Charcoal Rounded Indicator Directly on the Arc ── */}
        <g
          style={{
            transform: `translate(${activeCoord.arcX}px, ${activeCoord.y}px)`,
            transition: 'transform 0.35s cubic-bezier(0.2, 0.9, 0.25, 1.15)',
          }}
        >
          <rect
            x={-8}
            y={-3}
            width={16}
            height={6}
            rx={3}
            fill="#23272f"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth={0.75}
          />
          {/* Subtle colored center accent dot matching active item */}
          <circle
            cx={0}
            cy={0}
            r={1.2}
            fill={currentItem.pastelColor}
            opacity={0.85}
          />
        </g>
      </svg>

      {/* ── Perfectly Straight Vertical Column of Icons & Labels ── */}
      <div className="relative w-full h-full z-20">
        {items.map((item, idx) => {
          const { y } = itemCoords[idx];
          const isTargeted = currentIndex === idx;
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              onMouseEnter={() => setHoveredIndex(idx)}
              className="absolute flex items-center group cursor-pointer transition-all duration-200"
              style={{
                left: `${iconColumnLeft}px`,
                top: `${y}px`,
                transform: 'translateY(-50%)',
              }}
              title={`Go to ${item.label}`}
            >
              {/* Circular Icon Container */}
              <div
                className={cn(
                  'relative h-[34px] w-[34px] rounded-full border flex items-center justify-center transition-all duration-300 shrink-0',
                  isTargeted ? 'scale-105' : 'hover:scale-[1.02]'
                )}
                style={{
                  borderColor: isTargeted ? item.pastelColor : `${item.pastelColor}28`,
                  backgroundColor: isTargeted ? `${item.pastelColor}22` : `${item.pastelColor}10`,
                  boxShadow: isTargeted ? `0 0 12px ${item.pastelColor}35` : undefined,
                }}
              >
                <Icon
                  className="h-4 w-4 transition-colors duration-200 shrink-0"
                  style={{
                    color: item.pastelColor,
                  }}
                />
              </div>

              {/* Horizontally Aligned Label */}
              <div
                className={cn(
                  'ml-3 px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all duration-300 border',
                  isTargeted
                    ? 'bg-white/[0.12] text-white font-medium shadow-xs'
                    : 'bg-white/[0.03] border-white/[0.07] text-white/60 group-hover:text-white/85 group-hover:bg-white/[0.06] group-hover:border-white/15'
                )}
                style={{
                  borderColor: isTargeted ? `${item.pastelColor}50` : undefined,
                }}
              >
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
