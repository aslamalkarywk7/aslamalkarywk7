# Q&A — About Me, How I Work, and How I Write Code

> Docs: [README](../README.md) • [Full-Stack proof](full-stack.md) • [Stack](tech-stack.md) • [AI](ai-integrations.md) • [Security](defensive-security.md) • [Linux](linux-systems.md) • [Other](other-skills.md)

## Personal

**Who are you?**
Islam El-Nashar, a Full-Stack Web Developer (Next.js / TypeScript / Prisma)
from Egypt, working with clients since 2023.

**What is your education?**
Undergraduate at the Higher Institute of Computer Science and Business
Administration, Zarqa — Management Information Systems, 3rd year, expected
graduation 2029. Self-taught programmer alongside formal study.

**Which languages do you speak?**
Arabic (native, Egyptian dialect), English (working, technical), Spanish (basic).

**What are you looking for?**
Full-time Full-Stack roles and freelance projects: business websites, stores,
custom web apps, Arabic AI integration, site hardening.

## Work method

**How do you start a project?**
Scope first (pages, roles, data), then data model, then vertical slice:
auth → one working page → API → polish. Demo early, never big-bang.

**How do you think through a feature?**
Who uses it, what can go wrong (validation, auth, empty states), then the
smallest contract (Zod schema / API shape) before any UI.

**How do you solve a hard problem?**
Reproduce → isolate → read the source/error, not guesses → smallest fix →
regression test → document. Evidence before synthesis, always.

**How do you debug?**
Logs and request IDs first (`x-request-id`), then bisect recent changes, then
minimal reproduction. I fix the cause, not the symptom.

## Code and global standards

**How do you write code?**
Strict TypeScript, thin handlers (parse → validate → respond), server-first
components, `kebab-case` files / `PascalCase` components / `camelCase`
functions. No `any` in app code; shared Zod contracts as single source of truth.

**Which standards do you follow?**
Conventional Commits, semantic versioning, MIT licensing with attribution,
CI green before merge, docs-as-code (every module has a header + guide),
WCAG basics (labels carry meaning, never color alone), OWASP awareness
(validate input, HttpOnly sessions, least privilege).

**How do you handle security?**
Validate everything server-side, bcrypt passwords, JWT HttpOnly cookies,
middleware route guards, rate limits, secure headers, audit trails. Defensive
only — I harden my own sites; details in [defensive-security.md](defensive-security.md).

**How do you use AI tools?**
AI-assisted, human-reviewed: AI drafts, I verify, test, and take
responsibility for every merged line. No unreviewed generated code in production.

**How do you keep quality up alone?**
Automated gates replace reviewers: unit + smoke + e2e suites, link checkers,
type checks, and checklists (see any repo's `docs/DEPLOY-CHECKLIST.md`).

## Proof

Live work linked from [full-stack.md](full-stack.md): OpsDesk SaaS, 18-site
portfolio, TurboQuant library, 80 static dashboard designs, Hugging Face
models/datasets, and open-source PRs under review.
