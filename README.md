# 🎓 KIET Campus Talent & Career Development Platform
> **Codename:** `Only_Jobs` • **Target Scale:** KIET Group of Institutions (~7,000+ Students)  
> **Mission:** Replacing resume fraud, unorganized WhatsApp placement groups, and static portals with **verifiable proof of work**, continuous peer motivation, institutional placement policies, and deep AI-driven skill intelligence.

---

## 📌 Executive Summary: Why This Platform?

Current campus placement systems and generic social networks fail Indian engineering institutions in two fundamental ways:
1. **Resume Inflation & Zero Proof:** Students copy-paste projects and self-claim marks. Recruiters and TPOs waste hundreds of hours manually screening unverified claims.
2. **Operational Chaos for TPO:** Managing 1-student-1-job rules, dream company upgrades, branch eligibility filters, and backlog policies across Google Sheets and WhatsApp is error-prone and stressful.

**Only_Jobs** solves this with an institutional, proof-first ecosystem:
* **Students:** 1st-to-4th-year growth ladders, automated nightly GitHub/LeetCode sync, AI code-quality scoring, and verified academic credentials.
* **Faculty:** Noise-free lab project rooms with zero conversational clutter, automated AST code similarity checks, and 1-click evaluations.
* **TPO (Placement Cell):** Superset-grade automated placement drives, dynamic JSONB eligibility filters, automated 1-student-1-job policy locks, and instant recruiter talent extraction.
* **Leadership (Deans & HODs):** Real-time department skill heatmaps, verified student benchmark matrices, and data-backed placement analytics.

---

## 🏗️ High-Level System Architecture

The platform is designed as a **high-throughput Modular Monolith** (Node.js/Express) coupled with an **asynchronous Worker Queue** (Redis + BullMQ) and a specialized **AI Code Intelligence Microservice** (Python + FastAPI).

```mermaid
flowchart TD
    subgraph STAKEHOLDERS["👥 Campus Stakeholders"]
        S["🎓 Student<br/>(1st–4th Year)"]
        F["👨‍🏫 Faculty / Lab Instructor"]
        T["🏛️ TPO / Placement Cell"]
        R["💼 Recruiter / Startup Partner"]
    end

    subgraph GATEWAY["⚡ API Gateway & Security Layer"]
        GW["Express.js Gateway<br/>• @kiet.edu SSO & JWT Auth<br/>• Role-Based Access Control (RBAC)<br/>• Redis Rate Limiter (3 Posts/Day Guard)"]
    end

    subgraph MONOLITH["🏢 Core Backend Monolith (Node.js + Express)"]
        M1["M1: Student Profile & Academics"]
        M2["M2: Superset Placement Engine"]
        M3["M3: Campus Social & Benchmark Feed"]
        M4["M4: Class Project Rooms (Zero-Text)"]
        M5["M5: 3-Phase Learning Engine"]
        M6["M6: Server-Timed Exam Engine"]
    end

    subgraph DATA_TIER["💾 Storage & Queuing Tier"]
        PG[("🐘 PostgreSQL + Prisma<br/>(Transactional Data & pgvector)")]
        REDIS[("🔴 Redis + BullMQ<br/>(Cache, Rate Limits & Job Queues)")]
        S3["☁️ AWS S3 / Cloudflare R2<br/>(Presigned Marksheet & Media Uploads)"]
    end

    subgraph WORKERS["⚙️ Background Workers (BullMQ)"]
        W1["Nightly Coding Sync Worker<br/>(00:00 AM Cron)"]
        W2["Exam Auto-Submit Worker<br/>(Server Timers)"]
        W3["Drive Notification Worker<br/>(Email / In-App Alerts)"]
    end

    subgraph AI_SERVICE["🧠 AI Intelligence Microservice (Python FastAPI)"]
        AI1["Tree-Sitter AST Code Inspection"]
        AI2["Project Plagiarism & Similarity Detection"]
        AI3["384-Dim pgvector Candidate-Job Matcher"]
    end

    S & F & T & R --> GW
    GW --> MONOLITH
    MONOLITH <--> PG
    MONOLITH <--> REDIS
    MONOLITH --> S3

    REDIS --> WORKERS
    WORKERS --> AI_SERVICE
    AI_SERVICE <--> PG
```

---

## ⚡ Core Operational Workflows

### 1. Verified Proof-of-Work & Nightly Sync Pipeline
Instead of querying third-party APIs during page loads (which causes latency and rate limits), student activity is synchronized asynchronously every night and enriched with AI code analysis.

