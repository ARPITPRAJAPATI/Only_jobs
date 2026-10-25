'use client';

import { useState, useMemo } from 'react';
import {
  Building2,
  Send,
  CheckCircle2,
  Search,
  Linkedin,
  ExternalLink,
  ShieldCheck,
  FolderGit2,
  X,
  Lock,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useToast } from '@/components/toast';
import { useStudent } from '@/components/store';
import { cn } from '@/lib/utils';
import type { Project } from '@/lib/types';

interface AlumniMentor {
  id: string;
  name: string;
  avatarUrl: string;
  company: string;
  role: string;
  batch: string;
  branch: string;
  domain: string;
  skills: string[];
  packageLpa?: number;
  isPackagePublic: boolean;
  referralSlotsAvailable: number;
  linkedinUrl: string;
  verifiedByTpo: boolean;
}

const ALUMNI_DATA: AlumniMentor[] = [
  {
    id: 'alumni-1',
    name: 'Arpit Prajapati',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    company: 'Microsoft',
    role: 'Software Development Engineer II',
    batch: 'Class of 2024',
    branch: 'CSE',
    domain: 'Distributed Systems',
    skills: ['Next.js', 'Distributed Systems', 'Azure', 'C++'],
    packageLpa: 28.5,
    isPackagePublic: true,
    referralSlotsAvailable: 4,
    linkedinUrl: 'https://linkedin.com',
    verifiedByTpo: true,
  },
  {
    id: 'alumni-2',
    name: 'Priya Verma',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
    company: 'Swiggy',
    role: 'Staff Frontend Engineer',
    batch: 'Class of 2023',
    branch: 'IT',
    domain: 'Frontend & Mobile',
    skills: ['React Native', 'Figma', 'System Design', 'Performance'],
    packageLpa: 24.0,
    isPackagePublic: true,
    referralSlotsAvailable: 6,
    linkedinUrl: 'https://linkedin.com',
    verifiedByTpo: true,
  },
  {
    id: 'alumni-3',
    name: 'Siddharth Sen',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    company: 'Amazon',
    role: 'Cloud Infrastructure SDE',
    batch: 'Class of 2022',
    branch: 'CSE',
    domain: 'Cloud & DevOps',
    skills: ['Golang', 'Kubernetes', 'DynamoDB', 'Microservices'],
    packageLpa: 32.0,
    isPackagePublic: false, // Privacy masked
    referralSlotsAvailable: 2,
    linkedinUrl: 'https://linkedin.com',
    verifiedByTpo: true,
  },
  {
    id: 'alumni-4',
    name: 'Rohan Gupta',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    company: 'Atlassian',
    role: 'Site Reliability Engineer',
    batch: 'Class of 2021',
    branch: 'ECE',
    domain: 'Cloud & DevOps',
    skills: ['Terraform', 'Kafka', 'Linux Internals', 'Python'],
    packageLpa: 26.8,
    isPackagePublic: true,
    referralSlotsAvailable: 3,
    linkedinUrl: 'https://linkedin.com',
    verifiedByTpo: true,
  },
  {
    id: 'alumni-5',
    name: 'Ananya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    company: 'NVIDIA',
    role: 'AI / Machine Learning Engineer',
    batch: 'Class of 2024',
    branch: 'CS-AI',
    domain: 'AI / ML',
    skills: ['PyTorch', 'CUDA', 'TensorRT', 'Computer Vision'],
    packageLpa: 36.5,
    isPackagePublic: true,
    referralSlotsAvailable: 1,
    linkedinUrl: 'https://linkedin.com',
    verifiedByTpo: true,
  },
  {
    id: 'alumni-6',
    name: 'Ayush Saxena',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80',
    company: 'Goldman Sachs',
    role: 'Quantitative Software Engineer',
    batch: 'Class of 2023',
    branch: 'CSE',
    domain: 'Quant & FinTech',
    skills: ['C++20', 'Low Latency', 'Algorithmic Trading', 'SQL'],
    packageLpa: 30.0,
    isPackagePublic: false, // Privacy masked
    referralSlotsAvailable: 5,
    linkedinUrl: 'https://linkedin.com',
    verifiedByTpo: true,
  },
];

