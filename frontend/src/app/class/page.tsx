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
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileCode,
  FileText,
  Filter,
  Flame,
  FolderGit2,
  GraduationCap,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Send,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Timer,
  TrendingUp,
  Upload,
  UserCheck,
  UserMinus,
  Users,
  Video,
  X,
} from 'lucide-react';
import { useStudent } from '@/components/store';
import { useToast } from '@/components/toast';
import { cn } from '@/lib/utils';

// Types
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
  classId: string;
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

interface ClassNote {
  id: string;
  title: string;
  unit: string;
  fileType: 'pdf' | 'slides' | 'code';
  fileSize: string;
  author: string;
  date: string;
  downloadUrl?: string;
}

interface ClassTest {
  id: string;
  title: string;
  unit: string;
  date: string;
  time: string;
  duration: string;
  maxMarks: number;
  studentScore?: number;
  status: 'upcoming' | 'completed' | 'in_progress';
  topics: string[];
}

interface ClassStudent {
  id: string;
  name: string;
  roll: string;
  avatar: string;
  isActiveNow: boolean;
  attendance: 'present' | 'absent' | 'late';
  lastSeen: string;
  submittedToday?: {
    title: string;
    time: string;
    status: 'APPROVED' | 'SUBMITTED' | 'NEEDS_REVISION';
  };
}

interface SemClass {
  id: string;
  code: string;
  shortName: string;
  fullName: string;
  teacher: string;
  semester: string;
  section: string;
  timing: string;
  labRoom: string;
  totalStudents: number;
  activeToday: number;
  todayTopic: string;
  accentBg: string;
  accentColor: string;
  notesCount: number;
  upcomingTestsCount: number;
  notes: ClassNote[];
  tests: ClassTest[];
  students: ClassStudent[];
}

