'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  ExternalLink,
  FileCode,
  FileText,
  Filter,
  FolderGit2,
  Globe,
  GraduationCap,
  Image as ImageIcon,
  Info,
  Layers,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Upload,
  UserCheck,
  Users,
  Video,
  X,
} from 'lucide-react';
import { useStudent } from '@/components/store';
import { useToast } from '@/components/toast';
import { cn } from '@/lib/utils';

interface ProjectAttachment {
  title: string;
  githubUrl: string;
  liveUrl?: string;
  photoUrls: string[];
  astPlagScore: number;
  status: 'SUBMITTED' | 'APPROVED' | 'NEEDS_REVISION';
  teacherFeedback?: string;
  grade?: number;
}

interface ChatMessage {
  id: string;
  roomId: string;
  senderName: string;
  senderRoll?: string;
  senderAvatar: string;
  senderRole: 'student' | 'teacher';
  isCurrentUser?: boolean;
  text?: string;
  project?: ProjectAttachment;
  timestamp: string;
  reactions?: { emoji: string; count: number; reacted?: boolean }[];
}

interface ClassRoom {
  id: string;
  name: string;
  code: string;
  teacher: string;
  semester: string;
  section: string;
  activeAssignment: string;
  deadline: string;
  enrolledCount: number;
  verifiedCount: number;
  avatarBg: string;
}

const INITIAL_ROOMS: ClassRoom[] = [
  {
    id: 'room-1',
    name: 'Cloud Computing Lab - CSE 3A',
    code: 'KCS-601',
    teacher: 'Prof. V. Sharma',
    semester: 'Semester 6',
    section: 'Section 3A',
    activeAssignment: 'Mini Project 1: Dockerized REST API with Redis Queue',
    deadline: '28 Oct 2026',
    enrolledCount: 38,
    verifiedCount: 34,
    avatarBg: 'bg-[#0969da]',
  },
  {
    id: 'room-2',
    name: 'Distributed Systems Lab - CSE 3A',
    code: 'KCS-602',
    teacher: 'Dr. A. Verma',
    semester: 'Semester 6',
    section: 'Section 3A',
    activeAssignment: 'Raft Consensus Protocol Implementation in Go',
    deadline: '04 Nov 2026',
    enrolledCount: 38,
    verifiedCount: 18,
    avatarBg: 'bg-[#1a7f37]',
  },
  {
    id: 'room-3',
    name: 'Compiler Design Lab - CSE 3A',
    code: 'KCS-603',
    teacher: 'Prof. Neha Gupta',
    semester: 'Semester 6',
    section: 'Section 3A',
    activeAssignment: 'Lexical Analyzer & AST Generator with Flex/Bison',
    deadline: '10 Nov 2026',
    enrolledCount: 38,
    verifiedCount: 38,
    avatarBg: 'bg-[#8250df]',
  },
  {
    id: 'room-4',
    name: 'Full Stack Web Dev Lab - CSE 3A',
    code: 'KCS-604',
    teacher: 'Prof. S. K. Rastogi',
    semester: 'Semester 6',
    section: 'Section 3A',
    activeAssignment: 'Microservices Portfolio with Next.js & GraphQL',
    deadline: '15 Nov 2026',
    enrolledCount: 36,
    verifiedCount: 12,
    avatarBg: 'bg-[#cf222e]',
  },
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'room-1': [
    {
      id: 'm-1',
      roomId: 'room-1',
      senderName: 'Prof. V. Sharma',
      senderAvatar: 'VS',
      senderRole: 'teacher',
      text: 'Good morning everyone. Mini Project 1 submission channel is now open. Please drop your project cards with at least 1-4 screenshots and a public GitHub repo. Zero text chat policy: keep comments strictly related to code verification.',
      timestamp: 'Today at 09:30 AM',
      reactions: [{ emoji: '👍', count: 24, reacted: true }, { emoji: '🚀', count: 12 }],
    },
    {
      id: 'm-2',
      roomId: 'room-1',
      senderName: 'Rahul Sharma',
      senderRoll: '2100290120045',
      senderAvatar: 'RS',
      senderRole: 'student',
      text: 'Submitted my Distributed Task Queue implementation. Tested under 5,000 concurrent jobs using Redis BullMQ.',
      timestamp: 'Today at 10:45 AM',
      project: {
        title: 'Distributed Task Queue with Redis & BullMQ',
        githubUrl: 'https://github.com/rahul-sharma/distributed-task-queue',
        liveUrl: 'https://taskqueue-redis.render.com',
        photoUrls: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        ],
        astPlagScore: 4.2,
        status: 'APPROVED',
        teacherFeedback: 'Clean multi-stage Docker build. Redis cluster retry logic verified. Verified for placement docket.',
        grade: 9.5,
      },
      reactions: [{ emoji: '⭐', count: 8 }, { emoji: '🔥', count: 4 }],
    },
    {
      id: 'm-3',
      roomId: 'room-1',
      senderName: 'Priya Verma',
      senderRoll: '2100290120089',
      senderAvatar: 'PV',
      senderRole: 'student',
      text: 'Submitting RESTful Auth Microservice with JWT authentication and PostgreSQL DB connection pooling.',
      timestamp: 'Today at 11:30 AM',
      project: {
        title: 'RESTful Auth Microservice with JWT & PostgreSQL',
        githubUrl: 'https://github.com/priya-v/auth-microservice-pg',
        photoUrls: [
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        ],
        astPlagScore: 6.8,
        status: 'NEEDS_REVISION',
        teacherFeedback: 'Missing Dockerfile spec in repository root. Please add container config and re-upload.',
      },
      reactions: [{ emoji: '👀', count: 3 }],
    },
    {
      id: 'm-4',
      roomId: 'room-1',
      senderName: 'Arpit Prajapati',
      senderRoll: '2100290100045',
      senderAvatar: 'AP',
      senderRole: 'student',
      isCurrentUser: true,
      text: 'Sir, I have submitted the High-Throughput Log Aggregator pipeline deployed with Docker Swarm. AST plagiarism check completed.',
      timestamp: 'Today at 02:15 PM',
      project: {
        title: 'High-Throughput Log Aggregator & Docker Swarm Pipeline',
        githubUrl: 'https://github.com/arpit/log-aggregator-swarm',
        liveUrl: 'https://logs-pipeline.arpit.dev',
        photoUrls: [
          'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        ],
        astPlagScore: 2.1,
        status: 'APPROVED',
        teacherFeedback: 'Outstanding container orchestration benchmarks and stress testing results. Recommended for Dean innovation docket.',
        grade: 10.0,
      },
      reactions: [{ emoji: '🔥', count: 16, reacted: true }, { emoji: '⭐', count: 11 }],
    },
  ],
};

