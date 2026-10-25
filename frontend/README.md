# Student Profile — Next.js frontend

Frontend for the **Student Profile System** described in `plan/student_profile_architecture.md` (Only_jobs / KIET Campus Platform).
Next.js 14 (App Router) · TypeScript · Tailwind CSS.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

Out of the box it runs on **mock data** (a sample student) and persists your edits in `localStorage`, so every flow works with no backend.

## Connect your backend

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_DEFAULT_ROLL_NO=2100290100045
```

All network code lives in **`src/lib/api.ts`** and **`src/components/store.tsx`**.

| Action | Request (adjust to your routes) |
| --- | --- |
| Load profile | `GET /api/v1/students/:rollNo` (partial JSON is merged over the mock shape) |
| Presigned upload | `GET /api/v1/academics/upload-url?sem=X` → `{ uploadUrl, fileUrl }`, then `PUT` the PDF |
| Update profile | `PATCH /api/v1/students/me` |
| Semester | `PUT /api/v1/academics/:sem` · `DELETE /api/v1/academics/:id` |
| Projects | `POST /api/v1/projects` · `PUT/DELETE /api/v1/projects/:id` |
| Badge request | `POST /api/v1/badges/:badgeId/request` · `DELETE …/request` |
| Certifications | `POST /api/v1/certifications` · `DELETE /api/v1/certifications/:id` |

Writes are optimistic and fire-and-forget; swap `pushRemote` for your preferred data layer (React Query, SWR, server actions) when the API is ready.

## Structure

```
src/
  app/                    one route per sub-module
    page.tsx              Overview (identity, trust score, heatmaps, highlights)
    academics/            SGPA chart, semester table, audit/penalty model, presigned PDF upload
    projects/ [id]/       Top-6 pinned projects, Markdown README (react-markdown + rehype-sanitize)
    coding/               GitHub + LeetCode calendars, streaks, handles, sync explainer
    badges/               Catalog, request queue states (pending / approved / rejected)
    certifications/       Internal (hash-verified) vs external
    settings/             Editable fields, admin-locked fields, theme, demo controls
  components/             Shell, UI kit, Heatmap, charts, modals, providers
  lib/                    types (mirror of Prisma), mock data, API adapter, helpers
```

## Design system

Colours are CSS variables in `globals.css` (`[data-theme]` blocks) consumed by Tailwind tokens (`bg-surface`, `text-ink`, `bg-accent`…).
Four themes ship: **Indigo**, **Forest**, **Mono**, **Midnight**. To add one, copy a block, change the RGB triplets, and add it to `THEMES` in `components/theme.tsx`.

## Behaviours worth knowing

- **Admin-locked data** (name, roll no., email, branch, semester, batch) is read-only everywhere.
- **Max 6 projects** is enforced in the store; README is sanitised before render.
- **Audit states**: `VERIFIED` and `FLAGGED_FRAUD` semesters are locked; `SELF_DECLARED` ones are editable.
- **Frozen accounts** (`isAccountFrozen`) show a banner and block every mutation.
- **Trust score** is an illustrative client-side calculation (`trustBreakdown` in `lib/utils.ts`) — replace with a server value when available.
- Heatmaps read the exact JSON shape from the doc (`graphWeeks`, `submissionCalendar`).
- Fonts use a system stack; add `next/font/google` (Inter) in `layout.tsx` if you want it.
