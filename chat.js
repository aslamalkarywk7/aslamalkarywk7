/* ═══════════════════════════════════════════
   AI ASSISTANT — floating chat widget
   Talks to the portfolio's own /api/chat proxy.
   The Groq key never reaches the browser.
   ═══════════════════════════════════════════ */

(function () {
  "use strict";

  /* Set window.PORTFOLIO_CHAT_ENDPOINT before this file loads when the site
     is hosted somewhere else than the API (e.g. GitHub Pages + Vercel). */
  const ENDPOINT = (window.PORTFOLIO_CHAT_ENDPOINT || "/api/chat").replace(/\/$/, "");
  const MAX_HISTORY = 16;

  const COPY = {
    en: {
      open: "Open the AI assistant",
      close: "Close the assistant",
      title: "Ask Islam's AI",
      subtitle: "Services, ideas, and background",
      planMode: "Plan mode",
      planModeOn: "Plan mode is on — the assistant will build a step-by-step plan",
      planGoal: "Plan",
      planEffort: { small: "Small", medium: "Medium", large: "Large" },
      welcome:
        "Hi — I'm the AI assistant for Islam Al-Nashar, a Full-Stack Developer from Egypt. Ask me about his services, his stack, his certificates, or tell me what you want to build and I'll suggest how he can help.",
      placeholder: "Ask about services, ideas, or Islam's background…",
      send: "Send",
      thinking: "Thinking…",
      offline:
        "The assistant isn't reachable right now. You can email Islam directly at aslamalkarywka@gmail.com.",
      busy: "The assistant is busy right now — please try again in a minute.",
      generic: "Something went wrong. Please try again.",
    },
    ar: {
      open: "افتح مساعد الذكاء الاصطناعي",
      close: "أغلق المساعد",
      title: "اسأل ذكاء إسلام",
      subtitle: "الخدمات والأفكار والخبرة",
      planMode: "وضع التخطيط",
      planModeOn: "وضع التخطيط مُفعّل — سيبني المساعد خطة خطوة بخطوة",
      planGoal: "الخطة",
      planEffort: { small: "صغير", medium: "متوسط", large: "كبير" },
      welcome:
        "مرحباً — أنا مساعد إسلام النشار، مطوّر Full-Stack من مصر. اسألني عن خدماته أو تقنياته أو شهاداته، أو أخبرني بما تريد بناءه وسأقترح كيف يمكنه مساعدتك.",
      placeholder: "اسأل عن الخدمات أو الأفكار أو خبرة إسلام…",
      send: "إرسال",
      thinking: "جارٍ التفكير…",
      offline:
        "المساعد غير متاح حالياً. يمكنك مراسلة إسلام مباشرة على aslamalkarywka@gmail.com.",
      busy: "المساعد مشغول حالياً — يُرجى المحاولة بعد دقيقة.",
      generic: "حدث خطأ ما. يُرجى المحاولة مرة أخرى.",
    },
  };

  const STARTERS = {
    en: [
      { label: "What services do you offer?" },
      { label: "Plan a project for me", plan: true },
      { label: "What is your tech stack?" },
      { label: "Show me your certificates" },
    ],
    ar: [
      { label: "ما الخدمات التي تقدمها؟" },
      { label: "خطط لي مشروعاً", plan: true },
      { label: "ما هي تقنياتك المستخدمة؟" },
      { label: "أرني شهاداتك" },
    ],
  };

  const lang = () =>
    document.documentElement.lang === "ar" || document.documentElement.dir === "rtl"
      ? "ar"
      : "en";
  const t = (key) => COPY[lang()][key];

  /* ── Markdown ──────────────────────────────────────────────────────────
     The model answers in markdown. Everything is HTML-escaped first, then a
     tiny safe subset is turned back into tags (bold, italic, code, lists).
     No raw model output is ever inserted as HTML.
     ────────────────────────────────────────────────────────────────────── */
  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function inlineMd(s) {
    return s
      .replace(/`([^`\n]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>")
      .replace(/~~([^~\n]+)~~/g, "<del>$1</del>");
  }

  function mdToHtml(text) {
    const lines = escapeHtml(text).split("\n");
    let html = "";
    let list = null;

    const closeList = () => {
      if (list) {
        html += "</" + list + ">";
        list = null;
      }
    };

    for (const line of lines) {
      const ol = line.match(/^\s*\d+\.\s+(.*)$/);
      const ul = line.match(/^\s*[-*•]\s+(.*)$/);

      if (ol) {
        if (list !== "ol") {
          closeList();
          html += "<ol>";
          list = "ol";
        }
        html += "<li>" + inlineMd(ol[1]) + "</li>";
        continue;
      }
      if (ul) {
        if (list !== "ul") {
          closeList();
          html += "<ul>";
          list = "ul";
        }
        html += "<li>" + inlineMd(ul[1]) + "</li>";
        continue;
      }

      closeList();
      if (!line.trim()) continue;
      const h = line.match(/^#{1,4}\s+(.*)$/);
      html += h
        ? "<p><strong>" + inlineMd(h[1]) + "</strong></p>"
        : "<p>" + inlineMd(line) + "</p>";
    }
    closeList();
    return html;
  }

  /* ── DOM ─────────────────────────────────────────────────────────────── */
  const root = document.createElement("div");
  root.className = "ai-chat";

  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "ai-chat__launcher";
  launcher.setAttribute("aria-label", t("open"));
  launcher.setAttribute("aria-expanded", "false");
  launcher.innerHTML =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' +
    '<span class="ai-chat__pulse" aria-hidden="true"></span>';

  const panel = document.createElement("section");
  panel.className = "ai-chat__panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", t("title"));
  panel.hidden = true;

  const head = document.createElement("header");
  head.className = "ai-chat__head";
  head.innerHTML =
    '<div class="ai-chat__avatar" aria-hidden="true">AI</div>' +
    '<div class="ai-chat__headings">' +
    `<strong class="ai-chat__title"></strong>` +
    `<span class="ai-chat__subtitle"></span>` +
    "</div>";

  const planBtn = document.createElement("button");
  planBtn.type = "button";
  planBtn.className = "ai-chat__plan-toggle";
  planBtn.setAttribute("aria-pressed", "false");
  planBtn.textContent = "🎯";

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "ai-chat__close";
  closeBtn.setAttribute("aria-label", t("close"));
  closeBtn.innerHTML = "&times;";
  head.appendChild(planBtn);
  head.appendChild(closeBtn);

  const log = document.createElement("div");
  log.className = "ai-chat__log";
  log.setAttribute("aria-live", "polite");

  const chips = document.createElement("div");
  chips.className = "ai-chat__chips";

  const form = document.createElement("form");
  form.className = "ai-chat__form";
  const input = document.createElement("input");
  input.type = "text";
  input.className = "ai-chat__input";
  input.setAttribute("aria-label", t("placeholder"));
  input.autocomplete = "off";
  const sendBtn = document.createElement("button");
  sendBtn.type = "submit";
  sendBtn.className = "ai-chat__send";
  sendBtn.setAttribute("aria-label", t("send"));
  sendBtn.innerHTML =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
  form.appendChild(input);
  form.appendChild(sendBtn);

  panel.appendChild(head);
  panel.appendChild(log);
  panel.appendChild(chips);
  panel.appendChild(form);
  root.appendChild(panel);
  root.appendChild(launcher);
  document.body.appendChild(root);

  /* ── State ───────────────────────────────────────────────────────────── */
  const history = [];
  let busy = false;
  let opened = false;
  let planMode = false;
  let planAvailable = false;

  function applyCopy() {
    launcher.setAttribute("aria-label", t("open"));
    closeBtn.setAttribute("aria-label", t("close"));
    panel.setAttribute("aria-label", t("title"));
    head.querySelector(".ai-chat__title").textContent = t("title");
    head.querySelector(".ai-chat__subtitle").textContent = t("subtitle");
    input.setAttribute("aria-label", t("placeholder"));
    input.placeholder = t("placeholder");
    sendBtn.setAttribute("aria-label", t("send"));
    planBtn.setAttribute("aria-pressed", planMode ? "true" : "false");
    planBtn.setAttribute("aria-label", t("planMode"));
  }

  /* ── Plan card ────────────────────────────────────────────────────────── */
  function addPlan(plan) {
    if (!plan || !plan.steps || !plan.steps.length) return;

    const card = document.createElement("div");
    card.className = "ai-plan";

    const goal = document.createElement("p");
    goal.className = "ai-plan__goal";
    const goalLabel = document.createElement("span");
    goalLabel.className = "ai-plan__label";
    goalLabel.textContent = t("planGoal");
    goal.appendChild(goalLabel);
    goal.appendChild(document.createTextNode(" " + (plan.goal || "")));
    card.appendChild(goal);

    const list = document.createElement("ol");
    list.className = "ai-plan__steps";

    plan.steps.forEach((step) => {
      const li = document.createElement("li");
      li.className = "ai-plan__step";

      const head = document.createElement("div");
      head.className = "ai-plan__step-head";
      const title = document.createElement("strong");
      title.className = "ai-plan__step-title";
      title.textContent = step.title || "";
      head.appendChild(title);
      if (step.effort) {
        const badge = document.createElement("span");
        badge.className = "ai-plan__effort ai-plan__effort--" + step.effort;
        badge.textContent = t("planEffort")[step.effort] || step.effort;
        head.appendChild(badge);
      }
      li.appendChild(head);

      if (step.detail) {
        const detail = document.createElement("p");
        detail.className = "ai-plan__detail";
        detail.textContent = step.detail;
        li.appendChild(detail);
      }

      const meta = document.createElement("div");
      meta.className = "ai-plan__meta";
      if (step.stack) {
        const stack = document.createElement("span");
        stack.className = "ai-plan__stack";
        stack.textContent = step.stack;
        meta.appendChild(stack);
      }
      if (step.tool) {
        const tool = document.createElement("span");
        tool.className = "ai-plan__tool";
        tool.textContent = step.tool;
        meta.appendChild(tool);
      }
      if (meta.childNodes.length) li.appendChild(meta);

      list.appendChild(li);
    });

    card.appendChild(list);
    log.appendChild(card);
    log.scrollTop = log.scrollHeight;
  }

  function addMessage(role, text) {
    const wrap = document.createElement("div");
    wrap.className = "ai-chat__msg ai-chat__msg--" + role;
    const bubble = document.createElement("div");
    bubble.className = "ai-chat__bubble";
    if (role === "bot" && text) bubble.innerHTML = mdToHtml(text);
    else bubble.textContent = text;
    wrap.appendChild(bubble);
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
    return bubble;
  }

  function addTyping() {
    const wrap = document.createElement("div");
    wrap.className = "ai-chat__msg ai-chat__msg--bot";
    wrap.innerHTML =
      '<p class="ai-chat__bubble ai-chat__bubble--typing"><span></span><span></span><span></span></p>';
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
    return wrap;
  }

  function renderChips() {
    chips.innerHTML = "";
    STARTERS[lang()].forEach((item) => {
      /* the planning chip disappears when planning is switched off */
      if (item.plan && !planAvailable) return;
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "ai-chat__chip";
      chip.textContent = item.label;
      chip.addEventListener("click", () => {
        if (!busy) send(item.label);
      });
      chips.appendChild(chip);
    });
  }

  /* ── Open / close ────────────────────────────────────────────────────── */
  function open() {
    opened = true;
    applyCopy();
    renderChips();
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    launcher.setAttribute("aria-label", t("close"));
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => panel.classList.add("is-open"));

    if (!history.length) {
      addMessage("bot", t("welcome"));
      log.scrollTop = log.scrollHeight;
    }
    setTimeout(() => input.focus(), 120);
  }

  function close() {
    opened = false;
    panel.classList.remove("is-open");
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-label", t("open"));
    document.body.style.overflow = "";
    setTimeout(() => {
      if (!opened) panel.hidden = true;
    }, 260);
  }

  launcher.addEventListener("click", () => (opened ? close() : open()));
  closeBtn.addEventListener("click", close);

  planBtn.addEventListener("click", () => {
    if (!planAvailable) return;
    planMode = !planMode;
    planBtn.classList.toggle("is-on", planMode);
    planBtn.setAttribute("aria-pressed", planMode ? "true" : "false");
    planBtn.setAttribute("aria-label", t("planMode"));
    if (planMode) {
      addMessage("bot", t("planModeOn"));
    }
  });

  /* The server decides which features are switched on. If the plan mode is
     off, the button is removed entirely instead of being shown disabled. */
  async function loadConfig() {
    try {
      const res = await fetch(ENDPOINT, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) return;
      const cfg = await res.json();
      planAvailable = Boolean(cfg.plan_mode);
      if (!planAvailable) {
        planMode = false;
        planBtn.remove();
      }
      renderChips();
    } catch {
      /* keep the button — the server may simply not expose /api/config */
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && opened) close();
  });

  /* ── Send ────────────────────────────────────────────────────────────── */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || busy) return;
    input.value = "";
    send(text);
  });

  async function send(text) {
    if (busy) return;
    busy = true;
    sendBtn.disabled = true;
    chips.querySelectorAll(".ai-chat__chip").forEach((c) => (c.disabled = true));

    addMessage("user", text);
    history.push({ role: "user", content: text });
    if (history.length > MAX_HISTORY) history.splice(0, history.length - MAX_HISTORY);

    const typing = addTyping();
    let bubble = null;

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.slice(),
          lang: lang(),
          mode: planMode ? "plan" : "chat",
        }),
      });

      if (!res.ok) {
        let msg = null;
        try {
          const j = await res.json();
          msg = j && j.message;
        } catch {
          /* not JSON → the API is not deployed at this origin */
        }
        throw new Error(msg || (res.status === 429 ? t("offline") : t("generic")));
      }

      if (!res.body || !res.body.getReader) throw new Error(t("generic"));

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let full = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx;
        while ((idx = buffer.indexOf("\n\n")) !== -1) {
          const frame = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          for (const line of frame.split("\n")) {
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const j = JSON.parse(payload);
              if (j.error) {
                throw new Error(
                  j.error === "rate_limited"
                    ? t("busy")
                    : t("offline")
                );
              }
              if (j.plan) {
                addPlan(j.plan);
                continue;
              }
              if (!j.t) continue;
              full += j.t;
              if (!bubble) {
                typing.remove();
                bubble = addMessage("bot", "");
              }
              bubble.innerHTML = mdToHtml(full);
              log.scrollTop = log.scrollHeight;
            } catch (err) {
              if (err && err.message && err.message !== "ignore") throw err;
              /* ignore non-JSON keep-alive frame */
            }
          }
        }
      }

      if (!bubble) {
        typing.remove();
        bubble = addMessage("bot", "");
      }
      if (!bubble.textContent.trim()) {
        bubble.textContent = t("generic");
      } else {
        history.push({ role: "assistant", content: bubble.textContent });
        if (history.length > MAX_HISTORY)
          history.splice(0, history.length - MAX_HISTORY);
      }
    } catch (err) {
      typing.remove();
      const message =
        err && err.message && err.message !== "Failed to fetch"
          ? err.message
          : t("offline");
      addMessage("bot", message);
    } finally {
      busy = false;
      sendBtn.disabled = false;
      chips.querySelectorAll(".ai-chat__chip").forEach((c) => (c.disabled = false));
      log.scrollTop = log.scrollHeight;
    }
  }

  /* Keep the copy in sync when the site language changes */
  document.addEventListener("portfolio:langchange", () => {
    applyCopy();
    renderChips();
  });

  applyCopy();
  renderChips();
  loadConfig();

  /* Let other parts of the site open the assistant (e.g. the services CTA) */
  window.openPortfolioChat = open;
})();
