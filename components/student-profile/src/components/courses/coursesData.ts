export interface PhaseData {
  title: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCE';
  duration: string;
  modulesCount: number;
  description: string;
  skills: string[];
  examCutoff: number; // e.g. 70
}

export interface CourseNote {
  id: string;
  title: string;
  readTime: string;
  format: 'PDF' | 'MARKDOWN' | 'CHEATSHEET';
  topics: string[];
  contentSummary: string;
  fullContent?: string;
  downloadUrl?: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  difficulty: 'Intermediate' | 'Advanced' | 'Production Capstone';
  estimatedHours: string;
  techStack: string[];
  brief: string;
  architectureHighlights: string[];
  githubTemplateUrl?: string;
}

export interface JobProfile {
  id: string;
  roleTitle: string;
  ctcRange: string;
  demandTier: 'Tier 1 Marquee' | 'High Demand' | 'Startup Core';
  topHiringCompanies: string[];
  placementEligibility: string;
  keyResponsibilities: string[];
}

export interface StudentReview {
  id: string;
  studentName: string;
  rollNumber: string;
  batchYear: string;
  rating: number; // 1-5
  date: string;
  placedCompany?: string;
  placedPackage?: string;
  reviewText: string;
  verifiedCertificateHash?: string;
}

export interface CourseItem {
  id: string;
  slug: string;
  title: string;
  category: 'ALL' | 'FULLSTACK' | 'DEVOPS' | 'DSA' | 'AIML' | 'SYSTEMS' | 'SECURITY' | 'MOBILE';
  categoryLabel: string;
  priceTag: string; // e.g., "$336" or "100% Free · KIET"
  priceType: 'paid-sponsored' | 'free';
  thumbnailUrl: string;
  mentor: {
    name: string;
    avatarUrl: string;
    title: string;
    department: string;
  };
  rating: number; // e.g., 5.00
  reviewCount: number;
  lessonsCount: number;
  studentsCount: number;
  viewsCount: string; // e.g., "12K"
  labHours: number;
  currentPhase: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCE';
  overview: string;
  phases: PhaseData[];
  tpoPartner: string;
  isRecommended?: boolean;
  matchScore?: number;
  matchReason?: string;
  notes?: CourseNote[];
  projectIdeas?: ProjectIdea[];
  jobProfiles?: JobProfile[];
  reviews?: StudentReview[];
}

