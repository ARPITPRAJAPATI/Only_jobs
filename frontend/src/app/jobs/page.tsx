'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Search,
  Building2,
  Lock,
  Calendar,
  Video,
  FileText,
  AlertTriangle,
  ChevronRight,
  X,
  ExternalLink,
  ShieldCheck,
  Check,
  Globe,
  Bookmark,
  Share2,
  Filter,
} from 'lucide-react';
import { useToast } from '@/components/toast';
import { useStudent } from '@/components/store';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export type JobSectionTab = 'TPO_DRIVES' | 'OFFCAMPUS' | 'RECOMMENDED' | 'APPLICATIONS';

export interface JobDrive {
  id: string;
  company: string;
  logoLetter: string;
  role: string;
  type: 'Full-time' | 'Internship';
  category: 'SDE' | 'INTERN' | 'DATA' | 'DEVOPS';
  ctc: string;
  ctcLpa: number;
  isDreamCompany: boolean;
  location: string;
  deadline: string;
  cgpaCutoff: number;
  allowedBranches: string[];
  maxBacklogs: number;
  minVerifiedBadges?: number;
  batch: string;
  requiredTrack: string;
  description: string;
}

export interface OffCampusJob {
  id: string;
  company: string;
  logoLetter: string;
  role: string;
  type: 'Full-time' | 'Internship';
  compensation: string;
  location: string;
  batchEligible: string;
  deadline: string;
  requiredSkills: string[];
  portalSource: string;
  applyUrl: string;
  hasReferral: boolean;
  isHot?: boolean;
}

export interface SuggestedJob {
  id: string;
  company: string;
  logoLetter: string;
  role: string;
  type: 'TPO_DRIVE' | 'OFFCAMPUS';
  compensation: string;
  matchReasons: string[];
  skillsMatched: string[];
  originalDriveId?: string;
  externalUrl?: string;
}

export type ApplicationStage =
  | 'APPLIED'
  | 'OA_SHORTLISTED'
  | 'TECHNICAL_INTERVIEW'
  | 'HR_ROUND'
  | 'OFFERED'
  | 'REJECTED';

export interface CollegeJobApplication {
  id: string;
  driveId: string;
  company: string;
  role: string;
  ctc: string;
  appliedDate: string;
  currentStage: ApplicationStage;
  nextRoundDate?: string;
  nextRoundTitle?: string;
  meetLink?: string;
  interviewerNotes?: string;
  isOfferAccepted?: boolean;
}

// ============================================================================
// DATA: TPO PLACEMENT DRIVES (ON-CAMPUS)
// ============================================================================

const TPO_DRIVES_DATA: JobDrive[] = [
  {
    id: 'tpo-1',
    company: 'Microsoft',
    logoLetter: 'MS',
    role: 'Software Development Engineer (SDE 1)',
    type: 'Full-time',
    category: 'SDE',
    ctc: '₹44.5 LPA',
    ctcLpa: 44.5,
    isDreamCompany: true,
    location: 'Hyderabad / Bengaluru',
    deadline: '28 Oct 2026',
    cgpaCutoff: 7.5,
    allowedBranches: ['CSE', 'IT', 'CS-AI'],
    maxBacklogs: 0,
    minVerifiedBadges: 2,
    batch: '2026 Batch',
    requiredTrack: 'Full Stack Next.js or DSA Mastery',
    description: 'Design and develop highly scalable distributed cloud services across Azure Core Engineering.',
  },
  {
    id: 'tpo-2',
    company: 'Amazon',
    logoLetter: 'AMZ',
    role: 'Software Development Engineer Intern',
    type: 'Internship',
    category: 'INTERN',
    ctc: '₹1.10 Lakh / mo',
    ctcLpa: 13.2,
    isDreamCompany: true,
    location: 'Bengaluru / Hyderabad',
    deadline: '30 Oct 2026',
    cgpaCutoff: 7.0,
    allowedBranches: ['CSE', 'IT', 'CS-AI', 'ECE'],
    maxBacklogs: 0,
    minVerifiedBadges: 1,
    batch: '2026 & 2027 Batch',
    requiredTrack: 'DSA Mastery in C++ (Phase 2 Passed)',
    description: '6-month pre-placement internship with Amazon Prime Video and Fulfillment Technologies.',
  },
  {
    id: 'tpo-3',
    company: 'Cisco Systems',
    logoLetter: 'CS',
    role: 'Cloud Security & Network Systems Engineer',
    type: 'Full-time',
    category: 'DEVOPS',
    ctc: '₹18.0 LPA',
    ctcLpa: 18.0,
    isDreamCompany: true,
    location: 'Bengaluru',
    deadline: '02 Nov 2026',
    cgpaCutoff: 7.0,
    allowedBranches: ['CSE', 'IT', 'ECE', 'EE'],
    maxBacklogs: 0,
    batch: '2026 Batch',
    requiredTrack: 'Cloud Native Kubernetes or Pen-Testing',
    description: 'Zero Trust architecture, BGP telemetry routing, and enterprise edge container security.',
  },
  {
    id: 'tpo-4',
    company: 'Atlassian',
    logoLetter: 'ATL',
    role: 'Graduate Software Engineer',
    type: 'Full-time',
    category: 'SDE',
    ctc: '₹52.0 LPA',
    ctcLpa: 52.0,
    isDreamCompany: true,
    location: 'Remote / Bengaluru',
    deadline: '05 Nov 2026',
    cgpaCutoff: 8.5, // High cutoff demo
    allowedBranches: ['CSE', 'IT'],
    maxBacklogs: 0,
    minVerifiedBadges: 3,
    batch: '2026 Batch',
    requiredTrack: 'Distributed Systems or Golang Backend',
    description: 'Build Jira and Confluence backend microservices operating at petabyte multi-region scale.',
  },
  {
    id: 'tpo-5',
    company: 'Swiggy',
    logoLetter: 'SW',
    role: 'Associate Frontend Engineer',
    type: 'Full-time',
    category: 'SDE',
    ctc: '₹24.0 LPA',
    ctcLpa: 24.0,
    isDreamCompany: true,
    location: 'Bengaluru',
    deadline: '07 Nov 2026',
    cgpaCutoff: 6.8,
    allowedBranches: ['CSE', 'IT', 'CS-AI', 'ECE', 'ME'],
    maxBacklogs: 1,
    batch: '2026 Batch',
    requiredTrack: 'Complete Web Design & Front-End',
    description: 'High-speed mobile web delivery, micro-frontends, and checkout web performance optimization.',
  },
  {
    id: 'tpo-6',
    company: 'Oracle Corporation',
    logoLetter: 'ORC',
    role: 'Database & Cloud Infrastructure Specialist',
    type: 'Full-time',
    category: 'DATA',
    ctc: '₹21.5 LPA',
    ctcLpa: 21.5,
    isDreamCompany: true,
    location: 'Noida / Hyderabad',
    deadline: '10 Nov 2026',
    cgpaCutoff: 7.2,
    allowedBranches: ['CSE', 'IT', 'CS-AI'],
    maxBacklogs: 0,
    batch: '2026 Batch',
    requiredTrack: 'Production PostgreSQL & DB Architecture',
    description: 'Exadata query performance tuning, distributed consensus engines, and autonomous Linux clusters.',
  },
  {
    id: 'tpo-7',
    company: 'TCS Digital',
    logoLetter: 'TCS',
    role: 'System Engineer · Digital Cadre',
    type: 'Full-time',
    category: 'SDE',
    ctc: '₹7.5 LPA',
    ctcLpa: 7.5,
    isDreamCompany: false,
    location: 'Pan India',
    deadline: '12 Nov 2026',
    cgpaCutoff: 6.5,
    allowedBranches: ['CSE', 'IT', 'CS-AI', 'ECE', 'EE', 'ME', 'CE'],
    maxBacklogs: 1,
    batch: '2026 Batch',
    requiredTrack: 'Core Engineering Foundations',
    description: 'Enterprise transformation, cloud migration, and Java Spring Boot microservices.',
  },
  {
    id: 'tpo-8',
    company: 'Texas Instruments',
    logoLetter: 'TI',
    role: 'Embedded Firmware & Systems Engineer',
    type: 'Full-time',
    category: 'DEVOPS',
    ctc: '₹26.0 LPA',
    ctcLpa: 26.0,
    isDreamCompany: true,
    location: 'Bengaluru',
    deadline: '15 Nov 2026',
    cgpaCutoff: 7.5,
    allowedBranches: ['ECE', 'EE'], // CSE intentionally not allowed for demo
    maxBacklogs: 0,
    batch: '2026 Batch',
    requiredTrack: 'Hardware RTOS & C Firmware',
    description: 'Real-time operating systems, low-power ARM architecture, and automotive radar firmware.',
  },
];

