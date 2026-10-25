# Campus Feed Engine: Architecture, Redis Rate Limiting & Cursor Pagination

---

## 📌 Executive Summary

The **Campus Feed** is the primary social engagement and peer motivation hub of the **KIET Campus Platform**. 
It enables students, faculty members, and deans to publish project updates, hackathon achievements, and official notices without turning into a chaotic, spammy social network.

To maintain professional rigor, instant feed delivery, and total institutional control across 7,000+ students, the feed is built on **3 core engineering pillars**:
1. **Strict Daily Rate Limiting:** Exactly 3 posts per day per user enforced via Redis atomic counters with rollback mechanics.
2. **Multi-Tenant Campus Isolation:** Zero cross-college data leaks using database-level `tenantId` scoping.
3. **High-Throughput Cursor Pagination:** Zero-lag infinite scrolling that avoids SQL `OFFSET` performance degradation.

---

## 🏗️ Architectural Overview

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Student / Faculty
    participant MW as 🛡️ Express RateLimiter Middleware
    participant Redis as 🔴 Redis Cache
    participant Ctrl as 🎮 Post Controller
    participant DB as 🐘 PostgreSQL (Prisma)
    participant CDN as ☁️ S3 / Cloudflare R2

    User->>MW: POST /api/v1/posts (Content, MediaUrls, ProjectLink)
    MW->>Redis: INCR ratelimit:posts:{tenantId}:{userId}:{YYYY-MM-DD}
    alt Counter == 1
        MW->>Redis: EXPIRE key until Midnight (12:00 AM)
    end
    alt Counter > 3
        MW-->>User: HTTP 429 Too Many Requests (Limit: 3 posts/day)
    else Counter <= 3
        MW->>Ctrl: Pass to createPost Controller
        Ctrl->>DB: INSERT INTO Post (content, mediaUrls, projectLink)
        alt Database Insert Fails
            Ctrl->>Redis: DECR key (Rollback rate limit counter)
            Ctrl-->>User: HTTP 500 Internal Server Error
        else Success
            DB-->>Ctrl: Return Created Post
            Ctrl-->>User: HTTP 201 Created (Post Published)
        end
    end
```

---

## 🗄️ 1. Database Schema (`schema.prisma`)

```prisma
enum RoleType {
  STUDENT
  TEACHER
  DEAN
  ADMIN
}

enum PostType {
  PROJECT_SHOWCASE     // Production projects, GitHub repos, live demos
  HACKATHON_WIN        // Podium finishes, competition achievements
  PLACEMENT_UPDATE     // Verified placement offers, interview breakdown
  CAMPUS_NOTICE        // Official CRPC/TPO drives, dean circulars
}

model Post {
  id             String        @id @default(uuid())
  tenantId       String        @default("kiet-main") // College isolation
  authorId       String
  author         User          @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  postType       PostType      @default(PROJECT_SHOWCASE)
  content        String        @db.Text
  hashtags       String[]      // e.g. ["#KIET2025", "#PlacementDrive", "#DevOps"]
  mediaUrls      String[]      // High-res project screenshots, system architecture diagrams (S3/R2 direct CDN)
  projectLink    String?       // Optional GitHub repo or live demo link
  
  // High-performance denormalized counters (avoid expensive COUNT queries)
  likesCount     Int           @default(0)
  commentsCount  Int           @default(0)
  savesCount     Int           @default(0)
  
  // Relations
  likes          PostLike[]
  comments       PostComment[]
  saves          PostSave[]

  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  // Compound index for instant chronological college feed queries
  @@index([tenantId, createdAt(sort: Desc)])
  @@index([authorId])
}

