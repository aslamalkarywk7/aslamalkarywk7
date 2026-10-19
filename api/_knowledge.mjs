/**
 * Knowledge base + system prompt for the portfolio AI assistant.
 *
 * Everything the assistant is allowed to claim lives here. The proxy injects
 * this as the system message, so the model answers from verified facts only.
 * Keep it factual and dated — update it when the portfolio changes.
 */

export const OWNER = {
  name: "Islam Al-Nashar",
  nameAr: "إسلام النشار",
  email: "aslamalkarywka@gmail.com",
  github: "https://github.com/aslamalkarywk7",
  linkedin: "https://www.linkedin.com/in/islam-elnashar/",
  huggingface: "https://huggingface.co/ISLAM-PO",
  site: "https://aslamalkarywk7.github.io/aslamalkarywk7/",
};

export const KNOWLEDGE = `
## Who he is
- Name: Islam Al-Nashar (إسلام النشار), 20 years old, based in Egypt.
- Role: Full-Stack Developer (Next.js / TypeScript / Prisma). He builds websites and web applications.
- Supporting skills: AI integration (he integrates AI, he is not an AI researcher) and website hardening / defensive security.
- Languages: Arabic (native, Egyptian dialect), English (working / technical), Spanish (basic).
- Work mode: open to full-time Full-Stack roles AND freelance projects.
- Education: undergraduate, Management Information Systems & Business Administration, 3rd year, expected graduation 2029. Earlier: Electronics Engineering foundation at secondary technical school.

## Production stack
TypeScript, JavaScript, Next.js, React, Node.js, Prisma, PostgreSQL, SQLite, Tailwind CSS, CSS, HTML, Sass, tRPC, Express.js, REST APIs, Git, GitHub Actions, Docker, Nginx, Netlify, Vercel, Linux/Bash, Figma, Postman, VS Code, Cursor, Obsidian, Excalidraw, DaVinci Resolve, Audacity, Photoshop, GIMP.

## Services he offers
1. Business websites, portfolios and online stores — React / Next.js / Node.js.
2. Arabic-first AI for websites — chat assistants, content generation, translation. He is the integrator, not the researcher.
3. Website hardening and protection — audits, fixes, monitoring against common attacks. He hardens his own sites; he is not a pentester for hire.
4. Linux and deployment — Bash, Docker, CI/CD with GitHub Actions, Nginx / Vercel, shipping Next.js apps.

## Honesty rules the assistant must follow
- Never invent employers, clients, projects, salary, dates, tools, certificates or numbers that are not in this brief.
- If the visitor asks something not covered here, say plainly that it is not documented, and offer to pass the question to Islam (email / contact form).
- Distinguish clearly between what he has shipped in production and what he has only explored.
- Do not claim he is a pentester, an AI researcher, a game studio, or a 39-language speaker.
`.trim();

/**
 * The same facts, but structured — served by the `get_profile` tool so the
 * model can pull them in one call instead of re-reading a long prompt.
 */
export const PROFILE = {
  identity: {
    name: "Islam Al-Nashar",
    name_ar: "إسلام النشار",
    age: 20,
    location: "Egypt",
    role: "Full-Stack Developer (Next.js / TypeScript / Prisma)",
    tagline:
      "Builds websites & web applications; AI integration and site hardening are supporting skills.",
    work_mode: "Open to full-time Full-Stack roles and freelance projects",
    languages_spoken: ["Arabic (native, Egyptian dialect)", "English (working / technical)", "Spanish (basic)"],
  },
  education: [
    {
      degree: "Management Information Systems & Business Administration",
      school: "Higher Institute of Computer Science and Business Administration, Zarqa",
      period: "3rd year, expected graduation 2029",
    },
    {
      degree: "Electronics Engineering foundation",
      school: "Secondary technical education",
      period: "2021 – 2024",
    },
  ],
  experience: [
    {
      role: "Karjoka — Platform Founder & Lead Engineer",
      period: "2023 – present",
      points: [
        "Designed and delivered multiple production-grade web applications under the Karjoka brand.",
        "Architected full-stack solutions with Node.js, Bun, Svelte, MongoDB and tRPC.",
        "Set up CI/CD and containerised deployments with Docker and Netlify.",
      ],
    },
    {
      role: "Local AI Infrastructure Specialist",
      period: "2024 – present",
      points: [
        "Deployed and maintained offline LLM environments with Ollama for local AI workflows.",
        "Built agent-based automation to amplify developer productivity pipelines.",
        "Evaluated and integrated open models: LLaMA, Gemma, Mistral, Qwen.",
      ],
    },
    {
      role: "Open-Source Contributor — InvokeAI",
      period: "2024",
      points: [
        "Built a comprehensive Arabic localisation and documentation framework for the platform.",
        "Authored structured i18n translation files for Arabic-speaking communities.",
      ],
    },
    {
      role: "Game Development Engineer — Unity",
      period: "2022 – 2024",
      points: [
        "Built game mechanics, AI behaviour trees and multiplayer networking with Unity & C#.",
        "Integrated PlayFab cloud backend and Plastic SCM for collaboration.",
      ],
    },
  ],
  ai_work: {
    huggingface: "https://huggingface.co/ISLAM-PO",
    models: ["MasryGPT-Chat-1.5B", "MasryGPT-Flash-Adapter", "Glitch-Img-1.0"],
    datasets: [
      "arabic-history-and-dialects",
      "arabic-to-code-8-langs-3m",
      "documents-Egyptian-Arabic",
      "arab-dialects-20-countries-3m",
    ],
    open_source_targets: [
      "Ollama", "InvokeAI", "markitdown", "genkit", "adk-python", "LocalAI", "mem0", "mastra",
    ],
  },
  stack: [
    "TypeScript", "JavaScript", "Next.js", "React", "Node.js", "Prisma",
    "PostgreSQL", "SQLite", "Tailwind CSS", "tRPC", "Express.js", "REST APIs",
    "Git", "GitHub Actions", "Docker", "Nginx", "Netlify", "Vercel", "Linux/Bash",
    "Figma", "Postman", "VS Code", "Cursor", "Obsidian",
  ],
};


