/**
 * Regenerate data/docs-corpus.mjs — a snapshot of the portfolio's markdown
 * documentation, used by the AI assistant's `search_portfolio_docs` tool
 * when the live files are not on disk (e.g. inside a serverless bundle).
 *
 *   node scripts/build-corpus.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(REPO, "data", "docs-corpus.mjs");

const FILES = [
  "README.md",
  "CONTRIBUTIONS.md",
  "docs/full-stack.md",
  "docs/tech-stack.md",
  "docs/ai-integrations.md",
  "docs/defensive-security.md",
  "docs/linux-systems.md",
  "docs/other-skills.md",
  "docs/qa.md",
  "docs/certificates.md",
];

const corpus = {};
let total = 0;

for (const rel of FILES) {
  const abs = path.join(REPO, rel);
  if (!fs.existsSync(abs)) {
    console.log("  skip (missing):", rel);
    continue;
  }
  const text = fs.readFileSync(abs, "utf8");
  corpus[rel] = text;
  total += text.length;
  console.log(`  ${rel.padEnd(34)} ${String(text.length).padStart(7)} chars`);
}

const header = `/**
 * GENERATED FILE — do not edit by hand.
 * Rebuild with:  node scripts/build-corpus.mjs
 *
 * Snapshot of the portfolio's markdown documentation. The AI assistant uses
 * it for grounded retrieval (\`search_portfolio_docs\`) when the live files
 * are not available on disk.
 */

export const CORPUS = `;

fs.writeFileSync(
  OUT,
  header + JSON.stringify(corpus, null, 0) + ";\n",
  "utf8"
);

console.log(
  `\n  ${Object.keys(corpus).length} files, ${(total / 1024).toFixed(1)} KB of text` +
    `\n  → ${path.relative(REPO, OUT)} (${(fs.statSync(OUT).size / 1024).toFixed(1)} KB)`
);