const COMPANIES = ['ALL', 'Microsoft', 'Amazon', 'Swiggy', 'Atlassian', 'NVIDIA', 'Goldman Sachs'];
const DOMAINS = ['ALL', 'Distributed Systems', 'Frontend & Mobile', 'Cloud & DevOps', 'AI / ML', 'Quant & FinTech'];
const BATCHES = ['ALL', 'Class of 2024', 'Class of 2023', 'Class of 2022', 'Class of 2021'];

export default function AlumniPage() {
  const toast = useToast();
  const { student } = useStudent();
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('ALL');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [selectedBatch, setSelectedBatch] = useState('ALL');

  // Modal State
  const [selectedMentor, setSelectedMentor] = useState<AlumniMentor | null>(null);
  const [requestPurpose, setRequestPurpose] = useState('Job Referral');
  const [targetRole, setTargetRole] = useState('Software Development Engineer (SDE-1)');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    student.projects[0]?.id || ''
  );
  const [personalPitch, setPersonalPitch] = useState('');
  const [requested, setRequested] = useState<Record<string, { purpose: string; role: string; date: string }>>({});

  const filteredAlumni = useMemo(() => {
    return ALUMNI_DATA.filter((al) => {
      const matchSearch =
        search.trim() === '' ||
        al.name.toLowerCase().includes(search.toLowerCase()) ||
        al.company.toLowerCase().includes(search.toLowerCase()) ||
        al.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

      const matchCompany = selectedCompany === 'ALL' || al.company.toLowerCase() === selectedCompany.toLowerCase();
      const matchDomain = selectedDomain === 'ALL' || al.domain.toLowerCase() === selectedDomain.toLowerCase();
      const matchBatch = selectedBatch === 'ALL' || al.batch.toLowerCase() === selectedBatch.toLowerCase();

      return matchSearch && matchCompany && matchDomain && matchBatch;
    });
  }, [search, selectedCompany, selectedDomain, selectedBatch]);

  const handleOpenModal = (mentor: AlumniMentor) => {
    setSelectedMentor(mentor);
    setPersonalPitch(
      `Hi ${mentor.name.split(' ')[0]}, I am a 4th year ${student.branch} student at KIET with verified skills in ${mentor.skills.slice(0, 2).join(' & ')}. I would love to request guidance/referral for ${mentor.company}.`
    );
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;

    setRequested((prev) => ({
      ...prev,
      [selectedMentor.id]: {
        purpose: requestPurpose,
        role: targetRole,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      },
    }));

    toast(`Referral & guidance ticket sent to ${selectedMentor.name} @ ${selectedMentor.company}!`, 'success');
    setSelectedMentor(null);
  };

  return (
    <div className="min-h-screen bg-bg text-ink pb-20 transition-colors">
      {/* Clean, Airy Theme-Aware Header */}
      <div className="border-b border-line bg-surface/50 py-8 sm:py-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface2 px-2.5 py-0.5 text-[11px] font-semibold text-muted border border-line">
              Alumni Mentorship Network
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              <span>Verified TPO Institutional Records</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink font-sans">
            KIET Alumni Mentorship & Placement Rails
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted max-w-2xl font-normal leading-relaxed">
            Auto-populated strictly from verified campus placement audits. Connect with placed KIET seniors across Microsoft, Amazon, Swiggy, and NVIDIA for employee job referrals, 1-on-1 mock interviews, and portfolio reviews.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-muted">
            <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-[#1a7f37]" />
              <span className="text-ink font-medium">450+ Verified Alumni Mentors</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-[#0969da]" />
              <span className="text-ink font-medium">120+ Big Tech Referrals Placed</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 shadow-2xs">
              <Lock className="h-3 w-3 text-muted" />
              <span className="text-muted font-medium">Strict Privacy Package Controls</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 pt-6">
        {/* Controls Toolbar: Search & Filter Tabs */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative w-full sm:w-[340px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
              <input
                type="text"
                placeholder="Search mentor name, company, skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8.5 rounded-md bg-surface border border-line pl-8.5 pr-3 text-xs font-medium text-ink outline-none focus:border-[#0969da] shadow-2xs transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-muted">
              <Filter className="h-3.5 w-3.5 text-muted" />
              <span>Showing <strong>{filteredAlumni.length}</strong> of {ALUMNI_DATA.length} Verified Alumni</span>
            </div>
          </div>

          {/* Quick Pill Filter Bars */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-line">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted mr-1.5">
              Top Firms:
            </span>
            {COMPANIES.map((company) => (
              <button
                key={company}
                onClick={() => setSelectedCompany(company)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer',
                  selectedCompany === company
                    ? 'bg-[#0969da] text-white shadow-2xs'
                    : 'bg-surface2 text-muted hover:text-ink hover:bg-surface border border-line'
                )}
              >
                {company}
              </button>
            ))}
          </div>

          {/* Domain & Batch Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-muted font-medium">Domain:</span>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="rounded-md border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink outline-none focus:border-[#0969da]"
              >
                {DOMAINS.map((dom) => (
                  <option key={dom} value={dom}>
                    {dom}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-muted font-medium">Batch:</span>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="rounded-md border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink outline-none focus:border-[#0969da]"
              >
                {BATCHES.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>

            {(selectedCompany !== 'ALL' || selectedDomain !== 'ALL' || selectedBatch !== 'ALL' || search) && (
              <button
                onClick={() => {
                  setSelectedCompany('ALL');
                  setSelectedDomain('ALL');
                  setSelectedBatch('ALL');
                  setSearch('');
                }}
                className="text-xs text-[#0969da] hover:underline font-semibold cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Mentors Grid */}
        {filteredAlumni.length === 0 ? (
          <div className="py-20 text-center rounded-xl bg-surface2 border border-line">
            <p className="text-sm font-bold text-muted">
              No alumni mentors match your selected filters.
            </p>
            <button
              onClick={() => {
                setSelectedCompany('ALL');
                setSelectedDomain('ALL');
                setSelectedBatch('ALL');
                setSearch('');
              }}
              className="mt-3 text-xs font-bold text-[#0969da] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlumni.map((alumni) => {
              const reqData = requested[alumni.id];
              const isReq = !!reqData;

              return (
                <div
                  key={alumni.id}
                  className="rounded-md border border-line bg-surface p-4 shadow-2xs hover:border-[#8c959f] transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Avatar & Basic Identity */}
                    <div className="flex items-start gap-3">
                      <img
                        src={alumni.avatarUrl}
                        alt={alumni.name}
                        className="h-11 w-11 rounded-full object-cover border border-line shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 truncate">
                            <h3 className="font-bold text-sm text-ink truncate">
                              {alumni.name}
                            </h3>
                            <span title="Verified KIET Placement Record" className="inline-flex text-[#1a7f37] shrink-0">
                              <CheckCircle2 className="h-3.5 w-3.5 fill-emerald-500/15" />
                            </span>
                          </div>

                          <a
                            href={alumni.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted hover:text-[#0969da] transition-colors p-1"
                            aria-label={`LinkedIn for ${alumni.name}`}
                          >
                            <Linkedin className="h-3.5 w-3.5" />
                          </a>
                        </div>

                        <div className="text-xs font-semibold text-ink mt-0.5 truncate">
                          {alumni.role}
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-muted mt-0.5">
                          <Building2 className="h-3 w-3 text-muted shrink-0" />
                          <span className="font-medium text-ink">{alumni.company}</span>
                          <span>•</span>
                          <span>{alumni.batch}</span>
                          <span>•</span>
                          <span>{alumni.branch}</span>
                        </div>
                      </div>
                    </div>

                    {/* Domain & Placement CTC Box */}
                    <div className="mt-3.5 p-2.5 rounded-md bg-surface2 border border-line space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-muted">Domain:</span>
                        <span className="text-[11px] font-semibold text-ink">{alumni.domain}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-line/60">
                        <span className="text-[11px] text-muted">Verified CTC:</span>
                        {alumni.isPackagePublic && alumni.packageLpa ? (
                          <span className="text-[11.5px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{alumni.packageLpa.toFixed(1)} LPA
                          </span>
                        ) : (
                          <span className="text-[10.5px] text-muted italic flex items-center gap-1">
                            <Lock className="h-2.5 w-2.5" />
                            <span>Confidential (Alumnus masked)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Skills Pills */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {alumni.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded bg-surface2 border border-line px-2 py-0.5 text-[10.5px] font-medium text-ink"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Referral Slots Available */}
                    <div className="mt-3 flex items-center justify-between text-xs text-muted">
                      <span>Available Referral Slots:</span>
                      <strong className="text-[#1a7f37] font-mono font-bold">
                        {alumni.referralSlotsAvailable} Active
                      </strong>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="mt-4 pt-3 border-t border-line flex items-center justify-between gap-3">
                    <span className="text-[11px] text-muted">
                      {isReq ? `Sent on ${reqData.date}` : '1-on-1 Guidance & CV'}
                    </span>

                    <button
                      onClick={() => (isReq ? null : handleOpenModal(alumni))}
                      disabled={isReq}
                      className={cn(
                        'rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border shadow-2xs',
                        isReq
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 cursor-default'
                          : 'bg-[#1f883d] hover:bg-[#1a7f37] text-white border-[#1b1f24]/15 active:scale-95'
                      )}
                    >
                      {isReq ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Referral Requested</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3" />
                          <span>Request Referral</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Interactive Referral & Guidance Request Modal ── */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setSelectedMentor(null)}
          />

          {/* Modal Dialog */}
          <div className="relative w-full max-w-xl rounded-md bg-surface shadow-xl border border-line overflow-hidden z-10 my-auto animate-fade-up text-ink">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-line flex items-start justify-between gap-3 bg-surface2/50">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMentor.avatarUrl}
                  alt={selectedMentor.name}
                  className="h-10 w-10 rounded-full object-cover border border-line"
                />
                <div>
                  <h3 className="text-base font-bold text-ink flex items-center gap-1.5">
                    <span>Request Referral from {selectedMentor.name}</span>
                    <ShieldCheck className="h-4 w-4 text-[#0969da]" />
                  </h3>
                  <p className="text-xs text-muted">
                    {selectedMentor.role} at <strong>{selectedMentor.company}</strong> ({selectedMentor.batch})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMentor(null)}
                className="rounded-md p-1.5 text-muted hover:text-ink hover:bg-surface border border-line transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendRequest} className="p-5 space-y-4">
              {/* Mentorship Purpose Selector */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Mentorship / Referral Purpose
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Job Referral',
                    '1-on-1 Mock Interview',
                    'Resume Review',
                    'Domain Guidance',
                  ].map((purpose) => (
                    <button
                      key={purpose}
                      type="button"
                      onClick={() => setRequestPurpose(purpose)}
                      className={cn(
                        'rounded-md px-3 py-1.5 text-xs font-semibold text-left border transition-all cursor-pointer',
                        requestPurpose === purpose
                          ? 'border-[#0969da] bg-[#0969da]/10 text-[#0969da]'
                          : 'border-line bg-surface text-muted hover:text-ink hover:border-[#8c959f]'
                      )}
                    >
                      {purpose}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Job Role */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Target Role / Opening
                </label>
                <input
                  type="text"
                  required
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Software Development Engineer - Backend (Job ID #98214)"
                  className="w-full rounded-md border border-line bg-surface2 px-3 py-1.5 text-xs font-medium text-ink outline-none focus:border-[#0969da]"
                />
              </div>

              {/* Attached Verified Project Showcase */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                    <FolderGit2 className="h-3.5 w-3.5 text-[#0969da]" />
                    <span>Attach Verified Showcase Project</span>
                  </label>
                  <span className="text-[11px] text-muted">Proof-of-work attached</span>
                </div>

                {student.projects.length > 0 ? (
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full rounded-md border border-line bg-surface2 px-3 py-1.5 text-xs font-medium text-ink outline-none focus:border-[#0969da]"
                  >
                    {student.projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.title} ({proj.techStack?.slice(0, 3).join(', ')})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-muted p-2 rounded bg-surface2 border border-line">
                    No pinned projects found in your profile. You can still submit this referral request.
                  </p>
                )}
              </div>

              {/* Pitch Note */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Personal Note to Senior
                </label>
                <textarea
                  rows={4}
                  required
                  value={personalPitch}
                  onChange={(e) => setPersonalPitch(e.target.value)}
                  placeholder="Introduce yourself, your technical skills, and why you are interested in this position..."
                  className="w-full rounded-md border border-line bg-surface2 p-3 text-xs text-ink outline-none focus:border-[#0969da]"
                />
              </div>

              {/* Notice */}
              <div className="rounded-md bg-surface2 p-3 border border-line text-[11px] text-muted flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#0969da] shrink-0 mt-0.5" />
                <span>
                  Your official KIET profile, CGPA ({student.academics[student.academics.length - 1]?.sgpa || '8.5+'}), and verified code stats will be shared directly with {selectedMentor.name}.
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface2 rounded-md transition-colors border border-line cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#1f883d] hover:bg-[#1a7f37] text-white font-semibold text-xs px-4 py-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  <span>Submit Referral Request</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