```mermaid
sequenceDiagram
    autonumber
    participant Cron as ⏰ Node-Cron (00:00 AM)
    participant Queue as 🔴 Redis Queue (BullMQ)
    participant Worker as ⚙️ Sync Worker
    participant External as 🌐 GitHub / LeetCode / Codeforces
    participant AI as 🧠 FastAPI AI Microservice
    participant DB as 🐘 PostgreSQL (Prisma)
    participant Client as 📱 Student Profile Client

    Cron->>Queue: Dispatch 'sync-student-coding-stats' (7,000 jobs)
    Queue->>Worker: Consume next student batch
    Worker->>External: Fetch GitHub Commits & LeetCode Solves
    External-->>Worker: Return Raw Activity & Language Breakdown
    Worker->>AI: Send Repository AST & Code Samples
    AI-->>Worker: Return Code Quality Score & Plagiarism Index
    Worker->>DB: Save to StudentProfile (JSONB codingStats + vector)
    
    Note over Client,DB: Next morning profile visit:
    Client->>DB: Fetch Profile by Roll No
    DB-->>Client: Cached verified proof-of-work in < 10ms
```

---

### 2. Superset-Grade Placement Drive & Policy Enforcement
Automates end-to-end placement operations while strictly enforcing college hiring policies (e.g., **1-Student 1-Job** and **Dream Company Upgrade** rules).

```mermaid
flowchart TD
    A["🏛️ TPO Creates Placement Drive<br/>(Job Role, CTC, Dynamic JSONB Criteria)"] --> B["⚡ Auto-Filter Eligible Students<br/>(CGPA, Backlogs, Branch, Verified Skills)"]
    B --> C["📩 Notification Sent to Eligible Candidates"]
    C --> D["🎓 Student Applies with 1-Click Dossier"]
    D --> E["📋 Multi-Round Pipeline<br/>(Shortlist ➔ OA Test ➔ Technical ➔ HR)"]
    E --> F{"🎉 Candidate Selected for Offer?"}
    F -- No --> G["Retains Active Application Status"]
    F -- Yes --> H["Institutional Policy Check Engine"]
    
    H --> I{"Existing Active Offer?"}
    I -- No --> J["✅ Mark as PLACED<br/>Freeze general applications"]
    I -- Yes --> K{"Is New Drive a 'Dream Company'?<br/>(CTC > 2x Current Offer)"}
    K -- Yes --> L["🚀 Allow Dream Upgrade<br/>Release previous offer for waitlist"]
    K -- No --> M["🚫 Block Application<br/>Enforce 1-Student 1-Job rule"]
```

---

### 3. Faculty Class Project Room & Zero-Text Anti-Plagiarism Flow
Lab submissions are kept noise-free: conversational chit-chat is blocked, requiring clean repository links and screenshots reviewed with 1-click teacher grading and automated AST analysis.

```mermaid
flowchart LR
    Student["🎓 Student"] -->|"Submits Repo + Screenshot<br/>(Zero Text Allowed)"| Guard["🛡️ Zod Validation Guard"]
    Guard -->|"Valid Submission"| Room["📂 Class Project Room"]
    Room -->|"Dispatches Job"| AI["🧠 AST Plagiarism Checker"]
    AI -->|"Computes Similarity"| Score["📊 Code Authenticity Score"]
    Score --> Teacher["👨‍🏫 Faculty Dashboard"]
    Teacher -->|"1-Click Action"| Action["✅ Approve / Verified Badge<br/>⚠️ Request Resubmission<br/>🚩 Flag Academic Fraud"]
```

---

## 🛠️ Technology Stack

| Layer | Technologies | Key Architectural Role |
| :--- | :--- | :--- |
| **Backend Monolith** | **Node.js • Express** | High-concurrency modular monolith with strict domain boundaries |
| **Database & ORM** | **PostgreSQL • Prisma • pgvector** | ACID compliance, JSONB eligibility queries, and 384-dim skill embeddings |
| **Caching & Queues** | **Redis • BullMQ** | Atomic rate limiting (3 posts/day), nightly coding sync, and delayed auto-submits |
| **AI Microservice** | **Python • FastAPI • Tree-Sitter** | AST code parsing, semantic project deduplication, and talent matchmaking |
| **Storage & Media** | **AWS S3 / Cloudflare R2** | Presigned direct uploads for marksheet PDFs, project screenshots, and avatars |
| **Client UI** | **Next.js (App Router) • Tailwind CSS** | Fast server-side rendering, role-tailored dashboards, and dark-mode styling |
| **Infra & DevOps** | **Docker • GitHub Actions** | Multi-container compose (API + Worker + Redis + Postgres + AI Service) |

---

## 📂 Repository Architecture & Documentation Map

Detailed engineering specifications, database schemas, and architectural blueprints are organized into two key directories:

