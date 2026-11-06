'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDownWideNarrow, Check, ChevronDown, Heart, ImagePlus, MessageCircle, MoreHorizontal, Send, ShieldCheck, X } from 'lucide-react';
import { BadgeIcon } from '@/components/BadgeIcon';
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
  isLiked?: boolean;
  isOwnPost?: boolean;
}

interface FeedComment {
  id: string;
  authorName: string;
  initials: string;
  content: string;
}

const DAILY_POST_LIMIT = 3;

function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function readDailyPostCount(storageKey: string) {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return 0;

  try {
    const saved = JSON.parse(raw) as { date?: string; count?: number };
    if (saved.date !== getLocalDateKey() || !Number.isInteger(saved.count)) return 0;
    return Math.min(DAILY_POST_LIMIT, Math.max(0, saved.count ?? 0));
  } catch {
    return 0;
  }
}

export default function FeedPage() {
  const { student, catalog } = useStudent();
  const trust = trustBreakdown(student).total;
  const approvedBadges = student.badges.filter((b) => b.status === 'APPROVED').length;
  const approvedBadgeIds = new Set(student.badges.filter((badge) => badge.status === 'APPROVED').map((badge) => badge.badgeId));
  const topStudentBadges = catalog.filter((badge) => approvedBadgeIds.has(badge.id)).slice(0, 3);

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
      isLiked: false,
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
      isLiked: true,
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
      isLiked: false,
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
      isLiked: false,
    },
  ]);

  // Composer
  const [postText, setPostText] = useState('');
  const [dailyQuota, setDailyQuota] = useState(DAILY_POST_LIMIT);
  const [quotaReady, setQuotaReady] = useState(false);
  const [quotaStorageError, setQuotaStorageError] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [composerError, setComposerError] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [postComments, setPostComments] = useState<Record<string, FeedComment[]>>({});
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [openPostMenu, setOpenPostMenu] = useState<string | null>(null);
  const [postActionNotice, setPostActionNotice] = useState<{ postId: string; message: string } | null>(null);
  const [sortOrder, setSortOrder] = useState<'recent' | 'popular'>('recent');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const visiblePosts = sortOrder === 'popular' ? [...posts].sort((a, b) => b.likes - a.likes) : posts;
  const imageInputRef = useRef<HTMLInputElement>(null);
  const postTextRef = useRef<HTMLTextAreaElement>(null);
  const publishingRef = useRef(false);
  const quotaStorageKey = `onlyjobs:feed-post-limit:v1:${student.id}`;

  useEffect(() => {
    const refreshQuota = () => {
      try {
        const usedToday = readDailyPostCount(quotaStorageKey);
        setDailyQuota(DAILY_POST_LIMIT - usedToday);
        setQuotaStorageError(false);
      } catch {
        setDailyQuota(0);
        setQuotaStorageError(true);
      } finally {
        setQuotaReady(true);
      }
    };

    refreshQuota();
    const refreshOnFocus = () => refreshQuota();
    const refreshOnStorage = (event: StorageEvent) => {
      if (event.key === quotaStorageKey) refreshQuota();
    };
    window.addEventListener('focus', refreshOnFocus);
    window.addEventListener('storage', refreshOnStorage);
    const refreshInterval = window.setInterval(refreshQuota, 60_000);
    return () => {
      window.removeEventListener('focus', refreshOnFocus);
      window.removeEventListener('storage', refreshOnStorage);
      window.clearInterval(refreshInterval);
    };
  }, [quotaStorageKey]);

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedImage]);

  useEffect(() => {
    if (!composerOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setComposerOpen(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    postTextRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [composerOpen]);

  const readImage = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject(new Error('The selected image could not be read.'));
      };
      reader.onerror = () => reject(new Error('The selected image could not be read.'));
      reader.readAsDataURL(file);
    });

  // Follow states
  const [followedState, setFollowedState] = useState<Record<string, boolean>>({
    aman: false,
    sneha: true,
    kartik: false,
    priya: true,
  });

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = postText.trim();
    if ((!content && !selectedImage) || !quotaReady || quotaStorageError || publishingRef.current) return;

    publishingRef.current = true;
    setIsPublishing(true);
    setComposerError(null);

    try {
      const currentCount = readDailyPostCount(quotaStorageKey);
      if (currentCount >= DAILY_POST_LIMIT) {
        setDailyQuota(0);
        setComposerError('You’ve reached today’s post limit. You can post again tomorrow.');
        return;
      }

      let image: string | undefined;
      if (selectedImage) {
        try {
          image = await readImage(selectedImage);
        } catch {
          setComposerError('We could not load that image. Please choose it again.');
          return;
        }
      }

      const latestCount = readDailyPostCount(quotaStorageKey);
      if (latestCount >= DAILY_POST_LIMIT) {
        setDailyQuota(0);
        setComposerError('You’ve reached today’s post limit. You can post again tomorrow.');
        return;
      }

      const nextCount = latestCount + 1;
      localStorage.setItem(quotaStorageKey, JSON.stringify({ date: getLocalDateKey(), count: nextCount }));
      setDailyQuota(DAILY_POST_LIMIT - nextCount);

      const newPost: Post = {
        id: Date.now().toString(),
        type: 'PROJECT_SHOWCASE',
        author: {
          name: student.name,
          email: student.email || 'student@kiet.edu',
          role: 'B.Tech CSE · Sem 7',
          dept: 'Student Contributor',
          avatarUrl: student.avatarUrl || undefined,
          initials: student.name.split(' ').map((n) => n[0]).join('').slice(0, 2),
          time: 'Just now',
          verifiedType: 'student',
        },
        content,
        image,
        likes: 0,
        comments: 0,
        isLiked: false,
        isOwnPost: true,
      };

      setPosts((currentPosts) => [newPost, ...currentPosts]);
      setPostText('');
      setSelectedImage(null);
      setComposerError(null);
      setComposerOpen(false);
    } catch {
      setDailyQuota(0);
      setQuotaStorageError(true);
      setComposerError('We couldn’t verify your daily post limit. Please enable browser storage and try again.');
    } finally {
      publishingRef.current = false;
      setIsPublishing(false);
    }
  };

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setComposerError('Choose an image file to attach.');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setComposerError('Images must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }

    setComposerError(null);
    setSelectedImage(file);
  };

  const toggleLike = (postId: string) => {
    setPosts(posts.map((p) => (p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p)));
  };

  const toggleFollow = (userKey: string) => {
    setFollowedState((prev) => ({ ...prev, [userKey]: !prev[userKey] }));
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    const comment: FeedComment = {
      id: `${Date.now()}-${Math.random()}`,
      authorName: student.name,
      initials: student.name.split(' ').map((n) => n[0]).join('').slice(0, 2),
      content: text,
    };
    setPosts((currentPosts) => currentPosts.map((p) => (p.id === postId ? { ...p, comments: p.comments + 1 } : p)));
    setPostComments((currentComments) => ({
      ...currentComments,
      [postId]: [...(currentComments[postId] || []), comment],
    }));
    setCommentInputs((currentInputs) => ({ ...currentInputs, [postId]: '' }));
    setExpandedComments(postId);
  };

  const handleCopyPostLink = async (postId: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#post-${postId}`);
      setPostActionNotice({ postId, message: 'Post link copied.' });
    } catch {
      setPostActionNotice({ postId, message: 'Could not copy the post link. Check clipboard permissions.' });
    }
    setOpenPostMenu(null);
  };

  const handleHidePost = (postId: string) => {
    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
    setOpenPostMenu(null);
    setPostActionNotice(null);
  };

  const handleDeletePost = (postId: string) => {
    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
    setPostComments((currentComments) => {
      const { [postId]: _deletedComments, ...remainingComments } = currentComments;
      return remainingComments;
    });
    setOpenPostMenu(null);
    setPostActionNotice(null);
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
            <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs sm:p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-surface2 text-xs font-semibold text-ink">
                  {student.avatarUrl ? (
                    <Image src={student.avatarUrl} alt="" width={40} height={40} className="h-full w-full object-cover" />
                  ) : (
                    student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setComposerOpen(true)}
                  disabled={!quotaReady || quotaStorageError || dailyQuota <= 0}
                  className="flex min-h-11 flex-1 items-center rounded-full border border-line bg-surface2/60 px-4 text-left text-sm text-muted transition-colors hover:border-accent/40 hover:bg-surface2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {!quotaReady
                    ? 'Checking today’s post limit…'
                    : dailyQuota > 0
                      ? 'Share a project, achievement, or update…'
                      : 'You’ve reached today’s post limit'}
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line/70 pt-3">
                <button
                  type="button"
                  onClick={() => setComposerOpen(true)}
                  disabled={!quotaReady || quotaStorageError || dailyQuota <= 0}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface2 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ImagePlus className="h-4 w-4 text-accent" />
                  Add a photo
                </button>
                <span className="text-xs text-muted">
                  {quotaReady ? `${dailyQuota}/3 posts left today` : 'Checking daily post limit…'}
                </span>
              </div>
              {quotaStorageError && (
                <p role="alert" className="mt-2 text-xs text-bad">
                  Could not verify your daily limit. Enable browser storage to post.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between border-b border-line/70 px-1 pb-2 text-xs">
              <span className="text-muted">{posts.length} campus updates</span>
              <div
                className="relative"
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setSortMenuOpen(false);
                }}
              >
                <button
                  type="button"
                  aria-label={`Sort campus updates: ${sortOrder === 'recent' ? 'Recent' : 'Most liked'}`}
                  aria-haspopup="menu"
                  aria-expanded={sortMenuOpen}
                  onClick={() => setSortMenuOpen((open) => !open)}
                  className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 font-semibold text-ink shadow-xs transition-colors hover:border-accent/40 hover:bg-surface2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                >
                  <ArrowDownWideNarrow className="h-3.5 w-3.5 text-muted" />
                  <span>{sortOrder === 'recent' ? 'Recent' : 'Most liked'}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-muted transition-transform ${sortMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {sortMenuOpen && (
                  <div role="menu" aria-label="Sort campus updates" className="absolute right-0 top-full z-20 mt-2 min-w-40 rounded-xl border border-line bg-surface p-1.5 shadow-lg">
                    {([
                      { value: 'recent', label: 'Recent' },
                      { value: 'popular', label: 'Most liked' },
                    ] as const).map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        role="menuitemradio"
                        aria-checked={sortOrder === option.value}
                        onClick={() => {
                          setSortOrder(option.value);
                          setSortMenuOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium text-ink transition-colors hover:bg-surface2"
                      >
                        {option.label}
                        {sortOrder === option.value && <Check className="h-3.5 w-3.5 text-accent" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Posts Feed */}
            {visiblePosts.map((post) => {
              const isDeanNotice = post.id === 'dean-notice';
              const isStudentPost = post.isOwnPost || post.author.email === (student.email || 'arpit.prajapati@kiet.edu');
              const postBadges: { id: string; title: string; iconUrl?: string }[] = isStudentPost
                ? topStudentBadges.map((badge) => ({ id: badge.id, title: badge.title, iconUrl: badge.iconUrl }))
                : (post.author.badges || []).slice(0, 3).map((title) => ({ id: title, title }));
              return (
                <article
                  key={post.id}
                  id={`post-${post.id}`}
                  className={`overflow-hidden bg-surface rounded-2xl border shadow-xs transition-shadow hover:shadow-md ${
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
                          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                            <h4 className="min-w-0 truncate text-sm font-semibold leading-tight text-ink">{post.author.name}</h4>
                            {post.author.verifiedType !== 'student' && (
                              <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-label="Verified campus account" />
                            )}
                            {postBadges.length > 0 && (
                              <div aria-label="Top badges" className="flex min-w-0 flex-wrap items-center gap-1">
                                {postBadges.map((badge) => (
                                  <span
                                    key={badge.id}
                                    title={badge.title}
                                    className="inline-flex max-w-36 items-center gap-1 rounded-full border border-[#54aeff]/30 bg-[#ddf4ff]/70 py-0.5 pl-1 pr-2 text-[10px] font-semibold leading-none text-[#0969da] transition-colors hover:bg-[#ddf4ff]"
                                  >
                                    {badge.iconUrl ? (
                                      <BadgeIcon iconUrl={badge.iconUrl} className="!h-4 !w-4 !shrink-0 !rounded-full !border-0 !bg-transparent !text-[#0969da] !shadow-none [&>svg]:!h-3 [&>svg]:!w-3" />
                                    ) : (
                                      <ShieldCheck className="ml-0.5 h-3 w-3 shrink-0" />
                                    )}
                                    <span className="truncate">{badge.title}</span>
                                  </span>
                                ))}
                              </div>
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

                      <div className="relative shrink-0">
                        <button
                          type="button"
                          aria-label="More post options"
                          aria-expanded={openPostMenu === post.id}
                          aria-haspopup="menu"
                          onClick={() => {
                            setOpenPostMenu((currentPostId) => currentPostId === post.id ? null : post.id);
                            setPostActionNotice(null);
                          }}
                          className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-surface2 hover:text-ink"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {openPostMenu === post.id && (
                          <div role="menu" className="absolute right-0 top-10 z-20 min-w-44 rounded-xl border border-line bg-surface p-1.5 shadow-lg">
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => void handleCopyPostLink(post.id)}
                              className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-ink transition-colors hover:bg-surface2"
                            >
                              Copy post link
                            </button>
                            {post.isOwnPost ? (
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => handleDeletePost(post.id)}
                                className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-bad transition-colors hover:bg-surface2"
                              >
                                Delete post
                              </button>
                            ) : (
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => handleHidePost(post.id)}
                                className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-ink transition-colors hover:bg-surface2"
                              >
                                Not interested
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {postActionNotice?.postId === post.id && (
                    <p role="status" className="px-5 pb-2 text-xs text-muted">{postActionNotice.message}</p>
                  )}

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
                        aria-expanded={expandedComments === post.id}
                        aria-controls={`comments-${post.id}`}
                        onClick={() => {
                          const isExpanded = expandedComments === post.id;
                          setExpandedComments(isExpanded ? null : post.id);
                          if (!isExpanded) window.setTimeout(() => document.getElementById(`comment-${post.id}`)?.focus(), 0);
                        }}
                        className={`inline-flex items-center gap-1.5 transition-colors ${
                          expandedComments === post.id ? 'text-accent' : 'hover:text-ink'
                        }`}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </button>

                    </div>
                  </div>

                  {expandedComments === post.id && (
                    <section
                      id={`comments-${post.id}`}
                      aria-label={`Comments on ${post.author.name}'s post`}
                      className="border-t border-line bg-surface2/40 px-4 py-4 sm:px-5"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h5 className="text-sm font-semibold text-ink">Comments</h5>
                        <span className="text-xs text-muted">{post.comments}</span>
                      </div>
                      {(postComments[post.id] || []).length > 0 ? (
                        <div className="mb-4 space-y-4">
                          {postComments[post.id].map((comment) => (
                            <div key={comment.id} className="flex items-start gap-2.5">
                              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-surface text-[10px] font-semibold text-muted">
                                {comment.initials}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="inline-block max-w-full rounded-xl bg-surface px-3 py-2">
                                  <p className="text-xs font-semibold text-ink">{comment.authorName}</p>
                                  <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-relaxed text-ink">{comment.content}</p>
                                </div>
                                <p className="mt-1 px-2 text-[11px] font-medium text-muted">Just now</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mb-4 text-xs text-muted">No comments yet. Start the conversation.</p>
                      )}
                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                          handleAddComment(post.id);
                        }}
                        className="flex items-center gap-2"
                      >
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface text-[10px] font-semibold text-muted">
                          {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <input
                          id={`comment-${post.id}`}
                          type="text"
                          maxLength={500}
                          placeholder="Write a comment"
                          value={commentInputs[post.id] || ''}
                          onChange={(event) => setCommentInputs((currentInputs) => ({
                            ...currentInputs,
                            [post.id]: event.target.value,
                          }))}
                          className="min-w-0 flex-1 rounded-full border border-line/70 bg-surface px-4 py-2 text-xs text-ink outline-none transition-colors placeholder:text-muted focus:border-accent/50"
                        />
                        <button
                          type="submit"
                          aria-label="Send comment"
                          disabled={!commentInputs[post.id]?.trim()}
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-accent transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </form>
                    </section>
                  )}
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

      {composerOpen && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/55 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setComposerOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-post-title"
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <h2 id="create-post-title" className="text-base font-semibold text-ink">Create a post</h2>
                <p className="mt-0.5 text-xs text-muted">Share an update with the KIET community.</p>
              </div>
              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                aria-label="Close post composer"
                className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface2 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <form onSubmit={handleCreatePost}>
              <div className="max-h-[65vh] space-y-4 overflow-y-auto p-5">
                {quotaStorageError && (
                  <p role="alert" className="text-sm text-bad">
                    We couldn’t verify your daily post limit. Please enable browser storage and try again.
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-surface2 text-xs font-semibold text-ink">
                    {student.avatarUrl ? (
                      <Image src={student.avatarUrl} alt="" width={40} height={40} className="h-full w-full object-cover" />
                    ) : (
                      student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{student.name}</p>
                    <p className="text-xs text-muted">KIET student</p>
                  </div>
                </div>

                <textarea
                  ref={postTextRef}
                  value={postText}
                  onChange={(event) => setPostText(event.target.value)}
                  placeholder="What would you like to share?"
                  rows={5}
                  maxLength={2000}
                  className="w-full resize-y border-0 bg-transparent p-0 text-[15px] leading-relaxed text-ink outline-none placeholder:text-muted focus:ring-0"
                  aria-label="Post text"
                />

                {imagePreview && (
                  <div className="relative overflow-hidden rounded-xl border border-line bg-surface2">
                    <img src={imagePreview} alt="Selected post preview" className="max-h-80 w-full object-contain" />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        if (imageInputRef.current) imageInputRef.current.value = '';
                      }}
                      aria-label="Remove selected image"
                      className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/70 text-white transition-colors hover:bg-black"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelection}
                  className="hidden"
                  aria-label="Choose an image"
                />
                {composerError && <p role="alert" className="text-sm text-bad">{composerError}</p>}
                <div className="flex items-center justify-between rounded-xl border border-line px-3 py-2.5">
                  <span className="text-sm font-medium text-ink">Add to your post</span>
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface2 hover:text-ink"
                  >
                    <ImagePlus className="h-4 w-4 text-accent" />
                    Photo
                  </button>
                </div>
                <p className="text-right text-xs text-muted">{postText.length}/2000 characters · 5 MB max image</p>
              </div>

              <footer className="flex items-center justify-between border-t border-line px-5 py-4">
                <span className="text-xs text-muted">
                  {quotaReady ? `${dailyQuota}/3 posts left today` : 'Checking daily post limit…'}
                </span>
                <button
                  type="submit"
                  disabled={
                    (!postText.trim() && !selectedImage) ||
                    !quotaReady ||
                    quotaStorageError ||
                    dailyQuota <= 0 ||
                    isPublishing
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-surface transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isPublishing ? 'Publishing…' : 'Share post'} <Send className="h-4 w-4" />
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