/**
 * System prompt. `lang` nudges the answer language; the model is also told to
 * mirror whatever language the visitor actually uses.
 *
 * The prompt is intentionally SHORT: the facts now live in tools
 * (`get_profile`, `list_certificates`, `search_portfolio_docs`, …), so the
 * same tokens are not re-sent on every tool round.
 */
export function buildSystemPrompt(lang = "en", mode = "chat") {
  const langRule =
    lang === "ar"
      ? "The visitor is browsing in Arabic. Answer in Modern Standard Arabic with an Egyptian-friendly touch, keeping technical terms (Next.js, Prisma, API, Docker) in English."
      : "The visitor is browsing in English. Answer in clear, professional English.";

  const planning = mode === "plan" ? `
PLANNING MODE IS ON — the visitor wants a plan, a scope, a roadmap or a project design. Follow this procedure exactly, in this order:
1. GROUND FIRST. Call the tools you need so the plan rests on verified facts (get_profile, get_project_templates, list_certificates, search_portfolio_docs, get_live_github_stats). Never plan from memory.
2. RECORD THE PLAN. Call record_plan exactly ONCE with the goal and 3–6 ordered steps. Every step MUST fill in all four fields — title, detail, stack, effort — plus the tool that informed it. A step with an empty field is an invalid step.
3. THEN ANSWER. Write prose after the plan card: the recommendation, the stack, the size, the main risk, and one clear next step for the visitor.
Never skip step 2 — the plan card is the deliverable, the prose is only the explanation.` : "";

  return [
    `You are the AI assistant embedded in Islam Al-Nashar's personal portfolio website — a Full-Stack Developer (Next.js / TypeScript / Prisma) based in Egypt. You represent him when he is not available.

YOU ANSWER QUESTIONS ABOUT ISLAM. That is your whole job. The visitor wants to know who he is, what he can do, what he has built, what he has earned and how to reach him.

TOOLS ARE YOUR SOURCE OF TRUTH. Use them instead of recalling — never invent employers, clients, dates, numbers, tools or certificates. If a tool returns nothing, say it is not documented and offer to forward the question to Islam (email / contact form).

Your job:
1. Answer questions about Islam's identity, skills, stack, experience, education, certificates, services, open-source work and contact details, using the tools.
2. Help a visitor decide whether to work with him, and point to the next step (contact form or email).
3. Keep the answer about him and about working with him.${planning}

Style:
- Concise and concrete. 2-5 short sentences for a normal question, a small list when there are several facts.
- Warm but professional. Speak about Islam in the third person, or as "his assistant".
- Distinguish what he has shipped in production from what he has only explored.
- ${langRule}
- Answer in the language of the visitor's message, not the browsing language.`,
  ].join("\n");
}

/** Short suggestion chips shown under the welcome message. */
export const STARTERS = [
  { en: "What services do you offer?", ar: "ما الخدمات التي تقدمها؟" },
  { en: "Suggest a project idea for me", ar: "اقترح لي فكرة مشروع" },
  { en: "What is your tech stack?", ar: "ما هي تقنياتك المستخدمة؟" },
  { en: "Show me your certificates", ar: "أرني شهاداتك" },
];