```
Only_jobs/
├── README.md                                    # Master platform guide & architecture
├── plan/                                        # 🏛️ Core Platform Specifications
│   ├── system_design_hdd.md                     # Complete High-Level Design Document (HDD)
│   ├── plan.md                                  # 10-Day Dean roadmap & 6-month development sprints
│   ├── student_profile_architecture.md          # Profile sub-modules, database models & sync
│   ├── superset_placement_engine.md             # Placement drive automation & policy rules
│   ├── campus_feed_architecture.md              # Social motivation feed & Redis rate limiting
│   ├── class_project_rooms_architecture.md      # Zero-text lab submissions & grading
│   ├── learning_and_certification_engine.md     # 3-phase progression & verifiable certificates
│   ├── exam_and_mock_test_engine.md             # Server-timed tests & anti-cheat telemetry
│   ├── alumni_directory_architecture.md         # Alumni graduation transition & privacy toggles
│   └── helper_mentor_support_engine.md          # Load-balanced peer mentor ticket queues
└── ai/                                          # 🧠 AI-Enhanced Feature Specifications
    ├── student-profile-system.md                # AI AST depth, topic matrix & vector embeddings
    ├── superset_placement_engine.md             # Semantic candidate matching & recruiter dossiers
    ├── class_project_rooms_architecture.md      # Tree-sitter code similarity & quality grading
    ├── exam_and_mock_test_engine.md             # AI anomaly detection & anti-cheating telemetry
    ├── learning_and_certification_engine.md     # AI skill-gap analysis & path recommendations
    └── helper_mentor_support_engine.md          # AI first-response doubt bot & smart routing
```

---

## 🎯 Master Functional Modules Overview

| # | Module | Core Functionality | Primary Stakeholders |
|:---|:---|:---|:---|
| **M1** | **[Student Profile System](plan/student_profile_architecture.md)** | Admin-locked college meta (`@kiet.edu`), nightly coding sync (GitHub/LeetCode), self-declared marks with S3 presigned marksheets, fraud audit trail. | Student, TPO, Dean |
| **M2** | **[Placement Engine](plan/superset_placement_engine.md)** | Superset-grade ATS, dynamic JSONB eligibility criteria, multi-round selection pipeline, 1-student 1-job rule, and dream company upgrade logic. | TPO, Student, Recruiter |
| **M3** | **[Campus Feed](plan/campus_feed_architecture.md)** | Achievement & peer motivation hub with Redis atomic 3-posts-per-day rate limits, cursor pagination, and anti-spam controls. | Student, Faculty, Dean |
| **M4** | **[Class Project Rooms](plan/class_project_rooms_architecture.md)** | Zero-text submission drop box (screenshots + repository URL only) with automated AST plagiarism checks and 1-click teacher review. | Student, Faculty |
| **M5** | **[Learning & Certification](plan/learning_and_certification_engine.md)** | Sequential gatekeeping (Beginner $\rightarrow$ Intermediate $\rightarrow$ Advanced), comprehensive milestone checkpoints, and auto-minted verifiable credentials. | Student, Mentors |
| **M6** | **[Exam & Mock Test Engine](plan/exam_and_mock_test_engine.md)** | Server-enforced test windows, BullMQ delayed auto-submit workers, and anti-cheating telemetry (disqualification on 3 tab switches). | Student, Faculty |
| **M7** | **[Alumni Network](plan/alumni_directory_architecture.md)** | Automated graduation transition, package privacy toggles (`isPackagePublic`), and multi-dimensional company/role search. | Student, Alumni |
| **M8** | **[Mentor Support Engine](plan/helper_mentor_support_engine.md)** | Structured doubt ticketing, round-robin routing to least-busy peer mentors/TAs, and AI-assisted instant answers. | Student, TA/Mentors |
| **M9** | **[AI Code Intelligence](ai/student-profile-system.md)** | AST code parsing, cross-repository plagiarism analysis, and semantic candidate-to-job matching using vector embeddings. | TPO, Recruiters |

---

## 📅 Roadmap & Milestones

* **Phase 1: Architectural Design & Dean Pitch (Current - October 2026)**
  * Finalize High-Level Design Document (`system_design_hdd.md`).
  * Target Pitch Date: **25 October 2026** — Presentation to Dean, KIET Group of Institutions.
  * Controlled Pilot Approval: 100 students across the CSE / IT department.
* **Phase 2: Core Platform & Sync Pipeline (Nov 2026 – Jan 2027)**
  * Core Express Monolith, PostgreSQL Prisma models, Redis BullMQ nightly sync.
  * Student Profile & Class Project Rooms rollout.
* **Phase 3: Superset Placement ATS & Exams (Feb 2027 – Mar 2027)**
  * Placement drive engine with dynamic JSONB rules and 1-student-1-job enforcement.
  * Server-timed mock test engine with anti-cheat telemetry.
* **Phase 4: AI Microservice & Campus-Wide Launch (April 2027 onwards)**
  * FastAPI AST inspection service and semantic candidate matchmaking.
  * Scale platform to all 7,000+ students across all engineering branches.

---

## 👥 Core Project Team

* **Arpit Prajapati** — *Backend Architecture, Database Design, System Blueprinting & DevOps Lead*
* **Frontend Lead** — *Next.js Client Architecture, UI/UX Design System & Micro-Interactions*
* **AI & Data Specialist** — *Python FastAPI Microservice, AST Code Analysis & External APIs*
* **Product & Institutional Liaison** — *Institutional Workflows, Dean Presentation & Pilot Management*

---
*Maintained under strict engineering discipline. Designed for KIET Group of Institutions.*
