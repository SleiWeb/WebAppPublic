# Build prompt — Prisma (for claude-fable-5)

> Paste everything below the line into Fable 5 as a single build task. It is self‑contained but assumes the repo and `docs/PLAN.md` are present. Fable 5 should read `docs/PLAN.md` first — that is the full product spec; this prompt is the build order.

---

## Role & goal

You are a senior full‑stack engineer. Build the **entire, finished, runnable web application** for **Prisma** — a Danish web‑based learning platform for Mathematics, Physics, Chemistry, Biology and Geography, aimed at grundskole 5.–9. klasse and gymnasiet. It combines Brilliant‑style interactive/visual understanding with MatematikFessor‑style practice, auto‑correction, hints and a teacher dashboard.

The complete product specification is in **`docs/PLAN.md`** — read it first and treat it as the source of truth for *what* to build. This document is the *how/order*. When the plan and this prompt conflict, this prompt wins on scope and stack; the plan wins on product behaviour.

"Finished" = a full‑stack app that **runs end‑to‑end with one command**, is **seeded with real sample content across all five subjects**, and lets a **student** and a **teacher** complete their core journeys. It does not mean production‑hardened or real Unilogin — see the scope boundary.

## What you already have

- An existing prototype at repo root (`MatematikAppV2`): React 18 + Vite + TypeScript, `react-router`, and a **working math engine you must reuse, not rewrite**:
  - `src/engine/engine_v0_1.ts` — deterministic seed‑based item generation, multiple `response_kind`s (int, number, mcq, order, quotient_remainder, column_add, fraction display).
  - `src/adaptive/irt.ts` — Rasch/1PL adaptivity (`theta` per node, level selection).
  - `src/progress/mastery.ts`, `progress/types.ts`, `progress/ProgressContext.tsx`, `progress/storage.ts` — mastery updated **per attempt**, localStorage persistence.
  - `src/skillmap/skillmap.ts`, `progress/unlock.ts` — skill graph + unlock logic.
- Preserve the behaviour of this engine. Extract it into a shared package (below) rather than duplicating it.

## Scope boundary (read carefully)

**In scope (build fully):**
- All **five subject cards** live on the homepage; each opens a real course→module→lesson flow.
- Full **learning loop** from `PLAN.md §6`: short explanation → active problem → visual model → interactive widget → generated practice → worked example → progressive hints → misconception diagnosis → mastery → adaptive repetition.
- The **~10 interaction primitives** from `PLAN.md §10` (number/text input, MCQ, ordering, drag‑drop placement, slider‑sim, graph reading, labeling, matching, equation input, balancing). Every subject must use at least the primitives it needs.
- **Auth & roles** (student / teacher / admin) with real sessions.
- **Student**: dashboard, adaptive practice, hints, mastery/progress view, assigned tasks.
- **Teacher**: dashboard with class overview (mastery heatmap), misconception panel, assign‑workflow (content → class/group/student + due date + level band), per‑student drill‑down.
- **Server‑side answer validation** (authoritative — never trust the client for correctness) and attempt logging.
- **Seeded content**: Math and Physics each with ≥2 modules and several lessons; Chemistry, Biology, Geography each with ≥1 complete lesson so all cards work. All content tagged with Fælles Mål references (from `PLAN.md §2`).
- Danish UI (`lang="da"`), basic accessibility (TTS toggle, dyslexia‑friendly font option, keyboard nav), privacy‑by‑design (no third‑party trackers, PII minimised).

**Out of scope (stub cleanly behind an interface — do not block on these):**
- **Real Unilogin**: implement an `AuthProvider` interface with an email/password provider (real) **and** a `MockUniloginProvider` (dev‑only, one‑click "log ind som elev/lærer"). Leave a documented seam for real OIDC/SAML later.
- Payment/licensing, parent view, real email sending, mobile apps, AI tutor.
- Gymnasium‑depth content breadth (structure must support it; seed only samples).

## Tech stack (decided — do not deliberate)

- **Monorepo**, npm workspaces:
  - `apps/web` — React 18 + Vite + TypeScript (extend the existing frontend into here).
  - `apps/api` — Node + **Fastify** + TypeScript. REST (or tRPC if you prefer type‑safety) API.
  - `packages/engine` — extracted item engine + IRT + mastery (from existing `src/`).
  - `packages/content` — seed content (lessons, blueprints) as typed data (`PLAN.md §9`).
  - `packages/shared` — shared TypeScript types (DTOs, roles, content model).
- **Database**: PostgreSQL via **Prisma**. Provide `docker-compose.yml` for a one‑command Postgres, plus a Prisma seed script. Schema follows `PLAN.md §8`.
- **Auth**: session cookies (httpOnly, SameSite) + hashed passwords (argon2/bcrypt); `AuthProvider` seam for Unilogin.
- **Rendering math**: KaTeX. **Simulations/visuals**: Canvas/SVG, no heavy game engine.
- **Styling**: keep it lightweight (CSS modules or a small utility layer). Prism visual identity: five subject colours.
- **Tests**: Vitest for engine/validators (unit) + at least a couple of API integration tests. Node ≥ 20.
- Keep everything runnable **without paid/external services**. If a real service would be needed, mock it.

## Repository structure to create

