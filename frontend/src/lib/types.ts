// Frontend mirror of the Prisma schema in student_profile_architecture.md

export type AuditStatus = 'SELF_DECLARED' | 'VERIFIED' | 'FLAGGED_FRAUD';
export type BadgeStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ProjectVerification = 'UNVERIFIED' | 'AI_ANALYZED' | 'TEACHER_APPROVED';
export type BadgeCategory = 'DSA' | 'DEV' | 'OPEN_SOURCE' | 'COMPETITIVE';

/* ---------- Nightly cached coding stats (StudentProfile.codingStats JSONB) ---------- */
export interface ContributionDay {
  date: string; // YYYY-MM-DD
  contributionCount: number;
  color?: string;
}
export interface GithubStats {
  totalContributions: number;
  latestActivity: string;
  graphWeeks: { contributionDays: ContributionDay[] }[];
}
export interface LeetcodeStats {
  latestActivity: string;
  /** unix-seconds (UTC midnight) -> number of submissions */
  submissionCalendar: Record<string, number>;
}
export interface CodingStats {
  github?: GithubStats;
  leetcode?: LeetcodeStats;
}

/* ---------- Relations ---------- */
export interface AcademicSemester {
  id: string;
  semesterNumber: number; // 1..8
  sgpa: number;
  cgpaCumulative: number;
  activeBacklogs: number;
  deadBacklogs: number;
  resultPdfUrl: string; // S3/R2 CDN link ("local://name.pdf" in demo mode)
  auditStatus: AuditStatus;
  auditedBy?: string | null;
  teacherReview?: string | null;
}

export interface Project {
  id: string;
  title: string; // <= 120
  shortTagline: string; // <= 200
  markdownContent: string;
  githubRepoUrl?: string | null;
  liveDemoUrl?: string | null;
  techStack: string[];
  aiPlagScore?: number | null; // 0..100
  isTeacherApproved: boolean;
  teacherRemarks?: string | null;
  createdAt: string;
}

export interface Badge {
  id: string;
  title: string;
  /** "lucide:<icon-key>" or an image URL */
  iconUrl: string;
  category: BadgeCategory;
  description?: string | null;
}

export interface StudentBadge {
  id: string;
  badgeId: string;
  status: BadgeStatus;
  proofUrl: string;
  rejectionReason?: string | null;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
}

export interface Certification {
  id: string;
  title: string;
  issuingOrg: string;
  isInternalCourse: boolean;
  certificateHash?: string | null;
  credentialUrl?: string | null;
  certificateFileUrl?: string | null;
  issueDate: string;
}

/* ---------- Aggregate ---------- */
export interface Student {
  id: string;
  tenantId: string;

  // joined from User / college-locked
  name: string;
  email: string;
  rollNumber: string;
  branch: string;
  currentSemester: number;
  batchYear: string;

  // editable
  avatarUrl?: string | null;
  bio?: string | null;
  linkedinUrl?: string | null;
  xUrl?: string | null;
  githubHandle?: string | null;
  leetcodeHandle?: string | null;
  codeforcesHandle?: string | null;
  codechefHandle?: string | null;
  gfgHandle?: string | null;

  codingStats?: CodingStats | null;
  lastStatsSync?: string | null;

  isAccountFrozen: boolean;
  pendingFine: number;
  fraudRemarks?: string | null;

  academics: AcademicSemester[];
  projects: Project[];
  certifications: Certification[];
  badges: StudentBadge[];
}

export type EditableProfileFields = Pick<
  Student,
  | 'avatarUrl'
  | 'bio'
  | 'linkedinUrl'
  | 'xUrl'
  | 'githubHandle'
  | 'leetcodeHandle'
  | 'codeforcesHandle'
  | 'codechefHandle'
  | 'gfgHandle'
>;
