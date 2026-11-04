'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDownWideNarrow, BarChart3, Bookmark, Heart, ImagePlus, MessageCircle, MoreHorizontal, Send, ShieldCheck } from 'lucide-react';
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
        avatarUrl: student.avatarUrl || undefined,
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
  const [sortOrder, setSortOrder] = useState<'recent' | 'popular'>('recent');
  const visiblePosts = sortOrder === 'popular' ? [...posts].sort((a, b) => b.likes - a.likes) : posts;

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
              {/* Profile Body */}
              <div className="px-5 pt-5 pb-5 text-center">
                {/* Avatar */}
                <div className="mx-auto w-[62px] h-[62px] rounded-full ring-[3px] ring-surface overflow-hidden bg-surface2 text-ink border border-line flex items-center justify-center shadow-xs">
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

          </aside>

          {/* ============================================================ */}
          {/* ── CENTER COLUMN: Composer & Feed ── */}
          {/* ============================================================ */}
          <main className="lg:col-span-6 space-y-3.5">
            
            {/* Post Composer */}
            <div className="bg-surface rounded-xl p-3.5 sm:p-4 border border-line shadow-xs">
              <form onSubmit={handleCreatePost}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-surface2 text-ink flex items-center justify-center font-semibold text-xs shrink-0 border border-line">
                    {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Share a project, achievement, or update…"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    className="w-full bg-surface2/70 hover:bg-surface2 focus:bg-surface rounded-full px-4 py-2.5 text-sm text-ink placeholder-muted outline-none border border-transparent focus:border-line focus:ring-2 focus:ring-accent/15 transition-colors"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-line/70 pt-3 text-xs text-muted">
                  <div className="flex min-w-0 items-center gap-1 sm:gap-2">
                    <button type="button" className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 font-medium transition-colors hover:bg-surface2 hover:text-ink">
                      <ImagePlus className="h-4 w-4 text-accent" />
                      <span>Photo</span>
                    </button>
                    <button type="button" className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 font-medium transition-colors hover:bg-surface2 hover:text-ink">
                      <BarChart3 className="h-4 w-4 text-muted" />
                      <span>Poll</span>
                    </button>
                    <span className="hidden text-[11px] text-muted sm:inline">{dailyQuota}/3 posts left today</span>
                  </div>

                  <button
                    type="submit"
                    disabled={!postText.trim()}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-xs font-semibold text-surface transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Share update <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </div>

            <div className="flex items-center justify-between border-b border-line/70 px-1 pb-2 text-xs">
              <span className="text-muted">{posts.length} campus updates</span>
              <label className="inline-flex items-center gap-2 text-muted">
                <ArrowDownWideNarrow className="h-3.5 w-3.5" />
                <span>Sort by</span>
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value as 'recent' | 'popular')}
                  className="cursor-pointer bg-transparent font-semibold text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  aria-label="Sort campus updates"
                >
                  <option value="recent">Recent</option>
                  <option value="popular">Most liked</option>
                </select>
              </label>
            </div>

            {/* Posts Feed */}
            {visiblePosts.map((post) => {
              const isDeanNotice = post.id === 'dean-notice';
              return (
                <article
                  key={post.id}
                  className={`overflow-hidden bg-surface rounded-xl border shadow-xs transition-shadow hover:shadow-sm ${
                    isDeanNotice
                      ? 'border-[#d4a72c]/40'
                      : 'border-line'
                  }`}
                >
                  <div className="space-y-3.5 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-surface2 text-xs font-semibold text-ink">
                          {post.author.avatarUrl ? (
                            <Image src={post.author.avatarUrl} alt="" width={40} height={40} className="h-full w-full object-cover" />
                          ) : (
                            post.author.initials
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                            <h4 className="text-sm font-semibold leading-tight text-ink">{post.author.name}</h4>
                            {post.author.verifiedType !== 'student' && (
                              <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-label="Verified campus account" />
                            )}
                            {isDeanNotice && (
                              <span className="rounded border border-[#d4a72c]/40 bg-[#fff8c5]/60 px-1.5 py-0.5 text-[10px] font-medium text-[#9a6700]">
                                Official notice
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted">
                            {post.author.role} <span aria-hidden>·</span> {post.author.time}
                          </p>
                        </div>
                      </div>

                      <button type="button" aria-label="More post options" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-surface2 hover:text-ink">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-4 text-[13px] leading-relaxed text-ink sm:px-5 sm:pb-5">
                    <p>{post.content}</p>

                    {post.hashtags && (
                      <div className="mt-1.5 flex flex-wrap gap-x-1.5 gap-y-0.5">
                        {post.hashtags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-medium text-accent hover:underline"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Media */}
                  {post.image && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface2">
                      <Image
                        src={post.image}
                        alt={post.imageTag || 'Campus post image'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Project Repo Card */}
                  {post.projectLink && (
                    <div className="mx-4 mt-4 flex items-center justify-between gap-3 rounded-lg border border-line bg-surface2/60 p-3 text-xs sm:mx-5">
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
                  <div className="mx-4 mt-3 flex items-center justify-between border-t border-line/70 py-2.5 text-xs text-muted sm:mx-5">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        aria-label={`${post.isLiked ? 'Unlike' : 'Like'} post (${post.likes})`}
                        aria-pressed={Boolean(post.isLiked)}
                        onClick={() => toggleLike(post.id)}
                        className={`inline-flex items-center gap-1.5 transition-colors ${
                          post.isLiked ? 'text-[#cf222e]' : 'hover:text-ink'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span>{post.likes}</span>
                      </button>

                      <button
                        type="button"
                        aria-label={`Write a comment (${post.comments})`}
                        onClick={() => document.getElementById(`comment-${post.id}`)?.focus()}
                        className="inline-flex items-center gap-1.5 transition-colors hover:text-ink"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </button>

                      <button
                        type="button"
                        aria-label={`${post.isSaved ? 'Unsave' : 'Save'} post (${post.saves})`}
                        aria-pressed={Boolean(post.isSaved)}
                        onClick={() => toggleSave(post.id)}
                        className={`inline-flex items-center gap-1.5 transition-colors ${
                          post.isSaved ? 'text-accent' : 'hover:text-ink'
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${post.isSaved ? 'fill-current' : ''}`} />
                        <span>{post.saves}</span>
                      </button>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                      <ShieldCheck className="h-3.5 w-3.5 text-good" />
                      KIET verified
                    </span>
                  </div>

                  {/* Quick comment box */}
                  <div className="mx-4 flex items-center gap-2 pb-4 sm:mx-5 sm:pb-5">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface2 text-[10px] font-semibold text-muted">
                      {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <input
                      id={`comment-${post.id}`}
                      type="text"
                      placeholder="Write a comment"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(post.id);
                      }}
                      className="min-w-0 flex-1 rounded-full border border-line/70 bg-surface2/60 px-4 py-2 text-xs text-ink outline-none transition-colors placeholder:text-muted focus:border-accent/50 focus:bg-surface"
                    />
                    {commentInputs[post.id]?.trim() && (
                      <button
                        type="button"
                        aria-label="Send comment"
                        onClick={() => handleAddComment(post.id)}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-accent transition-colors hover:bg-accent/10"
                      >
                        <Send className="h-4 w-4" />
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
