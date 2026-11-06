# ONLY_JOBS Backend — Complete Architecture & System Maps

---

## 1. High-Level Architecture Map

Ye diagram dikhata hai ki client se aayi hui HTTP request kis tarah backend ke alag-alag layers se guzarti hai:

```mermaid
flowchart TD
    Client["Client (Browser / Postman / Next.js)"] -->|"HTTP Request"| Server["server.js (Express App :5000)"]
    
    subgraph Global_Middlewares ["Global Middlewares"]
        Server --> Cors["cors()"]
        Cors --> Json["express.json()"]
        Json --> Cookie["cookieParser()"]
    end
    
    Cookie --> Health["GET /health (Public Healthcheck)"]
    Cookie --> AuthRouter["/api/auth (auth.routes.js)"]
    Cookie --> ApiRouter["/api (api.routes.js)"]
    
    subgraph Public_Auth ["Public Auth Endpoints"]
        AuthRouter --> RegisterStaff["POST /register (Staff self-registration)"]
        AuthRouter --> Login["POST /login (User login)"]
    end
    
    subgraph Protected_Auth ["Protected Auth Endpoints (authenticateUser)"]
        AuthRouter --> Logout["POST /logout"]
        AuthRouter --> Me["GET /me"]
        AuthRouter --> StaffProfile["GET, PUT /staff/profile (DEAN, TEACHER, TPO)"]
        AuthRouter --> ChangePass["PATCH /change-password"]
        AuthRouter --> ProvStudent["POST /students/register (ADMIN)"]
    end

    subgraph Centralized_Protected_Api ["Centralized Protected Routes (api.routes.js)"]
        ApiRouter --> CentralAuth["router.use(authenticateUser)"]
        CentralAuth --> Students["/students (student.routes.js)"]
        CentralAuth --> Profiles["/profiles (profile.routes.js)"]
        CentralAuth --> Academics["/academics (academic.routes.js)"]
        CentralAuth --> Projects["/projects (project.routes.js)"]
        CentralAuth --> Certs["/certifications (certification.routes.js)"]
        CentralAuth --> Badges["/badges (badge.routes.js)"]
    end

    Students & Profiles & Academics & Projects & Certs & Badges --> Controllers["Controllers Layer"]
    Controllers --> PrismaClient["Prisma ORM (Client with PG Adapter)"]
    PrismaClient --> PostgresDB[("PostgreSQL Database")]
```

---

## 2. Database & Entity Relationship (ER) Map

Platform me do main pillars hain: **Users (Authentication & Account)** aur **Entities (Student Profile, Staff Profile, Academics, Projects, Certifications, Badges)**.

```mermaid
erDiagram
    User ||--o| Student : "links to (1:1)"
    User ||--o| StaffRegistry : "links to (1:1)"
    User ||--o| StaffProfile : "has (1:1)"

    Student ||--o| StudentProfile : "has (1:1)"
    Student ||--o{ AcademicRecord : "has many (1:N)"
    Student ||--o{ Project : "builds (1:N)"
    Student ||--o{ Certification : "earns (1:N)"
    Student ||--o{ StudentBadge : "awarded (1:N)"

    User {
        string id PK "UUID"
        string email UK "unique email"
        string passwordHash "bcrypt hash"
        enum role "ADMIN | STUDENT | TEACHER | DEAN | TPO"
        boolean isActive "default true"
        boolean mustChangePassword "default false"
        datetime createdAt
        datetime updatedAt
    }

    Student {
        string id PK "UUID"
        string userId FK "nullable, unique -> User.id"
        string name "Student Name"
        string email UK "Official email"
        string collegeName "College name"
        string rollNumber UK "College Roll No"
        string libraryId UK "Optional Library ID"
        string course "B.Tech, etc."
        string branch "CSE, IT, etc."
        int batch "Year (e.g. 2026)"
    }

    StudentProfile {
        string id PK "UUID"
        string studentId FK "unique -> Student.id"
        string username UK "Public handle"
        string bio "About student"
        string avatarUrl "Profile image"
        string githubUrl "GitHub link"
        string linkedinUrl "LinkedIn link"
        string leetcodeUrl "LeetCode link"
        string codeforcesUrl "Codeforces link"
        string codechefUrl "CodeChef link"
        string xUrl "X / Twitter link"
    }

    AcademicRecord {
        string id PK "UUID"
        string studentId FK "-> Student.id"
        int semester "1 to 8 (unique per student)"
        float sgpa "Semester GPA"
        float cgpa "Cumulative GPA"
        int backlogs "Backlog count"
        boolean isVerified "Default false"
    }

    Project {
        string id PK "UUID"
        string studentId FK "-> Student.id"
        string title "Project title"
        string tagline "Short subtitle"
        string description "Markdown / text"
        string githubUrl "Repo link"
        string demoUrl "Live URL"
        string_array techStack "React, Node, etc."
        boolean isPinned "Highlight on top"
        boolean isVerified "Verified project"
    }

    Certification {
        string id PK "UUID"
        string studentId FK "-> Student.id"
        string title "Cert title"
        string issuer "AWS, Google, etc."
        string credentialId "Cert ID"
        string credentialUrl "Verify URL"
        string certificateUrl "Image/PDF URL"
        datetime issuedAt
        datetime expiresAt
        boolean isVerified "Default false"
    }

    StudentBadge {
        string id PK "UUID"
        string studentId FK "-> Student.id"
        string title "Badge name"
        string description "Achievement details"
        string imageUrl "Badge icon"
        string awardedBy "Dean / TPO / System"
        datetime awardedAt
    }

    StaffRegistry {
        string id PK "UUID"
        string staffId UK "STF-XXXX"
        string email UK "Official email whitelist"
        enum role "DEAN | TEACHER | TPO"
        string userId FK "nullable, unique -> User.id"
        boolean isActive "Default true"
    }

    StaffProfile {
        string id PK "UUID"
        string userId FK "unique -> User.id"
        string fullName "Full name"
        string profileImage "Avatar"
        string designation "HOD / Professor / Officer"
        string department "CSE / Placement Cell"
        string about "Bio"
        string_array areasOfExpertise
        string_array subjects
    }
```