// ============================================================================
// DATA: OFF-CAMPUS JOB & INTERNSHIP POSTINGS
// ============================================================================

const OFFCAMPUS_POSTINGS: OffCampusJob[] = [
  {
    id: 'off-1',
    company: 'Google',
    logoLetter: 'GOOG',
    role: 'Software Student Training in Engineering Program (STEP Intern)',
    type: 'Internship',
    compensation: '₹1,25,000 / mo',
    location: 'Bengaluru / Hyderabad',
    batchEligible: '2026 & 2027 Undergraduates',
    deadline: '05 Nov 2026',
    requiredSkills: ['C++', 'Java', 'Python', 'Data Structures', 'Algorithms'],
    portalSource: 'Google Student Careers Portal',
    applyUrl: 'https://careers.google.com/jobs/results/step-intern-india',
    hasReferral: true,
    isHot: true,
  },
  {
    id: 'off-2',
    company: 'Uber',
    logoLetter: 'UBER',
    role: 'Software Engineer · HackTag Global Challenge 2026',
    type: 'Full-time',
    compensation: '₹38.5 LPA',
    location: 'Bengaluru',
    batchEligible: '2026 Batch (B.Tech All Branches)',
    deadline: '08 Nov 2026',
    requiredSkills: ['Go', 'Java', 'Distributed Systems', 'Kafka', 'System Design'],
    portalSource: 'Uber Engineering Careers',
    applyUrl: 'https://uber.com/careers/engineering-campus',
    hasReferral: true,
    isHot: true,
  },
  {
    id: 'off-3',
    company: 'Goldman Sachs',
    logoLetter: 'GS',
    role: 'Engineering Campus Hiring Program (Analyst)',
    type: 'Full-time',
    compensation: '₹28.0 LPA',
    location: 'Bengaluru / Hyderabad',
    batchEligible: '2026 Graduating Batch',
    deadline: '12 Nov 2026',
    requiredSkills: ['Problem Solving', 'C++', 'Java', 'Math/Quant', 'OS Fundamentals'],
    portalSource: 'Goldman Sachs Student Programs',
    applyUrl: 'https://goldmansachs.com/careers/students',
    hasReferral: false,
  },
  {
    id: 'off-4',
    company: 'Razorpay',
    logoLetter: 'RZP',
    role: 'Frontend Engineering Intern · Core Checkout Platform',
    type: 'Internship',
    compensation: '₹65,000 / mo',
    location: 'Remote / Bengaluru',
    batchEligible: 'Pre-final & Final Year',
    deadline: '15 Nov 2026',
    requiredSkills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Web Performance'],
    portalSource: 'Razorpay Careers Hub',
    applyUrl: 'https://razorpay.com/jobs/frontend-intern',
    hasReferral: true,
    isHot: true,
  },
  {
    id: 'off-5',
    company: 'CRED',
    logoLetter: 'CRED',
    role: 'Backend Systems Developer · Payments & Ledger',
    type: 'Full-time',
    compensation: '₹32.0 LPA',
    location: 'Bengaluru',
    batchEligible: '2026 Batch',
    deadline: '18 Nov 2026',
    requiredSkills: ['Go', 'PostgreSQL', 'Redis', 'High-Throughput Concurrency'],
    portalSource: 'CRED Careers',
    applyUrl: 'https://cred.club/careers/backend',
    hasReferral: true,
  },
  {
    id: 'off-6',
    company: 'Zomato',
    logoLetter: 'ZOM',
    role: 'Associate Mobile Engineer (React Native / iOS)',
    type: 'Full-time',
    compensation: '₹22.0 LPA',
    location: 'Gurugram / Hybrid',
    batchEligible: '2026 Batch',
    deadline: '20 Nov 2026',
    requiredSkills: ['React Native', 'TypeScript', 'Redux Toolkit', 'Mobile Animations'],
    portalSource: 'Zomato Feeding India Tech',
    applyUrl: 'https://zomato.com/careers',
    hasReferral: false,
  },
];