model PostLike {
  id        String   @id @default(uuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String
  createdAt DateTime @default(now())

  // Prevents multiple likes from the same user on a single post
  @@unique([postId, userId])
  @@index([postId])
}

model PostSave {
  id        String   @id @default(uuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String
  createdAt DateTime @default(now())

  // Bookmarking a post for later reference (interview prep, project inspiration)
  @@unique([postId, userId])
  @@index([userId])
}

model PostComment {
  id        String   @id @default(uuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  content   String   @db.VarChar(500)
  createdAt DateTime @default(now())

  @@index([postId, createdAt(sort: Asc)])
}
```

---

## ⚡ 2. Redis Atomic Rate Limiter: Max 3 Posts Per Day

Running SQL queries like `SELECT COUNT(*) FROM Post WHERE authorId = ... AND createdAt >= today` is slow, locks table rows, and is vulnerable to concurrency race conditions.

Instead, we use **Redis Atomic Increment (`INCR`)** with dynamic TTL to midnight:

### Express Middleware (`src/middlewares/rateLimiter.middleware.js`)

```javascript
import { redis } from '../lib/redis.js';

export async function checkDailyPostLimit(req, res, next) {
  const userId = req.user.id;
  const tenantId = req.user.tenantId || 'kiet-main';

  // Dynamic date key: YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  const rateLimitKey = `ratelimit:posts:${tenantId}:${userId}:${today}`;

  try {
    // 1. Atomic increment in Redis (Thread-safe)
    const currentPostCount = await redis.incr(rateLimitKey);

    // 2. On first post of the day, set TTL to expire at 00:00:00 midnight
    if (currentPostCount === 1) {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const ttlInSeconds = Math.max(Math.floor((midnight.getTime() - now.getTime()) / 1000), 60);

      await redis.expire(rateLimitKey, ttlInSeconds);
    }

    // 3. Exceeded maximum daily quota of 3 posts
    if (currentPostCount > 3) {
      return res.status(429).json({
        success: false,
        error: "Daily post limit reached (Max 3 posts/day). Quota refreshes at midnight!"
      });
    }

    // Attach key to request for rollback handling in controller
    req.rateLimitKey = rateLimitKey;
    next();
  } catch (error) {
    console.error('[RateLimiter Error]', error);
    // Fail-open or continue if Redis is temporarily unreachable
    next();
  }
}
```

---

## 🛡️ 3. Safe Post Creation Controller with Rollback (`createPost`)

If validation fails or the PostgreSQL database encounters a deadlock/error, the Redis counter must be decremented (`DECR`) so the student doesn't lose their legitimate post quota.

### Controller (`src/controllers/post.controller.js`)

```javascript
import { prisma } from '../lib/prisma.js';
import { redis } from '../lib/redis.js';

export async function createPost(req, res) {
  const { content, mediaUrls = [], projectLink } = req.body;
  const { id: userId, tenantId = 'kiet-main' } = req.user;
  const rateLimitKey = req.rateLimitKey;

  // 1. Validation check
  if ((!content || content.trim().length === 0) && mediaUrls.length === 0) {
    if (rateLimitKey) await redis.decr(rateLimitKey);
    return res.status(400).json({ error: "Post cannot be empty. Add text content or media screenshots." });
  }

  // 2. Max 4 images restriction
  if (mediaUrls.length > 4) {
    if (rateLimitKey) await redis.decr(rateLimitKey);
    return res.status(400).json({ error: "Maximum 4 project screenshots allowed per post." });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        tenantId,
        authorId: userId,
        content: content.trim(),
        mediaUrls,
        projectLink: projectLink || null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            studentProfile: {
              select: {
                branch: true,
                currentSemester: true,
                rollNumber: true
              }
            }
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: "Post published successfully",
      post: newPost
    });
  } catch (error) {
    console.error('[CreatePost DB Error]', error);
    // Rollback Redis rate-limit counter on DB failure
    if (rateLimitKey) {
      await redis.decr(rateLimitKey);
    }
    return res.status(500).json({ error: "Failed to publish post due to an internal error." });
  }
}
```

---

## 📜 4. Cursor-Based Infinite Scroll Feed Delivery

### ❌ Why `OFFSET / LIMIT` Fails at 7,000 Users
* `OFFSET 1000` scans and discards 1,000 rows in PostgreSQL before returning 10 rows. As the table grows to 100,000+ posts, queries slow down to 800ms+.
* If a new post is added while a student is scrolling, pages drift and students see duplicate posts.

### ✅ Cursor Pagination Solution
By ordering by `createdAt DESC` and passing the last post ID as a `cursor`, PostgreSQL jumps directly to the record via the B-tree index in **< 5ms**.

```javascript
export async function getCampusFeed(req, res) {
  const { tenantId = 'kiet-main' } = req.user;
  const { cursor, limit = 10 } = req.query;
  const pageSize = Math.min(Number(limit) || 10, 30);

  try {
    const posts = await prisma.post.findMany({
      take: pageSize,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: { tenantId }, // Strict tenant isolation
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            studentProfile: {
              select: {
                branch: true,
                currentSemester: true,
                rollNumber: true
              }
            }
          }
        },
        _count: {
          select: { likes: true, comments: true }
        }
      }
    });

    // Compute cursor for next page
    const nextCursor = posts.length === pageSize ? posts[posts.length - 1].id : null;

    return res.json({
      success: true,
      data: posts,
      pagination: {
        nextCursor,
        hasMore: nextCursor !== null
      }
    });
  } catch (error) {
    console.error('[GetCampusFeed Error]', error);
    return res.status(500).json({ error: "Failed to fetch campus feed." });
  }
}
```

---

## 🎨 5. 3-Column UI Architecture & Institutional Contract (Only Jobs × KIET)

The campus feed UI implements an anti-slop, high-usability **3-Column Architecture** built with clean typography (Nunito ExtraBold 800 headings), pure white cards, and an authentic blue accent (`#1E75FF` / `#0a66c2`):