---

## 3. Authentication & User Lifecycles Map

### Flow A: Staff Registration Lifecycle
Staff seedha register nahi ho sakte jab tak unka email pehle se `StaffRegistry` whitelist me na ho.

```mermaid
sequenceDiagram
    autonumber
    actor Staff as Staff Member
    participant API as /api/auth/register
    participant Registry as StaffRegistry Table
    participant DB as User Table

    Staff->>API: POST /api/auth/register { email, password }
    API->>Registry: getStaffFromRegistry(email)
    alt Email not in Registry
        Registry-->>API: null
        API-->>Staff: 403 Forbidden ("Staff record not found")
    else Staff already registered (userId exists)
        Registry-->>API: staff with userId
        API-->>Staff: 409 Conflict ("Already registered")
    else Valid New Staff
        API->>API: bcrypt.hash(password)
        API->>DB: tx.user.create(email, hash, staff.role)
        API->>Registry: tx.staffRegistry.update(userId: newUser.id)
        API-->>Staff: 201 Created ("Registration successful")
    end
```

### Flow B: Student 2-Step Onboarding Lifecycle
Students self-register nahi karte. College Admin do steps me student ko platform pe lata hai:

```mermaid
sequenceDiagram
    autonumber
    actor Admin as College Admin
    participant StudentRoute as /api/students/register
    participant ProvisionRoute as /api/auth/students/register
    participant StudentDB as Student Table
    participant UserDB as User Table

    Note over Admin, StudentDB: Step 1: Create College Student Record
    Admin->>StudentRoute: POST /api/students/register { name, email, rollNumber, batch, course, branch }
    StudentRoute->>StudentDB: prisma.student.create(...)
    StudentDB-->>StudentRoute: studentRecord (id, rollNumber, etc.)
    StudentRoute-->>Admin: 201 Created (Student data saved, userId = null)

    Note over Admin, UserDB: Step 2: Provision User Login Account
    Admin->>ProvisionRoute: POST /api/auth/students/register { studentId }
    ProvisionRoute->>StudentDB: findUnique(studentId)
    ProvisionRoute->>UserDB: tx.user.create(email: student.email, initialPassword: student.email, role: "STUDENT")
    ProvisionRoute->>StudentDB: tx.student.update(userId: newUser.id)
    ProvisionRoute-->>Admin: 201 Created ("Student account provisioned")
```

### Flow C: Login & Protected Request Lifecycle
Ek baar user login karta hai, tab JWT HttpOnly cookie ke through har protected request ko pass karta hai:

