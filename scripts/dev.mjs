/**
 * Zero-dependency local dev server.
 *
 *   node scripts/dev.mjs
 *
 * Serves the static site from the repo root and mounts the same /api/chat
 * handler used in production, so the assistant works while you develop.
 * The key is read from .env (git-ignored) or from the environment.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { handleChat, preflight, guard } from "../api/_core.mjs";
import { publicConfig } from "../api/_config.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT || 3000);

loadEnv(path.join(ROOT, ".env"));

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/chat") {
    if (req.method === "OPTIONS") return preflight(req, res);
    if (req.method === "GET") {
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
      return res.end(JSON.stringify(publicConfig()));
    }
    if (req.method !== "POST") {
      res.writeHead(405, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "method_not_allowed" }));
    }
    if (guard(req, res)) return;
    const body = await readJson(req);
    return handleChat(body, res, {
      GROQ_API_KEY: process.env.GROQ_API_KEY,
      GROQ_MODEL: process.env.GROQ_MODEL,
    });
  }

  /* static files */
  let rel = decodeURIComponent(url.pathname);
  if (rel.endsWith("/")) rel += "index.html";
  const file = path.join(ROOT, path.normalize(rel).replace(/^([/\\])+/, ""));

  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    return res.end("<h1>404</h1>");
  }

  res.writeHead(200, {
    "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  const key = process.env.GROQ_API_KEY ? "set" : "MISSING";
  console.log(`\n  Portfolio dev server`);
  console.log(`  → http://localhost:${PORT}`);
  console.log(`  → API:  POST http://localhost:${PORT}/api/chat`);
  console.log(`  → GROQ_API_KEY: ${key}\n`);
});

/* ── helpers ─────────────────────────────────────────────────────────────── */

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    const value = m[2].replace(/^["']|["']$/g, "");
    if (!(m[1] in process.env)) process.env[m[1]] = value;
  }
}

function readJson(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => {
      data += c;
      if (data.length > 200_000) req.destroy();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}