export const COURSES_DATA: CourseItem[] = [
  {
    id: 'course-1',
    slug: 'fullstack-nextjs-distributed-systems',
    title: 'Learn React & Next.js Distributed Web Applications',
    category: 'FULLSTACK',
    categoryLabel: 'Development',
    priceTag: '$336',
    priceType: 'paid-sponsored',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Kevin Perry',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      title: 'Senior Frontend Architect',
      department: 'Dept of CSE',
    },
    rating: 5.0,
    reviewCount: 142,
    lessonsCount: 8,
    studentsCount: 79,
    viewsCount: '12K',
    labHours: 48,
    currentPhase: 'BEGINNER',
    overview: 'Master React Server Components, Next.js 14 App Router, Prisma ORM, and high-performance server-side rendering for campus placement capstones.',
    phases: [
      {
        title: 'Phase 1: React 18 & TypeScript Foundations',
        level: 'BEGINNER',
        duration: '2 Weeks (16 Hours)',
        modulesCount: 3,
        description: 'Component architecture, custom hooks, TypeScript strict mode, Tailwind CSS utility systems, and state lifting.',
        skills: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite'],
        examCutoff: 70,
      },
      {
        title: 'Phase 2: Next.js 14 App Router & API Architecture',
        level: 'INTERMEDIATE',
        duration: '3 Weeks (20 Hours)',
        modulesCount: 3,
        description: 'Server components vs client components, Server Actions, streaming SSR, PostgreSQL database integration with Prisma.',
        skills: ['Next.js 14', 'PostgreSQL', 'Prisma ORM', 'Server Actions'],
        examCutoff: 75,
      },
      {
        title: 'Phase 3: Production Defense & Distributed Redis Caching',
        level: 'ADVANCE',
        duration: '2 Weeks (12 Hours)',
        modulesCount: 2,
        description: 'Edge functions, Redis caching layer, rate-limiting, Docker multi-stage deployment, and automated CI/CD pipeline defense.',
        skills: ['Docker', 'Redis', 'CI/CD Actions', 'Edge Runtime'],
        examCutoff: 80,
      },
    ],
    tpoPartner: 'Microsoft & Amazon Drive Shortlist',
  },
  {
    id: 'course-2',
    slug: 'python-data-visualization-ml',
    title: 'Learning Python for Data Visualization & Neural Nets',
    category: 'AIML',
    categoryLabel: 'Technology',
    priceTag: '$445',
    priceType: 'paid-sponsored',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Justin Viber',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      title: 'AI Lab Director',
      department: 'KIET AI Research Centre',
    },
    rating: 5.0,
    reviewCount: 98,
    lessonsCount: 5,
    studentsCount: 56,
    viewsCount: '11K',
    labHours: 42,
    currentPhase: 'BEGINNER',
    overview: 'Statistical analysis, NumPy, Pandas, Matplotlib, Seaborn, and PyTorch deep neural network visualization pipelines.',
    phases: [
      {
        title: 'Phase 1: Exploratory Data Analysis & Vector Math',
        level: 'BEGINNER',
        duration: '2 Weeks (14 Hours)',
        modulesCount: 2,
        description: 'NumPy vectorized matrices, Pandas dataframe joins, clean data normalization, and Seaborn visual heatmaps.',
        skills: ['Python 3.12', 'Pandas', 'NumPy', 'Seaborn'],
        examCutoff: 70,
      },
      {
        title: 'Phase 2: Supervised & Unsupervised ML Pipelines',
        level: 'INTERMEDIATE',
        duration: '2 Weeks (16 Hours)',
        modulesCount: 2,
        description: 'Scikit-learn classification, regression, random forests, dimensionality reduction, and evaluation ROC/AUC metrics.',
        skills: ['Scikit-Learn', 'Feature Engineering', 'XGBoost'],
        examCutoff: 75,
      },
      {
        title: 'Phase 3: PyTorch Vision Models & ONNX Deployment',
        level: 'ADVANCE',
        duration: '2 Weeks (12 Hours)',
        modulesCount: 1,
        description: 'Convolutional neural networks, transfer learning with ResNet, ONNX runtime conversion, and FastAPI inference serving.',
        skills: ['PyTorch', 'FastAPI', 'ONNX Runtime', 'Docker ML'],
        examCutoff: 80,
      },
    ],
    tpoPartner: 'NVIDIA & Adobe AI Shortlist',
  },
  {
    id: 'course-3',
    slug: 'cloud-native-kubernetes-devops',
    title: 'Cloud Native Kubernetes from Scratch to Advance',
    category: 'DEVOPS',
    categoryLabel: 'Development',
    priceTag: '$456',
    priceType: 'paid-sponsored',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Mark Joker',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      title: 'DevOps Lead Engineer',
      department: 'KIET Cloud Innovation Club',
    },
    rating: 5.0,
    reviewCount: 210,
    lessonsCount: 3,
    studentsCount: 46,
    viewsCount: '10K',
    labHours: 52,
    currentPhase: 'INTERMEDIATE',
    overview: 'Production Docker containerization, Kubernetes orchestration, Helm packaging, and Prometheus cluster observability.',
    phases: [
      {
        title: 'Phase 1: Linux Namespaces & Docker Internals',
        level: 'BEGINNER',
        duration: '2 Weeks (14 Hours)',
        modulesCount: 1,
        description: 'cgroups, overlay2 storage drivers, multi-stage minimal scratch containers, and docker compose architectures.',
        skills: ['Linux', 'Docker', 'Bash', 'Networking'],
        examCutoff: 70,
      },
      {
        title: 'Phase 2: Kubernetes Core Primitives & Ingress',
        level: 'INTERMEDIATE',
        duration: '3 Weeks (22 Hours)',
        modulesCount: 1,
        description: 'Control plane internals, Pod lifecycles, Deployments, Services, ConfigMaps, Ingress Controllers, and Persistent Volumes.',
        skills: ['Kubernetes', 'Kubeadm', 'Helm v3', 'Ingress NGINX'],
        examCutoff: 75,
      },
      {
        title: 'Phase 3: GitOps with ArgoCD & Prometheus Alerting',
        level: 'ADVANCE',
        duration: '2 Weeks (16 Hours)',
        modulesCount: 1,
        description: 'Declarative GitOps syncing via ArgoCD, canary rollouts, Prometheus metric scrapes, and Grafana dashboards.',
        skills: ['ArgoCD', 'Prometheus', 'Grafana', 'Canary Rollouts'],
        examCutoff: 80,
      },
    ],
    tpoPartner: 'Cisco, RedHat & Oracle Placement Drive',
  },
  {
    id: 'course-4',
    slug: 'complete-web-design-development',
    title: 'Complete Modern Web Design & Front-End Engineering',
    category: 'FULLSTACK',
    categoryLabel: 'Design',
    priceTag: '$360',
    priceType: 'paid-sponsored',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Powel Felio',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      title: 'Staff UI Engineer',
      department: 'Dept of Information Technology',
    },
    rating: 5.0,
    reviewCount: 185,
    lessonsCount: 2,
    studentsCount: 49,
    viewsCount: '09K',
    labHours: 40,
    currentPhase: 'BEGINNER',
    overview: 'Design systems, Figma auto-layouts, micro-interactions, responsive CSS Grid, and zero-slop component libraries.',
    phases: [
      {
        title: 'Phase 1: Design Systems & CSS Grid Typography',
        level: 'BEGINNER',
        duration: '2 Weeks (14 Hours)',
        modulesCount: 1,
        description: 'Design tokens, semantic color spaces (HSL/OKLCH), layout fluid scales, responsive viewport units, and accessibility WCAG AAA.',
        skills: ['Figma', 'CSS Grid', 'Typography', 'WCAG AAA'],
        examCutoff: 70,
      },
      {
        title: 'Phase 2: Interactive Web Components & Motion',
        level: 'INTERMEDIATE',
        duration: '2 Weeks (16 Hours)',
        modulesCount: 1,
        description: 'Custom state machines, Framer Motion spring physics, modal dialog traps, and high-framerate hardware acceleration.',
        skills: ['Framer Motion', 'Radix UI', 'Tailwind CSS', 'State Machines'],
        examCutoff: 75,
      },
      {
        title: 'Phase 3: Production Design System Showcase',
        level: 'ADVANCE',
        duration: '1 Week (10 Hours)',
        modulesCount: 1,
        description: 'Publishing an open-source NPM design system package with Storybook documentation and automated chromatic visual regression tests.',
        skills: ['Storybook', 'NPM Publishing', 'Visual Testing', 'Rollup'],
        examCutoff: 80,
      },
    ],
    tpoPartner: 'Swiggy, Razorpay & CRED Product Team',
  },
  {
    id: 'course-5',
    slug: 'dsa-mastery-cpp-interviews',
    title: 'Data Structures & Algorithms in C++ for FAANG',
    category: 'DSA',
    categoryLabel: 'Technology',
    priceTag: '$123',
    priceType: 'paid-sponsored',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Jerzzy Lamot',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
      title: 'Competitive Coding Coach',
      department: 'KIET ACM Chapter Head',
    },
    rating: 5.0,
    reviewCount: 340,
    lessonsCount: 3,
    studentsCount: 11,
    viewsCount: '12K',
    labHours: 64,
    currentPhase: 'ADVANCE',
    overview: 'C++ STL, dynamic programming, monotonic stacks, graph theory (Dijkstra, Tarjan), and placement coding contest defense.',
    phases: [
      {
        title: 'Phase 1: Memory Pointers & STL Mastery',
        level: 'BEGINNER',
        duration: '3 Weeks (20 Hours)',
        modulesCount: 1,
        description: 'Pointers, references, memory allocation, vectors, sets, maps, binary search patterns, and two-pointer paradigms.',
        skills: ['C++20', 'STL', 'Time Complexity', 'Binary Search'],
        examCutoff: 75,
      },
      {
        title: 'Phase 2: Trees, Graphs & Dynamic Programming',
        level: 'INTERMEDIATE',
        duration: '4 Weeks (28 Hours)',
        modulesCount: 1,
        description: 'Binary lifting for LCA, segment trees, Dijkstra shortest paths, topological sort, bitmask DP, and memoization.',
        skills: ['Segment Trees', 'Dijkstra', 'DP Patterns', 'Recursion'],
        examCutoff: 75,
      },
      {
        title: 'Phase 3: Hard LeetCode Placement Mock Gauntlets',
        level: 'ADVANCE',
        duration: '2 Weeks (16 Hours)',
        modulesCount: 1,
        description: 'Live timed 90-minute algorithmic screening gauntlets under strict memory and time execution constraints.',
        skills: ['Mock Interviews', 'Trie', 'Network Flow', 'Greedy Theory'],
        examCutoff: 85,
      },
    ],
    tpoPartner: 'Google, Atlassian & Directi Placements',
  },
  {
    id: 'course-6',
    slug: 'seven-steps-system-design-power-tips',
    title: '7 Steps To Distributed System Design & Scalability',
    category: 'SYSTEMS',
    categoryLabel: 'Development',
    priceTag: '$455',
    priceType: 'paid-sponsored',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Peter Mark',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
      title: 'Principal Systems Architect',
      department: 'Dept of Computer Science',
    },
    rating: 5.0,
    reviewCount: 164,
    lessonsCount: 2,
    studentsCount: 23,
    viewsCount: '11K',
    labHours: 40,
    currentPhase: 'INTERMEDIATE',
    overview: 'CAP theorem, consistent hashing, message brokers (Kafka/RabbitMQ), database sharding, and real-time distributed feeds.',
    phases: [
      {
        title: 'Phase 1: Fundamentals of Horizontal Scalability',
        level: 'BEGINNER',
        duration: '2 Weeks (12 Hours)',
        modulesCount: 1,
        description: 'Load balancers (L4 vs L7), forward/reverse proxies, caching strategies (Write-Through vs Cache-Aside), and DB replication.',
        skills: ['Load Balancing', 'Caching', 'Replication', 'High Availability'],
        examCutoff: 70,
      },
      {
        title: 'Phase 2: Event-Driven Microservices & Queues',
        level: 'INTERMEDIATE',
        duration: '3 Weeks (18 Hours)',
        modulesCount: 1,
        description: 'Apache Kafka topic partitions, consumer lag, idempotency, distributed transactions (Saga pattern), and gRPC contracts.',
        skills: ['Apache Kafka', 'gRPC', 'Saga Pattern', 'Protocol Buffers'],
        examCutoff: 75,
      },
      {
        title: 'Phase 3: High-QPS Production System Architecture',
        level: 'ADVANCE',
        duration: '2 Weeks (10 Hours)',
        modulesCount: 1,
        description: 'Designing Uber geospatial indexing (H3/S2) or WhatsApp 10M active connection chat architecture under stress.',
        skills: ['Geospatial H3', 'WebSockets', 'Sharding', 'Disaster Recovery'],
        examCutoff: 80,
      },
    ],
    tpoPartner: 'Uber, Morgan Stanley & Goldman Sachs',
  },
  {
    id: 'course-7',
    slug: 'golang-high-concurrency-microservices',
    title: 'High-Concurrency Golang Backend & API Gateways',
    category: 'SYSTEMS',
    categoryLabel: 'Technology',
    priceTag: '$120',
    priceType: 'paid-sponsored',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Marry Franco',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
      title: 'Go Core Maintainer',
      department: 'KIET Systems Engineering Lab',
    },
    rating: 5.0,
    reviewCount: 112,
    lessonsCount: 1,
    studentsCount: 96,
    viewsCount: '06K',
    labHours: 38,
    currentPhase: 'BEGINNER',
    overview: 'Goroutines, channels, mutexes, memory profiling with pprof, Gin framework, and high-throughput zero-allocation network services.',
    phases: [
      {
        title: 'Phase 1: Go Syntax & Concurrency Model',
        level: 'BEGINNER',
        duration: '2 Weeks (14 Hours)',
        modulesCount: 1,
        description: 'Struct composition, interfaces, CSP concurrency with goroutines, buffered channels, select statement, and sync primitives.',
        skills: ['Go 1.22', 'Goroutines', 'Channels', 'Sync.Mutex'],
        examCutoff: 70,
      },
      {
        title: 'Phase 2: Microservice REST & gRPC Services',
        level: 'INTERMEDIATE',
        duration: '2 Weeks (14 Hours)',
        modulesCount: 1,
        description: 'Building JWT auth middlewares, sqlc database queries, structured logging with zap, and OpenTelemetry tracing.',
        skills: ['Gin', 'sqlc', 'OpenTelemetry', 'JWT Auth'],
        examCutoff: 75,
      },
      {
        title: 'Phase 3: High-QPS Benchmark Defense',
        level: 'ADVANCE',
        duration: '2 Weeks (10 Hours)',
        modulesCount: 1,
        description: 'Optimizing memory allocations, using pprof flame graphs, garbage collection tuning, and load testing at 50,000 req/sec.',
        skills: ['pprof', 'Benchmarking', 'GC Tuning', 'Vegeta Load Test'],
        examCutoff: 80,
      },
    ],
    tpoPartner: 'Coinbase, Zerodha & PhonePe Engineering',
  },
  {
    id: 'course-8',
    slug: 'real-life-data-engineering-spark',
    title: 'Real-Life Big Data Pipelines & Snowflake Warehousing',
    category: 'AIML',
    categoryLabel: 'Finance',
    priceTag: '$996',
    priceType: 'paid-sponsored',
    thumbnailUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Rose Marry',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
      title: 'Lead Data Engineer',
      department: 'KIET Data Science Cell',
    },
    rating: 5.0,
    reviewCount: 88,
    lessonsCount: 7,
    studentsCount: 56,
    viewsCount: '10K',
    labHours: 44,
    currentPhase: 'INTERMEDIATE',
    overview: 'Apache Spark distributed transformations, PySpark DataFrame execution plans, DBT models, and Snowflake star schemas.',
    phases: [
      {
        title: 'Phase 1: SQL Analytics & Data Modeling',
        level: 'BEGINNER',
        duration: '2 Weeks (14 Hours)',
        modulesCount: 2,
        description: 'Advanced window functions, recursive CTEs, fact and dimension table modeling, and Parquet columnar storage.',
        skills: ['PostgreSQL', 'Window Functions', 'Data Modeling', 'Parquet'],
        examCutoff: 70,
      },
      {
        title: 'Phase 2: PySpark Distributed Compute Engine',
        level: 'INTERMEDIATE',
        duration: '3 Weeks (18 Hours)',
        modulesCount: 3,
        description: 'Spark architecture, DAG scheduler, catalyst optimizer, broadcast joins, handling data skew, and Delta Lake tables.',
        skills: ['PySpark', 'Delta Lake', 'DAG Optimizer', 'AWS S3'],
        examCutoff: 75,
      },
      {
        title: 'Phase 3: Airflow Orchestration & Modern Cloud Lakehouse',
        level: 'ADVANCE',
        duration: '2 Weeks (12 Hours)',
        modulesCount: 2,
        description: 'Creating production DAGs in Apache Airflow, dbt transformations, Snowflake virtual warehouses, and data quality checks.',
        skills: ['Apache Airflow', 'dbt', 'Snowflake', 'Great Expectations'],
        examCutoff: 80,
      },
    ],
    tpoPartner: 'American Express & Deloitte BigData Teams',
  },
  {
    id: 'course-9',
    slug: 'cybersecurity-penetration-testing',
    title: 'Offensive Cybersecurity, Pen-Testing & Threat Modeling',
    category: 'SECURITY',
    categoryLabel: 'Technology',
    priceTag: '$445',
    priceType: 'paid-sponsored',
    thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Peter Parker',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      title: 'Certified Ethical Hacker',
      department: 'KIET Cyber Shield Cell',
    },
    rating: 5.0,
    reviewCount: 95,
    lessonsCount: 3,
    studentsCount: 53,
    viewsCount: '12K',
    labHours: 36,
    currentPhase: 'BEGINNER',
    overview: 'OWASP Top 10 vulnerabilities, network traffic analysis with Wireshark, Metasploit exploitation, and Linux privilege escalation.',
    phases: [
      {
        title: 'Phase 1: Network Reconnaissance & Port Scanning',
        level: 'BEGINNER',
        duration: '2 Weeks (12 Hours)',
        modulesCount: 1,
        description: 'TCP/IP handshake analysis, Nmap scripting engine, Wireshark packet dissection, and DNS reconnaissance.',
        skills: ['Nmap', 'Wireshark', 'TCP/IP', 'Linux Kali'],
        examCutoff: 70,
      },
      {
        title: 'Phase 2: Web Application Security & OWASP Top 10',
        level: 'INTERMEDIATE',
        duration: '2 Weeks (14 Hours)',
        modulesCount: 1,
        description: 'SQL injection bypasses, Cross-Site Scripting (XSS), CSRF tokens, SSRF exploitation, and Burp Suite Pro scanning.',
        skills: ['Burp Suite', 'SQLi', 'XSS', 'SSRF Exploits'],
        examCutoff: 75,
      },
      {
        title: 'Phase 3: Active Directory Attack Defense & CTF',
        level: 'ADVANCE',
        duration: '2 Weeks (10 Hours)',
        modulesCount: 1,
        description: 'Kerberoasting, Pass-the-Hash, Mimikatz token manipulation, and defending campus infrastructure against lateral movement.',
        skills: ['Active Directory', 'Kerberos', 'Mimikatz', 'SIEM Logs'],
        examCutoff: 80,
      },
    ],
    tpoPartner: 'Palo Alto Networks & KPMG Cyber Security',
  },
  {
    id: 'course-10',
    slug: 'react-native-ios-android-mobile',
    title: 'React Native & Expo for iOS & Android Mobile Apps',
    category: 'MOBILE',
    categoryLabel: 'Development',
    priceTag: '$456',
    priceType: 'paid-sponsored',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Marry Rose',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      title: 'Mobile Tech Lead',
      department: 'KIET Mobile Developers Club',
    },
    rating: 5.0,
    reviewCount: 130,
    lessonsCount: 2,
    studentsCount: 82,
    viewsCount: '11K',
    labHours: 36,
    currentPhase: 'INTERMEDIATE',
    overview: 'Expo Router, native device sensors, SQLite offline synchronization, Reanimated 3 gesture animations, and app store publishing.',
    phases: [
      {
        title: 'Phase 1: React Native Core Components & Layouts',
        level: 'BEGINNER',
        duration: '2 Weeks (12 Hours)',
        modulesCount: 1,
        description: 'Flexbox mobile layouts, touchable interactions, Expo development clients, and native vector icons.',
        skills: ['React Native', 'Expo', 'Flexbox', 'TypeScript'],
        examCutoff: 70,
      },
      {
        title: 'Phase 2: Offline-First SQLite & Push Notifications',
        level: 'INTERMEDIATE',
        duration: '2 Weeks (14 Hours)',
        modulesCount: 1,
        description: 'Local SQLite database schemas, background sync workers, Expo Push Notification tokens, and biometric FaceID auth.',
        skills: ['Expo SQLite', 'Push Notifications', 'Biometrics', 'Zustand'],
        examCutoff: 75,
      },
      {
        title: 'Phase 3: Smooth 60FPS Gestures & EAS Build Deployment',
        level: 'ADVANCE',
        duration: '2 Weeks (10 Hours)',
        modulesCount: 1,
        description: 'React Native Reanimated 3, Gesture Handler 2, EAS build pipelines for .aab and .ipa production app distribution.',
        skills: ['Reanimated 3', 'Gesture Handler', 'EAS Build', 'App Store'],
        examCutoff: 80,
      },
    ],
    tpoPartner: 'Flipkart, Zomato & Paytm Mobile Teams',
  },
  {
    id: 'course-11',
    slug: 'aws-cloud-architect-devops',
    title: 'AWS Certified Solutions Architect & Terraform Cloud',
    category: 'DEVOPS',
    categoryLabel: 'Technology',
    priceTag: '$336',
    priceType: 'paid-sponsored',
    thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Vivi Marian',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      title: 'AWS Community Hero',
      department: 'KIET AWS Academy Lead',
    },
    rating: 5.0,
    reviewCount: 175,
    lessonsCount: 1,
    studentsCount: 86,
    viewsCount: '06K',
    labHours: 45,
    currentPhase: 'BEGINNER',
    overview: 'VPC subnets, internet gateways, EC2 autoscaling, S3 lifecycle rules, IAM security policies, and Terraform Infrastructure as Code.',
    phases: [
      {
        title: 'Phase 1: AWS Core Infrastructure & Networking',
        level: 'BEGINNER',
        duration: '2 Weeks (14 Hours)',
        modulesCount: 1,
        description: 'Custom multi-AZ VPC, public/private subnets, NAT gateways, security groups, and bastion host SSH jump boxes.',
        skills: ['AWS VPC', 'EC2', 'IAM Security', 'S3'],
        examCutoff: 70,
      },
      {
        title: 'Phase 2: Terraform Infrastructure as Code (IaC)',
        level: 'INTERMEDIATE',
        duration: '3 Weeks (18 Hours)',
        modulesCount: 1,
        description: 'HCL syntax, remote S3 state backends with DynamoDB locking, reusable Terraform modules, and environment staging.',
        skills: ['Terraform', 'HCL', 'State Locking', 'RDS Multi-AZ'],
        examCutoff: 75,
      },
      {
        title: 'Phase 3: High-Availability ECS Fargate & CloudWatch',
        level: 'ADVANCE',
        duration: '2 Weeks (13 Hours)',
        modulesCount: 1,
        description: 'Serverless container deployments with AWS ECS Fargate, Application Load Balancers, Route53 health checks, and alarms.',
        skills: ['ECS Fargate', 'ALB', 'CloudWatch', 'Route 53'],
        examCutoff: 80,
      },
    ],
    tpoPartner: 'Amazon AWS, Wipro Cloud & Capgemini',
  },
  {
    id: 'course-12',
    slug: 'spring-boot-enterprise-microservices',
    title: 'Enterprise Java Spring Boot 3 & Kafka Microservices',
    category: 'FULLSTACK',
    categoryLabel: 'Development',
    priceTag: '$360',
    priceType: 'paid-sponsored',
    thumbnailUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    mentor: {
      name: 'Kevin Poul',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      title: 'Principal Java Architect',
      department: 'Dept of Information Technology',
    },
    rating: 5.0,
    reviewCount: 154,
    lessonsCount: 1,
    studentsCount: 96,
    viewsCount: '10K',
    labHours: 44,
    currentPhase: 'ADVANCE',
    overview: 'Spring Boot 3, Java 21 Virtual Threads, Spring Security 6 with OAuth2, Hibernate 6 JPA, and high-performance Kafka messaging.',
    phases: [
      {
        title: 'Phase 1: Modern Java 21 & Spring Boot Fundamentals',
        level: 'BEGINNER',
        duration: '2 Weeks (14 Hours)',
        modulesCount: 1,
        description: 'Virtual threads, record classes, pattern matching, Spring dependency injection, and Spring Data JPA entities.',
        skills: ['Java 21', 'Spring Boot 3', 'Spring Data JPA', 'PostgreSQL'],
        examCutoff: 70,
      },
      {
        title: 'Phase 2: Spring Cloud & Microservices Communication',
        level: 'INTERMEDIATE',
        duration: '3 Weeks (18 Hours)',
        modulesCount: 1,
        description: 'Service registry with Eureka, Spring Cloud Gateway routing, Resilience4j circuit breakers, and distributed tracing.',
        skills: ['Spring Cloud', 'Resilience4j', 'Gateway', 'Micrometer'],
        examCutoff: 75,
      },
      {
        title: 'Phase 3: Event Sourcing & Enterprise Production Defense',
        level: 'ADVANCE',
        duration: '2 Weeks (12 Hours)',
        modulesCount: 1,
        description: 'Kafka event publishing, CQRS read-write separation, Docker Compose deployment, and enterprise unit tests with Testcontainers.',
        skills: ['Apache Kafka', 'CQRS', 'Testcontainers', 'OAuth2'],
        examCutoff: 80,
      },
    ],
    tpoPartner: 'Infosys Wings1, TCS Digital & Cognizant Elevate',
  },
];

