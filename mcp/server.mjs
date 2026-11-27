#!/usr/bin/env node
/**
 * MCP server for the portfolio knowledge base.
 *
 * Exposes the same verified tools the website assistant uses, over the
 * Model Context Protocol (JSON-RPC 2.0 on stdio), so any MCP client —
 * Claude Desktop, Cursor, Windsurf, an IDE — can query them:
 *
 *   • get_profile            → identity, stack, experience, education, AI work
 *   • list_certificates      → the certificate catalogue
 *   • get_services           → the four services
 *   • get_project_templates  → deliverable project shapes
 *   • get_featured_work      → featured repos with links
 *   • get_contact_channels   → how to reach Islam
 *   • get_live_github_stats  → live followers / stars / repos
 *   • search_portfolio_docs  → retrieval over README + docs/
 *
 * Usage
 *   node mcp/server.mjs
 *
 * Register it with an MCP client, e.g. claude_desktop_config.json:
 *   {
 *     "mcpServers": {
 *       "portfolio": {
 *         "command": "node",
 *         "args": ["/absolute/path/to/mcp/server.mjs"]
 *       }
 *     }
 *   }
 *
 * No API key and no network access are required — everything except the
 * live GitHub counter comes from the repository itself.
 */

import readline from "node:readline";
import { TOOLS, runTool } from "../api/_tools.mjs";

const PROTOCOL_VERSION = "2024-11-05";
const SUPPORTED_VERSIONS = ["2024-11-05", "2025-03-26", "2025-06-18"];

const SERVER_INFO = {
  name: "aslamalkarywk7-portfolio",
  version: "1.0.0",
  title: "Islam Al-Nasher — Portfolio Knowledge Base",
};

/* ── stdout writer (one JSON object per line) ───────────────────────────── */
function send(message) {
  process.stdout.write(JSON.stringify(message) + "\n");
}

function ok(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function fail(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

/* ── tool schema conversion: OpenAI function → MCP ──────────────────────── */
function toMcpTools() {
  return TOOLS.map((t) => ({
    name: t.function.name,
    description: t.function.description,
    inputSchema: t.function.parameters || { type: "object", properties: {} },
  }));
}

/* ── method handlers ────────────────────────────────────────────────────── */
/* Return the reply instead of writing it, so batches can be sent as one
   JSON array. An unexpected throw can never crash the stdio loop. */
async function handle(msg) {
  try {
    return await handleRequest(msg);
  } catch {
    return fail(msg?.id ?? null, -32603, "Internal error");
  }
}

async function handleRequest(msg) {
  const { id, method, params } = msg || {};

  /* Messages with an id but no method are client responses, not requests. */
  if (id !== undefined && method === undefined) return null;

  switch (method) {
    case "initialize": {
      const wanted = params?.protocolVersion;
      const version = SUPPORTED_VERSIONS.includes(wanted) ? wanted : PROTOCOL_VERSION;
      return ok(id, {
        protocolVersion: version,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions:
          "Verified facts about Islam Al-Nasher (Full-Stack Developer, Egypt): " +
          "profile, production stack, work history, education, AI work, " +
          "certificates, services, project shapes, live GitHub stats, and " +
          "retrieval over the portfolio's own documentation.",
      });
    }

    case "notifications/initialized":
    case "initialized":
      return; // notification — no response

    case "ping":
      return ok(id, {});

    case "tools/list":
      return ok(id, { tools: toMcpTools() });

    case "tools/call": {
      const name = params?.name;
      const args = params?.arguments || {};
      if (!name) return fail(id, -32602, "Missing tool name");

      try {
        /* The MCP server is the owner's own client — it always gets the
           complete tool set, regardless of the website assistant's scope. */
        const result = await runTool(name, args, { scope: "full" });
        return ok(id, {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          isError: Boolean(result && result.error),
        });
      } catch (err) {
        return ok(id, {
          content: [{ type: "text", text: `Tool failed: ${err?.message || err}` }],
          isError: true,
        });
      }
    }

    case "resources/list":
      return ok(id, { resources: [] });

    case "prompts/list":
      return ok(id, { prompts: [] });

    default:
      if (id === undefined) return; // unknown notification
      return fail(id, -32601, `Method not found: ${method}`);
  }
}

/* ── stdio loop ─────────────────────────────────────────────────────────── */
const rl = readline.createInterface({ input: process.stdin, terminal: false });

rl.on("line", async (line) => {
  try {
    const text = line.trim();
    if (!text) return;

    let msg;
    try {
      msg = JSON.parse(text);
    } catch {
      send(fail(null, -32700, "Parse error"));
      return;
    }

    // Batches (array of messages) get ONE JSON array response.
    if (Array.isArray(msg)) {
      const results = [];
      for (const one of msg) {
        const reply = await handle(one);
        if (reply) results.push(reply); // notifications produce no reply
      }
      send(results);
      return;
    }

    const reply = await handle(msg);
    if (reply) send(reply);
  } catch {
    send({ jsonrpc: "2.0", id: null, error: { code: -32603, message: "Internal error" } });
  }
});

rl.on("close", () => process.exit(0));

process.stderr.write(
  `[${SERVER_INFO.name}] MCP server ready — ${TOOLS.length} tools\n`
);