```
/apps/web        (moved/refactored from existing src/, subject router, dashboards)
/apps/api        (Fastify, routes, auth, prisma client)
/packages/engine (engine_v0_1, irt, mastery, validators — server + client shareable)
/packages/content(seed lessons + blueprints per subject)
/packages/shared (types)
/prisma          (schema.prisma, seed.ts, migrations)
docker-compose.yml
package.json     (workspaces, root scripts: dev, build, test, db:seed)
README.md        (updated: one-command run instructions)
```
Preserve git history of the existing engine files where practical (move, don't delete‑and‑recreate).

## Build in phases — commit at the end of each phase, keep the app runnable

1. **Restructure**: set up workspaces; move existing frontend to `apps/web`; extract engine/irt/mastery into `packages/engine` with the old app still working against it. Commit.
2. **Content model + engine**: implement the content‑block + blueprint model (`PLAN.md §9`); add server‑side **answer validators** and **misconception rules** per `response_kind`; unit‑test them. Commit.
3. **Backend + DB + auth**: Prisma schema (`PLAN.md §8`), migrations, seed; Fastify API for lessons, attempts (authoritative validation), progress, assignments; email/password + MockUnilogin auth; migrate progress from localStorage to server. Commit.
4. **Student experience**: homepage five subject cards → course/module/lesson → interactive widgets (all ~10 primitives) → hints → misconception feedback → adaptive practice → student dashboard (mastery, assigned tasks). Commit.
5. **Teacher experience**: teacher dashboard — class mastery heatmap, misconception panel, assign‑workflow (content → target + due date + level band), per‑student drill‑down; Fælles Mål coverage view. Commit.
6. **Polish**: Danish copy, accessibility (TTS, dyslexia font, keyboard), privacy pass (no trackers, minimal PII, retention notes), README + demo credentials, final tests green. Commit.

## Feature detail (anchor to PLAN.md)

- **Homepage / IA** → `PLAN.md §4`. Five colour‑coded subject cards with progress rings; "fortsæt hvor du slap"; role switch; public demo lesson without login.
- **Learning loop** → `PLAN.md §6`. Explanation is short (2–4 sentences), problem comes first, hints are 3 progressive levels and are **logged**, mastery updates **per attempt** via the existing IRT.
- **Interactions** → `PLAN.md §10`. Implement primitives once, reuse across subjects; only render + validator are subject‑specific.
- **Data model** → `PLAN.md §8`. Include `misconceptions` so wrong answers are *diagnostic*; `assignments`+`assignment_targets` drive teacher tildeling; `attempts`+`progress`+`mastery_estimates` feed both adaptivity and the teacher dashboard.
- **Content model** → `PLAN.md §9`. One lesson = ordered content blocks + blueprints; identical schema across all five subjects; include `teacher_notes` (teacher‑only) and `faelles_maal[]`.

## Non‑functional requirements

- **Security**: correctness is decided **only** on the server; never ship correct answers to the client for gradable items. Log attempts authoritatively. Standard session/CSRF hygiene.
- **Privacy by design**: EU‑friendly, no third‑party analytics/ad SDKs, minimal PII, documented retention/deletion, pseudonymised analytics. School = dataansvarlig, Prisma = databehandler.
- **Accessibility**: `lang="da"`, TTS toggle, dyslexia‑friendly font option, full keyboard operation, sufficient contrast, ARIA on widgets.
- **i18n**: all user‑facing strings in Danish; keep them in one place so future i18n is possible.

## Working agreement

- Work on the branch your harness designates (create `claude/prisma-build` from the default branch if none is given). Do **not** touch unrelated branches.
- Commit at each phase with clear messages; keep the app runnable after every commit.
- After phases 4 and 5, **verify by driving the real app** (start it, click through the student flow and the teacher flow), not just by running tests. Fix what you observe.
- Update `README.md` with: prerequisites, `docker-compose up` + `npm run db:seed` + `npm run dev`, and demo credentials for a seeded student and teacher.
- Do not add secrets. Do not call external paid APIs.

## Definition of Done — acceptance checklist

The build is finished when all of these are true:

- [ ] `docker-compose up -d && npm install && npm run db:seed && npm run dev` starts web + api with seeded data.
- [ ] Homepage shows **all five** subject cards; each opens a real lesson.
- [ ] A seeded **student** can: log in (email/pw or MockUnilogin), open a lesson in each subject, use the interactive widgets, request all 3 hint levels, get **misconception‑specific** feedback on a designed wrong answer, and see mastery/progress update per attempt.
- [ ] Adaptive practice raises/lowers item difficulty based on IRT `theta`.
- [ ] A seeded **teacher** can: view a class mastery **heatmap**, open the **misconception panel**, **assign** a lesson/set to a class with a due date and level band, and drill into one student's attempts.
- [ ] Answer correctness is validated **server‑side**; attempts are persisted in Postgres.
- [ ] Content is tagged with Fælles Mål references and teacher notes are teacher‑only.
- [ ] UI is in Danish; TTS toggle and dyslexia‑font option work; core flows are keyboard‑navigable.
- [ ] `npm run test` and `npm run build` pass; README documents how to run everything with demo logins.

## Pitfalls to avoid

- Don't rewrite the existing engine — extract and extend it.
- Don't hardcode answers on the client for graded items.
- Don't over‑engineer real Unilogin/OIDC now — the mock provider behind the interface is the deliverable.
- Don't leave any subject card dead — every card must reach a working lesson.
- Keep it runnable at every commit; a beautiful half that doesn't start is a fail.
