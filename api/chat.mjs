/**
 * Vercel serverless function — POST /api/chat
 *
 * Keeps the Groq key server side. Deploy with:
 *   vercel env add GROQ_API_KEY        (or set it in the dashboard)
 *   vercel deploy
 */

import { handleChat, preflight, guard } from "./_core.mjs";
import { publicConfig } from "./_config.mjs";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return preflight(req, res);

  /* The browser asks what the assistant is allowed to do, so it can hide
     features that are switched off (e.g. the plan-mode button). */
  if (req.method === "GET") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(publicConfig());
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST, OPTIONS");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  if (guard(req, res)) return;

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body;
  return handleChat(body, res, {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GROQ_MODEL: process.env.GROQ_MODEL,
  });
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
