'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStudent } from '@/components/store';
import { trustBreakdown } from '@/lib/utils';

interface Post {
  id: string;
  type: 'DEAN_NOTICE' | 'PROJECT_SHOWCASE' | 'PLACEMENT_UPDATE' | 'HACKATHON_WIN';
  author: {
    name: string;
    email: string;
    role: string;
    dept: string;
    avatarUrl?: string;
    initials: string;
    time: string;
    verifiedType: 'dean' | 'crpc' | 'student';
    badges?: string[];
  };
  content: string;
  hashtags?: string[];
  image?: string;
  imageTag?: string;
  projectLink?: {
    repo: string;
    url: string;
    stars?: number;
    stack: string[];
  };
  likes: number;
  comments: number;
  saves: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export default function FeedPage() {
  const { student } = useStudent();
  const trust = trustBreakdown(student).total;
  const approvedBadges = student.badges.filter((b) => b.status === 'APPROVED').length;

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'dean-notice',
      type: 'DEAN_NOTICE',
      author: {
        name: 'Office of the Dean',
        email: 'dean.academics@kiet.edu',
        role: 'Dean of Academics',
        dept: 'KIET Institutional Council',
        initials: 'DO',
        time: 'Pinned',
        verifiedType: 'dean',
        badges: ['Academic Council'],
      },
      content: 'Mandatory Briefing on Smart India Hackathon (SIH 2026) internal college evaluations scheduled for Friday 2:00 PM at Main Auditorium. All 1st–4th year teams must link their verified GitHub repository on the portal before Thursday midnight.',
      hashtags: ['SIH2026', 'KIETAcademics', 'Hackathon'],
      likes: 1240,
      comments: 86,
      saves: 340,
      isLiked: false,
      isSaved: true,
    },
    {
      id: '1',
      type: 'PROJECT_SHOWCASE',
      author: {
        name: student.name,
        email: student.email || 'arpit.prajapati@kiet.edu',
        role: 'B.Tech CSE · Sem 7',
        dept: 'Cloud & Systems Lab',
        avatarUrl: '/feed_cover.jpg',
        initials: student.name.split(' ').map((n) => n[0]).join('').slice(0, 2),
        time: '15m ago',
        verifiedType: 'student',
        badges: ['200+ LeetCode', 'Full-Stack Builder', 'Hackathon Winner'],
      },
      content: 'Deployed KubePay to production. Microservices payment gateway on AWS EKS with Argo Rollouts and double-entry ledger. Passed k6 load tests at 1.2k RPS with zero-downtime canary updates.',
      hashtags: ['Kubernetes', 'DevOps', 'EKS', 'Go', 'Microservices'],
      image: '/feed_post_art.jpg',
      imageTag: 'EKS Production Architecture',
      projectLink: {
        repo: 'arpit/kubepay',
        url: 'https://github.com',
        stars: 38,
        stack: ['Go', 'Node.js', 'PostgreSQL', 'Docker', 'K8s'],
      },
      likes: 342,
      comments: 28,
      saves: 56,
      isLiked: true,
      isSaved: true,
    },
    {
      id: '2',
      type: 'PLACEMENT_UPDATE',
      author: {
        name: 'Placement Cell (CRPC)',
        email: 'crpc@kiet.edu',
        role: 'Corporate Relations Cell',
        dept: 'Campus Placement Office',
        initials: 'CR',
        time: '1h ago',
        verifiedType: 'crpc',
        badges: ['Official TPO'],
      },
      content: 'Placement Update: Amazon India SDE Intern Drive 2025 shortlisting released for KIET CSE/IT. Pre-placement talk tomorrow at 10:30 AM in Audi-2. Ensure proof-of-work profiles are up to date.',
      hashtags: ['PlacementDrive', 'Amazon', 'CampusRecruitment', 'KIET2025'],
      likes: 890,
      comments: 64,
      saves: 210,
      isLiked: false,
      isSaved: false,
    },
    {
      id: '3',
      type: 'HACKATHON_WIN',
      author: {
        name: 'Sneha Rawat',
        email: 'sneha.2226cs1018@kiet.edu',
        role: 'B.Tech CSE · Sem 5',
        dept: 'Innogeeks Society',
        initials: 'SR',
        time: '3h ago',
        verifiedType: 'student',
        badges: ['Hackathon Winner', 'Innogeeks Lead'],
      },
      content: 'Team Innogeeks secured 1st Runner Up at the North India Hackathon 2026. Built an automated real-time anti-cheat proctoring model in 36 hours. Thanks to our faculty mentors for the guidance.',
      hashtags: ['Hackathon', 'Innogeeks', 'ComputerVision', 'KIETBuilders'],
      likes: 412,
      comments: 42,
      saves: 31,
      isLiked: false,
      isSaved: false,
    },
  ]);

  // Composer
  const [postText, setPostText] = useState('');
  const [dailyQuota, setDailyQuota] = useState(2);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Follow states
  const [followedState, setFollowedState] = useState<Record<string, boolean>>({
    aman: false,
    sneha: true,
    kartik: false,
    priya: true,
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      type: 'PROJECT_SHOWCASE',
      author: {
        name: student.name,
        email: student.email || 'student@kiet.edu',
        role: 'B.Tech CSE · Sem 7',
        dept: 'Student Contributor',
        initials: student.name.split(' ').map((n) => n[0]).join('').slice(0, 2),
        time: 'Just now',
        verifiedType: 'student',
        badges: ['Verified Student'],
      },
      content: postText,
      hashtags: ['KIETCampus', 'ProofOfWork'],
      likes: 1,
      comments: 0,
      saves: 0,
      isLiked: false,
      isSaved: false,
    };

    setPosts([newPost, ...posts]);
    setPostText('');
    setDailyQuota((prev) => Math.max(0, prev - 1));
  };

  const toggleLike = (postId: string) => {
    setPosts(posts.map((p) => (p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p)));
  };

  const toggleSave = (postId: string) => {
    setPosts(posts.map((p) => (p.id === postId ? { ...p, isSaved: !p.isSaved, saves: p.isSaved ? p.saves - 1 : p.saves + 1 } : p)));
  };

  const toggleFollow = (userKey: string) => {
    setFollowedState((prev) => ({ ...prev, [userKey]: !prev[userKey] }));
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    setPosts(posts.map((p) => (p.id === postId ? { ...p, comments: p.comments + 1 } : p)));
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  return (
    <div className="min-h-screen bg-bg text-ink transition-colors">
      {/* ── Main 3-Column Layout ── */}
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ============================================================ */}
          {/* ── LEFT COLUMN: Student Identity & Shortcuts ── */}
          {/* ============================================================ */}
          <aside className="lg:col-span-3 space-y-4">
            
            {/* Card 1: Student Identity */}
            <div className="bg-surface rounded-2xl overflow-hidden border border-line shadow-xs">
              {/* Cover Banner */}
              <div className="h-[76px] w-full relative overflow-hidden bg-surface2">
                <Image
                  src="/feed_cover.jpg"
                  alt="Cover"
                  fill
                  className="object-cover opacity-70"
                />
              </div>

              {/* Profile Body */}
              <div className="px-5 pb-5 text-center">
                {/* Avatar */}
                <div className="-mt-9 mx-auto w-[62px] h-[62px] rounded-full ring-[3px] ring-surface overflow-hidden bg-surface2 text-ink border border-line flex items-center justify-center shadow-xs">
                  <span className="font-extrabold text-[18px] text-ink">
                    {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </span>
                </div>

                <h3 className="mt-2.5 font-bold text-[15px] text-ink tracking-tight">
                  {student.name}
                </h3>
                <p className="text-[12px] text-muted font-mono mt-0.5">
                  {student.email || 'arpit.prajapati@kiet.edu'}
                </p>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-3 divide-x divide-line/60 border-y border-line/60 py-2.5">
                  <div>
                    <div className="text-[14px] font-bold text-ink">{approvedBadges}</div>
                    <div className="text-[10px] text-muted font-semibold uppercase tracking-wider mt-0.5">Badges</div>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#0969da]">{trust}%</div>
                    <div className="text-[10px] text-muted font-semibold uppercase tracking-wider mt-0.5">Trust</div>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-ink">{student.projects.length}</div>
                    <div className="text-[10px] text-muted font-semibold uppercase tracking-wider mt-0.5">Projects</div>
                  </div>
                </div>

                {/* Link to Profile */}
                <Link
                  href="/profile"
                  className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-[#1f883d] hover:bg-[#1a7f37] text-white font-semibold text-[13px] transition-colors"
                >
                  <span>Verified Portfolio</span>
                  <span className="text-xs opacity-70">→</span>
                </Link>
              </div>
            </div>

            {/* Card 2: Campus Shortcuts */}
            <div className="bg-surface rounded-2xl p-4 border border-line shadow-xs">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Campus Circles
                </span>
                <Link href="/profile" className="text-[11px] font-semibold text-[#0969da] hover:underline">
                  View all
                </Link>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface2 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-[#ddf4ff] text-[#0969da] border border-[#54aeff]/30 flex items-center justify-center text-xs font-bold shrink-0">
                      ☁
                    </span>
                    <span className="text-[13px] font-medium text-ink group-hover:text-[#0969da] truncate">
                      DevOps & Cloud Lab
                    </span>
                  </div>
                  <span className="text-[11px] text-muted shrink-0">148</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface2 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-[#dafbe1] text-[#1a7f37] border border-[#4ac26b]/30 flex items-center justify-center text-xs font-bold shrink-0">
                      ⚡
                    </span>
                    <span className="text-[13px] font-medium text-ink group-hover:text-[#1a7f37] truncate">
                      Innogeeks Society
                    </span>
                  </div>
                  <span className="text-[11px] text-muted shrink-0">210</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface2 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-[#fff8c5] text-[#9a6700] border border-[#d4a72c]/30 flex items-center justify-center text-xs font-bold shrink-0">
                      🎯
                    </span>
                    <span className="text-[13px] font-medium text-ink group-hover:text-[#9a6700] truncate">
                      Placement Cell (CRPC)
                    </span>
                  </div>
                  <span className="text-[11px] text-muted shrink-0">Official</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface2 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-[#fbefff] text-[#8250df] border border-[#d2a8ff]/30 flex items-center justify-center text-xs font-bold shrink-0">
                      ◈
                    </span>
                    <span className="text-[13px] font-medium text-ink group-hover:text-[#8250df] truncate">
                      AI & ML Research Group
                    </span>
                  </div>
                  <span className="text-[11px] text-muted shrink-0">94</span>
                </div>
              </div>
            </div>

          </aside>

          {/* ============================================================ */}
          {/* ── CENTER COLUMN: Composer & Feed ── */}
          {/* ============================================================ */}
          <main className="lg:col-span-6 space-y-4">
            
            {/* Post Composer */}
            <div className="bg-surface rounded-2xl p-4 border border-line shadow-xs">
              <form onSubmit={handleCreatePost}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1f2328] text-white flex items-center justify-center font-bold text-xs shrink-0 border border-line">
                    {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Share a project, achievement or doubt with KIET..."
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    className="w-full bg-surface2 hover:bg-surface2/80 focus:bg-surface rounded-xl px-4 py-2 text-[13.5px] text-ink placeholder-muted outline-none border border-line focus:border-[#0969da] transition-colors"
                  />
                </div>

                <div className="mt-3 pt-3 border-t border-line/60 flex items-center justify-between text-xs text-muted">
                  <div className="flex items-center gap-4 font-medium">
                    <button type="button" className="hover:text-ink flex items-center gap-1.5 transition-colors">
                      <svg className="w-4 h-4 text-[#1a7f37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span>Media</span>
                    </button>

                    <button type="button" className="hover:text-ink flex items-center gap-1.5 transition-colors">
                      <svg className="w-4 h-4 text-[#0969da]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                      <span>Poll</span>
                    </button>

                    <span className="text-muted">
                      {dailyQuota}/3 daily posts
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={!postText.trim()}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      postText.trim()
                        ? 'bg-[#1f883d] hover:bg-[#1a7f37] text-white cursor-pointer shadow-xs'
                        : 'bg-surface2 text-muted border border-line cursor-not-allowed'
                    }`}
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>

            {/* Posts Feed */}
            {posts.map((post) => {
              const isDeanNotice = post.id === 'dean-notice';
              return (
                <article
                  key={post.id}
                  className={`bg-surface rounded-2xl p-5 border shadow-xs space-y-3.5 transition-all ${
                    isDeanNotice
                      ? 'border-[#d4a72c]/50 bg-[#fff8c5]/10'
                      : 'border-line'
                  }`}
                >
                  {/* Post Header: Clean, Human, Anti-Slop */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[#1f2328] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-line">
                        {post.author.initials}
                      </div>

                      {/* Author Details */}
                      <div className="min-w-0 flex-1">
                        {/* Line 1: Name + Email + Verified */}
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <h4 className="font-bold text-[14.5px] text-ink leading-none">
                            {post.author.name}
                          </h4>

                          {post.author.verifiedType === 'student' && (
                            <span className="text-[#0969da] text-xs font-bold leading-none" title="Verified KIET Student">
                              ✓
                            </span>
                          )}

                          {isDeanNotice && (
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#9a6700] bg-[#fff8c5] border border-[#d4a72c]/40 px-2 py-0.5 rounded leading-none">
                              Pinned Circular
                            </span>
                          )}

                          {/* Clean email text (No ugly bubble pill) */}
                          <span className="text-[12px] text-muted font-mono">
                            {post.author.email}
                          </span>
                        </div>

                        {/* Line 2: Role · Badges · Time */}
                        <div className="mt-1 flex items-center gap-2 text-[12px] text-muted flex-wrap">
                          <span>{post.author.role}</span>
                          <span className="text-muted/60">•</span>
                          <span>{post.author.time}</span>

                          {/* Subtle, refined badge chips */}
                          {post.author.badges && post.author.badges.length > 0 && (
                            <>
                              <span className="text-muted/60">•</span>
                              <div className="inline-flex items-center gap-1.5 flex-wrap">
                                {post.author.badges.map((b) => (
                                  <span
                                    key={b}
                                    className="text-[11px] font-medium text-ink bg-surface2 border border-line px-2 py-0.5 rounded-md"
                                  >
                                    {b}
                                  </span>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Context menu */}
                    <button className="text-muted hover:text-ink p-1 rounded-lg">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="1.5" />
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="12" cy="19" r="1.5" />
                      </svg>
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="text-[14px] text-ink leading-relaxed">
                    <p>{post.content}</p>

                    {post.hashtags && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {post.hashtags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[12px] font-medium text-[#0969da] hover:underline cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Media */}
                  {post.image && (
                    <div className="rounded-xl overflow-hidden relative w-full h-[260px] sm:h-[300px] bg-surface2 border border-line">
                      <Image
                        src={post.image}
                        alt="Post media"
                        fill
                        className="object-cover"
                        priority
                      />
                      {post.imageTag && (
                        <span className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                          {post.imageTag}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Project Repo Card */}
                  {post.projectLink && (
                    <div className="p-3 bg-surface2 rounded-xl border border-line flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-muted font-mono">github.com/{post.projectLink.repo}</span>
                        <a
                          href={post.projectLink.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0969da] font-semibold hover:underline"
                        >
                          View Source ↗
                        </a>
                      </div>

                      <div className="hidden sm:flex items-center gap-1.5 text-muted font-medium">
                        {post.projectLink.stack.map((s) => (
                          <span key={s} className="bg-surface border border-line px-1.5 py-0.5 rounded text-[10px] text-ink">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 flex items-center justify-between text-xs font-semibold text-muted border-t border-line/60">
                    <div className="flex items-center gap-5">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          post.isLiked ? 'text-[#cf222e]' : 'hover:text-ink'
                        }`}
                      >
                        <svg
                          className={`w-4 h-4 ${post.isLiked ? 'fill-[#cf222e]' : 'fill-none stroke-current'}`}
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        <span>{post.likes}</span>
                      </button>

                      <button className="flex items-center gap-1.5 hover:text-ink transition-colors cursor-pointer">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        </svg>
                        <span>{post.comments}</span>
                      </button>

                      <button
                        onClick={() => toggleSave(post.id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          post.isSaved ? 'text-[#0969da]' : 'hover:text-ink'
                        }`}
                      >
                        <svg
                          className={`w-4 h-4 ${post.isSaved ? 'fill-[#0969da]' : 'fill-none stroke-current'}`}
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                        <span>{post.saves}</span>
                      </button>
                    </div>

                    <span className="text-[11px] text-muted">
                      KIET Verified Feed
                    </span>
                  </div>

                  {/* Quick comment box */}
                  <div className="pt-1 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(post.id);
                      }}
                      className="flex-1 bg-surface2 focus:bg-surface rounded-lg px-3 py-1.5 text-xs text-ink placeholder-muted outline-none border border-line focus:border-[#0969da] transition-colors"
                    />
                    {commentInputs[post.id]?.trim() && (
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="text-xs font-semibold text-[#0969da] hover:underline px-1 cursor-pointer"
                      >
                        Send
                      </button>
                    )}
                  </div>
                </article>
              );
            })}

          </main>

          {/* ============================================================ */}
          {/* ── RIGHT COLUMN: Signals & Talent Network ── */}
          {/* ============================================================ */}
          <aside className="lg:col-span-3 space-y-4">
            
            {/* Card 1: Signals */}
            <div className="bg-surface rounded-2xl p-4 border border-line shadow-xs">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Campus Signals
                </span>
                <span className="text-[11px] text-[#1a7f37] font-semibold">● Live</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0969da] mt-1.5 shrink-0" />
                  <div className="text-xs">
                    <p className="text-ink">
                      <strong className="font-semibold">CRPC Cell</strong> announced Amazon SDE shortlists.
                    </p>
                    <span className="text-[11px] text-muted">15m ago</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a7f37] mt-1.5 shrink-0" />
                  <div className="text-xs">
                    <p className="text-ink">
                      <strong className="font-semibold">Prof. Sharma</strong> verified AST complexity.
                    </p>
                    <span className="text-[11px] text-muted">1h ago</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8250df] mt-1.5 shrink-0" />
                  <div className="text-xs">
                    <p className="text-ink">
                      <strong className="font-semibold">Rohan</strong> endorsed Docker & K8s skills.
                    </p>
                    <span className="text-[11px] text-muted">1D ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Placed Alumni & Peers */}
            <div className="bg-surface rounded-2xl p-4 border border-line shadow-xs">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  KIET Network
                </span>
                <Link href="/profile" className="text-[11px] font-semibold text-[#0969da] hover:underline">
                  Directory
                </Link>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h5 className="font-bold text-[13px] text-ink truncate">Aman Gupta</h5>
                    <p className="text-[11px] text-muted truncate">SDE @ Atlassian · &apos;24</p>
                  </div>
                  <button
                    onClick={() => toggleFollow('aman')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                      followedState.aman
                        ? 'bg-surface2 text-muted border border-line'
                        : 'bg-[#1f883d] text-white hover:bg-[#1a7f37]'
                    }`}
                  >
                    {followedState.aman ? 'Connected' : 'Connect'}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h5 className="font-bold text-[13px] text-ink truncate">Sneha Rawat</h5>
                    <p className="text-[11px] text-muted truncate">Innogeeks Lead · CSE &apos;26</p>
                  </div>
                  <button
                    onClick={() => toggleFollow('sneha')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                      followedState.sneha
                        ? 'bg-surface2 text-muted border border-line'
                        : 'bg-[#1f883d] text-white hover:bg-[#1a7f37]'
                    }`}
                  >
                    {followedState.sneha ? 'Connected' : 'Connect'}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h5 className="font-bold text-[13px] text-ink truncate">Priya Sharma</h5>
                    <p className="text-[11px] text-muted truncate">Placed @ Adobe · IT &apos;25</p>
                  </div>
                  <button
                    onClick={() => toggleFollow('priya')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                      followedState.priya
                        ? 'bg-surface2 text-muted border border-line'
                        : 'bg-[#1f883d] text-white hover:bg-[#1a7f37]'
                    }`}
                  >
                    {followedState.priya ? 'Connected' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
