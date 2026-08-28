# AI Agent Prompt: Next.js Front Office — Foundation & Candidate Auth

## Role
You are an expert Next.js developer building the STEG candidate-facing web application.
Target: `frontend/next` — Next.js 16 (App Router), React 19, TypeScript, Tailwind v4.

## Read First (Next.js 16 is NOT 14/15)
- `frontend/next/AGENTS.md`: "This is NOT the Next.js you know. Read `node_modules/next/dist/docs/` first."
- Use `src/proxy.ts` exporting `proxy` (NOT `middleware.ts`). `fetch` is NOT cached by default.
- `params`/`searchParams`/`cookies()` are **async** (must `await`).
- Forms via Server Actions + `useActionState` (from `react`, not `useFormState`).
- `next build` does NOT lint; run `eslint` separately.
- Backend context path is `/api/v1`; frontend proxies `/api/* -> backend` via `next.config.ts` rewrites.

## Inputs
- `docs/ROADMAP.md` (PHASE 9 §15)
- `docs/FRONT-OFFICE-SPECS.md`
- Backend contracts under `backend/src/main/java/tn/steg/backend/` (auth/candidates/applications)

## Delivered Foundation (implemented & live-verified)
- **Theme/global**: `src/app/globals.css` — Tailwind v4 `@import "tailwindcss"` + `--steg`/`--accent` tokens and `@layer components` primitives (`btn-primary`, `btn-outline`, `input`, `label`, `card`, `badge`).
- **Layout**: `src/app/layout.tsx` — root layout with auth-aware nav (shows Dashboard / Mes candidatures / Profil + logout when signed in, Connexion / Candidater otherwise) and footer.
- **Proxy**: `next.config.ts` rewrite `/api/:path* -> ${BACKEND_API_URL||http://localhost:8080/api/v1}/:path*`; `src/proxy.ts` guard: protected = `/dashboard*`,`/profile*`,`/applications*`; redirects to `/login?from=...` when no `steg_fo_access` cookie; returns to `/dashboard` if authed and on `/login`/`/register`.
- **Session**: `src/lib/session.ts` (server-only) — cookies `steg_fo_access` (readable) + `steg_fo_refresh` (httpOnly); `setSession`/`clearSession`/`getAccessToken`/`isAuthenticated`/`getCurrentUser` (calls `/auth/me`).
- **Auth actions**: `src/lib/actions/auth.ts` — `login`, `register`, `logout`, `requestPasswordReset` (Server Actions; call backend directly, set cookies, `redirect`).
- **Data loaders**: `src/lib/queries.ts` (server-only) — `getCandidateProfile` (`/candidates/me`), `getMyApplications` (`/applications/mine`) using the session token.
- **Client API**: `src/lib/client-api.ts` — `api` client (get/post/patch) reading Bearer from `steg_fo_access` cookie, 401 → `/login?expired=1`, typed `ApiClientError`; `src/lib/types.ts` DTOs.
- **Components**: `src/components/status-badge.tsx`, `src/components/logout-button.tsx`.
- **Pages**: `/` (landing), `/login`, `/register`, `/forgot-password`, `/dashboard`, `/profile`, `/applications`, `/applications/new`.

## Facts
- Registration hits `POST /auth/register` (public; creates CANDIDATE user + linked candidate in one tx), then auto-login. Backend enforces password policy — do not duplicate rules in UI.
- Candidate self-service endpoints: `GET /candidates/me`, `GET /applications/mine`, `POST /applications` (candidate bound to own profile; send `{submittedOnline:true}`), `PATCH /applications/{id}/submit`. **No self-update endpoint exists** (`PUT /candidates/{id}` is admin-only) — profile is read-only for now.
- Application statuses: `DRAFT, SUBMITTED, UNDER_REVIEW, ACCEPTED, REJECTED`. Reference format `APP-...`.

## Definition of Done
Public pages are accessible, candidate registration/login/logout/password-reset work, protected routes are guarded, and the dashboard/profile/applications pages render authenticated data from the backend.
