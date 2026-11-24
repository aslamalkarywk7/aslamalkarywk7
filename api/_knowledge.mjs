/**
 * Knowledge base + system prompt for the portfolio AI assistant.
 *
 * Everything the assistant is allowed to claim lives here. The proxy injects
 * this as the system message, so the model answers from verified facts only.
 * Keep it factual and dated — update it when the portfolio changes.
 */

export const OWNER = {
  name: "Islam Al-Nasher",
  nameAr: "إسلام الناشر",
  email: "aslamalkarywka@gmail.com",
  github: "https://github.com/aslamalkarywk7",
  linkedin: "https://www.linkedin.com/in/islam-elnashar/",
  huggingface: "https://huggingface.co/ISLAM-PO",
  devto: "https://dev.to/islam_alnashera_19f64a4e",
  site: "https://aslamalkarywk7.github.io/aslamalkarywk7/",
};

/**
 * Real, linkable work — kept in sync with the curated Projects and Profiles
 * sections of the site. Snapshot counts are dated so the assistant never
 * presents them as live numbers.
 */
export const PROJECT_DATA = {
  snapshot_date: "2026-11-24",
  github: {
    owner: "aslamalkarywk7",
    note: "Twelve curated public repositories. Stars are a snapshot, not live numbers.",
    repositories: [
      { name: "souqna", language: "TypeScript", description_ar: "متجر ثنائي اللغة AR/EN — سلة، JWT، SQLite", url: "https://github.com/aslamalkarywk7/souqna" },
      { name: "maktabi-store", language: "TypeScript", description_ar: "مكتبة/كتب أونلاين ثنائية اللغة", url: "https://github.com/aslamalkarywk7/maktabi-store" },
      { name: "islam-alnashar-perfumes", language: "TypeScript", description_ar: "متجر عطور فاخر AR/EN", url: "https://github.com/aslamalkarywk7/islam-alnashar-perfumes" },
      { name: "aura-analytics", language: "TypeScript", description_ar: "لوحة تحليلات لايف ثنائية اللغة", url: "https://github.com/aslamalkarywk7/aura-analytics" },
      { name: "Wardian-Conservatory-3D-Glass-Terrarium", language: null, description_ar: "صوبة زجاجية ثلاثية الأبعاد", url: "https://github.com/aslamalkarywk7/Wardian-Conservatory-3D-Glass-Terrarium" },
      { name: "AndroidReverseEngineering-Guide", language: "Python", description_ar: "دليل هندسة عكسية للأندرويد", stars: 8, url: "https://github.com/aslamalkarywk7/AndroidReverseEngineering-Guide" },
      { name: "fullstackopen", language: "JavaScript", description_ar: "حلول دورة Full Stack Open", url: "https://github.com/aslamalkarywk7/fullstackopen" },
      { name: "aslamalkarywk7", language: "JavaScript", description_ar: "مستودع البورتفوليو نفسه", stars: 1, url: "https://github.com/aslamalkarywk7/aslamalkarywk7" },
      { name: "blender-mcp", language: "Python", description_ar: "التحكم في Blender عبر MCP", url: "https://github.com/aslamalkarywk7/blender-mcp" },
      { name: "TurboQuant", language: "Python", description_ar: "ضغط ملفات lossless + web console", stars: 1, url: "https://github.com/aslamalkarywk7/TurboQuant" },
      { name: "opsdesk", language: "TypeScript", description_ar: "SaaS لإدارة الأعمال — Next.js 14 + Prisma", url: "https://github.com/aslamalkarywk7/opsdesk" },
      { name: "yaqout-langar", language: "C", description_ar: "لغة يعقوب: Lua مع كلمات عربية", stars: 1, url: "https://github.com/aslamalkarywk7/yaqout-langar" },
    ],
  },
  huggingface: {
    namespace: "ISLAM-PO",
    note: "Download counts are a dated snapshot; current numbers are on the Hugging Face profile.",
    models: [
      { id: "MasryGPT-Chat-1.5B", downloads: 579, url: "https://huggingface.co/ISLAM-PO/MasryGPT-Chat-1.5B" },
      { id: "MasryGPT-Flash-Adapter", downloads: 15, url: "https://huggingface.co/ISLAM-PO/MasryGPT-Flash-Adapter" },
      { id: "Glitch-Img-1.0", downloads: 82, url: "https://huggingface.co/ISLAM-PO/Glitch-Img-1.0" },
      { id: "unit4-agent-code", downloads: 0, url: "https://huggingface.co/ISLAM-PO/unit4-agent-code" },
      { id: "alfred-gala-agent", downloads: 0, url: "https://huggingface.co/ISLAM-PO/alfred-gala-agent" },
      { id: "context-engineering-toolkit", downloads: 0, url: "https://huggingface.co/ISLAM-PO/context-engineering-toolkit" },
      { id: "mcp-pr-agent", downloads: 0, url: "https://huggingface.co/ISLAM-PO/mcp-pr-agent" },
      { id: "LGM", downloads: 0, url: "https://huggingface.co/ISLAM-PO/LGM" },
    ],
    datasets: [
      { id: "arabic-history-and-dialects", downloads: 285, url: "https://huggingface.co/datasets/ISLAM-PO/arabic-history-and-dialects" },
      { id: "documents-Egyptian-Arabic", downloads: 482, url: "https://huggingface.co/datasets/ISLAM-PO/documents-Egyptian-Arabic" },
      { id: "arab-dialects-20-countries-3m", downloads: 3273, url: "https://huggingface.co/datasets/ISLAM-PO/arab-dialects-20-countries-3m" },
      { id: "arabic-to-code-8-langs-3m", downloads: 1432, url: "https://huggingface.co/datasets/ISLAM-PO/arabic-to-code-8-langs-3m" },
    ],
    total_downloads_snapshot: 6148,
  },
};

