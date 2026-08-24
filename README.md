# TANVO

> WE BUILD WHAT YOU IMAGINE.

Two applications in one repository.

```text
frontend/     Marketing website — Vite + React + Three.js + GSAP
backend/      Operations admin — clients, projects, invoices, payments
```

## frontend/

The public site at `tanvo.in`. A scroll-driven WebGL narrative:
IDEA → VISION → DESIGN → BUILD → LAUNCH → IMPACT.

```bash
cd frontend
npm install
npm run dev
```

| Command | Does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check and produce `dist/` |
| `npm run preview` | Serve the production build |

Configuration lives in `frontend/src/data/`. Copy `.env.example` to `.env`
before running — every `VITE_*` value is **public**, so no secrets there.

Design and build documentation is at the repository root: `AGENTS.md`,
`PROJECT.md`, `DESIGN_SYSTEM.md`, `ARCHITECTURE.md`, `IMPLEMENTATION_PLAN.md`.

## backend/

The admin panel behind `admin.tanvo.in`, plus the public invoice pages it
serves at `tanvo.in/i/<token>`. Currently **documentation only** — no code
written yet.

Read in this order:

1. [BACKEND.md](backend/BACKEND.md) — architecture and the decisions behind it
2. [DATA_MODEL.md](backend/DATA_MODEL.md) — schema and Row-Level Security
3. [INVOICING.md](backend/INVOICING.md) — invoice lifecycle, payments, sharing
4. [SECURITY.md](backend/SECURITY.md) — threats, controls, pre-launch checklist
5. [TASKS.md](backend/TASKS.md) — the phased build plan

**Start at [TASKS.md Phase 0](backend/TASKS.md#phase-0--stop-the-leak).**

## Deployment

Two Vercel projects from this one repository, distinguished by root directory:

| Project | Root directory | Domain |
|---|---|---|
| Marketing site | `frontend` | `tanvo.in` |
| Admin | `backend` | `admin.tanvo.in` |

> **After the folder split, the existing Vercel project must have its Root
> Directory changed to `frontend`,** or deployments fail — it will look for
> `package.json` at the repository root and not find one.

## Secrets

No credential belongs in this repository. `.gitignore` blocks `.env*`, `*.csv`,
`*-key*`, `*.pem` and `*.p12`, but the rule is the point, not the pattern:
keys live in Vercel and Supabase environment settings.

If a key has ever been committed, pushed, emailed or pasted into chat, **rotate
it** — see [SECURITY.md](backend/SECURITY.md#0-immediate-the-razorpay-key-in-the-repository).
