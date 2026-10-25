import type { AcademicSemester, Badge, Certification, ContributionDay, Project, Student, StudentBadge } from './types';

/* Deterministic PRNG so server & client render identical data (no hydration mismatch). */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAY = 86_400_000;
const END = Date.UTC(2026, 9, 24); // 24 Oct 2026

function buildYear(seed: number, weekdayP: number, weekendP: number, maxCount: number) {
  const rng = mulberry32(seed);
  const days: { date: string; count: number; dow: number; t: number }[] = [];
  for (let t = END - 364 * DAY; t <= END; t += DAY) {
    const d = new Date(t);
    const dow = d.getUTCDay();
    const wave = Math.sin(t / DAY / 17) * 0.18; // bursty months
    const p = (dow === 0 || dow === 6 ? weekendP : weekdayP) + wave;
    const active = rng() < p;
    const count = active ? Math.max(1, Math.round(rng() * rng() * maxCount)) : 0;
    days.push({ date: d.toISOString().slice(0, 10), count, dow, t });
  }
  return days;
}

function githubStats() {
  const days = buildYear(42, 0.62, 0.32, 14);
  const weeks: { contributionDays: ContributionDay[] }[] = [];
  for (const d of days) {
    if (d.dow === 0 || weeks.length === 0) weeks.push({ contributionDays: [] });
    weeks[weeks.length - 1].contributionDays.push({ date: d.date, contributionCount: d.count });
  }
  return {
    totalContributions: days.reduce((s, d) => s + d.count, 0),
    latestActivity: 'Committed to arpit/kubepay: "feat: add ingress manifest"',
    graphWeeks: weeks,
  };
}

function leetcodeStats() {
  const days = buildYear(7, 0.5, 0.4, 7);
  const submissionCalendar: Record<string, number> = {};
  for (const d of days) if (d.count > 0) submissionCalendar[String(d.t / 1000)] = d.count;
  return { latestActivity: 'Solved "Trapping Rain Water" on Oct 14', submissionCalendar };
}

const sgpas = [8.2, 8.32, 8.55, 8.4, 8.62, 8.43];
const audit = ['VERIFIED', 'VERIFIED', 'VERIFIED', 'VERIFIED', 'SELF_DECLARED', 'SELF_DECLARED'] as const;

const academics: AcademicSemester[] = sgpas.map((sgpa, i) => {
  const upto = sgpas.slice(0, i + 1);
  return {
    id: `sem-${i + 1}`,
    semesterNumber: i + 1,
    sgpa,
    cgpaCumulative: Math.round((upto.reduce((a, b) => a + b, 0) / upto.length) * 100) / 100,
    activeBacklogs: 0,
    deadBacklogs: i === 1 ? 1 : 0,
    resultPdfUrl: `https://example.com/marksheets/sem-${i + 1}.pdf`,
    auditStatus: audit[i],
    auditedBy: audit[i] === 'VERIFIED' ? 'tpo-admin' : null,
    teacherReview: i === 2 ? 'Marksheet matches university portal.' : null,
  };
});

const kubepayReadme = `# KubePay

A **microservices payment gateway** that runs on Kubernetes. Built to learn service meshes, idempotent payment APIs and zero-downtime rollouts.

## Architecture

| Service | Stack | Responsibility |
| --- | --- | --- |
| \`gateway\` | Node.js, Express | AuthN, rate limiting, routing |
| \`ledger\` | Go, PostgreSQL | Double-entry ledger |
| \`notifier\` | Node.js, BullMQ | Webhooks and email receipts |

## Highlights

- Idempotency keys on every write endpoint
- Canary deploys using Argo Rollouts
- 1.2k RPS sustained in k6 load tests (p95 < 80 ms)

## Run locally

\`\`\`bash
make cluster-up
kubectl apply -k deploy/overlays/dev
\`\`\`

> Status: stable — used by two campus club events for ticketing.
`;

const devpulseReadme = `# DevPulse

Distributed **real-time monitoring** for student-run servers.

## Features

- Agent written in Rust (≈3 MB binary)
- WebSocket fan-out with Redis streams
- Alert rules with a tiny DSL

\`\`\`yaml
rule: cpu_high
when: avg(cpu, 5m) > 85
notify: [slack, email]
\`\`\`

## Roadmap

1. Grafana datasource plugin
2. Multi-tenant dashboards
3. Anomaly detection
`;

const notelyReadme = `# Notely

An **offline-first notes PWA** with conflict-free sync.

- IndexedDB storage with a CRDT merge layer
- Installable, works without network
- Markdown editor with live preview

_Work in progress — sync server coming soon._
`;

const projects: Project[] = [
  {
    id: 'proj-kubepay',
    title: 'KubePay',
    shortTagline: 'Microservices payment gateway on Kubernetes with canary rollouts.',
    markdownContent: kubepayReadme,
    githubRepoUrl: 'https://github.com/arpit/kubepay',
    liveDemoUrl: 'https://kubepay.example.com',
    techStack: ['Node.js', 'Go', 'PostgreSQL', 'Kubernetes', 'Docker'],
    aiPlagScore: 4,
    isTeacherApproved: true,
    teacherRemarks: 'Excellent system design. Original work.',
    createdAt: '2026-03-12T10:00:00Z',
  },
  {
    id: 'proj-devpulse',
    title: 'DevPulse',
    shortTagline: 'Distributed real-time monitoring with a Rust agent and WebSocket fan-out.',
    markdownContent: devpulseReadme,
    githubRepoUrl: 'https://github.com/arpit/devpulse',
    liveDemoUrl: null,
    techStack: ['Rust', 'Redis', 'Next.js', 'WebSockets'],
    aiPlagScore: 9,
    isTeacherApproved: false,
    teacherRemarks: null,
    createdAt: '2026-06-02T10:00:00Z',
  },
  {
    id: 'proj-notely',
    title: 'Notely',
    shortTagline: 'Offline-first notes PWA with CRDT-based conflict-free sync.',
    markdownContent: notelyReadme,
    githubRepoUrl: 'https://github.com/arpit/notely',
    liveDemoUrl: 'https://notely.example.com',
    techStack: ['TypeScript', 'IndexedDB', 'PWA', 'Yjs'],
    aiPlagScore: null,
    isTeacherApproved: false,
    teacherRemarks: null,
    createdAt: '2026-09-18T10:00:00Z',
  },
];