/** Major, dated portfolio updates the assistant can talk about. */
export const RECENT_UPDATES = [
  {
    date: "2026-11-24",
    title: "AI assistant now briefed on projects and updates",
    detail: "The assistant can now describe the curated GitHub projects, all Hugging Face models and datasets, and the latest portfolio changes.",
  },
  {
    date: "2026-11-24",
    title: "All Hugging Face work is on the site",
    detail: "8 public models and 4 Arabic datasets are shown live with download counts — about 6,100 downloads at the time of writing.",
  },
  {
    date: "2026-11-24",
    title: "Twelve projects curated in the Projects section",
    detail: "The strongest repositories now appear first with clear Arabic descriptions instead of raw GitHub text.",
  },
  {
    date: "2026-11-24",
    title: "Intro video added to the hero",
    detail: "A 2:09 square intro video with a cinematic opening, project cards and burned-in English captions, playable from the hero portrait.",
  },
  {
    date: "2026-11-24",
    title: "Client-friendly copy and consistent name",
    detail: "Developer-only references were removed from the visible site, and the name is now Islam Al-Nasher everywhere.",
  },
];

export const KNOWLEDGE = `
## Who he is
- Name: Islam Al-Nasher (إسلام الناشر), 20 years old, based in Egypt.
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

## Projects and AI work (call get_projects for full data)
- Twelve curated public repositories, including: Yaqout (Arabic Lua language), TurboQuant (lossless compression), OpsDesk (business SaaS), blender-mcp (AI agents controlling Blender), and bilingual stores — Souqna, Maktabi Store and an Arabic perfume store.
- On Hugging Face (ISLAM-PO): 8 public models and 4 Arabic datasets — MasryGPT chat models, Glitch-Img, LGM, and Arabic dialect / Arabic-to-code datasets. About 6,100 downloads in total at the last snapshot.
- Most-starred repository: AndroidReverseEngineering-Guide (8 stars at the last snapshot).
- Always use get_projects for names, links and numbers; do not quote counts from memory.

## Recent updates (also in get_projects)
- 2026-11-24: Projects section now shows 12 curated repositories first, with Arabic descriptions.
- 2026-11-24: Hugging Face section now loads all 8 models and 4 datasets with download counts.
- 2026-11-24: A 2:09 intro video was added to the hero with a cinematic opening and project cards.
- 2026-11-24: Name standardised to Islam Al-Nasher and developer-only wording removed from the visible site.
- 2026-11-24: This assistant was upgraded to answer with project and update data.

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
    name: "Islam Al-Nasher",
    name_ar: "إسلام الناشر",
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
    models: [
      "MasryGPT-Chat-1.5B", "MasryGPT-Flash-Adapter", "Glitch-Img-1.0",
      "unit4-agent-code", "alfred-gala-agent", "context-engineering-toolkit",
      "mcp-pr-agent", "LGM",
    ],
    datasets: [
      "arabic-history-and-dialects", "documents-Egyptian-Arabic",
      "arab-dialects-20-countries-3m", "arabic-to-code-8-langs-3m",
    ],
    total_downloads_snapshot: 6148,
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
1. GROUND FIRST. Call the tools you need so the plan rests on verified facts (get_profile, get_projects, get_project_templates, list_certificates, search_portfolio_docs, get_live_github_stats). Never plan from memory.
2. RECORD THE PLAN. Call record_plan exactly ONCE with the goal and 3–6 ordered steps. Every step MUST fill in all four fields — title, detail, stack, effort — plus the tool that informed it. A step with an empty field is an invalid step.
3. THEN ANSWER. Write prose after the plan card: the recommendation, the stack, the size, the main risk, and one clear next step for the visitor.
Never skip step 2 — the plan card is the deliverable, the prose is only the explanation.` : "";

  return [
    `You are the AI assistant embedded in Islam Al-Nasher's personal portfolio website — a Full-Stack Developer (Next.js / TypeScript / Prisma) based in Egypt. You represent him when he is not available.

YOU ANSWER QUESTIONS ABOUT ISLAM. That is your whole job. The visitor wants to know who he is, what he can do, what he has built, what he has earned and how to reach him.

TOOLS ARE YOUR SOURCE OF TRUTH. Use them instead of recalling — never invent employers, clients, dates, numbers, tools or certificates. If a tool returns nothing, say it is not documented and offer to forward the question to Islam (email / contact form).

Your job:
1. Answer questions about Islam's identity, skills, stack, experience, education, certificates, services, projects, AI work, recent updates and contact details, using the tools.
2. When a visitor asks what he has built, what is new, or whether he has AI experience, call get_projects and answer with concrete names and links.
3. Help a visitor decide whether to work with him, and point to the next step (contact form or email).
4. Keep the answer about him and about working with him.${planning}

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
  { en: "What projects have you built?", ar: "ما المشاريع التي بنيتها؟" },
  { en: "What is your AI work?", ar: "ما أعمالك في الذكاء الاصطناعي؟" },
  { en: "What's new on your portfolio?", ar: "ما الجديد في بورتفوليو؟" },
  { en: "What services do you offer?", ar: "ما الخدمات التي تقدمها؟" },
  { en: "Suggest a project idea for me", ar: "اقترح لي فكرة مشروع" },
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
    name: "Yakout (yaqout-langar)",
    description: "A fully Arabised Lua interpreter with Arabic keywords and variables — written in C.",
    url: "https://github.com/aslamalkarywk7/yaqout-langar",
  },
  {
    name: "TurboQuant",
    description: "Lossless compression for every file type, with a web console.",
    url: "https://github.com/aslamalkarywk7/TurboQuant",
  },
  {
    name: "OpsDesk",
    description: "Business-management SaaS built with Next.js 14, TypeScript and Prisma.",
    url: "https://github.com/aslamalkarywk7/opsdesk",
  },
  {
    name: "AndroidReverseEngineering-Guide",
    description: "Most-starred repository in the account — practical defensive security research.",
    url: "https://github.com/aslamalkarywk7/AndroidReverseEngineering-Guide",
  },
  {
    name: "Hugging Face — ISLAM-PO",
    description:
      "8 public models and 4 Arabic datasets — MasryGPT, Glitch-Img, LGM and Arabic dialect / code datasets.",
    url: "https://huggingface.co/ISLAM-PO",
  },
];

