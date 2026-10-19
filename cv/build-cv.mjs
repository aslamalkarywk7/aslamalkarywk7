#!/usr/bin/env node
/**
 * Builds the printable CV (A4 PDF) for the portfolio.
 *
 *   node cv/build-cv.mjs
 *
 * Output
 *   cv/cv-source.html        — the printable source (committed, regenerable)
 *   Islam-Al-Nashar-CV.pdf   — the deliverable, at the repo root
 *
 * The certificate grid is rendered from data/certificates.mjs — the same
 * catalogue the website uses — so the CV can never drift from the site.
 *
 * The PDF is produced with headless Chrome so the result matches the site's
 * own typography (Inter / JetBrains Mono) and the @media print rules that
 * already live in style.css.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

import { CERTIFICATES } from "../data/certificates.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const OUT_HTML = path.join(HERE, "cv-source.html");
const OUT_PDF = path.join(REPO, "Islam-Al-Nashar-CV.pdf");

/* ── content ────────────────────────────────────────────────────────────── */
const PROFILE = {
  name: "Islam Al-Nashar",
  nameAr: "إسلام النشار",
  headline: "Full-Stack Developer — Next.js · TypeScript · Prisma",
  location: "Zarqa, Egypt",
  contacts: [
    ["Email", "aslamalkarywka@gmail.com", "mailto:aslamalkarywka@gmail.com"],
    ["GitHub", "github.com/aslamalkarywk7", "https://github.com/aslamalkarywk7"],
    ["LinkedIn", "linkedin.com/in/islam-elnashar", "https://www.linkedin.com/in/islam-elnashar/"],
    ["Hugging Face", "huggingface.co/ISLAM-PO", "https://huggingface.co/ISLAM-PO"],
    ["Portfolio", "aslamalkarywk7.github.io", "https://aslamalkarywk7.github.io/aslamalkarywk7/"],
  ],
};

const SUMMARY = `Full-Stack Developer based in Egypt with three years of production delivery, building and shipping
business sites, stores and custom web applications end to end — database design, API layer, interface and
deployment. TypeScript, Next.js, Prisma and PostgreSQL are the daily stack; Arabic-first AI integration and
defensive hardening are applied to the products I run rather than offered as theory. Twenty-five verified
certificates, published models and datasets on Hugging Face, and pull requests merged into codebases owned
by Microsoft and Google.`;

const SKILLS = [
  ["Full-Stack", "TypeScript · Next.js 14 (App Router) · React · Node.js · Prisma · PostgreSQL · SQLite · tRPC · REST APIs"],
  ["Frontend", "HTML5 · CSS3 · Sass · Tailwind CSS · Responsive design · WCAG accessibility · Markdown"],
  ["Backend & Data", "REST APIs · tRPC · Prisma ORM · PostgreSQL · MongoDB · Redis · Auth.js · JWT in HttpOnly sessions"],
  ["AI & Machine Learning", "Python · Pandas · NumPy · TensorFlow · PyTorch · Ollama · LangChain · Vector search · LLM APIs (Groq / OpenAI / Gemini)"],
  ["Models & Datasets", "Hugging Face · Qwen2.5 · AraGPT2 · LLaMA · Gemma · Mistral · Fine-tuning (QLoRA / SFT) · Dataset publishing"],
  ["DevOps & Cloud", "Docker · GitHub Actions CI/CD · Nginx · Vercel · Netlify · Linux · Bash · TLS · Logging & rollback"],
  ["Security", "OWASP Top 10 · Server-side validation (Zod) · Rate limiting · Security headers · Secret management · Dependency audits"],
  ["Engineering Practice", "Conventional Commits · Semantic versioning · Unit & regression tests · Black · Docs-as-code · Code review"],
];

const EXPERIENCE = [
  {
    title: "Karjoka — Platform Founder & Lead Engineer",
    org: "Independent / Self-directed",
    date: "2023 — present",
    points: [
      "Design and deliver production web applications end to end — domain model, API, interface, deployment.",
      "Architect full-stack solutions with Node.js, Bun, Svelte, MongoDB and tRPC.",
      "Set up CI/CD and containerised deployments with Docker and Netlify.",
      "Work directly with clients on scope, estimates and handover documentation.",
    ],
  },
  {
    title: "Local AI Infrastructure Specialist",
    org: "Personal R&D / Open Source",
    date: "2024 — present",
    points: [
      "Deploy and maintain offline LLM environments with Ollama for local AI workflows.",
      "Build agent-based automation that amplifies developer productivity pipelines.",
      "Evaluate and integrate open models: LLaMA, Gemma, Mistral and Qwen.",
    ],
  },
  {
    title: "Open-Source Contributor — InvokeAI",
    org: "Community / GitHub",
    date: "2024",
    points: [
      "Built an Arabic localisation and documentation framework for the platform.",
      "Authored structured i18n translation files serving Arabic-speaking communities.",
    ],
  },
  {
    title: "Game Development Engineer — Unity",
    org: "Independent Development",
    date: "2022 — 2024",
    points: [
      "Built game mechanics, AI behaviour trees and multiplayer networking in Unity and C#.",
      "Integrated the PlayFab cloud backend and Plastic SCM for collaboration.",
    ],
  },
];

