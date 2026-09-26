# AI Integrations — Supporting Skill for Web (not a separate specialty)

> Docs: [README](../README.md) • [Security](defensive-security.md) • [Linux](linux-systems.md) • [Other](other-skills.md) • [Contributions](../CONTRIBUTIONS.md)

> This file keeps AI details out of the main profile to avoid noise.
> Main focus stays: Freelance Web Developer. AI here = what I integrate into websites.

## Hugging Face
- Profile: https://huggingface.co/ISLAM-PO

## Models (verified 26 Sep 2026)

### 1. MasryGPT-Chat-1.5B — Egyptian Arabic chat
- Link: https://huggingface.co/ISLAM-PO/MasryGPT-Chat-1.5B
- Base: `Qwen/Qwen2.5-1.5B-Instruct` — QLoRA / SFT instruction-tuned, Unsloth + PEFT LoRA
- Stack: `transformers` + `safetensors`, `text-generation`, license `apache-2.0`
- Languages: `ar` + `en`, tags: `egyptian-arabic`, `masry`, `conversational`, `chat`
- Use in web: Arabic-first chat assistant endpoint for Next.js sites
- Files: `model.safetensors`, `chat_template.jinja`, `inference_example.py`, `EVALUATION.md`, `eval_results.json`, `run_benchmark_v2.py`
- Stats: ~1181 downloads — most used of the three
- Old URL `MasryGPT_chat_FINALLY` renamed — old link removed

### 2. MasryGPT-Flash-Adapter — lightweight LoRA adapter
- Link: https://huggingface.co/ISLAM-PO/MasryGPT-Flash-Adapter
- Base: `aubmindlab/aragpt2-base` — LoRA adapter only (`adapter_model.safetensors` + `adapter_config.json`)
- Stack: `peft`, `gpt2` / `causal-lm`, license `other`
- Use in web: cheap Arabic autocomplete / draft replies where full 1.5B is too heavy
- Files: `USAGE.md`, `TOKENIZER.md`, `TESTING.md`, `ARCHITECTURE.md`, `chat_template.jinja`
- Stats: ~129 downloads
- Old URL `masrygpt-flash` renamed — old link removed

### 3. Glitch-Img-1.0 — image generation
- Link: https://huggingface.co/ISLAM-PO/Glitch-Img-1.0
- Base: `Qwen/Qwen-Image-2.1` — `diffusers` `QwenImage21Pipeline`, license `qwen-research` (see `LICENSE`)
- Stack: `text-to-image` + `image-editing`, `rgba`, `safetensors`
- Use in web: product art / OG images / avatar generation endpoint
- Files: `model_index.json`, `scheduler/`, `text_encoder/`, `processor/`, `assets/logo.png`
- Stats: ~4 downloads — experimental, newest of the three

## Datasets (verified working)
- https://huggingface.co/datasets/ISLAM-PO/arabic-history-and-dialects
- https://huggingface.co/datasets/ISLAM-PO/arabic-to-code-8-langs-3m
- https://huggingface.co/datasets/ISLAM-PO/documents-Egyptian-Arabic
- https://huggingface.co/datasets/ISLAM-PO/arab-dialects-20-countries-3m
- Removed: `PLATFORM-DATASET-ARABIC-TOOLS` (returns 401 gated) — link deleted, skills kept

## What I actually use in web projects
- OpenAI API / Gemini API / LangChain — chat assistants, content, translation inside Next.js sites
- Automation: Playwright / Puppeteer / Selenium for E2E and scraping
- Data: Pandas / NumPy only for small preprocessing, not ML research

## Honest scope
- Integrator, not foundation-model researcher: fine-tunes/adapters on top of Qwen / AraGPT2.
- Dataset names with `3m` are collection goals, not verified production scale.
- For hiring: hire me for web + AI integration, not for AI researcher role.