export function getCourseBySlug(slug: string): CourseItem | undefined {
  return COURSES_DATA.find((c) => c.slug === slug);
}

export function getCourseNotes(course: CourseItem): CourseNote[] {
  if (course.notes && course.notes.length > 0) return course.notes;

  // DevOps & Cloud Native Track Notes
  if (course.category === 'DEVOPS' || course.slug.includes('devops') || course.slug.includes('kubernetes')) {
    return [
      {
        id: 'note-dev-1',
        title: 'Linux Kernel Namespaces, cgroups & Storage Drivers Cheatsheet',
        readTime: '12 min read',
        format: 'CHEATSHEET',
        topics: ['PID/NET Namespaces', 'cgroups v2 Memory Limits', 'overlay2 Storage Driver', 'iptables/nftables'],
        contentSummary: 'Deep-dive reference explaining how Linux containers isolate process trees, network sockets, and bind mounts at the kernel level without hypervisor overhead.',
        downloadUrl: '#',
      },
      {
        id: 'note-dev-2',
        title: 'Production Docker Multi-Stage Optimization & Container Hardening Guide',
        readTime: '15 min read',
        format: 'CHEATSHEET',
        topics: ['Scratch Base Images', 'Non-Root USER Security', 'BuildKit Cache Mounts', 'CVE Trivy Scans'],
        contentSummary: 'Practical checklist to shrink 1.2GB image bloat down to 35MB distroless micro-containers while eliminating root execution vulnerabilities.',
        downloadUrl: '#',
      },
      {
        id: 'note-dev-3',
        title: 'Kubernetes Production Manifests Architecture & Ingress NGINX Reference',
        readTime: '25 min read',
        format: 'PDF',
        topics: ['Pod Disruption Budgets', 'Topology Spread Constraints', 'Ingress Annotations', 'NetworkPolicies'],
        contentSummary: 'Complete production templates for Deployments, ClusterIP Services, PersistentVolumeClaims, and Cert-Manager Let’s Encrypt automated TLS.',
        downloadUrl: '#',
      },
      {
        id: 'note-dev-4',
        title: 'Prometheus PromQL Metrics Scrapes & Alertmanager SRE Playbook',
        readTime: '18 min read',
        format: 'MARKDOWN',
        topics: ['Rate() vs Irate()', 'Histogram Quantiles (p95/p99)', 'Alert Routing', 'Grafana Dashboards'],
        contentSummary: 'SRE incident playbook with query templates to monitor service level objectives (SLOs), error budgets, and saturation spikes.',
        downloadUrl: '#',
      },
    ];
  }

  // Full Stack Web Track Notes
  if (course.category === 'FULLSTACK' || course.slug.includes('fullstack') || course.slug.includes('nextjs')) {
    return [
      {
        id: 'note-fs-1',
        title: 'Next.js 14 App Router: Server Components, Streaming SSR & Hydration',
        readTime: '16 min read',
        format: 'CHEATSHEET',
        topics: ['React Server Components', 'Suspense Boundaries', 'Streaming SSR', 'Revalidation Tags'],
        contentSummary: 'Detailed architectural breakdown of the React Server Component wire format and zero-bundle-size server libraries.',
        downloadUrl: '#',
      },
      {
        id: 'note-fs-2',
        title: 'High-Performance PostgreSQL Schema Design & Prisma ORM Optimization',
        readTime: '20 min read',
        format: 'PDF',
        topics: ['Composite B-Tree Indexes', 'Connection Pooling (PgBouncer)', 'N+1 Query Solutions', 'ACID Transactions'],
        contentSummary: 'Production strategies for indexing relational queries, handling optimistic locking, and configuring connection pool limits for serverless Lambdas.',
        downloadUrl: '#',
      },
      {
        id: 'note-fs-3',
        title: 'Distributed Redis Caching, Atomic Rate Limiting & Token Buckets',
        readTime: '14 min read',
        format: 'CHEATSHEET',
        topics: ['Redis INCR & EXPIRE', 'Sliding Window Log', 'Pub/Sub WebSockets', 'Cache Invalidation'],
        contentSummary: 'Implementation guide for protecting Express/Next.js APIs against DDoS surges while synchronizing live user activity across instances.',
        downloadUrl: '#',
      },
    ];
  }

  // Default Universal Engineering Notes
  return [
    {
      id: `note-${course.id}-1`,
      title: `${course.title} — Comprehensive Revision Blueprint`,
      readTime: '15 min read',
      format: 'CHEATSHEET',
      topics: ['Core Architecture', 'Best Practices', 'Common Pitfalls', 'Exam Formulas'],
      contentSummary: `Complete conceptual review prepared by ${course.mentor.name} for KIET students preparing for the Phase 1 & 2 gatekeeper assessments.`,
      downloadUrl: '#',
    },
    {
      id: `note-${course.id}-2`,
      title: 'Interview Q&A Cheatsheet for Placement Drives',
      readTime: '22 min read',
      format: 'PDF',
      topics: ['Frequently Asked Questions', 'Code Tracing', 'System Design Trade-offs'],
      contentSummary: 'Curated list of technical interview questions asked by visiting on-campus recruiters (Microsoft, Amazon, Cisco, TCS Digital).',
      downloadUrl: '#',
    },
  ];
}

