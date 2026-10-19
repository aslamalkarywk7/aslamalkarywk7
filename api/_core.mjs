/**
 * Shared chat core — used by the Vercel function (api/chat.mjs) and by the
 * local dev server (scripts/dev.mjs).
 *
 * The Groq API key is NEVER sent to the browser. It is read from the
 * environment (GROQ_API_KEY) and used only here, server side.
 *
 * The model runs a tool-calling loop: it can ask for verified facts
 * (documentation retrieval, the certificate list, live GitHub numbers)
 * before it answers, and the answers stream back token by token.
 */

import { buildSystemPrompt } from "./_knowledge.mjs";
import { TOOLS, runTool, scopedTools } from "./_tools.mjs";
import { ACTIVE } from "./_config.mjs";

export const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
export const DEFAULT_MODEL = "qwen/qwen3.8-27b";

const MAX_HISTORY = 16;          // client messages kept
const MAX_USER_CHARS = 2000;     // per message
const MAX_TOKENS = 700;
const TEMPERATURE = 0.55;
const MAX_TOOL_ROUNDS = 3;       // ground → record the plan → answer
const RATE_LIMIT = 20;           // requests …
const RATE_WINDOW_MS = 5 * 60e3; // … per 5 minutes, per IP
const RETRY_ON_429_MS = 5000;    // wait before one retry when the provider throttles

/* ── Rate limiting (best effort — serverless instances are ephemeral) ────── */
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > RATE_LIMIT;
}

function clientIp(req) {
  const fwd = req.headers?.["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.headers?.["x-real-ip"] || req.socket?.remoteAddress || "unknown";
}

/* ── CORS ────────────────────────────────────────────────────────────────── */
export function corsHeaders(req) {
  const origin = req.headers?.origin || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

/* ── Request sanitising ──────────────────────────────────────────────────── */
function cleanMessages(raw) {
  const list = Array.isArray(raw) ? raw : [];
  return list
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim(),
    )
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, MAX_USER_CHARS),
    }))
    .slice(-MAX_HISTORY);
}

/* ── Groq stream parsing ─────────────────────────────────────────────────── */
/**
 * Reads a Groq SSE stream and returns the accumulated message.
 * Tool-call deltas arrive fragmented and are merged by index.
 */
async function readGroqStream(body, onContent) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let carry = "";
  let content = "";
  const toolCalls = new Map(); // index -> {id, name, args}

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    carry += decoder.decode(value, { stream: true });

    let idx;
    while ((idx = carry.indexOf("\n\n")) !== -1) {
      const frame = carry.slice(0, idx);
      carry = carry.slice(idx + 2);

      for (const line of frame.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") continue;

        let json;
        try {
          json = JSON.parse(data);
        } catch {
          continue;
        }

        const delta = json.choices?.[0]?.delta;
        if (!delta) continue;

        if (typeof delta.content === "string" && delta.content) {
          content += delta.content;
          if (onContent) onContent(delta.content);
        }

        for (const tc of delta.tool_calls || []) {
          const i = tc.index ?? 0;
          const cur = toolCalls.get(i) || { id: "", name: "", args: "" };
          if (tc.id) cur.id = tc.id;
          if (tc.function?.name) cur.name = tc.function.name;
          if (tc.function?.arguments) cur.args += tc.function.arguments;
          toolCalls.set(i, cur);
        }
      }
    }
  }

  return {
    content,
    toolCalls: [...toolCalls.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([, c]) => ({
        id: c.id || `call_${Math.random().toString(36).slice(2)}`,
        type: "function",
        function: { name: c.name, arguments: c.args || "{}" },
      })),
  };
}

/* ── Text-embedded tool calls ──────────────────────────────────────────────
   Some models answer with the call written out as text instead of the
   structured `tool_calls` field:
       <tool_call><function=name><parameter=key>value</parameter></function></tool_call>
   Both shapes are accepted so the assistant works whichever the model picks.
   ─────────────────────────────────────────────────────────────────────────── */
