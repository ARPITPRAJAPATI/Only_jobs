export type TicketCategory =
  | 'COURSE_DOUBT'
  | 'LAB_PROJECT_HELP'
  | 'EXAM_ISSUE'
  | 'TPO_DRIVE'
  | 'BUG_REPORT';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
export type TicketFilter = 'ALL' | 'OPEN' | 'RESOLVED';

export interface SupportTicket {
  id: string;
  category: TicketCategory;
  courseContext: string;
  title: string;
  description: string;
  codeSnippet?: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedHelper: string;
  createdAt: string;
  rating?: number;
}

export type NewTicket = Pick<
  SupportTicket,
  'category' | 'courseContext' | 'title' | 'description' | 'priority' | 'codeSnippet'
>;

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TICK-9021',
    category: 'LAB_PROJECT_HELP',
    courseContext: 'DevOps & Cloud Native — Phase 1: Docker Containerization',
    title: 'Docker daemon permission denied during multi-stage build',
    description:
      'Got permission denied when running `docker build -t app .` inside the campus Linux lab workstation. Needs socket permissions check.',
    codeSnippet:
      '$ docker build -t myapp .\nGot permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock',
    priority: 'HIGH',
    status: 'ASSIGNED',
    assignedHelper: 'Prof. V. Sharma (Faculty Mentor)',
    createdAt: 'Today, 2:15 PM',
  },
  {
    id: 'TICK-8842',
    category: 'TPO_DRIVE',
    courseContext: 'Amazon SDE-1 Campus Placement Drive 2026',
    title: 'Eligibility criteria verification for 7th Sem SGPA',
    description:
      'Submitted marksheet for 6th Sem audit. Requesting expedited TPO clearance for upcoming Amazon shortlisted student list.',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    assignedHelper: 'Er. R. K. Dixit (TPO Officer)',
    createdAt: 'Yesterday, 11:30 AM',
    rating: 5,
  },
];
