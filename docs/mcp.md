# 🔌 MCP Server — Portfolio Knowledge Base

> Docs: [README](../README.md) • [AI](ai-integrations.md) • [Stack](tech-stack.md) • [Full-Stack](full-stack.md) • [Security](defensive-security.md) • [Q&A](qa.md) • [MCP](mcp.md)

> **Document control** — Owner: Islam Al-Nashar • Scope: the Model Context Protocol server that exposes this portfolio's verified facts to any MCP client.

---

## What this is

An [MCP](https://modelcontextprotocol.io) server (JSON-RPC 2.0 over stdio) that exposes the portfolio's **verified facts** as tools. Any MCP client — Claude Desktop, Cursor, Windsurf, an IDE — can then ask about Islam's skills, stack, experience, education, certificates, services, project ideas and live GitHub numbers, and get answers grounded in this repository instead of guesses.

It is the same tool layer the website assistant uses (`api/_tools.mjs`), so both surfaces always agree.

## Tools

| Tool | What it returns |
|---|---|
| `get_profile` | Identity, production stack, work history, education, AI & open-source work |
| `list_certificates` | The 25 certificates, optionally filtered by category (`fullstack` / `ai` / `data` / `english`) |
| `get_services` | The four services Islam can be hired for, with the stack behind each |
| `get_project_templates` | Deliverable project shapes (scope, stack, size) — keeps AI suggestions realistic |
| `get_featured_work` | Featured repositories and projects with links |
| `get_contact_channels` | Email, GitHub, LinkedIn, Hugging Face, portfolio site |
| `get_live_github_stats` | Live followers, repo count, total stars, top repos (hits the GitHub API) |
| `record_plan` | Records a structured plan (goal + 3 to 6 steps, each with title, detail, stack, effort and the tool that informed it). The same tool the website assistant uses in plan mode. |
| `search_portfolio_docs` | Retrieval over `README.md` + `docs/*.md` — the authoritative source for details |

## Run it

```bash
node mcp/server.mjs
```

No API key, no network access (except the optional live GitHub counter) — everything is read from this repository.

## Register it with a client

**Claude Desktop** — `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "portfolio": {
      "command": "node",
      "args": ["/absolute/path/to/aslamalkarywk7/mcp/server.mjs"]
    }
  }
}
```

**Cursor / Windsurf / any stdio client** — the same shape:

```json
{
  "mcpServers": {
    "portfolio": {
      "command": "node",
      "args": ["/absolute/path/to/aslamalkarywk7/mcp/server.mjs"]
    }
  }
}
```

A ready-to-copy example lives in [`mcp/claude_desktop_config.example.json`](claude_desktop_config.example.json).

## Example session

```jsonc
// → client
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"claude","version":"1"}}}
// ← server
{"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2024-11-05","capabilities":{"tools":{"listChanged":false}},"serverInfo":{"name":"aslamalkarywk7-portfolio","version":"1.0.0"}}}

{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"list_certificates","arguments":{"category":"ai"}}}
// ← server
{"jsonrpc":"2.0","id":2,"result":{"content":[{"type":"text","text":"{ \"count\": 2, \"certificates\": [ … ] }"}]}}
```

## Scope

The MCP server always exposes the **complete** tool set — it is the owner's own client, not a public surface. The website assistant has its own switch in `api/_config.mjs` (`SCOPE = "personal" | "full"`) that decides which of these tools the public chat assistant may use.

## Implementation notes

- **Dependency-free** — the protocol is implemented directly on `node:readline`, so there is no `npm install` and nothing to keep in sync.
- **Read-only** — the server only reads; it never writes to the repository.
- **Honest by construction** — the tools return facts from the repo, not model output. The MCP client does the reasoning.
- **Shared source of truth** — the certificate catalogue lives in `data/certificates.mjs` and is imported by the browser grid, the website assistant and this server.

## Keep the documentation snapshot fresh

`search_portfolio_docs` reads the live markdown files when they are on disk. The deployed snapshot used by the serverless function is regenerated with:

```bash
node scripts/build-corpus.mjs
```

Run it after editing the README or any `docs/*.md` file, and commit `data/docs-corpus.mjs`.