const INVISIBLE = /[\u200B-\u200F\uFEFF]/g;

function parseTextToolCalls(text) {
  const clean = String(text || "").replace(INVISIBLE, "");
  if (!/<\s*tool_call\s*>/i.test(clean)) return [];

  const calls = [];
  const blocks = clean.match(/<\s*tool_call\s*>[\s\S]*?<\s*\/\s*tool_call\s*>/gi) || [];

  for (const block of blocks) {
    const fn = block.match(/<\s*function\s*=\s*([A-Za-z0-9_]+)/i);
    if (!fn) continue;
    const args = {};
    const params = block.matchAll(
      /<\s*parameter\s*=\s*([A-Za-z0-9_]+)\s*>([\s\S]*?)<\s*\/\s*parameter\s*>/gi
    );
    for (const p of params) {
      const key = p[1];
      let value = p[2].trim();
      if (
        (value.startsWith("{") && value.endsWith("}")) ||
        (value.startsWith("[") && value.endsWith("]"))
      ) {
        try {
          Object.assign(args, JSON.parse(value));
          continue;
        } catch {
          /* keep the raw string */
        }
      }
      args[key] = value;
    }
    calls.push({
      id: `call_text_${calls.length}_${Date.now()}`,
      type: "function",
      function: {
        name: fn[1],
        arguments: JSON.stringify(args),
      },
    });
  }
  return calls;
}

function stripTextToolCalls(text) {
  return String(text || "")
    .replace(INVISIBLE, "")
    .replace(/<\s*tool_call\s*>[\s\S]*?<\s*\/\s*tool_call\s*>/gi, "")
    .trim();
}

