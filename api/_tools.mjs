/**
 * Tool layer for the portfolio AI assistant.
 *
 * Every tool answers from a verified source:
 *   • the portfolio's own markdown documentation (real retrieval, not recall)
 *   • the shared certificate catalogue
 *   • the live GitHub API
 *
 * The same tools are exposed by the MCP server (mcp/server.mjs), so the
 * owner's AI client (Claude Desktop, an IDE, …) can query the exact same
 * facts the website assistant uses.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CERTIFICATES } from "../data/certificates.mjs";
import { CORPUS } from "../data/docs-corpus.mjs";
import { KNOWLEDGE, PROFILE, PROJECT_TEMPLATES, FEATURED_WORK } from "./_knowledge.mjs";
import { allowedTools, toolAllowed } from "./_config.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const GITHUB_USER = "aslamalkarywk7";

/* ── Documentation corpus ────────────────────────────────────────────────
   Prefer the live files when they are on disk (local dev / full checkout);
   fall back to the generated snapshot so the deployed function behaves
   identically.                                                              */
let cachedSections = null;

function loadSections() {
  if (cachedSections) return cachedSections;

  const files = ["README.md", "docs/full-stack.md", "docs/tech-stack.md",
    "docs/ai-integrations.md", "docs/defensive-security.md",
    "docs/linux-systems.md", "docs/other-skills.md", "docs/full-stack.md",
    "docs/qa.md", "docs/certificates.md", "CONTRIBUTIONS.md"];

  const sections = [];
  for (const rel of files) {
    const abs = path.join(REPO, rel);
    let text = "";
    try {
      if (fs.existsSync(abs)) text = fs.readFileSync(abs, "utf8");
    } catch {
      /* ignore */
    }
    if (!text && CORPUS[rel]) text = CORPUS[rel];
    if (!text) continue;
    sections.push(...splitSections(rel, text));
  }
  cachedSections = sections;
  return sections;
}