export function getCourseProjectIdeas(course: CourseItem): ProjectIdea[] {
  if (course.projectIdeas && course.projectIdeas.length > 0) return course.projectIdeas;

  // DevOps Projects
  if (course.category === 'DEVOPS' || course.slug.includes('devops') || course.slug.includes('kubernetes')) {
    return [
      {
        id: 'proj-dev-1',
        title: 'Automated GitOps Multi-Cluster Ingress with ArgoCD & Cilium eBPF',
        difficulty: 'Production Capstone',
        estimatedHours: '40 Hours',
        techStack: ['Kubernetes', 'ArgoCD', 'Helm v3', 'Cilium eBPF', 'Go'],
        brief: 'Build a production-grade declarative GitOps delivery pipeline where code commits automatically deploy across staging and production clusters with automated canary rollouts and zero-downtime rollback triggers.',
        architectureHighlights: [
          'ArgoCD ApplicationSets watching separate GitHub repository branches',
          'Cilium eBPF kernel routing replacing legacy kube-proxy iptables bottlenecks',
          'Automated Slack webhook alerts on sync failure and rollout degradation',
          'Prometheus metrics integration for automated canary analysis',
        ],
        githubTemplateUrl: 'https://github.com/arpit/gitops-multicluster-blueprint',
      },
      {
        id: 'proj-dev-2',
        title: 'Zero-Trust Service Mesh & Distributed Telemetry Platform with Istio',
        difficulty: 'Advanced',
        estimatedHours: '30 Hours',
        techStack: ['Istio', 'Docker', 'Prometheus', 'Jaeger', 'Grafana'],
        brief: 'Deploy a microservices cluster secured with mutual TLS (mTLS) enforcement, fine-grained RBAC authorization policies, rate-limiting Envoy filters, and end-to-end distributed tracing across multiple backend services.',
        architectureHighlights: [
          'Strict mTLS encryption between all inter-service HTTP/gRPC communication',
          'Envoy rate-limiting filter attached to ingress gateway for DDoS mitigation',
          'Jaeger distributed trace visualization for tracking sub-millisecond latencies',
        ],
        githubTemplateUrl: 'https://github.com/arpit/istio-zerotrust-telemetry',
      },
      {
        id: 'proj-dev-3',
        title: 'Self-Healing Kubernetes Event Controller using KEDA & Redis',
        difficulty: 'Intermediate',
        estimatedHours: '20 Hours',
        techStack: ['Go', 'KEDA', 'Redis', 'Docker', 'Kubernetes'],
        brief: 'Implement an event-driven autoscaling worker fleet that scales consumer pods from 0 to 50 based on Redis list queue length and triggers proactive pod restarts upon memory threshold violations.',
        architectureHighlights: [
          'KEDA custom scaledObject tied directly to Redis stream queue depth',
          'Go custom health-check daemon exporting Prometheus metrics to port 9090',
          'Multi-stage Dockerfile packaging a lightweight 12MB Go binary',
        ],
        githubTemplateUrl: 'https://github.com/arpit/keda-redis-autoscale-fleet',
      },
    ];
  }

  // Full Stack Projects
  if (course.category === 'FULLSTACK' || course.slug.includes('fullstack') || course.slug.includes('nextjs')) {
    return [
      {
        id: 'proj-fs-1',
        title: 'KubePay: Microservices Distributed Payment Gateway with Idempotency',
        difficulty: 'Production Capstone',
        estimatedHours: '45 Hours',
        techStack: ['Next.js 14', 'TypeScript', 'PostgreSQL', 'Prisma', 'BullMQ', 'Docker'],
        brief: 'A resilient payment processing system featuring double-entry accounting ledgers, strict idempotency key deduplication on POST routes, distributed job queues, and real-time webhook dispatching.',
        architectureHighlights: [
          'PostgreSQL serializable transactions to guarantee zero double-spend anomalies',
          'BullMQ asynchronous queue with exponential backoff retries for failed webhooks',
          'Argo Rollouts canary deployment configuration with k6 load testing scripts',
        ],
        githubTemplateUrl: 'https://github.com/arpit/kubepay-gateway-core',
      },
      {
        id: 'proj-fs-2',
        title: 'DevPulse: Real-Time Server Fleet Monitoring & WebSocket Telemetry',
        difficulty: 'Advanced',
        estimatedHours: '32 Hours',
        techStack: ['Next.js', 'Go / Rust', 'Redis Streams', 'WebSockets', 'TailwindCSS'],
        brief: 'Lightweight agent streaming host CPU/Memory metrics over WebSockets to a centralized Next.js dashboard with live interactive charts and configurable threshold alerts.',
        architectureHighlights: [
          'Redis Streams Pub/Sub broker fanning out telemetry to concurrent browser tabs',
          'Dynamic charting using Canvas 2D for 60fps smooth real-time metric rendering',
        ],
        githubTemplateUrl: 'https://github.com/arpit/devpulse-telemetry-engine',
      },
    ];
  }

  // Default Universal Project Ideas
  return [
    {
      id: `proj-${course.id}-1`,
      title: `${course.title} — Production Capstone Architecture`,
      difficulty: 'Production Capstone',
      estimatedHours: '35 Hours',
      techStack: course.phases[2]?.skills || ['Node.js', 'PostgreSQL', 'Docker'],
      brief: `End-to-end practical system demonstrating all core competencies acquired throughout the 3-Phase ${course.title} curriculum.`,
      architectureHighlights: [
        'Production-ready containerized microservices architecture',
        'Comprehensive automated integration test coverage',
        'Verifiable documentation ready for TPO placement portfolio showcase',
      ],
      githubTemplateUrl: '#',
    },
    {
      id: `proj-${course.id}-2`,
      title: 'High-Throughput Concurrent Service Benchmark',
      difficulty: 'Intermediate',
      estimatedHours: '20 Hours',
      techStack: course.phases[1]?.skills || ['TypeScript', 'Database', 'Cache'],
      brief: 'Optimize throughput and latency under stress conditions using connection pooling and caching strategies.',
      architectureHighlights: [
        'Load testing setup with k6 / autocannon',
        'Sub-50ms p95 latency targets',
      ],
      githubTemplateUrl: '#',
    },
  ];
}