/* ── Chat handler ────────────────────────────────────────────────────────── */
export async function handleChat(body, res, env = {}) {
  const key = env.GROQ_API_KEY || process.env.GROQ_API_KEY;
  const model = env.GROQ_MODEL || process.env.GROQ_MODEL || DEFAULT_MODEL;

  if (!key) {
    res.writeHead(500, { ...corsHeaders({ headers: {} }), "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "server_misconfigured",
        message: "The assistant is not configured yet. Please use the contact form instead.",
      }),
    );
    return;
  }

  const history = cleanMessages(body?.messages);
  if (!history.length) {
    res.writeHead(400, { ...corsHeaders({ headers: {} }), "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "empty_message", message: "Say something first." }));
    return;
  }

  const lang = body?.lang === "ar" ? "ar" : "en";
  const mode =
    ACTIVE.planMode && body?.mode === "plan" ? "plan" : "chat";
  const messages = [
    { role: "system", content: buildSystemPrompt(lang, mode) },
    ...history,
  ];

  res.writeHead(200, {
    ...corsHeaders({ headers: {} }),
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const toolsEnabled = env.DISABLE_TOOLS !== "1" && env.DISABLE_TOOLS !== true;
  const usedTools = [];

  /* One Groq round.
     `withTools` decides which schema is attached:
       round 0 → every tool (the model grounds itself in real data)
       later   → only record_plan, so the plan can still be recorded natively
                  without re-sending ~600 tokens of schema per round. */
  const callGroq = async (round) => {
    const scope = scopedTools();
    const schema =
      round === 0
        ? scope
        : scope.filter((t) => t.function.name === "record_plan");

    const payload = JSON.stringify({
      model,
      messages,
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
      top_p: 0.9,
      stream: true,
      ...(toolsEnabled && schema.length
        ? { tools: schema, tool_choice: "auto" }
        : {}),
    });

    const headers = {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    };

    /* The free tier throttles per minute (input and output tokens). One
       short wait + retry turns most throttles into a normal answer. */
    for (let attempt = 0; ; attempt++) {
      const upstream = await fetch(GROQ_URL, {
        method: "POST",
        headers,
        body: payload,
      });

      if (upstream.status !== 429 || attempt >= 1) {
        if (!upstream.ok || !upstream.body) {
          const detail = await upstream.text().catch(() => "");
          console.error("[chat] groq error", upstream.status, detail.slice(0, 300));
          const err = new Error("groq_error");
          err.status = upstream.status;
          throw err;
        }
        return upstream.body;
      }

      const wait = Number(upstream.headers.get("retry-after")) * 1000;
      const delay = Number.isFinite(wait) && wait > 0
        ? Math.min(wait, RETRY_ON_429_MS)
        : RETRY_ON_429_MS;
      console.log(`[chat] provider throttled — retrying in ${delay}ms`);
      await new Promise((r) => setTimeout(r, delay));
    }
  };

  let answered = false;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    let body;
    try {
      body = await callGroq(round);
    } catch (err) {
      const kind = err.status === 429 ? "rate_limited" : "upstream_error";
      res.write(`data: ${JSON.stringify({ t: "", error: kind })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }

    /* Content is buffered: if this round turns out to be a tool call, the
       partial text is discarded instead of flashing on screen. */
    let buffer = "";
    const { content, toolCalls: nativeCalls } = await readGroqStream(body, (chunk) => {
      buffer += chunk;
    });

    let toolCalls = nativeCalls;
    if (!toolCalls.length && buffer) {
      const textCalls = parseTextToolCalls(buffer);
      if (textCalls.length) {
        toolCalls = textCalls;
        buffer = stripTextToolCalls(buffer);
      }
    }

    if (!toolCalls.length) {
      if (buffer) res.write(`data: ${JSON.stringify({ t: buffer })}\n\n`);
      answered = true;
      break;
    }

    /* ── the model asked for a tool ─────────────────────────────────── */
    messages.push({
      role: "assistant",
      content: buffer || null,
      tool_calls: toolCalls,
    });

    for (const call of toolCalls) {
      let args = {};
      try {
        args = JSON.parse(call.function.arguments || "{}");
      } catch {
        args = {};
      }
      const started = Date.now();
      let result;
      try {
        result = await runTool(call.function.name, args);
      } catch (err) {
        result = { error: "tool_failed", message: String(err?.message || err) };
      }
      usedTools.push(call.function.name);
      console.log(`[chat] tool ${call.function.name} → ${Date.now() - started}ms`);

      /* A recorded plan is not a normal tool result — it is the deliverable.
         Forward it to the browser as its own event so the UI can render a
         checklist next to the answer. */
      if (call.function.name === "record_plan" && result && result.recorded) {
        res.write(`data: ${JSON.stringify({ plan: result })}\n\n`);
      }

      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(result).slice(0, 5000),
      });
    }
  }

  /* Tool budget exhausted → one final answer pass without tools, so the
     visitor always gets a reply. */
  if (!answered) {
    messages.push({
      role: "user",
      content:
        "Answer the visitor now, using the information you already retrieved. Do not request any more tools.",
    });
    try {
      const body = await callGroq(MAX_TOOL_ROUNDS + 1); // no schema at all
      let buffer = "";
      const { content } = await readGroqStream(body, (chunk) => {
        buffer += chunk;
      });
      /* the model may still try to call a tool in text form — drop it */
      const clean = stripTextToolCalls(buffer);
      res.write(
        `data: ${JSON.stringify({
          t:
            clean ||
            "I could not complete that lookup — you can reach Islam directly at aslamalkarywka@gmail.com.",
        })}\n\n`
      );
    } catch (err) {
      res.write(
        `data: ${JSON.stringify({
          t: "",
          error: err.status === 429 ? "rate_limited" : "upstream_error",
        })}\n\n`
      );
    }
  }

  res.write("data: [DONE]\n\n");
  res.end();
}

/** Shared OPTIONS / rate-limit guard used by both entry points. */
export function preflight(req, res) {
  res.writeHead(204, corsHeaders(req));
  res.end();
}

export function guard(req, res) {
  if (rateLimited(clientIp(req))) {
    res.writeHead(429, { ...corsHeaders(req), "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "rate_limited",
        message: "Too many messages — please wait a minute before continuing.",
      }),
    );
    return true;
  }
  return false;
}
