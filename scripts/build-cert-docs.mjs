#!/usr/bin/env node
/**
 * Regenerate the certificates section in README.md and docs/certificates.md
 * from the SAME catalogue the website renders (data/certificates.mjs).
 *
 *   node scripts/build-cert-docs.mjs
 *
 * One source of truth → the docs can never drift from the site. The script
 * fails loudly if a referenced file is missing.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CERTIFICATES } from "../data/certificates.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CERTS = path.join(REPO, "certificates");

/** Group order and headings — mirrors the site's filter chips. */
const GROUPS = [
  { cat: "fullstack", heading: "Full-Stack Development" },
  { cat: "ai", heading: "AI &amp; Machine Learning" },
  { cat: "data", heading: "Data &amp; Analytics — Kaggle Micro-Courses" },
  { cat: "english", heading: "English — OPEN MOOCs" },
];

/** Certificates with a public verification link get their image linked to it. */
const VERIFY = {
  "full-stack-open.png":
    "https://studies.cs.helsinki.fi/stats/api/certificate/fullstackopen/en/8adba106796fd6c41b4136dc41ecc601",
  "oneroadmap-full-stack-developer.png":
    "https://www.oneroadmap.io/skills/fs/certificate/CERT-90CAE102",
};

function assertFiles() {
  const missing = [];
  for (const c of CERTIFICATES) {
    if (!fs.existsSync(path.join(CERTS, c.file))) missing.push(c.file);
    /* c.pdf already carries the "certificates/" prefix in the catalogue */
    if (c.pdf && !fs.existsSync(path.join(CERTS, path.basename(c.pdf)))) {
      missing.push(path.basename(c.pdf));
    }
    const thumb = c.file.replace(/\.png$/, ".webp");
    if (!fs.existsSync(path.join(CERTS, "thumbs", thumb))) missing.push("thumbs/" + thumb);
  }
  if (missing.length) {
    console.error("Missing certificate files:\n  " + missing.join("\n  "));
    process.exit(1);
  }
}

function entry(c, prefix) {
  const title = c.en.title;
  const note = c.en.note;
  const img = `${prefix}certificates/${c.file}`;
  const link = VERIFY[c.file];

  const line = link
    ? `<p align="center"><a href="${link}"><img src="${img}" alt="${title}" width="600" /></a></p>`
    : `<p align="center"><img src="${img}" alt="${title}" width="600" /></p>`;

  const out = [line];
  if (c.pdf && fs.existsSync(path.join(CERTS, path.basename(c.pdf)))) {
    /* Raw HTML on purpose — GitHub does not render markdown inside an
       inline HTML block, so a markdown link would show up as literal text. */
    out.push(
      `<p align="center"><sub><i><a href="${prefix}certificates/${path.basename(
        c.pdf
      )}">PDF original</a></i></sub></p>`
    );
  }
  out.push(`<p align="center"><sub><i>${note}</i></sub></p>`);
  return out.join("\n");
}

function block(prefix, note) {
  const out = [];
  if (note) {
    out.push(note);
    out.push("");
  }
  for (const g of GROUPS) {
    const items = CERTIFICATES.filter((c) => c.cat === g.cat);
    if (!items.length) continue;
    out.push(`### ${g.heading}`);
    out.push("");
    for (const c of items) {
      out.push(entry(c, prefix));
      out.push("");
    }
  }
  return out.join("\n").trimEnd() + "\n";
}

/* The repo uses CRLF — keep whatever the file already had. */
function writeKeeping(path, text, original) {
  const eol = original.includes("\r\n") ? "\r\n" : "\n";
  const normalised = text.replace(/\r\n/g, "\n");
  fs.writeFileSync(path, normalised.replace(/\n/g, eol), "utf8");
}

assertFiles();

/* ── README.md ───────────────────────────────────────────────────────────── */
const readmePath = path.join(REPO, "README.md");
let readme = fs.readFileSync(readmePath, "utf8");
const readmeBlock = block(
  "",
  "> All 25 certificates below are generated from the same catalogue the website renders (`data/certificates.mjs`) — the docs and the site can never drift apart. Regenerate with `node scripts/build-cert-docs.mjs`."
);

/* Explicit markers are preferred; the heading form is kept as a fallback
   for the first run on an older file. */
const README_MARKED = /<!-- CERTS:START -->[\s\S]*?<!-- CERTS:END -->/;
const README_LEGACY = /(## 🎓 Certificates\r?\n\r?\n)[\s\S]*?(?=\r?\n## 👋 About Me)/;

if (README_MARKED.test(readme)) {
  readme = readme.replace(
    README_MARKED,
    `<!-- CERTS:START -->\n${readmeBlock}\n<!-- CERTS:END -->`
  );
} else if (README_LEGACY.test(readme)) {
  readme = readme.replace(README_LEGACY, (_, head) => head + readmeBlock);
} else {
  console.error("README: certificates block not found (no markers, no heading)");
  process.exit(1);
}
writeKeeping(readmePath, readme, fs.readFileSync(readmePath, "utf8"));

/* ── docs/certificates.md ────────────────────────────────────────────────── */
const docPath = path.join(REPO, "docs", "certificates.md");
let doc = fs.readFileSync(docPath, "utf8");
const docBlock = block(
  "../",
  "> This file is generated from the same catalogue the website renders (`data/certificates.mjs`), so the documentation and the site can never drift apart. Regenerate with `node scripts/build-cert-docs.mjs`."
);

const DOC_MARKED = /<!-- CERTS:START -->[\s\S]*?<!-- CERTS:END -->/;
const DOC_LEGACY = /(### [^\r\n]+\r?\n\r?\n)[\s\S]*$/;

if (DOC_MARKED.test(doc)) {
  doc = doc.replace(
    DOC_MARKED,
    `<!-- CERTS:START -->\n${docBlock}\n<!-- CERTS:END -->`
  );
} else if (DOC_LEGACY.test(doc)) {
  doc = doc.replace(DOC_LEGACY, (_, head) => head + docBlock);
} else {
  console.error("docs/certificates.md: certificates block not found");
  process.exit(1);
}
writeKeeping(docPath, doc, fs.readFileSync(docPath, "utf8"));

/* ── report ──────────────────────────────────────────────────────────────── */
console.log("Certificates documented from the shared catalogue:");
for (const g of GROUPS) {
  const items = CERTIFICATES.filter((c) => c.cat === g.cat);
  console.log(`  ${g.heading.replace(/&amp;/g, "&").padEnd(46)} ${items.length}`);
}
console.log(`  ${"TOTAL".padEnd(46)} ${CERTIFICATES.length}`);
console.log("\n  README.md            ✓ regenerated");
console.log("  docs/certificates.md ✓ regenerated");