```mermaid
sequenceDiagram
    autonumber
    actor User as Logged-In User
    participant Auth as POST /api/auth/login
    participant Mid as authenticateUser Middleware
    participant Route as Protected Feature Route
    participant Controller as Feature Controller

    User->>Auth: { email, password }
    Auth->>Auth: verify password with bcrypt
    Auth->>Auth: generate JWT (userId, role)
    Auth-->>User: Set-Cookie: accessToken=JWT (HttpOnly) + 200 OK

    Note over User, Controller: Subsequent Protected Calls (e.g. GET /api/profiles/:id)
    User->>Route: GET /api/profiles/:id (Cookie: accessToken)
    Route->>Mid: Intercepted in api.routes.js
    Mid->>Mid: jwt.verify(token, JWT_SECRET)
    Mid->>Mid: DB lookup User by decoded.userId (check isActive)
    Mid->>Mid: Attach req.user = { id, role, mustChangePassword }
    Mid->>Route: next()
    Route->>Controller: Controller receives req.user
    Controller-->>User: 200 OK (Data returned)
```

---

## 4. Feature Modules Breakdown & Endpoints Map

Platform ke 6 feature modules hain, jo sab `/api` ke under centralized protected hain:

### 1. Student Module (`/api/students`)
*Mounted at:* `backend/src/routes/student.routes.js`  
*Controller:* `backend/src/controllers/student.controller.js`

| Method | Endpoint | Required Role | Ownership Check | Description |
|---|---|---|---|---|
| `POST` | `/api/students/register` | `ADMIN` | N/A (Admin action) | College database me student ka official record banata hai. |
| `GET` | `/api/students/:identifier/full` | Any Authenticated | N/A (Public read) | 5 modules ka data (Demographics, Profile, Academics, Projects, Certifications, Badges) 1 single query me return karta hai. *(Note: Query currently has relation typo `studentBadges` vs `badges`)*. |

---

### 2. Profile Module (`/api/profiles`)
*Mounted at:* `backend/src/routes/profile.routes.js`  
*Controller:* `backend/src/controllers/profile.controller.js`

| Method | Endpoint | Required Role | Ownership Check | Description |
|---|---|---|---|---|
| `POST` | `/api/profiles/create` | Student (Own Record) | **Yes** (`student.userId === req.user.id`) | Student apna username, bio, avatar, and coding handles save karta hai. |
| `GET` | `/api/profiles/:studentId` | Any Authenticated | N/A (Public read) | Kisi bhi student ka profile card aur social links view karta hai. |
| `PATCH` | `/api/profiles/:studentId` | Student (Own Record) | **Yes** (`student.userId === req.user.id`) | Student apna bio ya links update karta hai. |
| `DELETE` | `/api/profiles/:studentId` | Student (Own Record) | **Yes** (`student.userId === req.user.id`) | Student apna profile record delete karta hai. |

---

### 3. Academic Module (`/api/academics`)
*Mounted at:* `backend/src/routes/academic.routes.js`  
*Controller:* `backend/src/controllers/academic.controller.js`

| Method | Endpoint | Required Role | Ownership Check | Description |
|---|---|---|---|---|
| `POST` | `/api/academics/add` | `ADMIN` | N/A (Admin only) | Kisi student ka semester SGPA, CGPA, backlogs record enter karta hai. |
| `GET` | `/api/academics/:studentId` | Any Authenticated | N/A (Public read) | Student ke saare semesters ke academic marks dekhta hai. |
| `PATCH` | `/api/academics/:studentId/:semester` | `ADMIN` | N/A (Admin only) | Marks ya backlogs correct karta hai. |
| `DELETE` | `/api/academics/:studentId/:semester` | `ADMIN` | N/A (Admin only) | Semester record delete karta hai. |

---

### 4. Projects Module (`/api/projects`)
*Mounted at:* `backend/src/routes/project.routes.js`  
*Controller:* `backend/src/controllers/project.controller.js`

| Method | Endpoint | Required Role | Ownership Check | Description |
|---|---|---|---|---|
| `POST` | `/api/projects/add` | Student (Own Record) | **Missing (Vulnerability)** | Student apna project (title, techStack, githubUrl, demoUrl) add karta hai. |
| `GET` | `/api/projects/:studentId` | Any Authenticated | N/A (Public read) | Student ke saare projects list karta hai. |
| `PATCH` | `/api/projects/:studentId/:projectId` | Student (Own Record) | **Missing (Vulnerability)** | Project details update karta hai. |
| `DELETE` | `/api/projects/:studentId/:projectId` | Student (Own Record) | **Missing (Vulnerability)** | Project delete karta hai. |

---