/**
 * Project shapes he can realistically deliver. The assistant proposes from
 * this list so its ideas match his actual delivery capability instead of
 * inventing something out of reach.
 */
export const PROJECT_TEMPLATES = [
  {
    name: "Business website + lead capture",
    category: "web",
    keywords: ["business", "company", "corporate", "startup", "موقع", "شركة"],
    scope:
      "5–8 pages, responsive, fast, SEO basics, contact + lead form, deployment and analytics.",
    stack: "Next.js · TypeScript · Tailwind · PostgreSQL · Vercel",
    size: "small",
  },
  {
    name: "Personal portfolio with a CMS",
    category: "web",
    keywords: ["portfolio", "personal", "cv", "معرض", "سيرة"],
    scope:
      "Projects, skills, certificates, blog/CMS, contact form, dark/light themes, deploy pipeline.",
    stack: "Next.js · React · Prisma · PostgreSQL · Tailwind",
    size: "small",
  },
  {
    name: "Online store with checkout",
    category: "ecommerce",
    keywords: ["store", "shop", "ecommerce", "متجر", "متجر إلكتروني"],
    scope:
      "Catalogue, search and filters, cart, checkout and payment gateway, orders admin panel, stock and invoices.",
    stack: "Next.js · Prisma · PostgreSQL · Stripe · Tailwind",
    size: "medium",
  },
  {
    name: "Arabic-first AI assistant on a site",
    category: "ai",
    keywords: ["ai", "chat", "assistant", "chatbot", "ذكاء", "مساعد", "دردشة"],
    scope:
      "Streaming chat widget, Arabic prompt layer, retrieval over site content, rate limiting, admin logs.",
    stack: "Next.js API routes · Groq / OpenAI · vector search · Postgres",
    size: "medium",
  },
  {
    name: "Content & translation pipeline",
    category: "ai",
    keywords: ["translation", "content", "seo", "ترجمة", "محتوى"],
    scope:
      "Bulk content generation, Arabic ⇄ English translation, review queue, publishing to a CMS.",
    stack: "Node scripts · LLM API · Markdown · headless CMS",
    size: "small",
  },
  {
    name: "Website hardening pass",
    category: "security",
    keywords: ["security", "hardening", "audit", "أمان", "حماية"],
    scope:
      "Header and cookie review, input validation, rate limiting, dependency audit, backups, monitoring and a written report.",
    stack: "OWASP Top 10 · Nginx · CI checks · server hardening",
    size: "small",
  },
  {
    name: "CI/CD + Docker deployment",
    category: "devops",
    keywords: ["deploy", "ci", "docker", "نشر", "استضافة"],
    scope:
      "GitHub Actions pipeline, container images, staging + production, TLS, logs and rollback.",
    stack: "GitHub Actions · Docker · Nginx · Vercel / any VPS",
    size: "small",
  },
  {
    name: "Internal tools dashboard",
    category: "web",
    keywords: ["dashboard", "admin", "internal", "crm", "erp", "لوحة", "إدارة"],
    scope:
      "Role-based access, CRUD over a real database, charts, export to CSV/Excel, audit trail.",
    stack: "Next.js · Prisma · PostgreSQL · Recharts",
    size: "medium",
  },
];

/** Real, linkable work. */
export const FEATURED_WORK = [
  {
    name: "islam-elite-portfolio",
    description: "18 live web projects with demos — a full front-end showcase.",
    url: "https://github.com/aslamalkarywk7/islam-elite-portfolio",
  },
  {
    name: "AndroidReverseEngineering-Guide",
    description: "Most-starred guide in the account — defensive security research.",
    url: "https://github.com/aslamalkarywk7/AndroidReverseEngineering-Guide",
  },
  {
    name: "TurboQuant",
    description: "Lossless compression for every file type, with a web console.",
    url: "https://github.com/aslamalkarywk7/TurboQuant",
  },
  {
    name: "Open-source pull requests",
    description:
      "Merged and reviewed contributions to Ollama, InvokeAI, markitdown, genkit, adk-python, LocalAI, mem0 and mastra.",
    url: "https://github.com/aslamalkarywk7?tab=repositories",
  },
  {
    name: "Hugging Face — ISLAM-PO",
    description:
      "MasryGPT chat models and Arabic datasets (history, dialects, Egyptian Arabic).",
    url: "https://huggingface.co/ISLAM-PO",
  },
];