// Initial Semester Classes Data
const INITIAL_SEM_CLASSES: SemClass[] = [
  {
    id: 'web-d',
    shortName: 'Web D',
    code: 'KCS-604',
    fullName: 'Full Stack Web Development & Microservices Lab',
    teacher: 'Prof. S. K. Rastogi',
    semester: 'Semester 6',
    section: 'Section 3A',
    timing: 'Mon, Wed • 10:00 AM - 11:40 AM',
    labRoom: 'Lab 4, Computing Complex',
    totalStudents: 64,
    activeToday: 58,
    todayTopic: 'Next.js 14 App Router, Server Actions & AST Plagiarism Verification',
    accentBg: 'bg-[#ddf4ff]',
    accentColor: 'text-[#0969da]',
    notesCount: 12,
    upcomingTestsCount: 2,
    notes: [
      {
        id: 'wn-1',
        title: 'Unit 1: Modern DOM, TypeScript Generics & Async Queues',
        unit: 'Unit 1',
        fileType: 'pdf',
        fileSize: '3.8 MB',
        author: 'Prof. S. K. Rastogi',
        date: '20 Oct 2026',
      },
      {
        id: 'wn-2',
        title: 'Unit 2: Next.js App Router, SSR vs ISR & Server Actions',
        unit: 'Unit 2',
        fileType: 'pdf',
        fileSize: '5.2 MB',
        author: 'Prof. S. K. Rastogi',
        date: '24 Oct 2026',
      },
      {
        id: 'wn-3',
        title: 'Unit 3: Microservices Communication & Redis BullMQ Queue Handlers',
        unit: 'Unit 3',
        fileType: 'slides',
        fileSize: '8.4 MB',
        author: 'Faculty Team',
        date: '28 Oct 2026',
      },
      {
        id: 'wn-4',
        title: 'Docker Orchestration & Docker-Compose Production Configs',
        unit: 'Unit 4',
        fileType: 'code',
        fileSize: '1.2 MB',
        author: 'DevOps Lab Mentor',
        date: 'Yesterday',
      },
    ],
    tests: [
      {
        id: 'wt-1',
        title: 'Unit Test 2: Full-Stack Architecture & State Machines',
        unit: 'Unit 2 & 3',
        date: '06 Nov 2026',
        time: '11:00 AM - 12:00 PM',
        duration: '60 Mins',
        maxMarks: 25,
        status: 'upcoming',
        topics: ['Next.js SSR', 'Database Indexing', 'JWT Authentication', 'Redis Caching'],
      },
      {
        id: 'wt-2',
        title: 'Continuous Evaluation Quiz 1: TypeScript & REST API Contracts',
        unit: 'Unit 1',
        date: '22 Oct 2026',
        time: '10:15 AM',
        duration: '30 Mins',
        maxMarks: 20,
        studentScore: 19,
        status: 'completed',
        topics: ['Generics', 'Type Narrowing', 'HTTP 200/201/409 codes'],
      },
      {
        id: 'wt-3',
        title: 'Mid-Sem Practical Lab Viva & AST Code Verification',
        unit: 'Comprehensive',
        date: '14 Nov 2026',
        time: '09:30 AM',
        duration: '90 Mins',
        maxMarks: 50,
        status: 'upcoming',
        topics: ['Live Git clone', 'Docker run', 'AST plagiarism verification'],
      },
    ],
    students: [
      {
        id: 'st-1',
        name: 'Arpit Prajapati',
        roll: '2100290100045',
        avatar: 'AP',
        isActiveNow: true,
        attendance: 'present',
        lastSeen: 'Active Now',
        submittedToday: {
          title: 'Distributed Log Aggregator with BullMQ',
          time: '10:14 AM',
          status: 'APPROVED',
        },
      },
      {
        id: 'st-2',
        name: 'Rahul Sharma',
        roll: '2100290120045',
        avatar: 'RS',
        isActiveNow: true,
        attendance: 'present',
        lastSeen: 'Active Now',
        submittedToday: {
          title: 'Distributed Task Queue with Redis',
          time: '10:45 AM',
          status: 'APPROVED',
        },
      },
      {
        id: 'st-3',
        name: 'Priya Verma',
        roll: '2100290120089',
        avatar: 'PV',
        isActiveNow: true,
        attendance: 'present',
        lastSeen: 'Active Now',
        submittedToday: {
          title: 'RESTful Auth Microservice with PostgreSQL',
          time: '11:30 AM',
          status: 'NEEDS_REVISION',
        },
      },
      {
        id: 'st-4',
        name: 'Devansh Saxena',
        roll: '2100290120038',
        avatar: 'DS',
        isActiveNow: false,
        attendance: 'late',
        lastSeen: '12m ago',
      },
      {
        id: 'st-5',
        name: 'Ananya Mishra',
        roll: '2100290120021',
        avatar: 'AM',
        isActiveNow: true,
        attendance: 'present',
        lastSeen: 'Active Now',
      },
      {
        id: 'st-6',
        name: 'Kunal Singh',
        roll: '2100290120067',
        avatar: 'KS',
        isActiveNow: false,
        attendance: 'absent',
        lastSeen: 'Offline (Last seen yesterday)',
      },
    ],
  },
  {
    id: 'dsa',
    shortName: 'DSA',
    code: 'KCS-401',
    fullName: 'Data Structures, Advanced Algorithms & Problem Solving',
    teacher: 'Prof. Neha Gupta',
    semester: 'Semester 6',
    section: 'Section 3A',
    timing: 'Tue, Thu • 09:00 AM - 10:40 AM',
    labRoom: 'Lab 2, Algorithm Wing',
    totalStudents: 64,
    activeToday: 61,
    todayTopic: 'Segment Trees, Range Queries & Trie Implementations for Autocomplete',
    accentBg: 'bg-[#dafbe1]',
    accentColor: 'text-[#1a7f37]',
    notesCount: 16,
    upcomingTestsCount: 1,
    notes: [
      {
        id: 'dn-1',
        title: 'Unit 1: Asymptotic Analysis, Master Theorem & Recurrences',
        unit: 'Unit 1',
        fileType: 'pdf',
        fileSize: '4.1 MB',
        author: 'Prof. Neha Gupta',
        date: '18 Oct 2026',
      },
      {
        id: 'dn-2',
        title: 'Unit 2: Graph Algorithms (Dijkstra, Bellman-Ford, Tarjan SCC)',
        unit: 'Unit 2',
        fileType: 'pdf',
        fileSize: '6.7 MB',
        author: 'Prof. Neha Gupta',
        date: '23 Oct 2026',
      },
      {
        id: 'dn-3',
        title: 'Unit 3: Dynamic Programming on Trees & Digit DP Problem Set',
        unit: 'Unit 3',
        fileType: 'pdf',
        fileSize: '5.5 MB',
        author: 'Faculty Mentors',
        date: '29 Oct 2026',
      },
    ],
    tests: [
      {
        id: 'dt-1',
        title: 'LeetCode Style Speed Contest 3: DP & Graphs',
        unit: 'Unit 2 & 3',
        date: '08 Nov 2026',
        time: '04:00 PM - 05:30 PM',
        duration: '90 Mins',
        maxMarks: 100,
        status: 'upcoming',
        topics: ['Disjoint Set Union', 'Shortest Paths', '0/1 Knapsack variations'],
      },
      {
        id: 'dt-2',
        title: 'DSA Unit Test 1: Trees & Balanced BST (AVL/Red-Black)',
        unit: 'Unit 1',
        date: '15 Oct 2026',
        time: '09:30 AM',
        duration: '45 Mins',
        maxMarks: 25,
        studentScore: 24,
        status: 'completed',
        topics: ['Tree Traversals', 'AVL Rotations', 'Lowest Common Ancestor'],
      },
    ],
    students: [
      {
        id: 'st-d1',
        name: 'Arpit Prajapati',
        roll: '2100290100045',
        avatar: 'AP',
        isActiveNow: true,
        attendance: 'present',
        lastSeen: 'Active Now',
      },
      {
        id: 'st-d2',
        name: 'Pooja Agarwal',
        roll: '2100290120078',
        avatar: 'PA',
        isActiveNow: true,
        attendance: 'present',
        lastSeen: 'Active Now',
      },
      {
        id: 'st-d3',
        name: 'Tanmay Bhatt',
        roll: '2100290120112',
        avatar: 'TB',
        isActiveNow: false,
        attendance: 'absent',
        lastSeen: 'Offline',
      },
    ],
  },
  {
    id: 'os',
    shortName: 'Operating Systems',
    code: 'KCS-402',
    fullName: 'Operating Systems Kernel Design & Concurrency Lab',
    teacher: 'Dr. A. Verma',
    semester: 'Semester 6',
    section: 'Section 3A',
    timing: 'Wed, Fri • 02:00 PM - 03:40 PM',
    labRoom: 'Linux Systems Lab 1',
    totalStudents: 64,
    activeToday: 55,
    todayTopic: 'Raft Consensus Protocol, POSIX Mutexes & Kernel Memory Management',
    accentBg: 'bg-[#fff8c5]',
    accentColor: 'text-[#9a6700]',
    notesCount: 10,
    upcomingTestsCount: 1,
    notes: [
      {
        id: 'on-1',
        title: 'Unit 1: Process Scheduling Algorithms & Linux CFS Mechanics',
        unit: 'Unit 1',
        fileType: 'pdf',
        fileSize: '3.2 MB',
        author: 'Dr. A. Verma',
        date: '16 Oct 2026',
      },
      {
        id: 'on-2',
        title: 'Unit 2: Inter-Process Communication, Semaphores & Deadlock Detection',
        unit: 'Unit 2',
        fileType: 'pdf',
        fileSize: '4.8 MB',
        author: 'Dr. A. Verma',
        date: '25 Oct 2026',
      },
    ],
    tests: [
      {
        id: 'ot-1',
        title: 'Operating Systems Unit Test 2: Virtual Memory & Page Replacement',
        unit: 'Unit 3',
        date: '12 Nov 2026',
        time: '02:00 PM',
        duration: '60 Mins',
        maxMarks: 30,
        status: 'upcoming',
        topics: ['Paging', 'TLB Miss Handling', 'LRU Approximation'],
      },
    ],
    students: [
      {
        id: 'st-o1',
        name: 'Arpit Prajapati',
        roll: '2100290100045',
        avatar: 'AP',
        isActiveNow: true,
        attendance: 'present',
        lastSeen: 'Active Now',
      },
      {
        id: 'st-o2',
        name: 'Shreya Saxena',
        roll: '2100290120101',
        avatar: 'SS',
        isActiveNow: true,
        attendance: 'present',
        lastSeen: 'Active Now',
      },
    ],
  },
  {
    id: 'dbms',
    shortName: 'DBMS',
    code: 'KCS-501',
    fullName: 'Database Management Systems & Distributed Storage',
    teacher: 'Prof. Manish Pant',
    semester: 'Semester 6',
    section: 'Section 3A',
    timing: 'Thu • 11:45 AM - 01:15 PM',
    labRoom: 'Database Lab 3',
    totalStudents: 64,
    activeToday: 60,
    todayTopic: 'B-Tree Indexing, Query Optimizer Cost Estimations & ACID in Sharded DBs',
    accentBg: 'bg-[#fbefff]',
    accentColor: 'text-[#8250df]',
    notesCount: 8,
    upcomingTestsCount: 2,
    notes: [
      {
        id: 'dbn-1',
        title: 'Unit 1: Relational Algebra & Advanced SQL Query Optimization',
        unit: 'Unit 1',
        fileType: 'pdf',
        fileSize: '4.4 MB',
        author: 'Prof. Manish Pant',
        date: '12 Oct 2026',
      },
      {
        id: 'dbn-2',
        title: 'Unit 2: Normalization (1NF to BCNF) & Dependency Preservation',
        unit: 'Unit 2',
        fileType: 'pdf',
        fileSize: '3.9 MB',
        author: 'Prof. Manish Pant',
        date: '21 Oct 2026',
      },
    ],
    tests: [
      {
        id: 'dbt-1',
        title: 'Database Unit Test 2: Transactions & Two-Phase Locking (2PL)',
        unit: 'Unit 3',
        date: '10 Nov 2026',
        time: '11:45 AM',
        duration: '50 Mins',
        maxMarks: 25,
        status: 'upcoming',
        topics: ['Serializability', 'Deadlocks', 'WAL Log Recovery'],
      },
    ],
    students: [
      {
        id: 'st-db1',
        name: 'Arpit Prajapati',
        roll: '2100290100045',
        avatar: 'AP',
        isActiveNow: true,
        attendance: 'present',
        lastSeen: 'Active Now',
      },
    ],
  },
];