function splitSections(file, text) {
  const out = [];
  const lines = text.split(/\r?\n/);
  let heading = "";
  let buf = [];
  let inFence = false;

  const flush = () => {
    const body = buf.join("\n").trim();
    if (body || heading) {
      out.push({ file, heading, body, text: `${heading}\n${body}`.trim() });
    }
    buf = [];
  };

  for (const line of lines) {
    if (/^```/.test(line)) inFence = !inFence;
    const m = !inFence && line.match(/^(#{1,4})\s+(.*)$/);
    if (m) {
      flush();
      heading = line.trim();
      continue;
    }
    buf.push(line);
  }
  flush();
  return out;
}

const STOP = new Set([
  "the", "a", "an", "of", "and", "or", "to", "in", "for", "on", "is", "are",
  "what", "which", "who", "how", "do", "does", "did", "his", "her", "their",
  "about", "with", "from", "can", "you", "me", "my", "he", "she", "it", "that",
  "this", "tell", "show", "give", "have", "has", "been", "was", "were", "his",
]);

function terms(query) {
  return String(query || "")
    .toLowerCase()
    .split(/[^a-z0-9؀-ۿ]+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
    .slice(0, 12);
}

function searchDocs(query, maxPassages = 4) {
  const words = terms(query);
  const sections = loadSections();
  if (!words.length) return [];

  const scored = sections.map((s) => {
    const hay = s.text.toLowerCase();
    const head = s.heading.toLowerCase();
    let score = 0;
    for (const w of words) {
      const inHead = head.includes(w) ? 3 : 0;
      const hits = hay.split(w).length - 1;
      score += inHead + Math.min(hits, 4);
    }
    return { s, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored
    .filter((x) => x.score > 0)
    .slice(0, Math.min(Math.max(Number(maxPassages) || 2, 1), 4))
    .map(({ s, score }) => ({
      source: s.file,
      section: s.heading.replace(/^#+\s*/, "") || s.file,
      excerpt: s.body.replace(/\n{3,}/g, "\n\n").slice(0, 700),
      relevance: score,
    }));
}

/* ── Live GitHub data ──────────────────────────────────────────────────── */
async function githubJson(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "aslamalkarywk7-portfolio-assistant",
      Accept: "application/vnd.github+json",
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return res.json();
}

async function liveGithubStats() {
  const [profile, repos] = await Promise.all([
    githubJson(`https://api.github.com/users/${GITHUB_USER}`),
    githubJson(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated&type=owner`),
  ]);

  const own = repos.filter((r) => !r.fork);
  const stars = own.reduce((a, r) => a + (r.stargazers_count || 0), 0);
  const top = own
    .slice()
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map((r) => ({
      name: r.name,
      stars: r.stargazers_count,
      language: r.language,
      description: (r.description || "").slice(0, 120),
      url: r.html_url,
      updated: r.updated_at,
    }));

  return {
    fetched_at: new Date().toISOString(),
    followers: profile.followers,
    public_repos: profile.public_repos,
    total_stars: stars,
    top_repositories: top,
    note: "Live numbers fetched from the GitHub API at request time.",
  };
}

/* ── Tool definitions ──────────────────────────────────────────────────────
   Kept deliberately compact: the whole JSON is re-sent on every tool round
   and Groq's free tier counts input tokens per minute.
   ─────────────────────────────────────────────────────────────────────────── */
export const TOOLS = [
  {
    type: "function",
    function: {
      name: "get_profile",
      description:
        "Islam's structured profile: identity, production stack, work history, education, AI work. Call first for background questions.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "search_portfolio_docs",
      description:
        "Search the portfolio's own README + docs/ and return matching passages. Authoritative for details the other tools omit.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Keywords or question." },
          max_passages: { type: "integer", description: "Default 2, max 4." },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_certificates",
      description: "List the certificates Islam holds.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: ["fullstack", "ai", "data", "english"],
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_services",
      description: "The four services Islam can be hired for, with their stack.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "get_project_templates",
      description:
        "Deliverable project shapes he can build (scope, stack, size). Use for project ideas so they match his real capability.",
      parameters: {
        type: "object",
        properties: { goal: { type: "string", description: "What the visitor wants." } },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_live_github_stats",
      description:
        "Live GitHub numbers: followers, repo count, total stars, top repos. Use for current stats.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "record_plan",
      description:
        "Record the execution plan as a structured checklist that is shown to the visitor. Call this EXACTLY ONCE, after grounding the plan with the other tools, whenever the visitor asks for a plan, a scope, a roadmap or a project design.",
      parameters: {
        type: "object",
        properties: {
          goal: {
            type: "string",
            description: "One sentence describing what the plan achieves.",
          },
          steps: {
            type: "array",
            description: "The ordered steps of the plan (3 to 6).",
            items: {
              type: "object",
              properties: {
                title: { type: "string", description: "Short step title." },
                detail: {
                  type: "string",
                  description: "What this step delivers — one or two sentences.",
                },
                stack: {
                  type: "string",
                  description: "Technologies used in this step.",
                },
                effort: {
                  type: "string",
                  enum: ["small", "medium", "large"],
                  description: "Effort of this single step.",
                },
                tool: {
                  type: "string",
                  description: "Which tool informed this step.",
                },
              },
              required: ["title", "detail", "stack", "effort"],
            },
          },
        },
        required: ["goal", "steps"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_contact_channels",
      description: "How to reach Islam: email, GitHub, LinkedIn, Hugging Face, site.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "get_featured_work",
      description: "Featured repositories and projects with links.",
      parameters: { type: "object", properties: {} },
    },
  },
];

/* ── Executors ─────────────────────────────────────────────────────────── */
export async function runTool(name, args = {}, opts = {}) {
  /* A tool that is not part of the active scope is simply not offered to the
     model — and if a call for it somehow arrives, it is refused.
     The MCP server passes { scope: "full" } to get the complete set. */
  if (!toolAllowed(name, opts.scope)) {
    return {
      error: "tool_not_available",
      tool: name,
      message:
        "This tool is not part of the assistant's current scope. Answer with what you already know.",
    };
  }

  switch (name) {
    case "get_profile":
      return PROFILE;

    case "search_portfolio_docs": {
      const passages = searchDocs(args.query, args.max_passages);
      return {
        query: String(args.query || ""),
        found: passages.length,
        passages,
        hint: passages.length
          ? "Quote or summarise these passages; do not add facts that are not in them."
          : "Nothing in the documentation matched — say it is not documented and offer to forward the question.",
      };
    }

    case "list_certificates": {
      const cat = args.category;
      const list = CERTIFICATES.filter((c) => !cat || c.cat === cat);
      return {
        count: list.length,
        certificates: list.map((c) => ({
          title: c.en.title,
          issuer: c.en.note.split("·")[0].trim(),
          summary: c.en.note,
          category: c.cat,
        })),
      };
    }

    case "get_services":
      return { services: SERVICES };

    case "get_project_templates": {
      const goal = String(args.goal || "").toLowerCase();
      const list = goal
        ? PROJECT_TEMPLATES.filter(
            (t) =>
              t.keywords.some((k) => goal.includes(k)) ||
              goal.includes(t.category),
          )
        : PROJECT_TEMPLATES;
      return {
        templates: (list.length ? list : PROJECT_TEMPLATES).map((t) => ({
          name: t.name,
          category: t.category,
          scope: t.scope,
          stack: t.stack,
          size: t.size,
        })),
      };
    }

    case "get_live_github_stats": {
      try {
        return await liveGithubStats();
      } catch (err) {
        return { error: "github_unavailable", message: String(err.message || err) };
      }
    }

    case "record_plan": {
      const steps = Array.isArray(args.steps) ? args.steps.slice(0, 8) : [];
      return {
        recorded: true,
        goal: String(args.goal || "").trim(),
        steps: steps.map((s, i) => ({
          n: i + 1,
          title: String(s?.title || "").trim(),
          detail: String(s?.detail || "").trim(),
          stack: String(s?.stack || "").trim(),
          effort: ["small", "medium", "large"].includes(s?.effort) ? s.effort : "",
          tool: String(s?.tool || "").trim(),
        })),
      };
    }

    case "get_contact_channels":
      return CONTACT;

    case "get_featured_work":
      return { featured_work: FEATURED_WORK };

    default:
      return { error: "unknown_tool", tool: name };
  }
}

const SERVICES = [
  {
    name: "Business websites, portfolios & stores",
    stack: "React / Next.js / Node.js / TypeScript / Prisma / PostgreSQL / Tailwind",
    scope:
      "Marketing sites, personal portfolios, company sites and small online stores — design, build, deploy, maintain.",
  },
  {
    name: "Arabic-first AI for your website",
    stack: "LLM APIs (OpenAI / Gemini / Groq), LangChain, vector search, prompt design",
    scope:
      "Chat assistants, content generation and translation wired into the product — he is the integrator, not the model researcher.",
  },
  {
    name: "Website hardening & protection",
    stack: "OWASP Top 10, security headers, input validation, rate limiting, CI checks, monitoring",
    scope:
      "Audits, fixes and monitoring against common attacks. He hardens his own sites; he is not a pentester for hire.",
  },
  {
    name: "Linux & deployment",
    stack: "Bash, Docker, GitHub Actions CI/CD, Nginx, Vercel / Netlify",
    scope:
      "Shipping Next.js apps: pipelines, containers, servers, TLS, logs and rollback.",
  },
];

const CONTACT = {
  email: "aslamalkarywka@gmail.com",
  contact_form: "The contact form at the bottom of the portfolio site",
  github: "https://github.com/aslamalkarywk7",
  linkedin: "https://www.linkedin.com/in/islam-elnashar/",
  huggingface: "https://huggingface.co/ISLAM-PO",
  portfolio: "https://aslamalkarywk7.github.io/aslamalkarywk7/",
  response_note:
    "Free to talk about scope, timeline and price. Full-time roles and freelance both on the table.",
};

export { KNOWLEDGE, PROJECT_TEMPLATES, FEATURED_WORK };

/** The tools that are actually exposed in the active scope. */
export function scopedTools(scope) {
  const allow = allowedTools(scope);
  return TOOLS.filter((t) => allow.includes(t.function.name));
}