// ============================================================================
// DATA: SUGGESTED ROLES
// ============================================================================

const SUGGESTED_JOBS: SuggestedJob[] = [
  {
    id: 'rec-1',
    company: 'Razorpay',
    logoLetter: 'RZP',
    role: 'Frontend Engineering Intern · Core Checkout Platform',
    type: 'OFFCAMPUS',
    compensation: '₹65,000 / mo',
    matchReasons: [
      'Frontend role focused on React and Next.js.',
      'TypeScript and UI development experience are relevant.',
    ],
    skillsMatched: ['Next.js', 'React', 'TypeScript', 'TailwindCSS'],
    externalUrl: 'https://razorpay.com/jobs/frontend-intern',
  },
  {
    id: 'rec-2',
    company: 'Amazon',
    logoLetter: 'AMZ',
    role: 'Software Development Engineer Intern',
    type: 'TPO_DRIVE',
    compensation: '₹1.10 Lakh / mo',
    matchReasons: [
      'Available through the KIET on-campus placement drive.',
      'Emphasizes data structures, algorithms, and problem solving.',
    ],
    skillsMatched: ['DSA in C++', 'Trees & Graphs', 'Algorithms', 'System Fundamentals'],
    originalDriveId: 'tpo-2',
  },
  {
    id: 'rec-3',
    company: 'Microsoft',
    logoLetter: 'MS',
    role: 'Software Development Engineer (SDE 1)',
    type: 'TPO_DRIVE',
    compensation: '₹44.5 LPA',
    matchReasons: [
      'Software engineering role with a systems and backend focus.',
      'Open to eligible CSE students in the 2026 batch.',
    ],
    skillsMatched: ['Distributed Systems', 'Next.js', 'PostgreSQL', 'Docker'],
    originalDriveId: 'tpo-1',
  },
  {
    id: 'rec-4',
    company: 'Uber',
    logoLetter: 'UBER',
    role: 'Software Engineer · HackTag Global Challenge 2026',
    type: 'OFFCAMPUS',
    compensation: '₹38.5 LPA',
    matchReasons: [
      'Backend engineering role involving Go and distributed systems.',
      'External application; review the role requirements before applying.',
    ],
    skillsMatched: ['Go', 'PostgreSQL', 'Kafka', 'System Design'],
    externalUrl: 'https://uber.com/careers/engineering-campus',
  },
];

// ============================================================================
// DATA: COLLEGE RECRUITMENT APPLICATIONS (ON-CAMPUS PIPELINE ONLY)
// ============================================================================

const INITIAL_COLLEGE_APPLICATIONS: CollegeJobApplication[] = [
  {
    id: 'app-1',
    driveId: 'tpo-2',
    company: 'Amazon',
    role: 'Software Development Engineer Intern',
    ctc: '₹1.10 Lakh / mo',
    appliedDate: '18 Oct 2026',
    currentStage: 'TECHNICAL_INTERVIEW',
    nextRoundDate: '28 Oct 2026, 02:00 PM IST',
    nextRoundTitle: 'Round 2: Data Structures & System Problem Solving',
    meetLink: 'https://meet.google.com/amz-oj-tech',
    interviewerNotes: 'Candidate demonstrated deep command of B-Trees and distributed caches in the OA screening round.',
  },
  {
    id: 'app-2',
    driveId: 'tpo-1',
    company: 'Microsoft',
    role: 'Software Development Engineer (SDE 1)',
    ctc: '₹44.5 LPA',
    appliedDate: '20 Oct 2026',
    currentStage: 'OA_SHORTLISTED',
    nextRoundDate: '30 Oct 2026, 10:00 AM IST',
    nextRoundTitle: 'Round 1: Online Assessment Screening (Codility)',
    meetLink: 'https://codility.com/c/kiet-msft-2026',
    interviewerNotes: 'Shortlisted directly based on verified GitHub proof-of-work and Top-6 KubePay microservice project.',
  },
  {
    id: 'app-3',
    driveId: 'tpo-7',
    company: 'TCS Digital',
    role: 'System Engineer · Digital Cadre',
    ctc: '₹7.5 LPA',
    appliedDate: '15 Oct 2026',
    currentStage: 'OFFERED',
    nextRoundDate: 'Offer Letter Acceptance Window Active',
    nextRoundTitle: 'Final Selection / Institutional Offer Rolled Out',
    meetLink: '',
    interviewerNotes: 'Cleared all rounds with 92% assessment score. Offer letter issued via CRPC placement records.',
    isOfferAccepted: false,
  },
];

const PIPELINE_STAGES: { stage: ApplicationStage; label: string; stepNumber: number }[] = [
  { stage: 'APPLIED', label: 'Applied', stepNumber: 1 },
  { stage: 'OA_SHORTLISTED', label: 'OA Shortlist', stepNumber: 2 },
  { stage: 'TECHNICAL_INTERVIEW', label: 'Tech Round', stepNumber: 3 },
  { stage: 'HR_ROUND', label: 'HR Round', stepNumber: 4 },
  { stage: 'OFFERED', label: 'Final Offer', stepNumber: 5 },
];

