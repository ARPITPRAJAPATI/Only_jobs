'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
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
  ChevronDown,
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

interface FilterDropdownProps {
  label?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  isActivePill?: boolean;
}

function FilterDropdown({
  label,
  value,
  options,
  onChange,
  placeholder = 'Search...',
  isActivePill = false,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    } else {
      setSearchQuery('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [options, searchQuery]);

  return (
    <div ref={containerRef} className={cn('relative grid gap-1.5', label ? 'min-w-[205px]' : 'min-w-[170px]')}>
      {label && <span className="text-[11px] font-semibold text-muted">{label}</span>}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'flex h-10 w-full items-center justify-between gap-2.5 rounded-lg border px-3 text-left text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
          isActivePill
            ? 'border-accent bg-accent text-accent-ink font-semibold'
            : 'border-line bg-surface text-ink hover:border-muted'
        )}
      >
        <span className="truncate">{selectedOption?.label ?? value}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'h-4 w-4 shrink-0 transition-transform',
            open && 'rotate-180',
            isActivePill ? 'text-accent-ink' : 'text-muted'
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={label ?? 'Filter options'}
          className="absolute left-0 top-full z-50 mt-1.5 w-64 max-w-[90vw] rounded-xl border border-line bg-surface p-1.5 shadow-2xl backdrop-blur-md"
        >
          {/* Mini Search Input inside Dropdown */}
          <div className="relative mb-1.5 flex items-center">
            <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-muted" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="h-8 w-full rounded-md border border-line bg-surface2 pl-8 pr-7 text-xs text-ink placeholder:text-muted focus:border-accent focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                className="absolute right-2 text-muted hover:text-ink"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Vertical Scrollable List (Slider) */}
          <div className="max-h-60 overflow-y-auto space-y-0.5 pr-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-muted">No matches found</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={value === option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex min-h-8 w-full items-center rounded-md px-2.5 text-left text-[13px] transition-colors',
                    value === option.value
                      ? 'bg-accent/15 font-semibold text-accent'
                      : 'text-ink hover:bg-surface2'
                  )}
                >
                  <span className="truncate">{option.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
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

const QUICK_COMPANIES = ['Microsoft', 'Amazon', 'Swiggy', 'Atlassian', 'NVIDIA', 'Goldman Sachs'];

// Top 120+ Tech Companies & High-Growth Startups
const ALL_COMPANIES = [
  'ALL',
  // Big Tech & FAANG / Tier-1 MNCs
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Uber', 'Atlassian',
  'Adobe', 'Salesforce', 'Oracle', 'Cisco', 'Intel', 'NVIDIA', 'AMD', 'Qualcomm',
  // FinTech & High-Frequency Trading
  'Goldman Sachs', 'Morgan Stanley', 'JPMorgan Chase', 'DE Shaw', 'Tower Research', 
  'Jane Street', 'Barclays', 'American Express', 'Deutsche Bank', 'WorldQuant', 'Citadel',
  // Indian Unicorns & Product Giants
  'Swiggy', 'Zomato', 'Flipkart', 'Razorpay', 'PhonePe', 'CRED', 'Meesho', 'Zepto',
  'Blinkit', 'InMobi', 'Paytm', 'MakeMyTrip', 'Oyo', 'Ola', 'Urban Company', 'Nykaa',
  'Groww', 'Zerodha', 'Upstox', 'InfoEdge', 'Pine Labs', 'BharatPe', 'CoinSwitch', 'CoinDCX',
  // Global & Indian SaaS Leaders
  'Postman', 'Hasura', 'BrowserStack', 'Innovaccer', 'Druva', 'Icertis', 'Chargebee',
  'Freshworks', 'Zoho', 'Gainsight', 'HighRadius', 'Darwinbox', 'CleverTap', 'LeadSquared',
  'Yellow.ai', 'Gupshup', 'Whatfix',
  // Logistics & Mobility
  'Delhivery', 'Shadowfax', 'Shiprocket', 'Rivigo', 'BlackBuck', 'Porter', 'Rapido',
  'Cars24', 'Spinny', 'CarDekho',
  // Gaming & Media
  'BookMyShow', 'Dream11', 'Games24x7', 'MPL', 'WinZO', 'Nazara',
  // D2C & HealthTech
  'Lenskart', 'Mamaearth', 'Purplle', 'Sugar Cosmetics', 'Tata 1mg', 'PharmEasy',
  'Practo', 'HealthifyMe', 'Cult.fit', 'Rebel Foods',
  // Cloud & Security Infrastructure
  'Snowflake', 'MongoDB', 'Datadog', 'Confluent', 'Palo Alto Networks', 'Fortinet',
  'CrowdStrike', 'Cloudflare', 'Twilio', 'Stripe', 'ServiceNow', 'VMware',
  // Tech Consulting & MNCs
  'IBM', 'SAP', 'Dell', 'HP', 'Capgemini', 'Accenture', 'TCS', 'Infosys', 'Wipro',
  'HCLTech', 'Cognizant', 'LTIMindtree', 'Tech Mahindra'
];

// Top 50+ In-Demand Technical Domains
const ALL_DOMAINS = [
  'ALL',
  'AI / Machine Learning',
  'Generative AI & LLMs',
  'Distributed Systems',
  'Cloud Architecture',
  'DevOps & SRE',
  'Platform Engineering',
  'Site Reliability Engineering (SRE)',
  'Fullstack Development',
  'Frontend Engineering',
  'Backend Engineering',
  'Mobile Development (Android)',
  'Mobile Development (iOS)',
  'Cross-Platform Mobile (React Native / Flutter)',
  'Data Engineering',
  'Big Data & Analytics',
  'Data Science',
  'Cybersecurity & InfoSec',
  'Penetration Testing & Red Teaming',
  'Cloud Security',
  'Application Security (AppSec)',
  'System Design & Architecture',
  'Database Internals & DBA',
  'Microservices & APIs',
  'High Performance Computing (HPC)',
  'Blockchain & Web3',
  'Smart Contracts & DeFi',
  'Computer Vision',
  'Natural Language Processing (NLP)',
  'Deep Learning & MLOps',
  'Embedded Systems & Firmware',
  'IoT & Edge Computing',
  'Robotics & Automation',
  'Quantitative Finance & Trading',
  'FinTech Engineering',
  'Game Development (Unity / Unreal)',
  'AR / VR / Spatial Computing',
  'QA & SDET Automation',
  'Performance Engineering',
  'Linux & Kernel Development',
  'Computer Networks & Protocols',
  'Real-Time Systems (WebRTC / Sockets)',
  'UI/UX Design & Research',
  'Product Management (Technical)',
  'Enterprise SaaS Architecture',
  'E-Commerce Tech',
  'Supply Chain Tech',
  'HealthTech & BioInformatics'
];

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
  const [selectedProjectId, setSelectedProjectId] = useState<string>(student.projects[0]?.id || '');
  const [personalPitch, setPersonalPitch] = useState('');
  const [requested, setRequested] = useState<Record<string, { purpose: string; role: string; date: string }>>({});

  useEffect(() => {
    if (!student.projects.length) {
      setSelectedProjectId('');
      return;
    }

    setSelectedProjectId((current) => {
      if (current && student.projects.some((project) => project.id === current)) {
        return current;
      }
      return student.projects[0].id;
    });
  }, [student.projects]);

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
  const verifiedAlumniCount = ALUMNI_DATA.filter((alumni) => alumni.verifiedByTpo).length;
  const representedCompanyCount = new Set(ALUMNI_DATA.map((alumni) => alumni.company)).size;

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
      <header className="border-b border-line bg-surface/40 text-ink">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 md:flex-row md:items-end md:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Alumni</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Connect with KIET alumni
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              Find alumni by company, experience, or area of expertise, and reach out for career guidance.
            </p>
          </div>

          <dl className="flex items-center gap-6">
            <div>
              <dt className="text-xs text-muted">Verified alumni</dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums text-ink">{verifiedAlumniCount}</dd>
            </div>
            <div className="h-8 border-l border-line" aria-hidden="true" />
            <div>
              <dt className="text-xs text-muted">Companies</dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums text-ink">{representedCompanyCount}</dd>
            </div>
          </dl>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        {/* Controls Toolbar: Search & Filter Tabs */}
        <div className="mb-6 space-y-4 border-b border-line pb-5">
          <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
            {/* Search Bar */}
            <div className="relative w-full sm:max-w-[480px] sm:flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search mentor name, company, skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-line bg-surface pl-10 pr-3.5 text-[13px] text-ink outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div aria-live="polite" className="flex items-center gap-2 text-[13px] text-muted">
              <Filter className="h-3.5 w-3.5 shrink-0" />
              <span>
                Showing <strong className="font-semibold text-ink">{filteredAlumni.length}</strong> of {ALUMNI_DATA.length} alumni
              </span>
            </div>
          </div>

          {/* Quick Pill Filter Bars */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-muted">Company</p>
            <div className="flex flex-wrap items-center gap-2">
              {/* All Companies Searchable Dropdown with Vertical Slider */}
              <FilterDropdown
                value={selectedCompany}
                options={ALL_COMPANIES.map((company) => ({
                  value: company,
                  label: company === 'ALL' ? 'All companies' : company,
                }))}
                onChange={setSelectedCompany}
                placeholder="Search 120+ companies..."
                isActivePill={!QUICK_COMPANIES.includes(selectedCompany)}
              />

              {/* Quick Hardcoded Company Pills */}
              {QUICK_COMPANIES.map((company) => (
                <button
                  key={company}
                  type="button"
                  aria-pressed={selectedCompany === company}
                  onClick={() => setSelectedCompany(company)}
                  className={cn(
                    'h-10 rounded-lg border px-3 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
                    selectedCompany === company
                      ? 'border-accent bg-accent text-accent-ink font-semibold'
                      : 'border-line bg-surface text-muted hover:bg-surface2 hover:text-ink'
                  )}
                >
                  {company}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <FilterDropdown
              label="Area of expertise"
              value={selectedDomain}
              options={ALL_DOMAINS.map((domain) => ({
                value: domain,
                label: domain === 'ALL' ? 'All areas' : domain,
              }))}
              onChange={setSelectedDomain}
              placeholder="Search 50+ domains..."
            />

            <FilterDropdown
              label="Graduation year"
              value={selectedBatch}
              options={BATCHES.map((batch) => ({
                value: batch,
                label: batch === 'ALL' ? 'All years' : batch.replace('Class of ', ''),
              }))}
              onChange={setSelectedBatch}
              placeholder="Search year..."
            />

            {(selectedCompany !== 'ALL' || selectedDomain !== 'ALL' || selectedBatch !== 'ALL' || search) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCompany('ALL');
                  setSelectedDomain('ALL');
                  setSelectedBatch('ALL');
                  setSearch('');
                }}
                className="mb-0.5 min-h-9 px-1.5 text-[13px] font-medium text-accent transition-colors hover:underline"
              >
                Clear filters
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
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredAlumni.map((alumni) => {
              const reqData = requested[alumni.id];
              const isReq = !!reqData;

              return (
                <div
                  key={alumni.id}
                  className="flex h-full flex-col justify-between rounded-xl border border-line bg-surface p-4 shadow-2xs transition-colors hover:border-accent/50 sm:p-5"
                >
                  <div>
                    {/* Top Row: Avatar & Basic Identity */}
                    <div className="flex items-start gap-3.5">
                      <img
                        src={alumni.avatarUrl}
                        alt={alumni.name}
                        className="h-12 w-12 shrink-0 rounded-full border border-line object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-1.5">
                            <h3 className="truncate text-sm font-semibold leading-[18px] text-ink sm:text-[15px]">
                              {alumni.name}
                            </h3>
                            <span title="Verified KIET Placement Record" className="inline-flex shrink-0 text-[#1a7f37]">
                              <CheckCircle2 className="h-4 w-4" />
                            </span>
                          </div>

                          <a
                            href={alumni.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-surface2 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                            aria-label={`LinkedIn for ${alumni.name}`}
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </div>

                        <div className="-mt-0.5 truncate text-xs font-medium leading-4 text-ink sm:text-[13px]">
                          {alumni.role}
                        </div>

                        <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-muted">
                          <Building2 className="h-3 w-3 shrink-0" />
                          <span className="font-medium text-ink">{alumni.company}</span>
                          <span aria-hidden="true">·</span>
                          <span>{alumni.batch.replace('Class of ', '')}</span>
                          <span aria-hidden="true">·</span>
                          <span>{alumni.branch}</span>
                        </div>
                      </div>
                    </div>

                    {/* Domain & Placement CTC Box */}
                    <dl className="mt-4 divide-y divide-line/70 rounded-lg border border-line bg-surface2/60 px-3.5 text-xs">
                      <div className="flex items-center justify-between">
                        <dt className="py-2.5 text-muted">Expertise</dt>
                        <dd className="py-2.5 text-right font-medium text-ink">{alumni.domain}</dd>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <dt className="py-2.5 text-muted">Verified package</dt>
                        {alumni.isPackagePublic && alumni.packageLpa ? (
                          <dd className="py-2.5 font-mono text-[11.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                            ₹{alumni.packageLpa.toFixed(1)} LPA
                          </dd>
                        ) : (
                          <dd className="flex items-center gap-1 py-2.5 text-[10.5px] italic text-muted">
                            <Lock className="h-2.5 w-2.5" />
                            Confidential
                          </dd>
                        )}
                      </div>
                    </dl>

                    {/* Skills Pills */}
                    <div className="mt-4 flex min-h-12 flex-wrap content-start gap-1.5">
                      {alumni.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border border-line bg-surface2 px-2 py-1 text-[10.5px] font-medium text-ink"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Referral Slots Available */}
                    <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                      <span className="text-muted">Referral availability</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 font-medium text-emerald-700 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {alumni.referralSlotsAvailable} slots
                      </span>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
                    <span className="text-xs text-muted">
                      {isReq ? `Sent on ${reqData.date}` : '1-on-1 Guidance & CV'}
                    </span>

                    <button
                      type="button"
                      onClick={() => (isReq ? null : handleOpenModal(alumni))}
                      disabled={isReq}
                      className={cn(
                        'inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors',
                        isReq
                          ? 'cursor-default border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : 'border-accent bg-accent text-accent-ink hover:opacity-90'
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
      </main>

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
