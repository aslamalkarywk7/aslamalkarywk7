# Open-Source Contributions — Islam El-Nashar (`aslamalkarywk7`)

> Every contribution below is a real pull request to a public project, with what broke,
> how I thought about it, how I fixed it, and what reviewers said. Status is current
> as of **20 Sep 2026**. I keep this file honest: open PRs are marked open, and
> every section below carries its own verified status line — flipped to `merged`
> the day it merges.

## Index

| # | Project | Pull request | Status |
|---|---------|--------------|--------|
| 1 | microsoft/markitdown | [#2538 — fix(xlsx): keep currency labels](https://github.com/microsoft/markitdown/pull/2538) | ✅ Approved, awaiting merge |
| 2 | microsoft/markitdown | [#2539 — fix(pdf): normalize Arabic presentation forms](https://github.com/microsoft/markitdown/pull/2539) | 🟡 Open, awaiting review |
| 3 | mudler/LocalAI | [#12136 — per-operation download throttling](https://github.com/mudler/LocalAI/pull/12136) | 🟡 Open, reviews addressed |
| 4 | google/adk-python | [#7198 — name partial-backed tools correctly](https://github.com/google/adk-python/pull/7198) | 🟡 Open, awaiting review |
| 5 | genkit-ai/genkit | [#6387 — skip re-registering dynamic tools](https://github.com/genkit-ai/genkit/pull/6387) | 🟡 Open, feedback addressed |
| 6 | genkit-ai/genkit | [#6386 — read GOOGLE_CLOUD_LOCATION](https://github.com/genkit-ai/genkit/pull/6386) | 🟡 Open, feedback addressed |
| 7 | ollama/ollama | [#16852 — CLI navigation, atomic manifests, model filtering](https://github.com/ollama/ollama/pull/16852) | 🟡 Open, awaiting CI approval |
| 8 | ollama/ollama | [#16851 — abort interactive mode on redirected stdout](https://github.com/ollama/ollama/pull/16851) | 🟡 Open, awaiting CI approval |
| 9 | lllyasviel/Fooocus | [#4187 — Arabic documentation translation](https://github.com/lllyasviel/Fooocus/pull/4187) | 🟢 Open, mergeable (clean) |

---

## 1. markitdown#2538 — Excel keeps its currency labels ✅ Approved

**Status (verified 20 Sep 2026).** ✅ Approved by reviewer — awaiting maintainer merge; flips to `merged` on merge.

**Problem.** `pandas.read_excel` returns raw values and drops Excel number formats,
so `$1199` became `1199` in the Markdown output (upstream issue #53).

**How I thought.** Don't change values — overlay what the spreadsheet *shows*.
I read formats with `openpyxl`, extracted the currency symbol from quoted
literals (`"$"#,##0.00`) and locale blocks (`[$€-…]`), and rewrote only the
rendered label, widening numeric columns to `object` first.

**Solution.** `_currency_symbol()` + `_is_currency_position_prefix()` +
`_overlay_currency_labels()` in `_xlsx_converter.py`, plus `test_xlsx_currency.py`.

**Review story.** Signed the Microsoft CLA, then reviewer Sylvester Kaczmarek
caught a real bug: I only inspected the *first* `;`-section, but Excel renders
negatives from the *second* section — so `"$"#,##0;"€"#,##0` mislabeled negative
cells. I added `_select_format_section()` following the Excel spec
(positive / negative / zero) plus regression tests. **He approved.**

## 2. markitdown#2539 — Arabic PDF presentation forms (RTL phase 1)

**Status (verified 20 Sep 2026).** 🟡 Open — CLA passing, awaiting reviewer; flips to `merged` on merge.

**Problem.** Some PDF producers emit Arabic Presentation Forms
(U+FB50–U+FDFF, U+FE70–U+FEFF) instead of standard letters, breaking search
matching and LLM extraction (related to #2336).

**How I thought.** Normalize *only* those two ranges to standard Unicode
(per-character NFKC, so ligatures expand too); everything else passes through
byte-identical. Applied as a post-processing stage next to the existing
numbering merge so all extraction paths are covered.

**Solution.** 1 commit, +80/−0, 2 files, with `tests/test_pdf_rtl.py` (5 tests).
I stated openly what is *out of scope*: full BiDi reading-order reconstruction
needs fixtures only the reporter can provide — proposed as Phase 2.

## 3. LocalAI#12136 — per-operation download throttling

**Status (verified 20 Sep 2026).** 🟡 Open — all review rounds + DCO addressed, awaiting re-review; flips to `merged` on merge.

**Problem.** No way to slow down an in-flight gallery download without restarting it.

**How I thought.** A shared, runtime-adjustable token bucket per download +
chunked context-aware reads (fast path when unlimited) + an admin endpoint +
docs. Then three rounds of bot review made it correct:
1. First review: `WaitN` capped waits at 1s and concurrent readers overspent —
   rewrote with debt-preserving accounting and throughput/concurrency tests.
2. Missing surfaces: added MCP tool `throttle_operation` (inproc + httpapi
   clients, route map, prompts, skill) and a real Swagger endpoint
   (`POST /api/operations/{jobID}/throttle`) wired into the instructions tags.
3. Follow-up: FIFO starvation (a later big reservation delayed an earlier small
   one) and short-read overcharging — rebuilt as a FIFO reservation queue with
   head-first serving, cancellation as plain dequeue, and `Refund()` for
   short reads/EOF/errors, with three new regression tests.

**Review story.** Also fixed a DCO sign-off failure on my own commits.
DCO now passes; awaiting maintainer re-review and workflow approval
(first contribution on that repo).

## 4. adk-python#7198 — partial-backed tools get the right name

**Status (verified 20 Sep 2026).** 🟡 Open — checks green, awaiting reviewer; flips to `merged` on merge.

**Problem** ([#7190](https://github.com/google/adk-python/issues/7190)).
Every `functools.partial` was advertised as `'partial'` (partials carry no
`__name__`), so only the last one survived; callable instances lost their
description too.

**How I thought.** Unwrap (nested) partials to the underlying function name,
resolve descriptions through the shared `unwrap_callable` helper, and fall back
to `__call__.__doc__` only for genuine callable instances.

**Solution.** 2 commits, +123/−2, 2 files. New `TestPartialAndCallableNaming`
(6 tests); full `test_function_tool_declarations.py` green (51/51) — the
existing suite caught one intermediate regression of mine before I pushed.

## 5. genkit#6387 — don't re-register tools across parent/child registries

**Status (verified 20 Sep 2026).** 🟡 Open — feedback addressed, checks green; flips to `merged` on merge.

**Problem.** Plugin tools were re-registered on every `generate()`, tripping
"already registered" errors.

**How I thought.** My first guard compared registries with strict equality —
but `generate()` wraps the registry in a *child* registry first, so the guard
never matched. Review feedback pointed at the parent chain.

**Solution.** Walk `registry.parent` chain instead of one comparison, plus a
unit test for the parent-registry case. All 33 tests in `generate_test.ts`
pass; TypeScript compiles clean.

## 6. genkit#6386 — VertexAI location from `GOOGLE_CLOUD_LOCATION`

**Status (verified 20 Sep 2026).** 🟡 Open — feedback addressed, checks green; flips to `merged` on merge.

**Problem.** The VertexAI plugin ignored the standard `GOOGLE_CLOUD_LOCATION`
environment variable.

**Solution.** Support it with precedence over `GCLOUD_LOCATION`, then applied
review feedback: removed the now-unreachable `if (!location)` guard since the
value always falls back to `'us-central1'`. All 57 tests in `utils_test.ts` pass.

## 7. ollama#16852 — CLI navigation, atomic manifests, model filtering

**Status (verified 20 Sep 2026).** 🟡 Open — awaiting CI approval + reviewer; flips to `merged` on merge.

**Problem.** Three papercuts: no word-by-word CLI navigation (Ctrl+Left/Right),
manifest files written non-atomically (corruption risk on interruption), and no
local model filtering.

**How I thought.** Small, safe, independent improvements in one PR: `MoveRightWord`
logic + ANSI CSI parsing in `readline/readline.go`; write-then-rename for
manifests; a filter flag for local models. 3 commits, +61/−7, 5 files.

## 8. ollama#16851 — stop corrupting redirected output

**Status (verified 20 Sep 2026).** 🟡 Open — awaiting CI approval + reviewer; flips to `merged` on merge.

**Problem.** `ollama run <model> > output.txt` with no prompt opened the
interactive REPL anyway, dumping ANSI codes and spinner characters into the file.

**How I thought.** A CLI must know when it's talking to a human. Added a TTY
guard (`golang.org/x/term`): non-TTY stdout + no prompt = clear error telling
the user to pass the prompt directly, with a proper exit code. 2 commits,
+58/−2, 2 files.

## 9. Fooocus#4187 — Arabic docs for Arab developers

**Status (verified 20 Sep 2026).** 🟢 Open, mergeable (clean) — awaiting maintainer merge; flips to `merged` on merge.

**Problem.** Zero Arabic documentation — Arab developers couldn't easily learn
to contribute.

**How I thought.** Lower the barrier: translate the docs so contributors can
compare branches and open PRs in their own language. 7 commits, +10,430/−0,
254 files. Mergeable state: **clean** — awaiting maintainer merge.

---

## Q&A

**Why contribute to open source instead of only personal projects?**
Real codebases have reviewers, CI, and users. Every item above survived contact
with a maintainer or a bot that runs my code in a harness — that feedback loop
taught me more than solo projects ever did.

**How do you handle critical review feedback?**
As data, not insult. On #2538 the reviewer proved my first-section assumption
wrong with a concrete format string — I reproduced it, fixed per the Excel
spec, and added the regression test. On #12136 I rewrote the limiter twice
across three review rounds. The approval on #2538 is the receipt.

**CLA/DCO — do you comply with contribution paperwork?**
Yes: Microsoft CLA signed (both markitdown PRs), Google CLA passing
(adk-python, genkit), DCO sign-offs on my LocalAI commits (fixed the one
failure myself the same day).

**How do you test?**
New behavior ships with new tests (6 + 51-suite green on adk-python, 15 specs
on the LocalAI limiter, 33 + 57 on genkit). I also verify pre-existing
failures with `git stash` baselines so I never claim — or ship — a fix for
something I broke.

**How do you scope work?**
Small, reviewable units with declared boundaries: the PDF RTL PR is explicitly
"Phase 1" with Phase 2 conditions stated; the ollama CLI work is split into
one PR per concern area where it made sense (#16851 vs #16852).

**What are you working toward?**
First merged PRs at Microsoft and Google, deeper AI-tooling work (Python /
TypeScript / Go), and freelance web projects that use Arabic-first AI.
