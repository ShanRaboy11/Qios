# Qios

Qios is a hardware-free, browser-based kiosk platform for F&B establishments in Cebu. It uses QR-triggered ordering, Gemini-powered natural language interactions, and a multi-tenant architecture designed for secure tenant-level data isolation.

## Project Overview

Qios helps restaurants and cafes run mobile kiosk experiences without dedicated kiosk hardware.

Core capabilities:

- QR code initiated ordering sessions
- Gemini AI-assisted natural language ordering
- Dual-mode inventory support:
	- Unit-based inventory (e.g., bottle, piece)
	- Measurement-based inventory (e.g., grams, ml)
- Multi-tenant data isolation using PostgreSQL Row Level Security (RLS) with `tenant_id`

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS |
| Backend/Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth (JWT-based) |
| Real-time | Supabase Realtime (Live Feeds) |
| AI Engine | Google Gemini API |
| Vector DB | Supabase pgvector |
| Infrastructure | Docker, Docker Compose |

## Local Setup

1. Clone the repository.

2. Create your local environment file:

```bash
cp .env.example .env
```

PowerShell alternative:

```powershell
Copy-Item .env.example .env
```

3. Start local services:

```bash
docker-compose up --build
```

4. Open the app:

```text
http://localhost:3000
```

5. Local pgvector-ready PostgreSQL is exposed at:

```text
localhost:54322
```

## Multi-Tenancy and RLS

All tenant-owned rows must include `tenant_id`.

The starter migration enables RLS on `public.orders` and provides tenant-scoped policies. Policies are written to support both:

- Supabase JWT claim context (`request.jwt.claim.tenant_id`)
- Local development fallback session context (`app.current_tenant_id`)


## Branching Strategy

- `main` -> production-ready, stable code
- `develop` -> active development branch
- `feature/` -> new features (example: `feature/dolera-landing-page`)
- `fix/` -> bug fixes (example: `fix/mactual-navbar-bug`)
- `chore/` -> configs, setup, and maintenance

Rules:

- Use lowercase (except names)
- Keep names short and descriptive
- Use hyphens (`-`), not spaces

Examples:

- `feature/dolera-landing-page`
- `fix/mactual-navbar-bug`

## Commit Guidelines

Format:

```text
<prefix>(<scope>): <message> - <name>
```

Examples:

- `feat(auth): implement login with JWT - Raboy`
- `fix(ui): resolve navbar bug - Lim`
- `docs(readme): update setup instructions - Mactual`

Rules:

- Prefix must follow the table below
- Use lowercase (except names)
- Keep messages concise
- Scope is optional, but recommended

### Commit Prefixes

| Prefix | Meaning |
| --- | --- |
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Code style changes (formatting, no logic change) |
| `refactor` | Refactoring code (not a fix or feature) |
| `test` | Adding or fixing tests |
| `chore` | Maintenance tasks (build, dependencies, configs, etc.) |