const PROJECTS = [
  {
    name: "islam-elite-portfolio",
    what: "18 production web applications delivered as one showcase site, each runnable with live demos.",
    stack: "Next.js · TypeScript · Tailwind",
    url: "https://github.com/aslamalkarywk7/islam-elite-portfolio",
    link: "github.com/aslamalkarywk7/islam-elite-portfolio",
  },
  {
    name: "TurboQuant",
    what: "Lossless compression for every file type, shipped with a browser-based console.",
    stack: "TypeScript · WebAssembly · Node.js",
    url: "https://github.com/aslamalkarywk7/TurboQuant",
    link: "github.com/aslamalkarywk7/TurboQuant",
  },
  {
    name: "AndroidReverseEngineering-Guide",
    what: "The most-starred repository in the account — a practical reverse-engineering guide.",
    stack: "Markdown · Tooling · Automation",
    url: "https://github.com/aslamalkarywk7/AndroidReverseEngineering-Guide",
    link: "github.com/aslamalkarywk7/AndroidReverseEngineering-Guide",
  },
  {
    name: "MasryGPT models & Arabic datasets",
    what: "MasryGPT-Chat-1.5B, a lightweight LoRA adapter and an image model, plus four Arabic datasets.",
    stack: "Qwen2.5 · QLoRA · PEFT · Transformers",
    url: "https://huggingface.co/ISLAM-PO",
    link: "huggingface.co/ISLAM-PO",
  },
  {
    name: "microsoft/markitdown — XLSX currency labels",
    what: "Restores currency labels that pandas drops, including section-, condition- and locale-aware number formats.",
    stack: "Python · pandas · openpyxl · pytest",
    url: "https://github.com/microsoft/markitdown/pull/2538",
    link: "github.com/microsoft/markitdown/pull/2538",
  },
  {
    name: "microsoft/markitdown — Arabic/RTL PDF normalisation",
    what: "Normalises Arabic Presentation Forms in the built-in PDF converter with encoding-proof regression tests.",
    stack: "Python · Unicode NFKC · pytest",
    url: "https://github.com/microsoft/markitdown/pull/2539",
    link: "github.com/microsoft/markitdown/pull/2539",
  },
];

const EDUCATION = [
  {
    title: "Management Information Systems & Business Administration",
    org: "Higher Institute of Computer Science and Business Administration, Zarqa",
    date: "3rd year — expected 2029",
    points: ["Enterprise systems design, database management, systems lifecycle and business process engineering."],
  },
  {
    title: "Electronics Engineering — foundation",
    org: "Secondary technical education",
    date: "2021 — 2024",
    points: ["Electronics systems, embedded logic and computational theory fundamentals."],
  },
];

/* ── helpers ────────────────────────────────────────────────────────────── */
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const cvCerts = CERTIFICATES.map((c) => ({
  file: c.file,
  title: c.en.title,
  issuer: c.en.note.split("·")[0].trim(),
}));

const certCards = cvCerts
  .map(
    (c) => `        <figure class="cv-cert">
          <img src="../certificates/thumbs/${c.file.replace(/\.png$/, ".webp")}" alt="${esc(
            c.title
          )}" loading="eager" />
          <figcaption>${esc(c.title)}</figcaption>
          <span class="cv-cert__issuer">${esc(c.issuer)}</span>
        </figure>`
  )
  .join("\n");

const skillCards = SKILLS.map(
  ([cat, items]) => `          <div class="cv-skill-group">
            <div class="cv-skill-group__cat">${esc(cat)}</div>
            <div class="cv-skill-group__items">${esc(items)}</div>
          </div>`
).join("\n");

const entries = (list) =>
  list
    .map(
      (e) => `        <div class="cv-entry">
          <div class="cv-entry__row">
            <div>
              <div class="cv-entry__title">${esc(e.title)}</div>
              <div class="cv-entry__org">${esc(e.org)}</div>
            </div>
            <div class="cv-entry__date">${esc(e.date)}</div>
          </div>
          ${
            e.points
              ? `<ul class="cv-entry__list">${e.points
                  .map((p) => `<li>${esc(p)}</li>`)
                  .join("")}</ul>`
              : ""
          }
        </div>`
    )
    .join("\n");