export default function ClassRoomChatPage() {
  const { student } = useStudent();
  const toast = useToast();

  // Rooms and Active Selection
  const [rooms, setRooms] = useState<ClassRoom[]>(INITIAL_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState<string>('room-1');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [searchRoom, setSearchRoom] = useState('');

  // Right sidebar toggle
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  // Mobile responsive tab state
  const [mobileTab, setMobileTab] = useState<'rooms' | 'chat' | 'dossier'>('chat');

  // Role toggle: Teacher mode vs Student mode
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');

  // Input state
  const [inputText, setInputText] = useState('');
  const [attachProjectOpen, setAttachProjectOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectGithub, setProjectGithub] = useState('');
  const [projectLive, setProjectLive] = useState('');
  const [projectPhotos, setProjectPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  ]);

  // Create Room Modal state (for teachers!)
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomCode, setNewRoomCode] = useState('');
  const [newRoomSection, setNewRoomSection] = useState('Section 3A');
  const [newRoomAssignment, setNewRoomAssignment] = useState('');
  const [newRoomDeadline, setNewRoomDeadline] = useState('15 Nov 2026');

  // Photo zoom modal
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Auto-scroll chat feed to bottom
  const chatBottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeRoomId]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];
  const roomMessages = messages[activeRoomId] || [];

  // Filtered rooms
  const filteredRooms = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(searchRoom.toLowerCase()) ||
      r.code.toLowerCase().includes(searchRoom.toLowerCase())
  );

  // Handle Send Project / Message in Chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachProjectOpen) return;

    if (attachProjectOpen) {
      if (!projectTitle.trim()) {
        toast('Please enter your project title', 'error');
        return;
      }
      if (!projectGithub.trim() || !projectGithub.includes('github.com')) {
        toast('Please enter a valid GitHub repository URL', 'error');
        return;
      }
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      roomId: activeRoomId,
      senderName: userRole === 'student' ? student.name : 'Prof. V. Sharma',
      senderRoll: userRole === 'student' ? student.rollNumber : undefined,
      senderAvatar: userRole === 'student' ? 'AP' : 'VS',
      senderRole: userRole,
      isCurrentUser: true,
      text: inputText.trim() || undefined,
      project: attachProjectOpen
        ? {
            title: projectTitle,
            githubUrl: projectGithub,
            liveUrl: projectLive.trim() || undefined,
            photoUrls: projectPhotos,
            astPlagScore: 2.8,
            status: 'SUBMITTED',
          }
        : undefined,
      timestamp: 'Just now',
      reactions: [{ emoji: '🚀', count: 1, reacted: true }],
    };

    setMessages((prev) => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] || []), newMsg],
    }));

    setInputText('');
    setAttachProjectOpen(false);
    setProjectTitle('');
    setProjectGithub('');
    setProjectLive('');
    toast(
      attachProjectOpen
        ? 'Project submitted to class chat room! Plagiarism check passed.'
        : 'Message sent to class room',
      'success'
    );
  };

  // Handle Teacher Review Action
  const handleTeacherReview = (msgId: string, status: 'APPROVED' | 'NEEDS_REVISION') => {
    const feedback =
      status === 'APPROVED'
        ? 'Approved during lab verification. AST verified.'
        : 'Missing Docker container spec or documentation. Please resubmit.';

    setMessages((prev) => ({
      ...prev,
      [activeRoomId]: (prev[activeRoomId] || []).map((m) =>
        m.id === msgId && m.project
          ? {
              ...m,
              project: {
                ...m.project,
                status,
                teacherFeedback: feedback,
                grade: status === 'APPROVED' ? 9.5 : undefined,
              },
            }
          : m
      ),
    }));

    toast(`Project ${status === 'APPROVED' ? 'approved' : 'marked for revision'}`, 'info');
  };

  // Handle Teacher Create Room
  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || !newRoomCode.trim()) {
      toast('Please enter room name and subject code', 'error');
      return;
    }

    const newRoom: ClassRoom = {
      id: `room-${Date.now()}`,
      name: `${newRoomName} - ${newRoomSection}`,
      code: newRoomCode.toUpperCase(),
      teacher: userRole === 'teacher' ? 'Prof. V. Sharma' : 'Faculty In-Charge',
      semester: 'Semester 6',
      section: newRoomSection,
      activeAssignment: newRoomAssignment || 'Lab Project 1',
      deadline: newRoomDeadline,
      enrolledCount: 38,
      verifiedCount: 0,
      avatarBg: 'bg-[#0969da]',
    };

    setRooms((prev) => [newRoom, ...prev]);
    setActiveRoomId(newRoom.id);
    setCreateRoomOpen(false);
    setNewRoomName('');
    setNewRoomCode('');
    setNewRoomAssignment('');

    // Welcome message in new room
    setMessages((prev) => ({
      ...prev,
      [newRoom.id]: [
        {
          id: `msg-${Date.now()}`,
          roomId: newRoom.id,
          senderName: newRoom.teacher,
          senderAvatar: 'TC',
          senderRole: 'teacher',
          text: `Welcome to ${newRoom.name}! The room is now active. Students can submit their project proofs directly here.`,
          timestamp: 'Just now',
          reactions: [{ emoji: '👋', count: 1 }],
        },
      ],
    }));

    toast(`Class room ${newRoom.name} created!`, 'success');
  };

  return (
    <div className="max-w-[1536px] mx-auto p-2 sm:p-4 lg:p-6 text-ink animate-fade-in">
      {/* Outer Floating Web App Window (Inspired by the chat reference layout) */}
      <div className="min-h-[calc(100vh-6rem)] rounded-2xl border border-line bg-surface shadow-sm overflow-hidden flex flex-col transition-all">
        {/* Top Control Bar: Room Info & Role Toggle */}
        <div className="px-4 py-2.5 border-b border-line bg-surface2/40 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1a7f37]" />
            <span className="font-bold text-ink">KIET Class Project Network</span>
            <span className="text-muted/60">•</span>
            <span className="text-muted">Strict Project Submission & Faculty Review Engine</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted font-medium hidden sm:inline">Role:</span>
            <button
              onClick={() => {
                const next = userRole === 'student' ? 'teacher' : 'student';
                setUserRole(next);
                toast(`Switched to ${next === 'teacher' ? 'Teacher / Faculty Mode' : 'Student Mode'}`, 'info');
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface hover:bg-surface2 px-2.5 py-1 text-xs font-semibold text-ink transition-all shadow-2xs"
            >
              <span>{userRole === 'student' ? '👨‍🎓 Student Mode (Arpit)' : '👨‍🏫 Teacher Mode (Prof. Sharma)'}</span>
              <span className="text-[10px] uppercase font-mono font-bold text-[#0969da] bg-[#ddf4ff] border border-[#54aeff]/40 px-1 rounded">
                Toggle
              </span>
            </button>
          </div>
        </div>

        {/* 3-Column Chat App Layout */}
        <div className="flex-1 flex overflow-hidden min-h-[720px]">
          {/* ========================================================= */}
          {/* COLUMN 1: Rooms / Channels Sidebar (~300px) */}
          {/* ========================================================= */}
          <aside
            className={cn(
              'w-full md:w-[280px] sm:md:w-[310px] shrink-0 border-r border-line bg-surface flex flex-col justify-between',
              mobileTab !== 'rooms' ? 'hidden md:flex' : 'flex'
            )}
          >
            <div>
              {/* Header: Rooms title + "+ Create Room" Button */}
              <div className="p-3.5 border-b border-line flex items-center justify-between gap-2">
                <div>
                  <h2 className="font-bold text-sm text-ink flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-[#0969da]" />
                    <span>Class Rooms</span>
                  </h2>
                  <p className="text-[11px] text-muted font-medium">Lab project submission feeds</p>
                </div>

                {/* Teacher "+ Create Room" button */}
                <button
                  onClick={() => setCreateRoomOpen(true)}
                  className="rounded-lg bg-[#0969da] hover:bg-[#0854b0] text-white px-2.5 py-1 text-xs font-bold transition-all shadow-2xs flex items-center gap-1 active:scale-95"
                  title="Teachers: Create a new classroom"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>New Room</span>
                </button>
              </div>

              {/* Search Rooms Input */}
              <div className="p-3 border-b border-line/60">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                  <input
                    type="text"
                    placeholder="Search labs, subject code..."
                    value={searchRoom}
                    onChange={(e) => setSearchRoom(e.target.value)}
                    className="w-full h-8 rounded-lg bg-surface2/70 border border-line/80 pl-8 pr-3 text-xs font-medium text-ink placeholder:text-muted outline-none focus:border-[#0969da] shadow-2xs"
                  />
                </div>
              </div>

              {/* Channels List */}
              <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-20rem)]">
                <div className="px-2 py-1 text-[10.5px] font-bold uppercase tracking-wider text-muted">
                  Active Rooms ({filteredRooms.length})
                </div>

                {filteredRooms.map((room) => {
                  const isActive = room.id === activeRoomId;
                  const roomMsgList = messages[room.id] || [];
                  const lastMsg = roomMsgList[roomMsgList.length - 1];

                  return (
                    <div
                      key={room.id}
                      onClick={() => {
                        setActiveRoomId(room.id);
                        setMobileTab('chat');
                      }}
                      className={cn(
                        'w-full p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5',
                        isActive
                          ? 'bg-[#ddf4ff]/50 border-[#0969da]/40 shadow-2xs'
                          : 'bg-surface hover:bg-surface2/60 border-transparent'
                      )}
                    >
                      <div className={cn('h-8 w-8 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs', room.avatarBg)}>
                        {room.code.slice(0, 3)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-bold text-xs text-ink truncate">{room.name}</p>
                          <span className="text-[10px] font-mono text-muted shrink-0">{room.code}</span>
                        </div>
                        <p className="text-[11px] text-muted truncate mt-0.5 font-medium">
                          {lastMsg ? `${lastMsg.senderName}: ${lastMsg.project ? `📦 ${lastMsg.project.title}` : lastMsg.text}` : room.activeAssignment}
                        </p>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-muted">
                          <span className="font-semibold text-[#1a7f37]">
                            {room.verifiedCount}/{room.enrolledCount} Verified
                          </span>
                          <span className="font-mono">Due {room.deadline}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Current User Card */}
            <div className="p-3 border-t border-line bg-surface2/30">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-[#0969da] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {userRole === 'student' ? 'AP' : 'VS'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-ink truncate">
                      {userRole === 'student' ? 'Arpit Prajapati' : 'Prof. V. Sharma'}
                    </p>
                    <p className="text-[10.5px] text-muted truncate font-mono">
                      {userRole === 'student' ? 'CSE-3A · 2100290100045' : 'Lab In-Charge · CSE Dept'}
                    </p>
                  </div>
                </div>

                <span className="h-2 w-2 rounded-full bg-[#1a7f37] shrink-0" title="Online" />
              </div>
            </div>
          </aside>

          {/* ========================================================= */}
          {/* COLUMN 2: Main Interactive Chat Room Canvas */}
          {/* ========================================================= */}
          <main
            className={cn(
              'flex-1 flex flex-col justify-between overflow-hidden bg-bg/40',
              mobileTab !== 'chat' ? 'hidden md:flex' : 'flex'
            )}
          >
            {/* Room Header */}
            <header className="p-3 sm:p-4 border-b border-line bg-surface flex items-center justify-between gap-2.5 sm:gap-3 shadow-2xs">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {/* Mobile Back Button to Rooms */}
                <button
                  type="button"
                  onClick={() => setMobileTab('rooms')}
                  className="md:hidden p-1.5 rounded-md border border-line bg-surface hover:bg-surface2 text-xs font-semibold text-ink flex items-center gap-1 shrink-0"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span className="text-[11px]">Rooms</span>
                </button>

                <div className={cn('h-9 w-9 sm:h-10 sm:w-10 rounded-xl text-white flex items-center justify-center font-extrabold text-xs sm:text-sm shadow-2xs shrink-0', activeRoom.avatarBg)}>
                  {activeRoom.code.slice(0, 3)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <h1 className="font-bold text-xs sm:text-base text-ink tracking-tight truncate">
                      {activeRoom.name}
                    </h1>
                    <span className="rounded-md bg-surface2 border border-line px-1.5 py-0.2 text-[10px] font-mono font-bold text-muted shrink-0">
                      {activeRoom.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs text-muted mt-0.5 truncate">
                    <span className="truncate">Teacher: <strong className="text-ink font-semibold">{activeRoom.teacher}</strong></span>
                    <span className="opacity-40 hidden sm:inline">•</span>
                    <span className="hidden sm:inline">{activeRoom.enrolledCount} Students Enrolled</span>
                  </div>
                </div>
              </div>

              {/* Actions on Header */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Mobile Dossier Toggle */}
                <button
                  type="button"
                  onClick={() => setMobileTab(mobileTab === 'dossier' ? 'chat' : 'dossier')}
                  className="xl:hidden p-1.5 rounded-lg border border-line bg-surface hover:bg-surface2 text-xs font-semibold text-ink"
                  title="Room Dossier"
                >
                  <Info className="h-4 w-4 text-[#0969da]" />
                </button>

                {/* Desktop Dossier Toggle */}
                <button
                  onClick={() => setShowRightSidebar(!showRightSidebar)}
                  className={cn(
                    'hidden xl:inline-flex h-8 px-2.5 rounded-lg border border-line text-xs font-semibold items-center gap-1.5 transition-all shadow-2xs',
                    showRightSidebar ? 'bg-[#ddf4ff] text-[#0969da] border-[#0969da]/40' : 'bg-surface hover:bg-surface2 text-muted hover:text-ink'
                  )}
                >
                  <Info className="h-3.5 w-3.5" />
                  <span>Room Dossier</span>
                </button>
              </div>
            </header>

            {/* Active Assignment Notice Banner */}
            <div className="p-3 sm:p-3.5 bg-surface border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="rounded-full bg-[#ddf4ff] text-[#0969da] border border-[#54aeff]/40 px-2 py-0.5 font-bold font-mono text-[10px] shrink-0">
                  Active Task
                </span>
                <span className="font-semibold text-ink truncate">
                  {activeRoom.activeAssignment}
                </span>
                <span className="text-muted shrink-0 hidden md:inline">
                  (Deadline: {activeRoom.deadline})
                </span>
              </div>

              <button
                onClick={() => setAttachProjectOpen(true)}
                className="rounded-lg bg-[#0969da] hover:bg-[#0854b0] text-white px-3 py-1 text-xs font-bold transition-all shadow-2xs active:scale-95 flex items-center gap-1.5 self-start sm:self-auto shrink-0"
              >
                <FolderGit2 className="h-3.5 w-3.5" />
                <span>Submit My Project Here</span>
              </button>
            </div>

            {/* Chat Stream (Messages + Rich Project Cards) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {roomMessages.map((msg) => {
                const isApproved = msg.project?.status === 'APPROVED';
                const isNeedsRevision = msg.project?.status === 'NEEDS_REVISION';

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex gap-3 items-start transition-all',
                      msg.isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        'h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ring-2 ring-surface',
                        msg.senderRole === 'teacher'
                          ? 'bg-[#1a7f37] text-white'
                          : msg.isCurrentUser
                          ? 'bg-[#0969da] text-white'
                          : 'bg-surface2 border border-line text-ink'
                      )}
                    >
                      {msg.senderAvatar}
                    </div>

                    {/* Chat Bubble / Project Card Container */}
                    <div className={cn('max-w-[92%] sm:max-w-[580px] space-y-1.5')}>
                      {/* Sender Meta */}
                      <div
                        className={cn(
                          'flex items-center gap-2 text-xs',
                          msg.isCurrentUser ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <span className="font-bold text-ink">{msg.senderName}</span>
                        {msg.senderRole === 'teacher' && (
                          <span className="text-[10px] font-bold text-[#1a7f37] bg-[#dafbe1] border border-[#4ac26b]/40 px-1.5 py-0.2 rounded">
                            Teacher
                          </span>
                        )}
                        {msg.isCurrentUser && (
                          <span className="text-[10px] font-bold text-[#0969da] bg-[#ddf4ff] border border-[#54aeff]/40 px-1.5 py-0.2 rounded">
                            You
                          </span>
                        )}
                        <span className="text-[11px] text-muted">{msg.timestamp}</span>
                      </div>

                      {/* Optional Chat Text Comment */}
                      {msg.text && (
                        <div
                          className={cn(
                            'p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-2xs',
                            msg.isCurrentUser
                              ? 'bg-[#0969da] text-white rounded-tr-xs'
                              : 'bg-surface border border-line text-ink rounded-tl-xs'
                          )}
                        >
                          {msg.text}
                        </div>
                      )}

                      {/* Rich Project Submission Card (When student submits project proof!) */}
                      {msg.project && (
                        <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-xs space-y-3.5">
                          {/* Card Header: Title & Verification Status */}
                          <div className="flex items-start justify-between gap-2.5 pb-2.5 border-b border-line/60">
                            <div>
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted block">
                                Project Proof Submission
                              </span>
                              <h3 className="font-extrabold text-sm sm:text-base text-ink tracking-tight mt-0.5">
                                {msg.project.title}
                              </h3>
                            </div>

                            {/* Status Badge */}
                            <div className="shrink-0">
                              {isApproved && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#dafbe1] px-2.5 py-0.5 text-xs font-bold text-[#1a7f37] border border-[#4ac26b]/40">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>Approved {msg.project.grade ? `(${msg.project.grade}/10)` : ''}</span>
                                </span>
                              )}
                              {isNeedsRevision && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#fff8c5] px-2.5 py-0.5 text-xs font-bold text-[#9a6700] border border-[#d4a72c]/40">
                                  <RefreshCw className="h-3 w-3" />
                                  <span>Needs Revision</span>
                                </span>
                              )}
                              {msg.project.status === 'SUBMITTED' && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#ddf4ff] px-2.5 py-0.5 text-xs font-bold text-[#0969da] border border-[#54aeff]/40">
                                  <Clock className="h-3 w-3" />
                                  <span>Awaiting Review</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Screenshots Preview Gallery */}
                          {msg.project.photoUrls.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                              {msg.project.photoUrls.map((url, i) => (
                                <div
                                  key={i}
                                  onClick={() => setSelectedPhoto(url)}
                                  className="group relative h-28 sm:h-32 rounded-xl overflow-hidden border border-line bg-surface2 cursor-pointer shadow-2xs"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={url}
                                    alt="Screenshot proof"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    <span>Expand</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Links: GitHub & Live Demo & AST */}
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <a
                              href={msg.project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface2/60 hover:bg-surface2 px-2.5 py-1 font-semibold text-ink transition-all shadow-2xs"
                            >
                              <Code2 className="h-3.5 w-3.5 text-[#0969da]" />
                              <span className="font-mono text-[11px] truncate max-w-[200px]">
                                {msg.project.githubUrl.replace('https://github.com/', '')}
                              </span>
                              <ArrowUpRight className="h-3 w-3 text-muted" />
                            </a>

                            {msg.project.liveUrl && (
                              <a
                                href={msg.project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface2/60 hover:bg-surface2 px-2.5 py-1 font-semibold text-ink transition-all shadow-2xs"
                              >
                                <Globe className="h-3.5 w-3.5 text-[#1a7f37]" />
                                <span className="font-mono text-[11px]">Live Demo</span>
                                <ArrowUpRight className="h-3 w-3 text-muted" />
                              </a>
                            )}

                            <span className="inline-flex items-center gap-1 rounded-md bg-surface2 px-2 py-0.5 text-[10.5px] font-mono text-muted border border-line">
                              AST: {msg.project.astPlagScore}% Similarity
                            </span>
                          </div>

                          {/* Teacher Feedback Box */}
                          {msg.project.teacherFeedback && (
                            <div className="rounded-lg bg-surface2/60 border border-line p-3 space-y-1">
                              <span className="text-[11px] font-bold text-ink flex items-center gap-1.5">
                                <Award className="h-3.5 w-3.5 text-[#1a7f37]" />
                                <span>Teacher Feedback & Marks:</span>
                              </span>
                              <p className="text-xs text-muted italic">
                                &ldquo;{msg.project.teacherFeedback}&rdquo;
                              </p>
                            </div>
                          )}

                          {/* Teacher Review Buttons (Visible when viewing in Teacher Mode) */}
                          {userRole === 'teacher' && msg.project.status !== 'APPROVED' && (
                            <div className="pt-2 border-t border-line/60 flex items-center gap-2">
                              <button
                                onClick={() => handleTeacherReview(msg.id, 'APPROVED')}
                                className="px-3 py-1 rounded-lg bg-[#1f883d] hover:bg-[#1a7f37] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1 active:scale-95"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>Approve (Grade: 9.5)</span>
                              </button>
                              <button
                                onClick={() => handleTeacherReview(msg.id, 'NEEDS_REVISION')}
                                className="px-3 py-1 rounded-lg bg-[#fff8c5] hover:bg-[#fae78b] text-[#9a6700] border border-[#d4a72c]/40 text-xs font-bold transition-all shadow-2xs flex items-center gap-1 active:scale-95"
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                                <span>Request Revision</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Emoji Reactions Bar */}
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div
                          className={cn(
                            'flex items-center gap-1.5 pt-0.5',
                            msg.isCurrentUser ? 'justify-end' : 'justify-start'
                          )}
                        >
                          {msg.reactions.map((r, ri) => (
                            <span
                              key={ri}
                              className={cn(
                                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border shadow-2xs',
                                r.reacted
                                  ? 'bg-[#ddf4ff] border-[#0969da]/40 text-[#0969da]'
                                  : 'bg-surface border-line text-muted'
                              )}
                            >
                              <span>{r.emoji}</span>
                              <span className="text-[11px] font-mono">{r.count}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* ========================================================= */}
            {/* Interactive Bottom Chat Input & Project Drop Area */}
            {/* ========================================================= */}
            <div className="p-3 sm:p-4 border-t border-line bg-surface">
              {/* Expandable Project Proof Drawer */}
              {attachProjectOpen && (
                <div className="mb-3 p-4 rounded-xl border border-[#0969da]/40 bg-[#ddf4ff]/20 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-line/60">
                    <span className="font-bold text-xs text-ink flex items-center gap-1.5">
                      <FolderGit2 className="h-4 w-4 text-[#0969da]" />
                      <span>Attach Project Proof to Message</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setAttachProjectOpen(false)}
                      className="text-muted hover:text-ink text-xs p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-ink block mb-1">
                        Project Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Distributed Task Queue with Redis"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        className="w-full h-8 rounded-lg bg-surface border border-line px-2.5 text-xs text-ink placeholder:text-muted outline-none focus:border-[#0969da]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-ink block mb-1">
                        GitHub Repository URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/username/repo"
                        value={projectGithub}
                        onChange={(e) => setProjectGithub(e.target.value)}
                        className="w-full h-8 rounded-lg bg-surface border border-line px-2.5 text-xs font-mono text-ink placeholder:text-muted outline-none focus:border-[#0969da]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-ink block mb-1">
                      Live Hosted Demo URL <span className="text-muted font-normal">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://my-project.render.com"
                      value={projectLive}
                      onChange={(e) => setProjectLive(e.target.value)}
                      className="w-full h-8 rounded-lg bg-surface border border-line px-2.5 text-xs font-mono text-ink placeholder:text-muted outline-none focus:border-[#0969da]"
                    />
                  </div>

                  {/* Screenshots preview */}
                  <div>
                    <span className="text-[11px] font-bold text-ink block mb-1">
                      Attached Screenshots (2 pre-loaded from repository build):
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {projectPhotos.map((p, idx) => (
                        <div key={idx} className="relative h-14 rounded-lg overflow-hidden border border-line bg-surface2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p} alt="proof" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Form Bar */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {/* Toggle Attach Project Button */}
                <button
                  type="button"
                  onClick={() => setAttachProjectOpen(!attachProjectOpen)}
                  className={cn(
                    'h-10 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs shrink-0',
                    attachProjectOpen
                      ? 'bg-[#0969da] text-white border-[#0969da]'
                      : 'bg-surface2 hover:bg-surface border-line text-ink'
                  )}
                  title="Attach Project Proof Card"
                >
                  <FolderGit2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Attach Project</span>
                </button>

                {/* Text Message Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={
                      attachProjectOpen
                        ? 'Add comments to your project submission...'
                        : 'Write message or question to class room...'
                    }
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full h-10 rounded-xl bg-surface2 border border-line px-3.5 text-xs text-ink placeholder:text-muted outline-none focus:border-[#0969da] shadow-2xs transition-colors"
                  />
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  className="h-10 px-4 rounded-xl bg-[#0969da] hover:bg-[#0854b0] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 active:scale-95 shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </div>
          </main>

          {/* ========================================================= */}
          {/* COLUMN 3: Right Sidebar (Room Dossier & Lab Specs) */}
          {/* ========================================================= */}
          {(showRightSidebar || mobileTab === 'dossier') && (
            <aside
              className={cn(
                'w-full xl:w-[310px] shrink-0 border-l border-line bg-surface flex flex-col justify-between overflow-y-auto animate-fade-in',
                mobileTab === 'dossier' ? 'flex' : 'hidden xl:flex'
              )}
            >
              <div className="p-4 space-y-5">
                {/* Dossier Header */}
                <div className="flex items-center justify-between pb-3 border-b border-line/60">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMobileTab('chat')}
                      className="xl:hidden p-1 rounded-md border border-line text-xs font-semibold text-ink flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Chat</span>
                    </button>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-muted">
                      Room Dossier
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowRightSidebar(false);
                      setMobileTab('chat');
                    }}
                    className="text-muted hover:text-ink text-xs p-1 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Room Specs */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-muted text-[11px] block">Subject & Section</span>
                    <strong className="text-ink font-bold">{activeRoom.name}</strong>
                  </div>
                  <div>
                    <span className="text-muted text-[11px] block">Subject Code</span>
                    <strong className="text-ink font-mono">{activeRoom.code}</strong>
                  </div>
                  <div>
                    <span className="text-muted text-[11px] block">Teacher In-Charge</span>
                    <strong className="text-ink">{activeRoom.teacher}</strong>
                  </div>
                </div>

                {/* Progress Card */}
                <div className="rounded-xl border border-line bg-surface2/40 p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink">Verification Index</span>
                    <span className="font-mono font-bold text-[#1a7f37]">
                      {activeRoom.verifiedCount}/{activeRoom.enrolledCount}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface2 border border-line">
                    <div
                      className="h-full rounded-full bg-[#1a7f37]"
                      style={{ width: `${(activeRoom.verifiedCount / activeRoom.enrolledCount) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10.5px] text-muted">
                    All marksheets and project hashes verified by KIET TPO AST audit.
                  </p>
                </div>

                {/* Enrolled Students Quick List */}
                <div>
                  <span className="text-xs font-bold text-ink block mb-2">
                    Enrolled Students ({activeRoom.enrolledCount})
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { name: 'Arpit Prajapati', roll: '2100290100045', verified: true },
                      { name: 'Rahul Sharma', roll: '2100290120045', verified: true },
                      { name: 'Priya Verma', roll: '2100290120089', verified: false },
                      { name: 'Devansh Saxena', roll: '2100290120038', verified: true },
                    ].map((s, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 rounded-lg hover:bg-surface2 flex items-center justify-between transition-colors"
                      >
                        <div className="truncate">
                          <p className="font-semibold text-ink truncate text-[11.5px]">{s.name}</p>
                          <p className="text-[10px] font-mono text-muted">{s.roll}</p>
                        </div>
                        {s.verified ? (
                          <span className="text-[10px] font-bold text-[#1a7f37] bg-[#dafbe1] px-1.5 py-0.2 rounded border border-[#4ac26b]/40">
                            Verified
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#9a6700] bg-[#fff8c5] px-1.5 py-0.2 rounded border border-[#d4a72c]/40">
                            Pending
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lab Files */}
                <div className="pt-2 border-t border-line/60">
                  <span className="text-xs font-bold text-ink block mb-2">
                    Lab Manuals & Resources
                  </span>
                  <div className="space-y-1 text-xs">
                    <button
                      onClick={() => toast('Lab Manual downloaded', 'success')}
                      className="w-full p-2 rounded-lg hover:bg-surface2 text-left flex items-center justify-between text-ink transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="h-3.5 w-3.5 text-[#0969da]" />
                        <span className="truncate font-medium text-[11.5px]">Lab Manual Spec.pdf</span>
                      </div>
                      <span className="text-[10px] font-mono text-muted">4.2 MB</span>
                    </button>

                    <button
                      onClick={() => toast('Opening Docker Swarm Spec', 'info')}
                      className="w-full p-2 rounded-lg hover:bg-surface2 text-left flex items-center justify-between text-ink transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCode className="h-3.5 w-3.5 text-[#cf222e]" />
                        <span className="truncate font-medium text-[11.5px]">Docker Spec.yml</span>
                      </div>
                      <span className="text-[10px] font-mono text-muted">12 KB</span>
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: Teachers Create Classroom Modal */}
      {/* ========================================================= */}
      {createRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xl space-y-4 animate-scale-up text-ink">
            <div className="flex items-start justify-between border-b border-line pb-3">
              <div>
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#0969da] block">
                  Teacher Action
                </span>
                <h3 className="font-extrabold text-base text-ink tracking-tight mt-0.5">
                  Create New Class Project Room
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Setup a submission chat room for your students.
                </p>
              </div>
              <button
                onClick={() => setCreateRoomOpen(false)}
                className="text-muted hover:text-ink transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  Class / Lab Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems Lab"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full h-9 rounded-lg bg-surface2 border border-line px-3 text-xs text-ink placeholder:text-muted outline-none focus:border-[#0969da]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">
                    Subject Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KCS-602"
                    value={newRoomCode}
                    onChange={(e) => setNewRoomCode(e.target.value)}
                    className="w-full h-9 rounded-lg bg-surface2 border border-line px-3 text-xs font-mono uppercase text-ink placeholder:text-muted outline-none focus:border-[#0969da]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">
                    Section
                  </label>
                  <select
                    value={newRoomSection}
                    onChange={(e) => setNewRoomSection(e.target.value)}
                    className="w-full h-9 rounded-lg bg-surface2 border border-line px-3 text-xs text-ink outline-none focus:border-[#0969da]"
                  >
                    <option value="Section 3A">Section 3A</option>
                    <option value="Section 3B">Section 3B</option>
                    <option value="Section 3C">Section 3C</option>
                    <option value="Section 4A">Section 4A</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  Active Lab Project / Task Brief
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mini Project 1: Dockerized REST API with Redis"
                  value={newRoomAssignment}
                  onChange={(e) => setNewRoomAssignment(e.target.value)}
                  className="w-full h-9 rounded-lg bg-surface2 border border-line px-3 text-xs text-ink placeholder:text-muted outline-none focus:border-[#0969da]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  Submission Deadline
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15 Nov 2026"
                  value={newRoomDeadline}
                  onChange={(e) => setNewRoomDeadline(e.target.value)}
                  className="w-full h-9 rounded-lg bg-surface2 border border-line px-3 text-xs text-ink placeholder:text-muted outline-none focus:border-[#0969da]"
                />
              </div>

              <div className="pt-2 border-t border-line flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateRoomOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-line text-xs font-bold text-muted hover:text-ink transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0969da] hover:bg-[#0854b0] text-white text-xs font-bold transition-all shadow-2xs active:scale-95 flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create Class Room</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Lightbox Screenshot Zoom Modal */}
      {/* ========================================================= */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs cursor-zoom-out animate-fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPhoto}
              alt="Expanded proof"
              className="w-full h-full object-contain max-h-[85vh]"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