### 5. Certifications Module (`/api/certifications`)
*Mounted at:* `backend/src/routes/certification.routes.js`  
*Controller:* `backend/src/controllers/certification.controller.js`

| Method | Endpoint | Required Role | Ownership Check | Description |
|---|---|---|---|---|
| `POST` | `/api/certifications/add` | Student (Own Record) | **Missing (Vulnerability)** | New certificate record add karta hai. |
| `GET` | `/api/certifications/:studentId` | Any Authenticated | N/A (Public read) | Student ke saare certificates list karta hai. |
| `PATCH` | `/api/certifications/:studentId/:certId` | Student (Own Record) | **Missing (Vulnerability)** | Certificate update karta hai. |
| `DELETE` | `/api/certifications/:studentId/:certId` | Student (Own Record) | **Missing (Vulnerability)** | Certificate delete karta hai. |

---

### 6. Badges Module (`/api/badges`)
*Mounted at:* `backend/src/routes/badge.routes.js`  
*Controller:* `backend/src/controllers/badge.controller.js`

| Method | Endpoint | Required Role | Ownership Check | Description |
|---|---|---|---|---|
| `GET` | `/api/badges/:studentId` | Any Authenticated | N/A (Public read) | Student ko mile badges aur achievements list karta hai. |

---

### 7. Staff Profile Module (Part of Auth Routes)
*Mounted at:* `backend/src/auth/routes/auth.routes.js`  
*Service:* `backend/src/auth/services/staff-profile.service.js`

| Method | Endpoint | Required Role | Ownership Check | Description |
|---|---|---|---|---|
| `GET` | `/api/auth/staff/profile` | `DEAN`, `TEACHER`, `TPO` | **Strict (`req.user.id`)** | Logged-in staff member ka profile fetch karta hai. |
| `PUT` | `/api/auth/staff/profile` | `DEAN`, `TEACHER`, `TPO` | **Strict (`req.user.id`)** | Staff member ka designation, department, about, areasOfExpertise save/upsert karta hai. |

---

## 5. Security & Request Flow Model (How RBAC & Ownership Work)

Har request in tin security checks se guzarti hai:

```mermaid
flowchart TD
    Req["Incoming HTTP Request"] --> Step1{"1. Authentication Guard"}
    Step1 --"No Cookie / Invalid JWT"--> Err401["401 Unauthorized"]
    Step1 --"Valid JWT"--> UserContext["Extract req.user (id, role)"]
    
    UserContext --> Step2{"2. Role Guard (authorizeRoles)"}
    Step2 --"Role Not Allowed"--> Err403Role["403 Forbidden (Insufficient Role)"]
    Step2 --"Role Allowed / No Role Guard"--> Step3{"3. Resource Ownership Guard"}
    
    Step3 --"Target student.userId !== req.user.id"--> Err403Owner["403 Forbidden (You do not own this resource)"]
    Step3 --"Owner verified OR Admin action"--> Execute["4. Execute Prisma Database Query"]
    Execute --> Success["200 / 201 OK Response"]
```

---

## 6. Directory Structure & Key Files Quick Index

```
backend/
├── arch/
│   └── backend_architecture_and_maps.md # Architecture & system maps reference
├── prisma/
│   └── schema.prisma                  # Master database models and relations
└── src/
    ├── server.js                      # Express bootstrap, CORS, port listener
    ├── config/
    │   ├── env.js                     # Validates JWT_SECRET, DATABASE_URL
    │   └── prisma.js                  # PostgreSQL pool adapter and Prisma Client
    ├── auth/                          # Auth domain
    │   ├── routes/auth.routes.js      # /api/auth endpoints (login, register, me, staff)
    │   ├── controllers/auth.controller.js # Request handlers for auth
    │   ├── services/                  # Business logic (auth, staff-reg, student-prov)
    │   ├── middlewares/               # authenticateUser, authorizeRoles
    │   └── utils/                     # bcrypt password hashing, jwt token util
    ├── routes/
    │   ├── api.routes.js              # Centralized parent router (applies auth)
    │   ├── student.routes.js          # /api/students
    │   ├── profile.routes.js          # /api/profiles
    │   ├── academic.routes.js         # /api/academics
    │   ├── project.routes.js          # /api/projects
    │   ├── certification.routes.js    # /api/certifications
    │   └── badge.routes.js            # /api/badges
    └── controllers/                   # 6 Feature Controllers
        ├── student.controller.js
        ├── profile.controller.js
        ├── academic.controller.js
        ├── project.controller.js
        ├── certification.controller.js
        └── badge.controller.js
```