export const BADGE_CATALOG: Badge[] = [
  { id: 'b-lc200', title: '200+ LeetCode Solved', iconUrl: 'lucide:code', category: 'DSA', description: 'Solve 200 or more problems on LeetCode.' },
  { id: 'b-hack', title: 'Hackathon Winner', iconUrl: 'lucide:trophy', category: 'COMPETITIVE', description: 'Podium finish at a recognised hackathon.' },
  { id: 'b-oss', title: 'Open Source Contributor', iconUrl: 'lucide:git-merge', category: 'OPEN_SOURCE', description: 'At least one merged PR in a public project.' },
  { id: 'b-cf', title: 'Codeforces Specialist', iconUrl: 'lucide:zap', category: 'COMPETITIVE', description: 'Reach a rating of 1400+ on Codeforces.' },
  { id: 'b-streak', title: '100 Day Code Streak', iconUrl: 'lucide:flame', category: 'DSA', description: 'Code on 100 consecutive days.' },
  { id: 'b-fs', title: 'Full-Stack Builder', iconUrl: 'lucide:layers', category: 'DEV', description: 'Ship a deployed full-stack project.' },
  { id: 'b-gsoc', title: 'GSoC Contributor', iconUrl: 'lucide:star', category: 'OPEN_SOURCE', description: 'Selected for Google Summer of Code.' },
  { id: 'b-cloud', title: 'Cloud Certified', iconUrl: 'lucide:cloud', category: 'DEV', description: 'Hold an associate-level cloud certification.' },
];

const badges: StudentBadge[] = [
  { id: 'sb-1', badgeId: 'b-lc200', status: 'APPROVED', proofUrl: 'https://leetcode.com/u/arpit', verifiedBy: 'tpo-admin', verifiedAt: '2026-08-10T09:00:00Z' },
  { id: 'sb-2', badgeId: 'b-oss', status: 'APPROVED', proofUrl: 'https://github.com/example/repo/pull/123', verifiedBy: 'tpo-admin', verifiedAt: '2026-09-01T09:00:00Z' },
  { id: 'sb-3', badgeId: 'b-hack', status: 'PENDING', proofUrl: 'https://devfolio.co/projects/kubepay' },
  {
    id: 'sb-4',
    badgeId: 'b-cf',
    status: 'REJECTED',
    proofUrl: 'https://codeforces.com/profile/arpit',
    rejectionReason: 'Current rating is 1312 — below the 1400 threshold. Re-apply once you cross it.',
    verifiedBy: 'tpo-admin',
    verifiedAt: '2026-09-20T09:00:00Z',
  },
];

const certifications: Certification[] = [
  {
    id: 'cert-1',
    title: 'Full-Stack Web Development — Level 1',
    issuingOrg: 'KIET Campus Platform',
    isInternalCourse: true,
    certificateHash: 'kiet_3f9a1c7e5b2d8a04c6e91f37b5d20a8e',
    issueDate: '2026-05-14T00:00:00Z',
  },
  {
    id: 'cert-2',
    title: 'AWS Certified Cloud Practitioner',
    issuingOrg: 'Amazon Web Services',
    isInternalCourse: false,
    credentialUrl: 'https://www.credly.com/badges/example',
    issueDate: '2026-02-03T00:00:00Z',
  },
  {
    id: 'cert-3',
    title: 'Data Structures and Algorithms (Elite)',
    issuingOrg: 'NPTEL',
    isInternalCourse: false,
    credentialUrl: 'https://nptel.ac.in/noc/example',
    issueDate: '2025-11-20T00:00:00Z',
  },
];

export const MOCK_STUDENT: Student = {
  id: 'sp-0001',
  tenantId: 'kiet-main',
  name: 'Arpit Prajapati',
  email: 'arpit.prajapati@kiet.edu',
  rollNumber: '2100290100045',
  branch: 'CSE',
  currentSemester: 7,
  batchYear: '2022–2026',
  avatarUrl: null,
  bio: 'Backend & infra enthusiast. Building things that scale, one manifest at a time. Open to SDE / DevOps internships.',
  linkedinUrl: 'https://linkedin.com/in/arpit-prajapati',
  xUrl: 'https://x.com/arpit',
  githubHandle: 'arpit',
  leetcodeHandle: 'arpit_dev',
  codeforcesHandle: 'arpit_cf',
  codechefHandle: 'arpit_cc',
  gfgHandle: null,
  codingStats: { github: githubStats(), leetcode: leetcodeStats() },
  lastStatsSync: '2026-10-24T00:04:31+05:30',
  isAccountFrozen: false,
  pendingFine: 0,
  fraudRemarks: null,
  academics,
  projects,
  certifications,
  badges,
};