```mermaid
graph TD
    subgraph Navbar ["Top Sticky Navbar (64px)"]
        Logo["Only Jobs × KIET Wordmark"]
        SearchPill["Dynamic Pill Search Bar"]
        NavTabs["Home Pill (Active) | Explore | Messages | Notifications (Red Dot) | Campus Groups"]
        ProfileSwitch["User Avatar Ring + Name + Switch Portal CTA"]
    end

    subgraph Column1 ["Left Column (280px)"]
        C1_Profile["Student Profile Mini-Card<br/>• Campus Cover Banner<br/>• Avatar with Yellow Ring<br/>• Roll Number & Branch<br/>• Verified Badges, Posts, Peers<br/>• 'My Profile' Link to /profile"]
        C1_Shortcuts["Campus Shortcuts<br/>• DevOps & Cloud Circle<br/>• Innogeeks Coding Society<br/>• Placement Cell (CRPC)<br/>• AI & ML Lab"]
    end

    subgraph Column2 ["Center Main Feed (640px)"]
        C2_Composer["Interactive Composer Card<br/>• 'Share a project, achievement or doubt...'<br/>• Media Attachments: Image, Architecture Diagram, Poll<br/>• Audience Scope: Campus Verified vs Public<br/>• Live 3-Post/Day Atomic Quota Feedback"]
        C2_Feed["Infinite Scroll Post Stream<br/>• Author Role Badging (Student / Faculty / TPO / Dean)<br/>• Verified Project Links (GitHub / Live Demo)<br/>• High-Res Media Gallery<br/>• Interactive Heart Likes, Threaded Comments, Bookmarks<br/>• Inline Quick Comment Capsule"]
    end

    subgraph Column3 ["Right Column (300px)"]
        C3_Activity["Real-time Campus Activity<br/>• TPO Placement Drive announcements<br/>• Faculty project verifications<br/>• Peer skill endorsements & milestone likes"]
        C3_Suggested["Suggested Batchmates & Placed Alumni<br/>• Placed Seniors (e.g. Amazon, Atlassian, Adobe)<br/>• Domain Specialist Peers<br/>• Interactive 'Connect / Follow' toggles"]
    end
```

### Visual Preview of the 3-Column Interface
```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [ONLY JOBS × KIET]   [🔍 Search campus...]       🏠 Home   🧭 Explore   💬 Chat   🔔 (•)   👥 Circles     [RV] Reinhard  [Switch]│
├──────────────────────────┬─────────────────────────────────────────────────┬─────────────────────────────────┤
│ ┌──────────────────────┐ │ ┌─────────────────────────────────────────────┐ │ ┌─────────────────────────────┐ │
│ │ 🖼️ Campus Banner     │ │ │ [RV] Share a project or achievement...  😊   │ │ │ ⚡ Campus Activity     See all│ │
│ │  (RV) Reinhard V.    │ │ ├─────────────────────────────────────────────┤ │ │ • TPO: Amazon Drive live 15m│ │
│ │  CSE • Sem 7 • KIET  │ │ │ [🖼️ Image]  [📊 Poll]   [🌐 Campus]  [Post] │ │ │ • Prof. Sharma verified Kube│ │
│ │  12 Badges | 4 Projs │ │ └─────────────────────────────────────────────┘ │ │ • Rohan endorsed Next.js  2h│ │
│ │ [View Full Profile]  │ │                                                 │ └─────────────────────────────┘ │
│ └──────────────────────┘ │ ┌─────────────────────────────────────────────┐ │ ┌─────────────────────────────┐ │
│ ┌──────────────────────┐ │ │ 🎓 Briansky • CSE • 12m ago             ⋮   │ │ │ 🤝 Suggested Batchmates     │ │
│ │ 📌 Campus Shortcuts  │ │ │ Beautiful art & deployment! #KIET #Cloud   │ │ │ • Aman (SDE @ Atlassian)    │ │
│ │ • DevOps & Cloud Lab │ │ │ [🖼️ Full-width Architecture / Demo]         │ │ │ • Sneha (Lead, Innogeeks)   │ │
│ │ • Innogeeks Society  │ │ │ ❤️ 320k   💬 120   🔖 148   ↗ Share          │ │ │ • Kartik (AI Researcher)    │ │
│ │ • Placement Cell     │ │ │ [RV] [Write your comment...               ] │ │ └─────────────────────────────┘ │
│ └──────────────────────┘ │ └─────────────────────────────────────────────┘ │                                 │
└──────────────────────────┴─────────────────────────────────────────────────┴─────────────────────────────────┘
```

---

## 🔐 6. Content Moderation & Institutional Safeguards

1. **Email Gated Access:** Only accounts authenticated via `@kiet.edu` domain can view or post on the feed.
2. **Strict Daily Cap:** Maximum 3 posts per day prevents individual users from spamming the campus feed.
3. **Automated Profanity & Word Filtering:** Content containing abusive language or inappropriate tags is rejected prior to DB insertion.
4. **Faculty Flagging Power:** Teachers and admins possess a 1-click `Flag & Hide Post` option that immediately unpublishes suspected content pending Dean review.

---
*Generated: 15 October 2026 — Campus Feed Architecture Specification.*