// Initial Messages for each class
const INITIAL_CLASS_MESSAGES: Record<string, ChatMessage[]> = {
  'web-d': [
    {
      id: 'wm-1',
      classId: 'web-d',
      senderName: 'Prof. S. K. Rastogi',
      senderAvatar: 'SK',
      senderRole: 'teacher',
      text: 'Good morning everyone! Welcome to Web D lab. Today’s assignment submission window is live. Attach your project cards with GitHub repository links and live URLs. Plagiarism engine will inspect AST hashes automatically.',
      timestamp: 'Today at 09:30 AM',
      reactions: [
        { emoji: '👍', count: 28, reacted: true },
        { emoji: '🚀', count: 14 },
      ],
    },
    {
      id: 'wm-2',
      classId: 'web-d',
      senderName: 'Rahul Sharma',
      senderRoll: '2100290120045',
      senderAvatar: 'RS',
      senderRole: 'student',
      text: 'Submitted my Distributed Task Queue implementation with Redis BullMQ and Node.js workers.',
      timestamp: 'Today at 10:45 AM',
      project: {
        title: 'Distributed Task Queue with Redis & BullMQ',
        githubUrl: 'https://github.com/rahul-sharma/distributed-task-queue',
        liveUrl: 'https://taskqueue-redis.render.com',
        photoUrls: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        ],
        astPlagScore: 3.2,
        status: 'APPROVED',
        teacherFeedback: 'Excellent cluster failover handling and clean queue backoff configuration. Approved for placement portfolio.',
        grade: 9.5,
      },
      reactions: [{ emoji: '⭐', count: 9 }, { emoji: '🔥', count: 6 }],
    },
    {
      id: 'wm-3',
      classId: 'web-d',
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
        teacherFeedback: 'Missing Docker container spec in repository root. Please add container config and re-upload.',
      },
      reactions: [{ emoji: '👀', count: 4 }],
    },
    {
      id: 'wm-4',
      classId: 'web-d',
      senderName: 'Arpit Prajapati',
      senderRoll: '2100290100045',
      senderAvatar: 'AP',
      senderRole: 'student',
      isCurrentUser: true,
      text: 'Sir, I have submitted the High-Throughput Log Aggregator pipeline deployed with Docker Swarm. All AST checks passed.',
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
      reactions: [{ emoji: '🔥', count: 18, reacted: true }, { emoji: '⭐', count: 12 }],
    },
  ],
  dsa: [
    {
      id: 'dm-1',
      classId: 'dsa',
      senderName: 'Prof. Neha Gupta',
      senderAvatar: 'NG',
      senderRole: 'teacher',
      text: 'Welcome to DSA Lab CSE 3A! Please upload your verified solutions for Trie Autocomplete and Segment Tree range queries with execution profiling.',
      timestamp: 'Yesterday at 09:15 AM',
      reactions: [{ emoji: '⚡', count: 22 }],
    },
  ],
  os: [
    {
      id: 'om-1',
      classId: 'os',
      senderName: 'Dr. A. Verma',
      senderAvatar: 'AV',
      senderRole: 'teacher',
      text: 'Operating Systems lab submission channel active. Drop your Raft consensus implementation or POSIX thread producer-consumer proofs.',
      timestamp: 'Wednesday at 02:00 PM',
      reactions: [{ emoji: '💻', count: 15 }],
    },
  ],
  dbms: [
    {
      id: 'dbm-1',
      classId: 'dbms',
      senderName: 'Prof. Manish Pant',
      senderAvatar: 'MP',
      senderRole: 'teacher',
      text: 'DBMS lab project cards: Submit your B-Tree Index visualizer or Sharded SQL transaction demo.',
      timestamp: 'Thursday at 11:45 AM',
      reactions: [{ emoji: '📁', count: 19 }],
    },
  ],
};