export function getCourseJobProfiles(course: CourseItem): JobProfile[] {
  if (course.jobProfiles && course.jobProfiles.length > 0) return course.jobProfiles;

  // DevOps Job Profiles
  if (course.category === 'DEVOPS' || course.slug.includes('devops') || course.slug.includes('kubernetes')) {
    return [
      {
        id: 'job-dev-1',
        roleTitle: 'Site Reliability Engineer (SRE)',
        ctcRange: '₹14.0 - ₹36.0 LPA',
        demandTier: 'Tier 1 Marquee',
        topHiringCompanies: ['Cisco Systems', 'Microsoft', 'Uber', 'Google', 'Atlassian'],
        placementEligibility: 'Min 7.0 CGPA & Verified Phase 2 DevOps Certificate',
        keyResponsibilities: [
          'Design and maintain multi-region Kubernetes clusters with 99.99% uptime SLAs',
          'Automate incident response, canary rollouts, and infrastructure as code (Terraform)',
          'Lead post-mortem reviews and configure Prometheus alert routing architectures',
        ],
      },
      {
        id: 'job-dev-2',
        roleTitle: 'Cloud DevOps & Platform Engineer',
        ctcRange: '₹12.0 - ₹28.0 LPA',
        demandTier: 'High Demand',
        topHiringCompanies: ['Amazon', 'Swiggy', 'Oracle', 'Razorpay', 'CRED'],
        placementEligibility: 'Min 6.8 CGPA & Verified Docker/K8s Repos on Profile',
        keyResponsibilities: [
          'Architect CI/CD automation pipelines deploying containerized microservices',
          'Manage cloud infrastructure on AWS/GCP with automated cost-optimization policies',
          'Implement Zero-Trust networking and vulnerability scanning in build pipelines',
        ],
      },
      {
        id: 'job-dev-3',
        roleTitle: 'Platform Infrastructure Architect',
        ctcRange: '₹18.0 - ₹45.0 LPA',
        demandTier: 'Tier 1 Marquee',
        topHiringCompanies: ['Atlassian', 'Goldman Sachs', 'Zomato', 'Cisco'],
        placementEligibility: 'Min 7.5 CGPA & Pinned Microservices Project on Master Profile',
        keyResponsibilities: [
          'Design developer platform tooling and internal developer portals (Backstage)',
          'Scale distributed database clusters (PostgreSQL, Cassandra) and Kafka brokers',
        ],
      },
    ];
  }

  // Full Stack Job Profiles
  if (course.category === 'FULLSTACK' || course.slug.includes('fullstack') || course.slug.includes('nextjs')) {
    return [
      {
        id: 'job-fs-1',
        roleTitle: 'Software Development Engineer (SDE 1 - Full Stack)',
        ctcRange: '₹14.0 - ₹44.5 LPA',
        demandTier: 'Tier 1 Marquee',
        topHiringCompanies: ['Microsoft', 'Amazon', 'Atlassian', 'Swiggy'],
        placementEligibility: 'Min 7.5 CGPA & Pinned Next.js Full Stack Project',
        keyResponsibilities: [
          'Build end-to-end web applications using React Server Components and modern APIs',
          'Optimize database queries, indexing strategies, and multi-tier Redis caches',
        ],
      },
      {
        id: 'job-fs-2',
        roleTitle: 'Associate Frontend Engineer',
        ctcRange: '₹10.0 - ₹24.0 LPA',
        demandTier: 'High Demand',
        topHiringCompanies: ['Razorpay', 'Swiggy', 'Zomato', 'TCS Digital'],
        placementEligibility: 'Min 6.8 CGPA & Verified JavaScript/TypeScript proof',
        keyResponsibilities: [
          'Develop responsive, accessible, and high-framerate web interfaces',
          'Implement state machines, micro-frontends, and client-side performance audits',
        ],
      },
    ];
  }

  // Default Universal Job Profiles
  return [
    {
      id: `job-${course.id}-1`,
      roleTitle: `${course.categoryLabel} Software Engineer`,
      ctcRange: '₹10.0 - ₹26.0 LPA',
      demandTier: 'High Demand',
      topHiringCompanies: ['Cisco', 'TCS Digital', 'Infosys', 'Cognizant', 'Accenture'],
      placementEligibility: 'Min 6.5 CGPA & Course Phase 1+ Certification',
      keyResponsibilities: [
        `Deliver high-quality software solutions in ${course.categoryLabel} domain`,
        'Participate in code reviews, technical testing, and deployment cycles',
      ],
    },
  ];
}

