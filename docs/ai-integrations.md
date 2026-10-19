# 🤖 AI Integrations — Supporting Skill for Web

> Docs: [README](../README.md) • [Full-Stack](full-stack.md) • [Stack](tech-stack.md) • [AI](ai-integrations.md) • [Security](defensive-security.md) • [Linux](linux-systems.md) • [Other](other-skills.md) • [Contributions](../CONTRIBUTIONS.md) • [Q&A](qa.md) • [MCP](mcp.md)

> **Document control** — Owner: Islam Al-Nashar • Last verified: 29 Sep 2026 • Scope: AI I integrate into websites (not a separate specialty).
> Main focus stays: Full-Stack Web Developer. AI here = what I integrate into websites.

---

## 1. Hugging Face

- Profile: [huggingface.co/ISLAM-PO](https://huggingface.co/ISLAM-PO)

## 2. Models

| # | Model | Base | Stack | Use in web | Stats |
|---|---|---|---|---|---|
| 1 | [MasryGPT-Chat-1.5B](https://huggingface.co/ISLAM-PO/MasryGPT-Chat-1.5B) (Egyptian Arabic chat) | `Qwen/Qwen2.5-1.5B-Instruct` — QLoRA / SFT (Unsloth + PEFT LoRA) | `transformers` + `safetensors`, `text-generation`, `apache-2.0` | Arabic-first chat assistant endpoint for Next.js sites | ~1235 downloads — most used of the three |
| 2 | [MasryGPT-Flash-Adapter](https://huggingface.co/ISLAM-PO/MasryGPT-Flash-Adapter) (lightweight LoRA adapter) | `aubmindlab/aragpt2-base` — LoRA adapter only (`adapter_model.safetensors` + `adapter_config.json`) | `peft`, `gpt2` / `causal-lm`, `other` | Cheap Arabic autocomplete / draft replies where full 1.5B is too heavy | ~131 downloads |
| 3 | [Glitch-Img-1.0](https://huggingface.co/ISLAM-PO/Glitch-Img-1.0) (image generation) | `Qwen/Qwen-Image-2.1` — `diffusers` `QwenImage21Pipeline`, `qwen-research` | `text-to-image` + `image-editing`, `rgba`, `safetensors` | Product art / OG images / avatar generation endpoint | ~6 downloads — experimental, newest |

**Notes**
- Model 1 files: `model.safetensors`, `chat_template.jinja`, `inference_example.py`, `EVALUATION.md`, `eval_results.json`, `run_benchmark_v2.py`
- Model 2 files: `USAGE.md`, `TOKENIZER.md`, `TESTING.md`, `ARCHITECTURE.md`, `chat_template.jinja`
- Model 3 files: `model_index.json`, `scheduler/`, `text_encoder/`, `processor/`, `assets/logo.png`
- Old URLs renamed (`MasryGPT_chat_FINALLY`, `masrygpt-flash`) — old links removed.

## 3. Datasets (verified working)

- https://huggingface.co/datasets/ISLAM-PO/arabic-history-and-dialects
- https://huggingface.co/datasets/ISLAM-PO/arabic-to-code-8-langs-3m
- https://huggingface.co/datasets/ISLAM-PO/documents-Egyptian-Arabic
- https://huggingface.co/datasets/ISLAM-PO/arab-dialects-20-countries-3m
- Removed: `PLATFORM-DATASET-ARABIC-TOOLS` (returns 401 gated) — link deleted, skills kept.

## 4. What I actually use in web projects

- OpenAI API / Gemini API / LangChain — chat assistants, content, translation inside Next.js sites
- Automation: Playwright / Puppeteer / Selenium for E2E and scraping
- Data: Pandas / NumPy only for small preprocessing, not ML research

## 5. Honest scope

- Integrator, not foundation-model researcher: fine-tunes/adapters on top of Qwen / AraGPT2.
- Dataset names with `3m` are collection goals, not verified production scale.
- For hiring: hire me for web + AI integration, not for AI researcher role.

## 6. AI assistant on this portfolio

The portfolio itself ships a customer-facing AI assistant — a floating chat widget in the bottom-right corner, in English and العربية. It is the same thing I build for clients: **AI integrated into a website**, not research.

### What it does

- Answers questions about my services, production stack, experience, education, certificates and open-source work.
- Proposes concrete project ideas with scope, stack and rough size.
- Mirrors the visitor's language (Arabic in → Arabic out) and pushes the visitor to the contact form.
- It is explicitly labelled as an AI assistant — it never pretends to be me.

### How it is grounded (no invented facts)

The assistant cannot free-form about me. The facts live in `api/_knowledge.mjs` and are exposed as **tools** — the model retrieves them instead of recalling them:

| Tool | Source |
|---|---|
| `get_profile` | identity, stack, experience, education, AI work |
| `list_certificates` | the shared catalogue in `data/certificates.mjs` |
| `get_services` | the four services + their stack |
| `get_project_templates` | deliverable project shapes (scope, stack, size) |
| `get_featured_work` | featured repos with links |
| `get_contact_channels` | email + social links |
| `get_live_github_stats` | the live GitHub API — real numbers, fetched at request time |
| `search_portfolio_docs` | retrieval over `README.md` + `docs/*.md` (the authoritative source) |

The prompt carries hard rules on top of that: never invent employers, clients, dates, tools, certificates or numbers; say "not documented" and offer to forward the question instead.

The same tool layer is also published as a **standalone MCP server** — see [docs/mcp.md](mcp.md).

### Assistant scope — one switch

`api/_config.mjs` holds a single constant that decides how much the assistant knows and can do:

```js
export const SCOPE = "personal";   // "personal" | "full"
```

| Scope | Tools exposed | Plan mode | What the assistant is |
|---|---|---|---|
| **`personal`** (default) | `get_profile`, `list_certificates`, `get_services`, `get_featured_work`, `get_contact_channels`, `search_portfolio_docs` | ✕ (button removed) | Answers **questions about Islam** — identity, stack, experience, education, certificates, services, work, contact |
| **`full`** | all nine (+ `get_project_templates`, `get_live_github_stats`, `record_plan`) | ✓ | Adds project planning, deliverable project templates and live GitHub numbers |

Switching is one line + a restart. The browser asks the server what is enabled (`GET /api/config`) and hides the plan-mode button and the planning suggestion chip when it is off — no client change needed.

A tool that is not in the active scope is not offered to the model, and if a call for it somehow arrives the executor refuses it with `tool_not_available`.

The **MCP server is exempt**: it is the owner's own client, so it always gets the complete tool set (`{ scope: "full" }`).

### Planning mode (how the assistant is told to plan)

The 🎯 button in the chat header switches the assistant into **plan mode**. The request then carries `mode: "plan"`, and the system prompt gains a strict procedure:

```
1. GROUND FIRST   → call the tools (get_profile, get_project_templates, …)
2. RECORD THE PLAN → call record_plan exactly once (goal + 3–6 steps)
3. THEN ANSWER      → prose: recommendation, stack, size, main risk, next step
```

`record_plan` is a real tool, so the plan is **structured data**, not prose: every step carries a title, a detail, the stack, the effort (small / medium / large) and the tool that informed it. The proxy forwards it to the browser as its own event and the UI renders it as a numbered checklist with effort badges — so the plan is always the same shape, never a paragraph that may drift.

The four levers that make an AI "use the skills you integrated":

| Lever | Where | What it controls |
|---|---|---|
| Tool description | `api/_tools.mjs` | **when** the model should reach for a tool |
| Tool parameters | `api/_tools.mjs` | **what** it can pass in, and what must be filled |
| System prompt | `api/_knowledge.mjs` | **the procedure** — order of steps, what to never invent |
| A tool that records the output | `record_plan` | **where the result lands** — a card in the UI |

### Architecture

```
Browser (static site)  ──POST /api/chat──▶  Serverless proxy  ──Bearer key──▶  Groq
   chat.js                                       api/chat.mjs                api.groq.com
                                                api/_core.mjs  ← key lives here (env var only)
                                                api/_tools.mjs ← the tools
```

| Layer | File | Notes |
|---|---|---|
| Widget | `chat.js` | streaming SSE, markdown rendering, RTL, EN/AR, suggestion chips |
| Knowledge | `api/_knowledge.mjs` | the brief + system prompt — edit this to change what the AI may say |
| Tools | `api/_tools.mjs` | the eight tools above |
| Proxy | `api/chat.mjs` → `api/_core.mjs` | CORS, per-IP rate limit (20 / 5 min), history cap, tool loop, key never leaves the server |
| Shared data | `data/certificates.mjs` | one catalogue for the site, the assistant and the MCP server |
| Doc snapshot | `data/docs-corpus.mjs` | generated by `scripts/build-corpus.mjs` |
| MCP server | `mcp/server.mjs` | the same tools over the Model Context Protocol |
| Dev server | `scripts/dev.mjs` | zero-dependency; serves the site **and** `/api/chat` locally |

### Model & streaming

`qwen/qwen3.8-27b` (131k context, strong Arabic + English) via the OpenAI-compatible Groq endpoint. Responses are streamed token by token as SSE, so the reply types out live.

The model answers with **native tool calls**; some models instead write the call out as text (`<tool_call><function=…>`), so the proxy understands both shapes.

### Token budget (this matters on the free tier)

Groq's free tier caps this account at **8 000 input tokens/minute** and **1 000 output tokens/minute**. The design keeps every conversation cheap:

- the system prompt is short (~420 tokens) — the facts live in tools, not in the prompt;
- the full tool schema (~600 tokens) is attached **only on the first round**; later rounds get just `record_plan` (~170 tokens), which is enough to still record the plan natively;
- retrieved passages are capped (2 by default, 700 characters each);
- the tool loop is capped at 3 rounds, and a final no-tools pass always produces an answer;
- on a provider throttle the proxy waits 5 s and retries once, so most throttles turn into a normal answer instead of an error.

A full tool-using conversation costs roughly 2 000–3 500 input tokens — **about three short conversations per minute** on the free tier. Plan mode is heavier (it produces a plan *and* prose), so it is the first thing to feel the ceiling. A paid Dev Tier removes it.

### Security rules I follow

- The Groq key is **never** in client-side code, in the repository, or in any response. It is read from `GROQ_API_KEY` in the server environment only.
- `.env` is git-ignored; `.env.example` documents the variable without a value.
- The proxy strips any `system` role sent by the browser and re-inserts the trusted prompt server-side, so a visitor cannot rewrite my instructions.
- Model output is HTML-escaped and re-rendered from a small, safe Markdown subset — no raw model HTML is ever injected.
- Per-IP rate limit, message-length cap and history cap limit abuse and cost.

### Run it locally

```bash
cp .env.example .env      # add your Groq key
node scripts/dev.mjs      # http://localhost:3000
```

### Deploy

```bash
vercel env add GROQ_API_KEY     # secret, never committed
vercel deploy
```

If the site is served from GitHub Pages, point the widget at the API deployment:

```html
<script>window.PORTFOLIO_CHAT_ENDPOINT = "https://<deployment>/api/chat";</script>
```