export default function ClassPage() {
  const { student } = useStudent();
  const toast = useToast();

  // Selected Class: if null, shows "My Sem Classes" hub; if string, enters that class
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // Sem Classes Store
  const [classes, setClasses] = useState<SemClass[]>(INITIAL_SEM_CLASSES);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_CLASS_MESSAGES);
  const [searchQuery, setSearchQuery] = useState('');

  // Role toggle: student vs teacher
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');

  // Side Tab for Student: 'notes' | 'tests'
  const [studentSideTab, setStudentSideTab] = useState<'notes' | 'tests'>('notes');

  // Chat message & project drawer input state
  const [inputText, setInputText] = useState('');
  const [attachProjectOpen, setAttachProjectOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectGithub, setProjectGithub] = useState('');
  const [projectLive, setProjectLive] = useState('');
  const [projectPhotos, setProjectPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  ]);

  // Selected Photo Zoom Modal
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Auto-scroll chat feed
  const chatBottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selectedClassId) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedClassId]);

  // Active Class details
  const currentClass = classes.find((c) => c.id === selectedClassId);
  const currentMessages = selectedClassId ? messages[selectedClassId] || [] : [];

  // Filtered classes list for the Hub
  const filteredClasses = classes.filter(
    (c) =>
      c.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Send Message / Project in Chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return;
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
      classId: selectedClassId,
      senderName: userRole === 'student' ? student.name : currentClass?.teacher || 'Faculty',
      senderRoll: userRole === 'student' ? student.rollNumber : undefined,
      senderAvatar: userRole === 'student' ? 'AP' : 'FC',
      senderRole: userRole,
      isCurrentUser: true,
      text: inputText.trim() || undefined,
      project: attachProjectOpen
        ? {
            title: projectTitle,
            githubUrl: projectGithub,
            liveUrl: projectLive.trim() || undefined,
            photoUrls: projectPhotos,
            astPlagScore: 2.4,
            status: 'SUBMITTED',
          }
        : undefined,
      timestamp: 'Just now',
      reactions: [{ emoji: '🚀', count: 1, reacted: true }],
    };

    setMessages((prev) => ({
      ...prev,
      [selectedClassId]: [...(prev[selectedClassId] || []), newMsg],
    }));

    setInputText('');
    setAttachProjectOpen(false);
    setProjectTitle('');
    setProjectGithub('');
    setProjectLive('');
    toast(
      attachProjectOpen
        ? 'Project proof submitted to class chat! AST check passed.'
        : 'Message sent to class',
      'success'
    );
  };

  // Teacher Review Action on student projects
  const handleTeacherReview = (msgId: string, status: 'APPROVED' | 'NEEDS_REVISION') => {
    if (!selectedClassId) return;
    const feedback =
      status === 'APPROVED'
        ? 'Verified in laboratory evaluation. AST verified & clean commits.'
        : 'Missing required configuration file or unit tests. Please update.';

    setMessages((prev) => ({
      ...prev,
      [selectedClassId]: (prev[selectedClassId] || []).map((m) =>
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

    toast(`Submission ${status === 'APPROVED' ? 'Approved' : 'Marked for Revision'}`, 'info');
  };

  // Teacher Attendance status toggle for a student
  const handleToggleAttendance = (studentId: string, newStatus: 'present' | 'absent' | 'late') => {
    if (!selectedClassId) return;
    setClasses((prev) =>
      prev.map((c) =>
        c.id === selectedClassId
          ? {
              ...c,
              students: c.students.map((s) =>
                s.id === studentId ? { ...s, attendance: newStatus } : s
              ),
            }
          : c
      )
    );
    toast('Attendance updated', 'success');
  };

  // Mark all students present in Today section
  const handleMarkAllPresent = () => {
    if (!selectedClassId) return;
    setClasses((prev) =>
      prev.map((c) =>
        c.id === selectedClassId
          ? {
              ...c,
              students: c.students.map((s) => ({ ...s, attendance: 'present' })),
            }
          : c
      )
    );
    toast('All students marked present for today', 'success');
  };

  // =========================================================================
  // VIEW 1: "MY SEM CLASSES" HUB
  // =========================================================================
  if (!selectedClassId || !currentClass) {
    return (
      <>
        <header className="border-b border-line bg-surface/40 text-ink">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            {/* Top Header & Role Switcher */}
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="max-w-3xl">
                <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1a7f37]" />
                    Semester 6 • 2026 Academic Session
                  </span>
                  <span className="text-xs font-medium text-muted">CSE 3A Section</span>
                </div>

                <h1 className="flex items-center gap-3 text-2xl font-extrabold tracking-tight text-ink sm:text-[2.1rem]">
                  <BookOpen className="h-7 w-7 text-[#0969da]" />
                  <span>My Sem Classes</span>
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-[15px]">
                  Select any of your active semester laboratory classes to enter the live classroom chat,
                  review lecture notes, and track upcoming class test assessments.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2 self-start rounded-xl border border-line bg-surface2/80 p-1 sm:self-center">
                <span className="px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Role</span>
                <button
                  onClick={() => {
                    setUserRole('student');
                    toast('Switched to Student View', 'info');
                  }}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors',
                    userRole === 'student' ? 'bg-surface text-ink shadow-xs border border-line' : 'text-muted hover:text-ink'
                  )}
                >
                  Student View
                </button>
                <button
                  onClick={() => {
                    setUserRole('teacher');
                    toast('Switched to Teacher / Faculty View', 'info');
                  }}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors',
                    userRole === 'teacher' ? 'bg-surface text-ink shadow-xs border border-line' : 'text-muted hover:text-ink'
                  )}
                >
                  Teacher View
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 text-ink animate-fade-in sm:px-6 lg:px-8">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search by class name, subject code, or faculty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 rounded-xl bg-surface border border-line pl-9 pr-4 text-xs font-medium text-ink placeholder:text-muted outline-none focus:border-[#0969da] transition-all shadow-2xs"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted self-end sm:self-auto">
              <span>Showing {filteredClasses.length} active laboratory classes</span>
            </div>
          </div>

          {/* Classes Cards Grid */}
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:gap-5">
            {filteredClasses.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedClassId(item.id)}
              className="group flex min-h-[320px] cursor-pointer flex-col justify-between rounded-xl border border-line bg-surface p-4 shadow-xs transition-colors duration-200 hover:border-[#0969da]/60 sm:p-5"
            >
              <div>
                {/* Header: Short Name badge + Subject Code + Students */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-bold shadow-2xs',
                        item.accentBg,
                        item.accentColor,
                        'border-black/5'
                      )}
                    >
                      {item.shortName.substring(0, 3).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h2 className="flex items-center gap-1.5 text-lg font-bold text-ink transition-colors group-hover:text-[#0969da] sm:text-xl">
                        <span className="truncate">{item.shortName}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                      </h2>
                      <span className="mt-0.5 block truncate text-[11px] font-mono font-medium text-muted">
                        {item.code} • {item.semester}
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface2 px-2.5 py-1 text-[11px] font-semibold text-ink">
                    <Users className="h-3.5 w-3.5 text-accent" />
                    <span>{item.totalStudents} enrolled</span>
                  </span>
                </div>

                <p className="mb-4 line-clamp-1 text-xs font-medium text-muted" title={item.fullName}>
                  {item.fullName}
                </p>

                {/* Faculty & Timing Info */}
                <div className="mb-4 space-y-2 rounded-lg border border-line/70 bg-surface2/50 px-3 py-3 text-xs">
                  <div className="flex items-start justify-between gap-4">
                    <span className="shrink-0 text-muted">Faculty</span>
                    <strong className="min-w-0 text-right font-semibold text-ink">{item.teacher}</strong>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="shrink-0 text-muted">Schedule</span>
                    <span className="min-w-0 text-right font-mono text-[10px] leading-5 text-ink sm:text-[11px]">{item.timing}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="shrink-0 text-muted">Location</span>
                    <span className="min-w-0 text-right font-medium text-ink">{item.labRoom}</span>
                  </div>
                </div>

                {/* Today's Topic Banner */}
                <div className="mb-4 flex min-h-11 items-start gap-2 rounded-lg border border-line bg-surface2/60 px-3 py-2.5 text-xs">
                  <Flame className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div className="min-w-0 leading-5">
                    <span className="mr-1.5 font-semibold text-accent">Today</span>
                    <span className="font-medium text-ink" title={item.todayTopic}>{item.todayTopic}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Stats & Enter CTA */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-xs">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="flex items-center gap-1.5 text-muted">
                    <FileText className="h-3.5 w-3.5 text-accent" />
                    <span>{item.notesCount} notes</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-muted">
                    <Timer className="h-3.5 w-3.5 text-[#cf222e]" />
                    <span>{item.upcomingTestsCount} upcoming tests</span>
                  </span>
                </div>

                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#0969da] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#0854b0]"
                >
                  <span>Enter Class</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            ))}
          </div>
        </main>
      </>
    );
  }

  // =========================================================================
  // VIEW 2: INSIDE SELECTED CLASS (3:4 SPLIT VIEW)
  // ~75% Class Room Chat + ~25% Student (Notes & Tests) or Teacher (Today Stats)
  // =========================================================================
  const activeStudentsToday = currentClass.students.filter((s) => s.attendance === 'present').length;
  const absentStudentsToday = currentClass.students.filter((s) => s.attendance === 'absent').length;

  return (
    <div className="max-w-[1536px] mx-auto p-2 sm:p-4 lg:p-6 text-ink animate-fade-in">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-surface p-3 sm:p-4 rounded-2xl border border-line shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedClassId(null)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface hover:bg-surface2 px-3 py-1.5 text-xs font-bold text-ink transition-colors shadow-2xs"
            title="Return to My Sem Classes"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>My Sem Classes</span>
          </button>

          <div className="h-4 w-px bg-line hidden sm:block" />

          <div className="flex items-center gap-2">
            <span
              className={cn(
                'h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs',
                currentClass.accentBg,
                currentClass.accentColor
              )}
            >
              {currentClass.shortName.substring(0, 2)}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-base text-ink">
                  {currentClass.shortName}
                </h1>
                <span className="text-xs font-mono font-semibold text-muted">
                  ({currentClass.code})
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#1a7f37] bg-[#dafbe1] px-2 py-0.5 rounded-full border border-[#4ac26b]/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1a7f37]" />
                  Live Lab Active
                </span>
              </div>
              <p className="text-[11px] text-muted font-medium hidden sm:block">
                {currentClass.teacher} • {currentClass.section} • {currentClass.labRoom}
              </p>
            </div>
          </div>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <span className="text-xs font-semibold text-muted">Active Role:</span>
          <button
            onClick={() => {
              const next = userRole === 'student' ? 'teacher' : 'student';
              setUserRole(next);
              toast(`Switched to ${next === 'student' ? 'Student View' : 'Teacher View'}`, 'info');
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface hover:bg-surface2 px-3 py-1.5 text-xs font-bold text-ink transition-all shadow-2xs"
          >
            <span>{userRole === 'student' ? '👨‍🎓 Student Mode (Arpit)' : '👨‍🏫 Teacher Mode (Faculty)'}</span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0969da] bg-[#ddf4ff] border border-[#54aeff]/40 px-1.5 py-0.5 rounded">
              Switch
            </span>
          </button>
        </div>
      </div>

      {/* 3:4 SPLIT WORKSPACE */}
      {/* Grid: 8 Cols (Chat) : 4 Cols (Sidebar) on LG, or 9 Cols : 3 Cols on XL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start min-h-[calc(100vh-12rem)]">
        {/* ========================================================= */}
        {/* SECTION 1: CLASS ROOM CHAT (3:4 ratio ~ 70-75% width) */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 xl:col-span-9 rounded-2xl border border-line bg-surface shadow-2xs overflow-hidden flex flex-col h-[780px]">
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-line bg-surface2/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#0969da]" />
              <span className="font-extrabold text-xs sm:text-sm text-ink">
                Classroom Project & Code Stream
              </span>
              <span className="text-xs text-muted">• {currentMessages.length} Messages</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted font-medium hidden sm:inline">
                AST Plagiarism Verification:
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1a7f37] bg-[#dafbe1] px-2 py-0.5 rounded-full border border-[#4ac26b]/40">
                <ShieldCheck className="h-3.5 w-3.5" />
                Active & Enforced
              </span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-5 bg-surface/50">
            {currentMessages.map((msg) => {
              const isTeacher = msg.senderRole === 'teacher';

              return (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-3 group animate-fade-in',
                    msg.isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      'h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs border',
                      isTeacher
                        ? 'bg-[#0969da] text-white border-[#0969da]'
                        : msg.isCurrentUser
                        ? 'bg-[#1a7f37] text-white border-[#1a7f37]'
                        : 'bg-surface2 text-ink border-line'
                    )}
                  >
                    {msg.senderAvatar}
                  </div>

                  {/* Message Bubble Container */}
                  <div
                    className={cn(
                      'max-w-[92%] sm:max-w-[85%] space-y-1.5',
                      msg.isCurrentUser ? 'items-end' : 'items-start'
                    )}
                  >
                    {/* Header info */}
                    <div
                      className={cn(
                        'flex items-center gap-2 text-xs',
                        msg.isCurrentUser ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <span className="font-bold text-ink">{msg.senderName}</span>
                      {msg.senderRoll && (
                        <span className="text-[10px] font-mono text-muted">({msg.senderRoll})</span>
                      )}
                      {isTeacher && (
                        <span className="text-[10px] font-bold text-[#0969da] bg-[#ddf4ff] border border-[#54aeff]/40 px-1.5 rounded">
                          Faculty
                        </span>
                      )}
                      <span className="text-[10.5px] text-muted">{msg.timestamp}</span>
                    </div>

                    {/* Text Message Content */}
                    {msg.text && (
                      <div
                        className={cn(
                          'p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-2xs border',
                          msg.isCurrentUser
                            ? 'bg-[#0969da] text-white border-[#0969da]'
                            : isTeacher
                            ? 'bg-surface2/90 text-ink border-line'
                            : 'bg-surface text-ink border-line'
                        )}
                      >
                        {msg.text}
                      </div>
                    )}

                    {/* Interactive Project Submission Card */}
                    {msg.project && (
                      <div className="rounded-2xl border border-line bg-surface p-4 space-y-3 shadow-xs">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#0969da] block">
                              Project Submission Proof
                            </span>
                            <h3 className="font-bold text-sm text-ink mt-0.5">
                              {msg.project.title}
                            </h3>
                          </div>

                          {/* Plagiarism Badge */}
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#dafbe1] border border-[#4ac26b]/40 text-[#1a7f37] text-xs font-mono font-bold">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>AST Plag: {msg.project.astPlagScore}%</span>
                          </div>
                        </div>

                        {/* Screenshot previews */}
                        {msg.project.photoUrls && msg.project.photoUrls.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            {msg.project.photoUrls.map((url, pIdx) => (
                              <button
                                key={pIdx}
                                type="button"
                                onClick={() => setSelectedPhoto(url)}
                                className="relative rounded-lg overflow-hidden border border-line h-28 group/img bg-surface2 block w-full"
                              >
                                <img
                                  src={url}
                                  alt="Project proof screenshot"
                                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1">
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>Inspect</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Links: GitHub & Live Demo */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <a
                            href={msg.project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-line bg-surface2 hover:bg-surface text-ink text-xs font-mono font-semibold transition-colors"
                          >
                            <FolderGit2 className="h-3.5 w-3.5 text-[#0969da]" />
                            <span>GitHub Repo</span>
                            <ExternalLink className="h-3 w-3 text-muted" />
                          </a>

                          {msg.project.liveUrl && (
                            <a
                              href={msg.project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-line bg-surface2 hover:bg-surface text-ink text-xs font-mono font-semibold transition-colors"
                            >
                              <ExternalLink className="h-3.5 w-3.5 text-[#1a7f37]" />
                              <span>Live Demo</span>
                            </a>
                          )}
                        </div>

                        {/* Status, Feedback & Grade */}
                        <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-muted font-medium">Status:</span>
                            <span
                              className={cn(
                                'px-2 py-0.5 rounded-full font-bold text-[11px] border',
                                msg.project.status === 'APPROVED'
                                  ? 'bg-[#dafbe1] text-[#1a7f37] border-[#4ac26b]/40'
                                  : msg.project.status === 'NEEDS_REVISION'
                                  ? 'bg-[#ffebe9] text-[#cf222e] border-[#ff8182]/40'
                                  : 'bg-[#fff8c5] text-[#9a6700] border-[#d4a72c]/40'
                              )}
                            >
                              {msg.project.status}
                            </span>
                          </div>

                          {msg.project.grade && (
                            <div className="flex items-center gap-1 font-bold text-ink">
                              <Award className="h-3.5 w-3.5 text-[#0969da]" />
                              <span>Grade: {msg.project.grade}/10</span>
                            </div>
                          )}
                        </div>

                        {msg.project.teacherFeedback && (
                          <div className="p-2.5 rounded-lg bg-surface2/60 border border-line/60 text-xs text-muted space-y-1">
                            <strong className="text-ink font-semibold block">Faculty Review:</strong>
                            <p>{msg.project.teacherFeedback}</p>
                          </div>
                        )}

                        {/* Teacher Moderation Actions (Visible if in Teacher Mode) */}
                        {userRole === 'teacher' && msg.project.status !== 'APPROVED' && (
                          <div className="pt-2 border-t border-line/60 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleTeacherReview(msg.id, 'APPROVED')}
                              className="px-3 py-1 rounded-lg bg-[#1a7f37] hover:bg-[#146c2e] text-white text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <Check className="h-3 w-3" />
                              <span>Approve Project</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTeacherReview(msg.id, 'NEEDS_REVISION')}
                              className="px-3 py-1 rounded-lg border border-[#cf222e]/40 text-[#cf222e] hover:bg-[#ffebe9] text-xs font-bold transition-colors"
                            >
                              Request Revision
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

          {/* Bottom Chat Input & Project Drop Drawer */}
          <div className="p-3 sm:p-4 border-t border-line bg-surface">
            {/* Expandable Project Attachment Drawer */}
            {attachProjectOpen && (
              <div className="mb-3 p-4 rounded-xl border border-[#0969da]/40 bg-[#ddf4ff]/20 space-y-3 animate-fade-in text-ink">
                <div className="flex items-center justify-between pb-2 border-b border-line/60">
                  <span className="font-bold text-xs flex items-center gap-1.5 text-ink">
                    <FolderGit2 className="h-4 w-4 text-[#0969da]" />
                    <span>Attach Project Card & Verification Links</span>
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
                    Live Demo URL <span className="text-muted font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://project.render.com"
                    value={projectLive}
                    onChange={(e) => setProjectLive(e.target.value)}
                    className="w-full h-8 rounded-lg bg-surface border border-line px-2.5 text-xs font-mono text-ink placeholder:text-muted outline-none focus:border-[#0969da]"
                  />
                </div>
              </div>
            )}

            {/* Input Action Form */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAttachProjectOpen(!attachProjectOpen)}
                className={cn(
                  'h-9 px-3 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-2xs',
                  attachProjectOpen
                    ? 'bg-[#0969da] text-white border-[#0969da]'
                    : 'bg-surface2 hover:bg-surface border-line text-ink'
                )}
                title="Attach GitHub Project Proof"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Attach Project</span>
              </button>

              <input
                type="text"
                placeholder={
                  attachProjectOpen
                    ? 'Add brief notes about your project architecture...'
                    : 'Type a message to class or discuss code...'
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 h-9 rounded-lg bg-surface2/60 border border-line px-3 text-xs text-ink placeholder:text-muted outline-none focus:border-[#0969da] transition-colors"
              />

              <button
                type="submit"
                disabled={!inputText.trim() && !attachProjectOpen}
                className="h-9 px-4 rounded-lg bg-[#0969da] hover:bg-[#0854b0] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
              >
                <span>Send</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: SIDE PANEL (~25% / remaining width) */}
        {/* STUDENT VIEW: [Class Notes & Class Tests] */}
        {/* TEACHER VIEW: ["Today" Live Class & Attendance Activity Metrics] */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 xl:col-span-3 rounded-2xl border border-line bg-surface shadow-2xs overflow-hidden flex flex-col h-[780px]">
          {/* ------------------------------------------------------------- */}
          {/* STUDENT SIDEBAR: [Class Notes] & [Class Tests] */}
          {/* ------------------------------------------------------------- */}
          {userRole === 'student' ? (
            <div className="flex flex-col h-full">
              {/* Tab Switcher: Class Notes vs Class Tests */}
              <div className="p-2.5 border-b border-line bg-surface2/50 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setStudentSideTab('notes')}
                  className={cn(
                    'flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs',
                    studentSideTab === 'notes'
                      ? 'bg-surface text-ink border border-line'
                      : 'text-muted hover:text-ink'
                  )}
                >
                  <FileText className="h-3.5 w-3.5 text-[#0969da]" />
                  <span>Class Notes ({currentClass.notes.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudentSideTab('tests')}
                  className={cn(
                    'flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs',
                    studentSideTab === 'tests'
                      ? 'bg-surface text-ink border border-line'
                      : 'text-muted hover:text-ink'
                  )}
                >
                  <Timer className="h-3.5 w-3.5 text-[#cf222e]" />
                  <span>Class Tests ({currentClass.tests.length})</span>
                </button>
              </div>

              {/* Tab 1: Class Notes Content */}
              {studentSideTab === 'notes' && (
                <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                      Lecture Material & Handouts
                    </span>
                    <span className="text-[10px] text-muted font-mono">
                      Faculty Verified
                    </span>
                  </div>

                  {currentClass.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded-xl border border-line bg-surface2/40 hover:bg-surface2 transition-colors space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'p-1.5 rounded-lg border text-xs font-bold shrink-0',
                              note.fileType === 'pdf'
                                ? 'bg-[#ffebe9] text-[#cf222e] border-[#ff8182]/40'
                                : note.fileType === 'slides'
                                ? 'bg-[#fff8c5] text-[#9a6700] border-[#d4a72c]/40'
                                : 'bg-[#ddf4ff] text-[#0969da] border-[#54aeff]/40'
                            )}
                          >
                            <FileCode className="h-4 w-4" />
                          </span>
                          <div>
                            <span className="text-[10px] font-bold text-[#0969da] uppercase block">
                              {note.unit}
                            </span>
                            <h4 className="font-bold text-xs text-ink leading-snug">
                              {note.title}
                            </h4>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted pt-1 border-t border-line/60">
                        <span>{note.fileSize} • {note.date}</span>
                        <button
                          type="button"
                          onClick={() => toast(`Downloading ${note.title}...`, 'success')}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0969da] hover:underline"
                        >
                          <Download className="h-3 w-3" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Class Tests Content */}
              {studentSideTab === 'tests' && (
                <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                      Continuous Evaluations & Quizzes
                    </span>
                    <span className="text-[10px] text-muted font-mono">
                      Strict Anti-Cheating
                    </span>
                  </div>

                  {currentClass.tests.map((test) => (
                    <div
                      key={test.id}
                      className="p-3.5 rounded-xl border border-line bg-surface2/40 hover:bg-surface2 transition-colors space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#cf222e] block">
                            {test.unit}
                          </span>
                          <h4 className="font-bold text-xs text-ink">{test.title}</h4>
                        </div>

                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0',
                            test.status === 'completed'
                              ? 'bg-[#dafbe1] text-[#1a7f37] border-[#4ac26b]/40'
                              : 'bg-[#ddf4ff] text-[#0969da] border-[#54aeff]/40'
                          )}
                        >
                          {test.status === 'completed' ? 'Completed' : 'Upcoming'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 text-[11px] text-muted bg-surface/70 p-2 rounded-lg border border-line/60">
                        <div>
                          <span className="block text-[10px]">Date & Time</span>
                          <strong className="text-ink font-semibold">{test.date}</strong>
                        </div>
                        <div>
                          <span className="block text-[10px]">Duration</span>
                          <strong className="text-ink font-semibold">{test.duration}</strong>
                        </div>
                      </div>

                      {/* Score or Syllabus Topics */}
                      {test.status === 'completed' && test.studentScore !== undefined ? (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#dafbe1]/60 border border-[#4ac26b]/30 text-xs">
                          <span className="font-medium text-[#1a7f37]">Your Score:</span>
                          <strong className="font-bold text-[#1a7f37]">
                            {test.studentScore} / {test.maxMarks} Marks
                          </strong>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="text-[10.5px] font-semibold text-muted block">
                            Syllabus Topics:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {test.topics.map((t, ti) => (
                              <span
                                key={ti}
                                className="px-1.5 py-0.2 rounded bg-surface border border-line text-[10px] text-ink"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {test.status === 'upcoming' && (
                        <button
                          type="button"
                          onClick={() => toast('Test portal will open 10 mins before schedule', 'info')}
                          className="w-full py-1.5 rounded-lg bg-surface border border-line hover:border-[#0969da] text-ink text-xs font-bold transition-all text-center block"
                        >
                          View Test Syllabus & Instructions
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // -------------------------------------------------------------
            // TEACHER SIDEBAR: "TODAY" (Live Class & Attendance Metrics)
            // -------------------------------------------------------------
            <div className="flex flex-col h-full">
              {/* Header: "Today" Live Activity Overview */}
              <div className="p-3.5 border-b border-line bg-surface2/60">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Radio className="h-4 w-4 text-[#1a7f37] animate-pulse" />
                    <h3 className="font-extrabold text-xs sm:text-sm text-ink">
                      Today's Live Class Activity
                    </h3>
                  </div>
                  <span className="text-[10.5px] font-mono font-bold text-[#1a7f37] bg-[#dafbe1] px-2 py-0.5 rounded-full border border-[#4ac26b]/40">
                    Live Session
                  </span>
                </div>
                <p className="text-[11px] text-muted">
                  Real-time student attendance & active project turn-ins
                </p>
              </div>

              {/* Today's KPI Counters */}
              <div className="p-3 border-b border-line bg-surface grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-surface2/60 border border-line/60">
                  <span className="text-[10px] font-semibold text-muted block">Enrolled</span>
                  <strong className="text-sm font-extrabold text-ink font-mono">
                    {currentClass.totalStudents}
                  </strong>
                </div>

                <div className="p-2 rounded-xl bg-[#dafbe1]/40 border border-[#4ac26b]/30">
                  <span className="text-[10px] font-semibold text-[#1a7f37] block">Active Now</span>
                  <strong className="text-sm font-extrabold text-[#1a7f37] font-mono">
                    {activeStudentsToday}
                  </strong>
                </div>

                <div className="p-2 rounded-xl bg-[#ffebe9]/40 border border-[#ff8182]/30">
                  <span className="text-[10px] font-semibold text-[#cf222e] block">Absent</span>
                  <strong className="text-sm font-extrabold text-[#cf222e] font-mono">
                    {absentStudentsToday}
                  </strong>
                </div>
              </div>

              {/* Quick Teacher Actions */}
              <div className="p-2.5 border-b border-line bg-surface2/30 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleMarkAllPresent}
                  className="flex-1 py-1 px-2 rounded-lg bg-surface border border-line hover:border-[#1a7f37] text-ink text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1"
                >
                  <UserCheck className="h-3.5 w-3.5 text-[#1a7f37]" />
                  <span>Mark All Present</span>
                </button>

                <button
                  type="button"
                  onClick={() => toast('Exporting Today’s Attendance to CSV...', 'success')}
                  className="py-1 px-2.5 rounded-lg bg-surface border border-line hover:bg-surface2 text-muted hover:text-ink text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                  title="Export Attendance Sheet"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export</span>
                </button>
              </div>

              {/* Today's Student Roster List */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted">
                    Student Roster ({currentClass.students.length})
                  </span>
                  <span className="text-[10px] text-muted">Click badge to toggle</span>
                </div>

                {currentClass.students.map((st) => (
                  <div
                    key={st.id}
                    className="p-2.5 rounded-xl border border-line bg-surface hover:bg-surface2/40 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <div className="relative">
                          <div className="h-7 w-7 rounded-full bg-surface2 border border-line flex items-center justify-center font-bold text-[11px] text-ink">
                            {st.avatar}
                          </div>
                          {st.isActiveNow ? (
                            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#1a7f37] border-2 border-surface" />
                          ) : (
                            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-muted/40 border-2 border-surface" />
                          )}
                        </div>

                        <div className="truncate">
                          <h4 className="font-bold text-xs text-ink truncate leading-tight">
                            {st.name}
                          </h4>
                          <span className="text-[10px] font-mono text-muted block">
                            {st.roll}
                          </span>
                        </div>
                      </div>

                      {/* Attendance Toggle Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const nextStatus: Record<'present' | 'absent' | 'late', 'present' | 'absent' | 'late'> = {
                            present: 'late',
                            late: 'absent',
                            absent: 'present',
                          };
                          handleToggleAttendance(st.id, nextStatus[st.attendance]);
                        }}
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10.5px] font-bold border transition-all cursor-pointer shadow-2xs',
                          st.attendance === 'present'
                            ? 'bg-[#dafbe1] text-[#1a7f37] border-[#4ac26b]/40'
                            : st.attendance === 'late'
                            ? 'bg-[#fff8c5] text-[#9a6700] border-[#d4a72c]/40'
                            : 'bg-[#ffebe9] text-[#cf222e] border-[#ff8182]/40'
                        )}
                        title="Click to cycle Present -> Late -> Absent"
                      >
                        {st.attendance === 'present'
                          ? 'Present'
                          : st.attendance === 'late'
                          ? 'Late'
                          : 'Absent'}
                      </button>
                    </div>

                    {/* Today Submission Status */}
                    {st.submittedToday && (
                      <div className="p-1.5 rounded-md bg-[#ddf4ff]/50 border border-[#54aeff]/30 text-[10.5px] flex items-center justify-between">
                        <span className="text-[#0969da] font-medium truncate">
                          Submitted: {st.submittedToday.title}
                        </span>
                        <span className="font-mono text-muted text-[10px] shrink-0 ml-1">
                          {st.submittedToday.time}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Zoom Image Viewer */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border border-white/20 bg-surface shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={selectedPhoto}
              alt="Inspected screenshot"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
