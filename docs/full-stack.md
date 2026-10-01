# Full-Stack Web Development — Proof, Not Claims

> Docs: [README](../README.md) • [Stack](tech-stack.md) • [AI](ai-integrations.md) • [Security](defensive-security.md) • [Linux](linux-systems.md) • [Other](other-skills.md) • [Contributions](../CONTRIBUTIONS.md)

> Position: production web developer (Next.js / TypeScript / Prisma). This page
> shows shipped work with screenshots, live links, and exact library versions.
> AI, security, and Linux below are supporting skills with their own docs.

## 1. Backend — APIs, auth, database

**OpsDesk** (business-management SaaS): Next.js 14 App Router, Auth.js v5
credentials + RBAC (STAFF / MANAGER / ADMIN), Prisma + Neon Postgres, Zod
validation, audit log, tests (7 unit + 25 smoke + 5 e2e), green CI.

- Live: https://opsdesk-vjez.vercel.app/ (demo: `staff/manager/admin@opsdesk.demo` / `opsdesk123`)
- Repo: https://github.com/aslamalkarywk7/opsdesk (47 per-file docs, deployment guide)

Role-aware dashboard with search, pagination, and server-enforced actions:

![OpsDesk dashboard](https://raw.githubusercontent.com/aslamalkarywk7/opsdesk/main/public/screenshots/desktop-dashboard.png)

ADMIN team panel (users, request metrics, full audit trail — Live DB / Demo badges):

![OpsDesk team and audit](https://raw.githubusercontent.com/aslamalkarywk7/opsdesk/main/public/screenshots/team-admin.png)

## 2. Frontend — 18 live sites + 65 dashboard variants

**Elite portfolio**: 18 real web projects, each runnable inside the site
(Vite + React 19, Next.js, Tailwind 4, Radix UI, Recharts). Full gallery:
https://github.com/aslamalkarywk7/islam-elite-portfolio

| Project | Stack | Live demo |
|---|---|---|
| ![Aetheria](https://raw.githubusercontent.com/aslamalkarywk7/islam-elite-portfolio/main/covers/aetheria.svg) Aetheria | Vite • React 19 • Tailwind 4 | [demo](https://github.com/aslamalkarywk7/islam-elite-portfolio/tree/main/live/aetheria---glassmorphism-2.0-platform/) |
| ![Clinics](https://raw.githubusercontent.com/aslamalkarywk7/islam-elite-portfolio/main/covers/clinics.webp) Elite Medical Clinics | Next.js | [demo](https://github.com/aslamalkarywk7/islam-elite-portfolio/tree/main/live/clinics-portfolio-design/) |
| ![Oman](https://raw.githubusercontent.com/aslamalkarywk7/islam-elite-portfolio/main/covers/oman.svg) Oman Luxury Dash | Next.js • Recharts | [demo](https://github.com/aslamalkarywk7/islam-elite-portfolio/tree/main/live/dashboard-website/) |
| ![Zenith](https://raw.githubusercontent.com/aslamalkarywk7/islam-elite-portfolio/main/covers/zenith.webp) Zenith Finance | Vite • React 19 | [demo](https://github.com/aslamalkarywk7/islam-elite-portfolio/tree/main/live/zenith-finance/) |
| ![Bauhaus](https://raw.githubusercontent.com/aslamalkarywk7/islam-elite-portfolio/main/covers/bauhaus.webp) BAUHAUS 1919 | Vite • React 19 | [demo](https://github.com/aslamalkarywk7/islam-elite-portfolio/tree/main/live/bauhaus-1919---creative-design-studio-1-/) |
| ![Arab Chat](https://raw.githubusercontent.com/aslamalkarywk7/islam-elite-portfolio/main/covers/arabic-chat.webp) Arab Chat Platform | Next.js • Tailwind 4 | [demo](https://github.com/aslamalkarywk7/islam-elite-portfolio/tree/main/live/arabic-chat-ui-ux-design-website/) |

**OpsDesk showcase**: 65 token-driven dashboard variants (8 domains × 8 layouts + signature):

![65 dashboard variants](https://raw.githubusercontent.com/aslamalkarywk7/opsdesk/main/public/screenshots/designs/all.png)

## 3. Stack — languages and libraries used (pinned versions)

| Layer | Tech | Version | Used in |
|---|---|---|---|
| Frontend | React / Next.js | 18.3.1 / 14.2.35 | OpsDesk, portfolio, chat, clinics |
| Styling | Tailwind CSS (+ Radix UI, Recharts) | 3.4.6 | OpsDesk, portfolio |
| Language | TypeScript / JavaScript | 5.5 / ESNext | all web repos |
| Backend | Node.js / Express | 22 / 4 | portfolio server, TurboQuant console |
| Auth | Auth.js v5 (JWT HttpOnly) + bcryptjs | 5 beta / 3 | OpsDesk |
| Validation | Zod | 3.23.8 | OpsDesk APIs |
| ORM / DB | Prisma / PostgreSQL (Neon), SQLite | 5.22.0 | OpsDesk |
| Python tooling | Pillow, zstandard, brotli, FastAPI/Flask | pinned in `requirements.txt` | TurboQuant (`tqz` on PyPI) |
| Testing | Playwright, pytest, node:test, Lighthouse | CI-pinned | all repos |
| DevOps | Docker, GitHub Actions, Vercel | — | all repos |

Backend Python frameworks (Django, FastAPI, Flask) and PHP (Laravel, Symfony)
are production-stack per [tech-stack.md](tech-stack.md); the shipped proof
above is Next.js/Node + Python tooling.

## 4. Supporting skills (one line each)

- **AI integration**: Arabic-first chat assistants and content endpoints inside
  Next.js sites — [ai-integrations.md](ai-integrations.md), models on
  [Hugging Face](https://huggingface.co/ISLAM-PO).
- **Security**: JWT cookies, bcrypt, Zod, rate-limit, secure headers on my own
  sites — [defensive-security.md](defensive-security.md).
- **Linux & deploy**: Bash, Docker, GitHub Actions, Vercel/Render —
  [linux-systems.md](linux-systems.md).

## Honest scope

Hire me for: business websites, stores, custom web apps (React / Next.js /
Node.js), Arabic AI chat integration, site hardening. Not for: AI researcher,
Security Engineer, or Linux Systems Engineer roles.