const projectCards = PROJECTS.map(
  (p) => `        <article class="cv-project">
          <div class="cv-project__head">
            <h3 class="cv-project__name">${esc(p.name)}</h3>
            <span class="cv-project__stack">${esc(p.stack)}</span>
          </div>
          <p class="cv-project__what">${esc(p.what)}</p>
          <a class="cv-project__link" href="${p.url}">${esc(p.link).replace(/\//g, "/<wbr>")}</a>
        </article>`
).join("\n");

const contactItems = PROFILE.contacts
  .map(
    ([label, text, href]) =>
      `          <span class="cv-contact-item__label">${esc(label)}</span>
          <a class="cv-contact-item" href="${href}">${esc(text)}</a>`
  )
  .join("\n");

/* ── template ───────────────────────────────────────────────────────────── */
const html = `<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8" />
<title>${esc(PROFILE.name)} — Full-Stack Developer — CV</title>
<meta name="author" content="${esc(PROFILE.name)}" />
<meta name="description" content="Curriculum Vitae of ${esc(PROFILE.name)}, Full-Stack Developer (Next.js / TypeScript / Prisma) from Egypt." />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="../style.css" />
<link rel="stylesheet" href="cv-print.css" />
</head>
<body>
<div class="cv-page" id="cv-root">
  <article class="cv-document" id="cv-document">

    <header class="cv-header">
      <div>
        <div class="cv-name">${esc(PROFILE.name)}</div>
        <div class="cv-headline">${esc(PROFILE.headline)}</div>
        <div class="cv-contact-item cv-contact-item--loc">${esc(PROFILE.location)}</div>
      </div>
      <div class="cv-header__contact">
${contactItems}
      </div>
    </header>

    <div class="cv-rule"></div>

    <section class="cv-section">
      <h2 class="cv-section__heading">Professional Summary</h2>
      <p class="cv-summary">${esc(SUMMARY)}</p>
    </section>

    <section class="cv-section">
      <h2 class="cv-section__heading">Core Competencies</h2>
      <div class="cv-skills-grid">
${skillCards}
      </div>
    </section>

    <section class="cv-section">
      <h2 class="cv-section__heading">Experience</h2>
${entries(EXPERIENCE)}
    </section>

    <section class="cv-section">
      <h2 class="cv-section__heading">Selected Projects &amp; Open-Source Work</h2>
      <div class="cv-projects">
${projectCards}
      </div>
    </section>

    <section class="cv-section">
      <h2 class="cv-section__heading">Certificates &amp; Badges (${cvCerts.length})</h2>
      <p class="cv-section__note">Every certificate is issued and verifiable — the full list with PDF originals is published at <strong>aslamalkarywk7.github.io/aslamalkarywk7</strong>.</p>
      <div class="cv-certs">
${certCards}
      </div>
    </section>

    <section class="cv-section">
      <h2 class="cv-section__heading">Education</h2>
${entries(EDUCATION)}
    </section>

    <div class="cv-rule cv-rule--end"></div>
    <p class="cv-foot">${esc(PROFILE.name)} — Full-Stack Developer · aslamalkarywka@gmail.com · github.com/aslamalkarywk7</p>

  </article>
</div>
</body>
</html>
`;

fs.writeFileSync(OUT_HTML, html, "utf8");
console.log(`  source  -> ${path.relative(REPO, OUT_HTML)}  (${(fs.statSync(OUT_HTML).size / 1024).toFixed(1)} KB)`);

/* ── render the PDF ─────────────────────────────────────────────────────── */
const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => fs.existsSync(p));

if (!CHROME) {
  console.error("  no Chrome/Edge found — source written, PDF skipped");
  process.exit(1);
}

const profile = path.join(HERE, ".chrome-profile");
const args = [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--no-pdf-header-footer",
  "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=20000",
  `--user-data-dir=${profile}`,
  `--print-to-pdf=${OUT_PDF}`,
  "file:///" + OUT_HTML.replace(/\\/g, "/"),
];

execFileSync(CHROME, args, { stdio: "ignore" });
fs.rmSync(profile, { recursive: true, force: true });

const kb = (fs.statSync(OUT_PDF).size / 1024).toFixed(0);
console.log(`  pdf     -> ${path.relative(REPO, OUT_PDF)}  (${kb} KB)`);