export default function JobsPage() {
  const toast = useToast();
  const { student } = useStudent();
  const [activeTab, setActiveTab] = useState<JobSectionTab>('TPO_DRIVES');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'SDE' | 'INTERN' | 'DATA' | 'DEVOPS'>('ALL');
  const [search, setSearch] = useState('');
  const [collegeApplications, setCollegeApplications] = useState<CollegeJobApplication[]>(INITIAL_COLLEGE_APPLICATIONS);
  const [selectedDriveForModal, setSelectedDriveForModal] = useState<JobDrive | null>(null);

  // Derive Student Academic Metrics for Dynamic Eligibility
  const latestSemester = student.academics[student.academics.length - 1];
  const studentCgpa = latestSemester ? latestSemester.cgpaCumulative : 8.42;
  const activeBacklogs = student.academics.reduce((acc, sem) => acc + sem.activeBacklogs, 0);
  const approvedBadgesCount = student.badges.filter((b) => b.status === 'APPROVED').length;

  // Single Offer Policy tracking
  const acceptedOffer = collegeApplications.find((a) => a.isOfferAccepted);
  const currentOfferCtc = acceptedOffer ? (acceptedOffer.company === 'TCS Digital' ? 7.5 : 12.0) : null;
  const highestCampusDrive = TPO_DRIVES_DATA.reduce(
    (highest, drive) => drive.ctcLpa > highest.ctcLpa ? drive : highest,
    TPO_DRIVES_DATA[0],
  );

  // Superset Strict Eligibility Engine
  function evaluateEligibility(drive: JobDrive) {
    if (studentCgpa < drive.cgpaCutoff) {
      return {
        eligible: false,
        reason: `Minimum CGPA required is ${drive.cgpaCutoff} (Your CGPA: ${studentCgpa.toFixed(2)})`,
      };
    }

    if (!drive.allowedBranches.includes(student.branch)) {
      return {
        eligible: false,
        reason: `Branch ${student.branch} is not eligible. Allowed branches: ${drive.allowedBranches.join(', ')}`,
      };
    }

    if (activeBacklogs > drive.maxBacklogs) {
      return {
        eligible: false,
        reason: `Maximum active backlogs allowed is ${drive.maxBacklogs} (You have: ${activeBacklogs})`,
      };
    }

    if (drive.minVerifiedBadges && approvedBadgesCount < drive.minVerifiedBadges) {
      return {
        eligible: false,
        reason: `Requires at least ${drive.minVerifiedBadges} verified skill badge(s) (You have: ${approvedBadgesCount})`,
      };
    }

    // 1-Student 1-Job Policy: Once an offer is secured, can only apply to Dream drives (>= 1.5x)
    if (currentOfferCtc) {
      const isDreamDrive = drive.isDreamCompany || drive.ctcLpa >= currentOfferCtc * 1.5;
      if (!isDreamDrive) {
        return {
          eligible: false,
          reason: `Single Offer Policy: You already hold an offer of ₹${currentOfferCtc} LPA. You can only apply to Dream drives (>= ₹${(
            currentOfferCtc * 1.5
          ).toFixed(1)} LPA).`,
        };
      }
    }

    return { eligible: true, reason: 'Eligible to apply' };
  }

  const isAppliedToCollege = (driveId: string) => collegeApplications.some((app) => app.driveId === driveId);

  // Filtered TPO Drives
  const filteredTpoDrives = TPO_DRIVES_DATA.filter((job) => {
    const matchesFilter = selectedCategory === 'ALL' || job.category === selectedCategory;
    const matchesSearch =
      search.trim() === '' ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.role.toLowerCase().includes(search.toLowerCase()) ||
      job.requiredTrack.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filtered Off-Campus
  const filteredOffCampus = OFFCAMPUS_POSTINGS.filter((job) => {
    return (
      search.trim() === '' ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.role.toLowerCase().includes(search.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const handleConfirmCollegeApplication = (drive: JobDrive) => {
    const newApp: CollegeJobApplication = {
      id: `app-${Date.now()}`,
      driveId: drive.id,
      company: drive.company,
      role: drive.role,
      ctc: drive.ctc,
      appliedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      currentStage: 'APPLIED',
      nextRoundTitle: 'Resume Screening & Profile Audit by TPO',
      nextRoundDate: 'Within 48 Hours',
    };

    setCollegeApplications((prev) => [newApp, ...prev]);
    setSelectedDriveForModal(null);
    toast(`Successfully applied to ${drive.company}! Audited resume forwarded to recruiter.`, 'success');
  };

  const handleAcceptOffer = (appId: string) => {
    setCollegeApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, isOfferAccepted: true } : app))
    );
    toast('Offer accepted! Placement recorded and standard non-dream drives frozen per college policy.', 'success');
  };

  const handleWithdrawApplication = (appId: string) => {
    setCollegeApplications((prev) => prev.filter((app) => app.id !== appId));
    toast('Application withdrawn successfully.', 'info');
  };

  return (
    <div className="min-h-screen bg-bg text-ink pb-20 transition-colors animate-fade-in">
      <header className="border-b border-line bg-surface/40">
        <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Career center</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Jobs &amp; placements
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                Browse campus drives and off-campus roles, then track your applications in one place.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="font-medium text-ink">{student.branch}</span>
              <span aria-hidden="true">·</span>
              <span>{studentCgpa.toFixed(2)} CGPA</span>
              {currentOfferCtc && (
                <span className="ml-2 rounded-md border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink">
                  Current offer: ₹{currentOfferCtc} LPA
                </span>
              )}
            </div>
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-line bg-surface px-4 py-3">
              <dt className="text-xs text-muted">Highest listed campus package</dt>
              <dd className="mt-1 text-xl font-semibold tracking-tight text-ink">₹{highestCampusDrive.ctcLpa.toFixed(1)} LPA</dd>
              <dd className="mt-0.5 truncate text-xs text-muted">{highestCampusDrive.company}</dd>
            </div>
            <div className="rounded-lg border border-line bg-surface px-4 py-3">
              <dt className="text-xs text-muted">Campus drives</dt>
              <dd className="mt-1 text-xl font-semibold tracking-tight text-ink">{TPO_DRIVES_DATA.length}</dd>
              <dd className="mt-0.5 text-xs text-muted">On-campus opportunities</dd>
            </div>
            <div className="rounded-lg border border-line bg-surface px-4 py-3">
              <dt className="text-xs text-muted">Off-campus roles</dt>
              <dd className="mt-1 text-xl font-semibold tracking-tight text-ink">{OFFCAMPUS_POSTINGS.length}</dd>
              <dd className="mt-0.5 text-xs text-muted">Jobs and internships</dd>
            </div>
            <div className="rounded-lg border border-line bg-surface px-4 py-3">
              <dt className="text-xs text-muted">Your applications</dt>
              <dd className="mt-1 text-xl font-semibold tracking-tight text-ink">{collegeApplications.length}</dd>
              <dd className="mt-0.5 text-xs text-muted">Campus drives</dd>
            </div>
          </dl>

          <nav aria-label="Job sections" className="mt-7 flex items-center gap-1 overflow-x-auto border-b border-line scrollbar-none">
            {/* 1. Jobs by TPO */}
            <button
              type="button"
              aria-current={activeTab === 'TPO_DRIVES' ? 'page' : undefined}
              onClick={() => setActiveTab('TPO_DRIVES')}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-3 text-xs font-semibold transition-colors sm:px-4',
                activeTab === 'TPO_DRIVES'
                  ? 'border-[#0969da] text-[#0969da]'
                  : 'border-transparent text-muted hover:text-ink'
              )}
            >
              <Briefcase className="h-4 w-4" />
              <span>Jobs by TPO (Placement Drives)</span>
              <span className="rounded-full bg-surface2 px-2 py-0.5 text-[10px] text-ink border border-line font-mono">
                {TPO_DRIVES_DATA.length}
              </span>
            </button>

            {/* 2. Off-Campus Jobs & Internship Posting */}
            <button
              type="button"
              aria-current={activeTab === 'OFFCAMPUS' ? 'page' : undefined}
              onClick={() => setActiveTab('OFFCAMPUS')}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-3 text-xs font-semibold transition-colors sm:px-4',
                activeTab === 'OFFCAMPUS'
                  ? 'border-[#0969da] text-[#0969da]'
                  : 'border-transparent text-muted hover:text-ink'
              )}
            >
              <Globe className="h-4 w-4" />
              <span>Off-Campus & Internships</span>
              <span className="rounded-full bg-surface2 px-2 py-0.5 text-[10px] text-ink border border-line font-mono">
                {OFFCAMPUS_POSTINGS.length}
              </span>
            </button>

            {/* 3. Suggested roles */}
            <button
              type="button"
              aria-current={activeTab === 'RECOMMENDED' ? 'page' : undefined}
              onClick={() => setActiveTab('RECOMMENDED')}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-3 text-xs font-semibold transition-colors sm:px-4',
                activeTab === 'RECOMMENDED'
                  ? 'border-[#0969da] text-[#0969da]'
                  : 'border-transparent text-muted hover:text-ink'
              )}
            >
              <Briefcase className="h-4 w-4" />
              <span>Suggested roles</span>
              <span className="rounded-full bg-surface2 px-2 py-0.5 text-[10px] text-ink border border-line font-mono">
                {SUGGESTED_JOBS.length}
              </span>
            </button>

            {/* 4. My Job Application (Only for college placement drive) */}
            <button
              type="button"
              aria-current={activeTab === 'APPLICATIONS' ? 'page' : undefined}
              onClick={() => setActiveTab('APPLICATIONS')}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-3 text-xs font-semibold transition-colors sm:px-4',
                activeTab === 'APPLICATIONS'
                  ? 'border-[#0969da] text-[#0969da]'
                  : 'border-transparent text-muted hover:text-ink'
              )}
            >
              <Building2 className="h-4 w-4" />
              <span>My Applications (College Drives)</span>
              <span className="rounded-full bg-[#0969da]/10 text-[#0969da] px-2 py-0.5 text-[10px] font-bold border border-[#0969da]/20 font-mono">
                {collegeApplications.length}
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ========================================================================= */}
        {/* SECTION 1: JOBS BY TPO (ON-CAMPUS PLACEMENT DRIVES) */}
        {/* ========================================================================= */}
        {activeTab === 'TPO_DRIVES' && (
          <div>
            {/* Controls Bar: Category Filters & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
              {/* Category Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: 'ALL', label: 'All Drives' },
                  { id: 'SDE', label: 'Full-time SDE' },
                  { id: 'INTERN', label: 'Internships' },
                  { id: 'DATA', label: 'Data & AI' },
                  { id: 'DEVOPS', label: 'Cloud & Systems' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id as any)}
                    className={cn(
                      'rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border',
                      selectedCategory === tab.id
                        ? 'bg-[#0969da] text-white border-[#0969da] shadow-2xs'
                        : 'bg-surface text-ink/80 hover:bg-surface2 hover:text-ink border-line'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                <input
                  type="text"
                  placeholder="Search TPO drives, tracks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-9 rounded-lg bg-surface border border-line pl-9 pr-3 text-xs font-medium text-ink placeholder:text-muted outline-none focus:border-[#0969da] shadow-2xs transition-colors"
                />
              </div>
            </div>

            {/* Drives Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTpoDrives.map((job) => {
                const isApplied = isAppliedToCollege(job.id);
                const evalResult = evaluateEligibility(job);

                return (
                  <div
                    key={job.id}
                    className="group flex h-full flex-col rounded-xl border border-line bg-surface p-4 transition-colors hover:border-accent/40 sm:p-5"
                  >
                    <div className="flex-1">
                      {/* Top Company Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface2 text-xs font-semibold text-ink">
                            {job.logoLetter}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-ink transition-colors group-hover:text-accent">
                              {job.company}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-muted mt-0.5">
                              <MapPin className="h-3 w-3 text-muted shrink-0" />
                              <span className="truncate">{job.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col items-end">
                          <span className="text-sm font-semibold tabular-nums text-ink">
                            {job.ctc}
                          </span>
                        </div>
                      </div>

                      {/* Role Title & Type */}
                      <div className="mt-3 min-h-[3.5rem]">
                        <h4 className="text-sm font-semibold leading-snug text-ink">
                          {job.role}
                        </h4>
                        <span className="mt-1.5 inline-block text-xs text-muted">
                          {job.type} · On-Campus Drive
                        </span>
                      </div>

                      <dl className="mt-3 grid grid-cols-[minmax(5.5rem,0.8fr)_minmax(0,1.2fr)] gap-x-3 gap-y-2 border-y border-line py-3 text-xs">
                        <dt className="text-muted">Cutoff</dt>
                        <dd className="text-right font-medium text-ink">{job.cgpaCutoff} CGPA</dd>
                        <dt className="text-muted">Eligible branches</dt>
                        <dd className="break-words text-right font-medium text-ink" title={job.allowedBranches.join(', ')}>
                          {job.allowedBranches.join(', ')}
                        </dd>
                        <dt className="text-muted">Max backlogs</dt>
                        <dd className="break-words text-right font-medium text-ink">{job.maxBacklogs === 0 ? '0 (Zero Tolerance)' : `Max ${job.maxBacklogs}`}</dd>
                        <dt className="text-muted">Required track</dt>
                        <dd className="line-clamp-2 break-words text-right font-medium text-ink" title={job.requiredTrack}>
                          {job.requiredTrack}
                        </dd>
                      </dl>

                      {/* Eligibility Transparency Layer Banner */}
                      <div className="mt-3">
                        {evalResult.eligible ? (
                          <div className="flex min-h-10 min-w-0 items-start gap-2 rounded-lg border border-good/25 bg-good/5 px-3 py-2.5 text-sm font-medium leading-snug text-good">
                            <Check className="mt-0.5 h-4 w-4 shrink-0" />
                            <span className="min-w-0">Meets academic and badge criteria</span>
                          </div>
                        ) : (
                          <div className="flex min-h-10 min-w-0 items-start gap-2 rounded-lg border border-warn/25 bg-warn/5 px-3 py-2.5 text-sm leading-snug text-warn">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span className="min-w-0 break-words">Ineligible: {evalResult.reason}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Apply CTA */}
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                      <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted">
                        <Clock className="h-3.5 w-3.5 text-muted shrink-0" />
                        <span className="truncate">Deadline: {job.deadline}</span>
                      </div>

                      {isApplied ? (
                        <button
                          onClick={() => setActiveTab('APPLICATIONS')}
                          className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface2 px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-ink"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#1a7f37]" />
                          <span>Track in Pipeline</span>
                        </button>
                      ) : evalResult.eligible ? (
                        <button
                          onClick={() => setSelectedDriveForModal(job)}
                          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-xs font-semibold text-accentInk transition-colors hover:opacity-90"
                        >
                          <span>1-Click Apply</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          disabled
                          title={evalResult.reason}
                          className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface2 px-3 py-2 text-xs font-medium text-muted/60"
                        >
                          <Lock className="h-3 w-3" />
                          <span>Locked</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: OFF-CAMPUS JOB & INTERNSHIP POSTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'OFFCAMPUS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
              <div>
                <h2 className="text-lg font-bold text-ink flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#8250df]" />
                  <span>Curated Off-Campus Jobs & Internship Postings</span>
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Verified external openings from top tech companies, hiring hackathons, and corporate career portals. Applications submitted directly on external portals.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                <input
                  type="text"
                  placeholder="Search off-campus roles, skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-9 rounded-lg bg-surface border border-line pl-9 pr-3 text-xs font-medium text-ink placeholder:text-muted outline-none focus:border-[#0969da] shadow-2xs transition-colors"
                />
              </div>
            </div>

            {/* Off-Campus Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOffCampus.map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-line bg-surface p-5 shadow-2xs hover:border-[#8250df]/50 hover:shadow-xs transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-surface2 border border-line text-ink font-bold flex items-center justify-center text-xs shadow-2xs shrink-0">
                          {job.logoLetter}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-[15px] text-ink group-hover:text-[#8250df] transition-colors truncate">
                            {job.company}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-muted mt-0.5">
                            <MapPin className="h-3 w-3 text-muted shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span className="rounded-full bg-[#fbefff] dark:bg-[#382247] text-[#8250df] border border-[#8250df]/30 font-mono font-bold text-xs px-2.5 py-0.5">
                          {job.compensation}
                        </span>
                        {job.isHot && (
                          <span className="text-[9.5px] font-bold text-amber-600 bg-amber-500/10 px-1.5 py-0.2 rounded mt-1 border border-amber-500/20">
                            High Demand
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Role Title */}
                    <div className="mt-4">
                      <h4 className="font-bold text-sm text-ink leading-snug">
                        {job.role}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[10.5px] font-medium text-muted bg-surface2 border border-line px-2 py-0.5 rounded">
                          {job.type}
                        </span>
                        <span className="text-[10.5px] font-medium text-muted bg-surface2 border border-line px-2 py-0.5 rounded">
                          {job.batchEligible}
                        </span>
                        {job.hasReferral && (
                          <span className="text-[10.5px] font-bold text-[#1a7f37] bg-[#dafbe1] px-2 py-0.5 rounded border border-[#4ac26b]/40">
                            Alumni Referral Active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Required Skills */}
                    <div className="mt-4">
                      <span className="text-[10.5px] font-bold text-muted uppercase tracking-wider block mb-1.5">
                        Required Tech & Skills:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {job.requiredSkills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded bg-surface2 border border-line text-ink"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer & Apply External */}
                  <div className="mt-5 pt-3.5 border-t border-line/70 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted">
                      <Clock className="h-3.5 w-3.5 text-muted shrink-0" />
                      <span>Closes: {job.deadline}</span>
                    </div>

                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-surface2 hover:bg-[#8250df] text-ink hover:text-white border border-line hover:border-[#8250df] text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                      <span>Apply on Portal</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: SUGGESTED ROLES */}
        {/* ========================================================================= */}
        {activeTab === 'RECOMMENDED' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
              <div>
                <h2 className="text-lg font-semibold text-ink">
                  Suggested roles
                </h2>
                <p className="mt-1 text-sm text-muted">
                  A shortlist of roles to explore based on your current skills and eligibility.
                </p>
              </div>
              <span className="text-xs text-muted">
                {SUGGESTED_JOBS.length} roles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SUGGESTED_JOBS.map((job) => (
                <div
                  key={job.id}
                  className="space-y-4 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-accent/40 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface2 text-xs font-semibold text-ink">
                        {job.logoLetter}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-ink">{job.company}</h3>
                          <span className="rounded-md border border-line bg-surface2 px-2 py-0.5 text-[10px] font-medium text-muted">
                            {job.type === 'TPO_DRIVE' ? 'Campus' : 'Off-campus'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted">{job.role}</p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-sm font-semibold text-ink">{job.compensation}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-ink">
                      Role highlights
                    </h4>
                    <ul className="space-y-1.5 text-sm text-muted">
                      {job.matchReasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-good" />
                          <span className="leading-relaxed">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {job.skillsMatched.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-line bg-surface2 px-2 py-1 text-[11px] font-medium text-muted"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-end border-t border-line pt-3">
                    {job.type === 'TPO_DRIVE' ? (
                      <button
                        type="button"
                        onClick={() => {
                          const original = TPO_DRIVES_DATA.find((d) => d.id === job.originalDriveId);
                          if (original) setSelectedDriveForModal(original);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-md bg-[#0969da] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0860ca]"
                      >
                        <span>View campus drive</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    ) : (
                      <a
                        href={job.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md bg-[#0969da] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0860ca]"
                      >
                        <span>Apply on Portal</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: MY JOB APPLICATION (ONLY FOR COLLEGE PLACEMENT DRIVE) */}
        {/* ========================================================================= */}
        {activeTab === 'APPLICATIONS' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div>
                <h2 className="text-lg font-bold text-ink flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#0969da]" />
                  <span>My Job Applications (College Placement Drives Only)</span>
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Follow recruitment progress across official KIET on-campus placement drives (OA, Technical Interviews, HR Round, and Final Offer).
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-muted bg-surface2 px-3 py-1 rounded-md border border-line">
                {collegeApplications.length} Drives Active
              </span>
            </div>

            {/* Note about external jobs */}
            <div className="p-3 rounded-lg bg-surface2 border border-line text-xs text-muted flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-[#0969da] shrink-0 mt-0.5" />
              <span>
                <strong>College Placement Policy:</strong> This pipeline tracks institutional placement drives organized through the Training & Placement Office (TPO). External off-campus applications are managed directly on the respective company portals.
              </span>
            </div>

            {collegeApplications.length === 0 ? (
              <div className="rounded-xl border border-line bg-surface p-12 text-center">
                <Briefcase className="h-8 w-8 text-muted mx-auto mb-2" />
                <h3 className="font-bold text-sm text-ink">No College Placement Applications Yet</h3>
                <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-4">
                  Browse eligible TPO placement drives in Section 1 and submit your standardized audited resume in 1-click.
                </p>
                <button
                  onClick={() => setActiveTab('TPO_DRIVES')}
                  className="px-4 py-2 rounded-md bg-[#0969da] text-white text-xs font-semibold shadow-2xs hover:bg-[#0860ca] transition-colors cursor-pointer"
                >
                  Explore Jobs by TPO
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {collegeApplications.map((app) => {
                  const currentStageObj = PIPELINE_STAGES.find((s) => s.stage === app.currentStage) || PIPELINE_STAGES[0];
                  const currentStepNum = currentStageObj.stepNumber;
                  const isOffered = app.currentStage === 'OFFERED';

                  return (
                    <div
                      key={app.id}
                      className="rounded-xl border border-line bg-surface p-5 sm:p-6 shadow-2xs space-y-5 transition-all hover:border-[#0969da]/30"
                    >
                      {/* Top Application Header */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h3 className="text-base font-bold text-ink">{app.company}</h3>
                            <span className="text-xs font-mono font-bold text-[#1a7f37] bg-[#dafbe1] px-2.5 py-0.5 rounded-full border border-[#4ac26b]/40">
                              {app.ctc}
                            </span>
                            {app.isOfferAccepted && (
                              <span className="text-[11px] font-bold text-white bg-[#1f883d] px-2 py-0.5 rounded">
                                Offer Accepted & Locked
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted mt-0.5">
                            {app.role} · Applied on {app.appliedDate} · KIET TPO Drive
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleWithdrawApplication(app.id)}
                            className="text-[11px] text-muted hover:text-red-500 transition-colors px-2.5 py-1 rounded border border-line bg-surface2 cursor-pointer"
                          >
                            Withdraw
                          </button>
                        </div>
                      </div>

                      {/* 5-Step Visual Stepper */}
                      <div className="pt-2 pb-1">
                        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                          {PIPELINE_STAGES.map((s) => {
                            const isCompleted = s.stepNumber < currentStepNum || (isOffered && s.stepNumber <= 5);
                            const isCurrent = s.stepNumber === currentStepNum && !isOffered;

                            return (
                              <div key={s.stage} className="flex flex-col items-center text-center">
                                {/* Bar indicator */}
                                <div
                                  className={cn(
                                    'h-1.5 w-full rounded-full transition-all mb-2',
                                    isCompleted || (isOffered && s.stepNumber === 5)
                                      ? 'bg-[#1f883d]'
                                      : isCurrent
                                      ? 'bg-[#0969da]'
                                      : 'bg-surface2'
                                  )}
                                />
                                <span
                                  className={cn(
                                    'text-[10px] sm:text-xs font-bold leading-tight truncate w-full',
                                    isCurrent ? 'text-[#0969da]' : isCompleted ? 'text-ink' : 'text-muted'
                                  )}
                                >
                                  {s.label}
                                </span>
                                <span className="text-[9.5px] font-mono text-muted hidden sm:inline">
                                  Stage {s.stepNumber}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Live Next Round Action Box */}
                      <div className="rounded-lg bg-surface2/60 border border-line/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                            Current Stage & Interview Details
                          </span>
                          <div className="text-xs font-bold text-ink flex items-center gap-2">
                            <span>{app.nextRoundTitle || 'Evaluation in Progress'}</span>
                            {app.nextRoundDate && (
                              <span className="text-[11px] font-mono text-[#0969da] bg-surface px-2 py-0.5 rounded border border-line">
                                {app.nextRoundDate}
                              </span>
                            )}
                          </div>
                          {app.interviewerNotes && (
                            <p className="text-[11px] text-muted leading-relaxed pt-0.5">
                              <strong>TPO Feedback / Notes:</strong> {app.interviewerNotes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {app.meetLink && (
                            <a
                              href={app.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0969da] hover:bg-[#0860ca] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                            >
                              <Video className="h-3.5 w-3.5" />
                              <span>Join Interview Meet</span>
                              <ExternalLink className="h-3 w-3 opacity-70" />
                            </a>
                          )}

                          {isOffered && !app.isOfferAccepted && (
                            <button
                              onClick={() => handleAcceptOffer(app.id)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#1f883d] hover:bg-[#1a7f37] text-white text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Accept Offer & Freeze Profile</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1-CLICK STANDARDIZED RESUME APPLICATION MODAL (FOR TPO DRIVES) */}
      {/* ========================================================================= */}
      {selectedDriveForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setSelectedDriveForModal(null)}
          />

          <div className="relative w-full max-w-xl rounded-xl bg-surface shadow-xl border border-line overflow-hidden z-10 my-auto animate-fade-up text-ink">
            {/* Header */}
            <div className="p-5 border-b border-line flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0969da] block">
                  Superset Verified Placement Submission
                </span>
                <h3 className="text-lg font-bold text-ink mt-0.5">
                  Confirm Application to {selectedDriveForModal.company}
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  {selectedDriveForModal.role} · {selectedDriveForModal.ctc}
                </p>
              </div>

              <button
                onClick={() => setSelectedDriveForModal(null)}
                className="h-7 w-7 rounded-md bg-surface2 hover:bg-surface border border-line text-muted hover:text-ink flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body: Standardized Audit Resume Summary */}
            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-lg bg-surface2 border border-line space-y-2">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted block">
                  Standardized Audited Candidate Record (Superset ATS Format)
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted block text-[11px]">Full Name:</span>
                    <strong className="text-ink">{student.name}</strong>
                  </div>
                  <div>
                    <span className="text-muted block text-[11px]">College Roll No:</span>
                    <strong className="text-ink font-mono">{student.rollNumber}</strong>
                  </div>
                  <div>
                    <span className="text-muted block text-[11px]">Branch & Batch:</span>
                    <strong className="text-ink">{student.branch} ({student.batchYear})</strong>
                  </div>
                  <div>
                    <span className="text-muted block text-[11px]">Verified Cumulative CGPA:</span>
                    <strong className="text-[#1a7f37] font-mono font-bold">{studentCgpa.toFixed(2)} CGPA</strong>
                  </div>
                </div>
              </div>

              {/* Verified Proof Artifacts forwarded to Recruiter */}
              <div>
                <span className="text-[11px] font-bold text-muted block mb-1.5">
                  Attached Proof-of-Work Artifacts:
                </span>
                <div className="space-y-1.5">
                  <div className="p-2 rounded border border-line bg-surface flex items-center justify-between text-xs">
                    <span className="font-medium text-ink">GitHub 1-Year Contributions</span>
                    <span className="font-mono text-[#0969da]">{student.codingStats?.github?.totalContributions || 482} Commits</span>
                  </div>
                  <div className="p-2 rounded border border-line bg-surface flex items-center justify-between text-xs">
                    <span className="font-medium text-ink">Featured Production Projects</span>
                    <span className="font-mono text-ink">{student.projects.length} Verified Repos</span>
                  </div>
                  <div className="p-2 rounded border border-line bg-surface flex items-center justify-between text-xs">
                    <span className="font-medium text-ink">Approved Skill Badges</span>
                    <span className="font-mono text-[#1a7f37]">{approvedBadgesCount} Badges</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-[11.5px] leading-relaxed">
                <p>
                  <strong>Note on Placement Policy:</strong> By clicking confirm, you consent to forwarding your official KIET marksheet audit and proof-of-work dossier to {selectedDriveForModal.company}'s recruitment panel.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-line bg-surface2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSelectedDriveForModal(null)}
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-muted hover:text-ink hover:bg-surface border border-line transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmCollegeApplication(selectedDriveForModal)}
                className="px-4 py-1.5 rounded-md text-xs font-semibold text-white bg-[#1f883d] hover:bg-[#1a7f37] shadow-2xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Confirm & Submit Application</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
