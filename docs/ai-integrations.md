# 🤖 AI Integrations — Supporting Skill for Web

> Docs: [README](../README.md) • [Full-Stack](full-stack.md) • [Stack](tech-stack.md) • [AI](ai-integrations.md) • [Security](defensive-security.md) • [Linux](linux-systems.md) • [Other](other-skills.md) • [Contributions](../CONTRIBUTIONS.md) • [Q&A](qa.md)

> **Document control** — Owner: Islam El-Nashar • Last verified: 29 Sep 2026 • Scope: AI I integrate into websites (not a separate specialty).
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