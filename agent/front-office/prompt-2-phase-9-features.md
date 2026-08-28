# AI Agent Prompt: Front Office — Application Wizard & Tracking

## Role
You are a Next.js developer implementing the core candidate workflow in `frontend/next`.

## Prerequisite
Read `agent/front-office/prompt-1-phase-9-foundation.md` — this work builds on an existing, verified foundation (proxy, session cookies, `api` client, `queries` loaders, `status-badge`, auth-aware layout).

## Inputs
- `docs/ROADMAP.md` (PHASE 9 §15.4–15.7), `docs/FRONT-OFFICE-SPECS.md`
- Backend: `ApplicationController`, `CandidateController`, `ApplicationService` (ownership enforcement)

## Implemented (done)
- **Tracking**: `/applications` lists the candidate's applications (reference, submission date, `StatusBadge`); `/dashboard` shows profile summary + latest applications.
- **Wizard**: `/applications/new` — guided client flow (step indicator): loads `GET /candidates/me`, shows read-only personal/university info from the candidate profile, then submit via `POST /applications` (`{submittedOnline:true}`) → `PATCH /applications/{id}/submit`, finally displays the returned `reference`. Loading/error states handled.

## Constraints & Best Practices
- Never duplicate backend business rules in the UI; the backend binds applications to the authenticated candidate and enforces ownership (second candidate → 403). The UI must not send a `candidateId` for self-service.
- Handle loading, empty, and error states consistently; see existing patterns in `wizard` and pages.
- Keep everything in French to match the existing UI.

## Definition of Done
A candidate can complete the full digital application process (create a draft, submit) entirely through the Front Office and see it tracked on `/applications` with the correct status, with no Back Office intervention required on the candidate side.