export function getCourseReviews(course: CourseItem): StudentReview[] {
  if (course.reviews && course.reviews.length > 0) return course.reviews;

  // DevOps Reviews
  if (course.category === 'DEVOPS' || course.slug.includes('devops') || course.slug.includes('kubernetes')) {
    return [
      {
        id: 'rev-dev-1',
        studentName: 'Aman Sharma',
        rollNumber: '2100290120015',
        batchYear: 'Batch 2026',
        rating: 5,
        date: '14 Oct 2026',
        placedCompany: 'Cisco Systems',
        placedPackage: '₹18.0 LPA',
        reviewText: 'Phase 1 Linux namespaces and cgroups exam was genuinely rigorous. In Cisco’s Round 2 technical interview, the interviewer asked the exact question about overlay2 storage driver layers and multi-stage container build optimizations. Having the verified certification hash on my profile got me an immediate shortlist!',
        verifiedCertificateHash: 'CERT-KIET-DEV-889102',
      },
      {
        id: 'rev-dev-2',
        studentName: 'Priya Verma',
        rollNumber: '2100290100084',
        batchYear: 'Batch 2026',
        rating: 5,
        date: '19 Oct 2026',
        placedCompany: 'Amazon',
        placedPackage: '₹1.10L / mo Intern',
        reviewText: 'The 3-phase gatekeeping is what sets this apart from typical Udemy courses. You cannot just skip videos—you must pass the server-timed exam with anti-cheat detection. Building the ArgoCD GitOps project idea gave me concrete talking points for the interviewer.',
        verifiedCertificateHash: 'CERT-KIET-DEV-772194',
      },
      {
        id: 'rev-dev-3',
        studentName: 'Rohan Gupta',
        rollNumber: '2200290130092',
        batchYear: 'Batch 2027',
        rating: 5,
        date: '22 Oct 2026',
        placedCompany: '3rd Year Undergrad',
        placedPackage: 'Pre-Placement Track',
        reviewText: 'I just passed Phase 1 after two practice mock tests! The practice mock mode gave me immediate clarity on where I was making mistakes in Linux file permissions and networking sockets. Highly recommended for 3rd years preparing early.',
        verifiedCertificateHash: 'CERT-KIET-DEV-661034',
      },
    ];
  }

  // Full Stack Reviews
  if (course.category === 'FULLSTACK' || course.slug.includes('fullstack') || course.slug.includes('nextjs')) {
    return [
      {
        id: 'rev-fs-1',
        studentName: 'Harshit Tyagi',
        rollNumber: '2100290100052',
        batchYear: 'Batch 2026',
        rating: 5,
        date: '16 Oct 2026',
        placedCompany: 'Microsoft',
        placedPackage: '₹44.5 LPA',
        reviewText: 'The Next.js 14 App Router and Prisma modules in Phase 2 are industry standard. The project ideas on microservices payment gateways (KubePay) helped me stand out in the Microsoft interview loop.',
        verifiedCertificateHash: 'CERT-KIET-WEB-991204',
      },
      {
        id: 'rev-fs-2',
        studentName: 'Simran Kaur',
        rollNumber: '2100290120078',
        batchYear: 'Batch 2026',
        rating: 5,
        date: '21 Oct 2026',
        placedCompany: 'Swiggy',
        placedPackage: '₹24.0 LPA',
        reviewText: 'Loved the server-timed exam interface! The anti-cheating tab switch counter creates actual exam seriousness. The notes on database indexing and connection pooling saved me hours of revision.',
        verifiedCertificateHash: 'CERT-KIET-WEB-441208',
      },
    ];
  }

  // Default Universal Reviews
  return [
    {
      id: `rev-${course.id}-1`,
      studentName: 'Kartik Saxena',
      rollNumber: '2100290100098',
      batchYear: 'Batch 2026',
      rating: 5,
      date: '18 Oct 2026',
      placedCompany: 'TCS Digital',
      placedPackage: '₹7.5 LPA',
      reviewText: `Outstanding track for ${course.categoryLabel}. The 3-phase gatekeeper progression and verified certificates provide authentic proof of work on the KIET placement portal.`,
      verifiedCertificateHash: `CERT-KIET-${course.category}-102938`,
    },
    {
      id: `rev-${course.id}-2`,
      studentName: 'Ananya Roy',
      rollNumber: '2200290120034',
      batchYear: 'Batch 2027',
      rating: 5,
      date: '23 Oct 2026',
      placedCompany: 'Pre-final Year',
      placedPackage: 'Summer Intern Pool',
      reviewText: 'The project ideas and downloadable notes give you a complete semester-long curriculum. Passed Phase 1 on my first attempt after taking the practice mock test!',
      verifiedCertificateHash: `CERT-KIET-${course.category}-449102`,
    },
  ];
}

