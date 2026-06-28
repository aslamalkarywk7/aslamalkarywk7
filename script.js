/* ═══════════════════════════════════════════
   Islam El-Nashar — Portfolio Script
   ═══════════════════════════════════════════ */

(function () {
  "use strict";

  /* ─────────────────────────────────────────
     1. DYNAMIC AGE CALCULATOR
     ───────────────────────────────────────── */
  const BIRTHDATE = new Date(2006, 6, 23); // Month is 0-indexed: 6 = July

  function calculateAge() {
    const now = new Date();
    let age = now.getFullYear() - BIRTHDATE.getFullYear();
    const monthDiff = now.getMonth() - BIRTHDATE.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && now.getDate() < BIRTHDATE.getDate())
    ) {
      age--;
    }
    return age;
  }

  const age = calculateAge();
  const ageEl = document.getElementById("age");
  const ageStatEl = document.getElementById("ageStat");
  if (ageEl) ageEl.textContent = age;
  if (ageStatEl) ageStatEl.textContent = age;

  /* ─────────────────────────────────────────
     2. FOOTER YEAR
     ───────────────────────────────────────── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─────────────────────────────────────────
     3. NAVIGATION — Scroll & Mobile Toggle
     ───────────────────────────────────────── */
  
  // Check if we're on index.html (has nav element)
  const nav = document.getElementById("nav");
  
  // Only run navigation code on index.html
  if (nav) {
    // We're on index.html - run navigation code
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.querySelector(".nav__links");

    // Scroll blur effect
    let lastScroll = 0;
  
    function onScroll() {
      const scrollY = window.scrollY;
      if (nav) {
        if (scrollY > 50) {
          nav.classList.add("scrolled");
        } else {
          nav.classList.remove("scrolled");
        }
      }
      lastScroll = scrollY;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // init
  
    // Mobile toggle
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        navToggle.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", isOpen);
        document.body.style.overflow = isOpen ? "hidden" : "";
      });

      // Close mobile menu on link click
      navLinks.querySelectorAll(".nav__link").forEach((link) => {
        link.addEventListener("click", () => {
          navLinks.classList.remove("open");
          navToggle.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        });
      });
    }

  } // End of index.html only section

  /* ─────────────────────────────────────────
     4. REVEAL ON SCROLL (IntersectionObserver)
     ───────────────────────────────────────── */
  const reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show everything
    reveals.forEach((el) => el.classList.add("visible"));
  }

  /* ─────────────────────────────────────────
     5. SKILLS TABS
     ───────────────────────────────────────── */
  const tabs = document.querySelectorAll(".skills__tab");
  const panels = document.querySelectorAll(".skills__panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      panels.forEach((p) => {
        p.classList.remove("active");
        p.hidden = true;
      });
      const activePanel = document.getElementById("tab-" + target);
      if (activePanel) {
        activePanel.classList.add("active");
        activePanel.hidden = false;
      }
    });
  });

  /* ───────────────────────────────────────
     6. GITHUB API FETCHER & LOAD MORE
     ─────────────────────────────────────── */
  const GITHUB_USER = "aslamalkarywk7";
  const API_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated&type=owner`;
  const projectsContainer = document.getElementById("github-projects");
  const INITIAL_COUNT = 6;
  let allRepos = [];

  // Language colors (common ones)
  const LANG_COLORS = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    "C#": "#178600",
    C: "#555555",
    "C++": "#f34b7d",
    Java: "#b07219",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Go: "#00ADD8",
    Rust: "#dea584",
    Ruby: "#701516",
    PHP: "#4F5D95",
    Svelte: "#ff3e00",
    Vue: "#41b883",
  };

  function getLangColor(lang) {
    return LANG_COLORS[lang] || "#722f37";
  }

  function createProjectCard(repo) {
    const card = document.createElement("article");
    card.className = "project-card";

    const desc = repo.description
      ? repo.description.length > 160
        ? repo.description.slice(0, 157) + "..."
        : repo.description
      : "No description provided.";

    const langHTML = repo.language
      ? `<span class="project-card__lang"><span class="project-card__lang-dot" style="background:${getLangColor(repo.language)}"></span>${repo.language}</span>`
      : '<span class="project-card__lang">—</span>';

    const demoLink = repo.homepage
      ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-card__link">Live Demo ↗</a>`
      : "";

    card.innerHTML = `
      <div class="project-card__header">
        <h3 class="project-card__name">${repo.name.replace(/[-_]/g, " ")}</h3>
        <svg class="project-card__icon" width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1h-8a1 1 0 00-1 1v6.708A2.486 2.486 0 014.5 9h8V1.5zm-8 11h8v1.5h-8a1 1 0 110-2 .75.75 0 010 .5z"/>
        </svg>
      </div>
      <p class="project-card__desc">${desc}</p>
      <div class="project-card__footer">
        ${langHTML}
        <div class="project-card__links">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-card__link">Code ↗</a>
          ${demoLink}
        </div>
      </div>
    `;
    return card;
  }

  function showFallback() {
    projectsContainer.innerHTML = "";
    const empty = document.createElement("div");
    empty.className = "projects__empty";
    empty.innerHTML = `
      <p>Couldn't load projects right now.</p>
      <p><a href="https://github.com/${GITHUB_USER}?tab=repositories" target="_blank" rel="noopener noreferrer">View all repos on GitHub ↗</a></p>
    `;
    projectsContainer.appendChild(empty);
    // Hide load-more on error
    const wrapper = document.getElementById("load-more-wrapper");
    if (wrapper) wrapper.style.display = "none";
  }

  function renderCards(repos, startIndex) {
    repos.forEach((repo, i) => {
      const card = createProjectCard(repo);
      card.style.setProperty("--card-delay", `${(startIndex + i) * 60}ms`);
      card.classList.add("card--enter");
      projectsContainer.appendChild(card);
      // Trigger entrance animation on next frame
      requestAnimationFrame(() => card.classList.add("card--visible"));
    });
  }

  function handleLoadMore() {
    if (allRepos.length === 0) return;

    const wrapper = document.getElementById("load-more-wrapper");
    const remaining = allRepos.slice(INITIAL_COUNT);
    renderCards(remaining, INITIAL_COUNT);

    // Morph wrapper into a GitHub profile link
    if (wrapper) {
      const link = document.createElement("a");
      link.href = `https://github.com/${GITHUB_USER}?tab=repositories`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "btn btn--secondary";
      link.textContent = "View Full GitHub Profile ↗";
      wrapper.innerHTML = "";
      wrapper.appendChild(link);
    }
  }

  async function fetchProjects() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`GitHub API responded with ${res.status}`);

      const repos = await res.json();

      // Filter forks, sort by most recently updated
      const filtered = repos
        .filter((r) => !r.fork)
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      if (filtered.length === 0) {
        showFallback();
        return;
      }

      allRepos = filtered;
      projectsContainer.innerHTML = "";

      // Render only first INITIAL_COUNT repos
      renderCards(allRepos.slice(0, INITIAL_COUNT), 0);

      // Show load-more only when there are additional repos
      const wrapper = document.getElementById("load-more-wrapper");
      if (wrapper) {
        wrapper.style.display =
          allRepos.length > INITIAL_COUNT ? "flex" : "none";
      }
    } catch (err) {
      console.warn("GitHub fetch failed:", err.message);
      showFallback();
    }
  }

  // Wire up load-more button
  const loadMoreBtn = document.getElementById("load-more-btn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", handleLoadMore);
  }

  // Run when projects section is near viewport
  if ("IntersectionObserver" in window) {
    const projectsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchProjects();
          projectsObserver.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    projectsObserver.observe(projectsContainer);
  } else {
    fetchProjects();
  }

  /* ───────────────────────────────────────
     8. OPEN SOURCE IMPACT — GitHub PR Search
     ─────────────────────────────────────── */
  const ossContainer = document.getElementById("oss-cards");

  // Only two projects explicitly confirmed by the owner.
  // Shown when the API returns zero external PRs or hits a rate limit.
  const OSS_FALLBACK = [
    {
      repoPath: "ollama/ollama",
      repoDisplayName: "Ollama",
      subtitle: "ollama/ollama",
      title:
        "Contributed to the local LLM runtime — API improvements, docs, and cross-platform compatibility.",
      state: "merged",
      url: `https://github.com/ollama/ollama/issues?q=author%3A${GITHUB_USER}`,
    },
    {
      repoPath: "invoke-ai/InvokeAI",
      repoDisplayName: "InvokeAI",
      subtitle: "invoke-ai/InvokeAI",
      title:
        "Contributed localization support and workflow optimizations to the AI image-generation platform.",
      state: "merged",
      url: `https://github.com/invoke-ai/InvokeAI/issues?q=author%3A${GITHUB_USER}`,
    },
  ];

  /**
   * Build a single OSS card element from a normalized data object.
   * @param {{ repoPath, repoDisplayName, subtitle, title, state, url }} item
   */
  function buildOssCard(item) {
    const { repoPath, repoDisplayName, subtitle, title, state, url } = item;
    const owner = repoPath.split("/")[0];
    const stateLabel =
      state === "merged" ? "Merged" : state === "open" ? "Open" : "Closed";

    const card = document.createElement("a");
    card.href = url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.className = "oss-card card--enter";
    card.setAttribute("aria-label", `View contribution to ${repoDisplayName}`);

    card.innerHTML = `
      <span class="oss-card__arrow" aria-hidden="true">&#x2197;</span>
      <div class="oss-card__body">
        <h3 class="oss-card__name">${repoDisplayName}</h3>
        <p class="oss-card__subtitle">${subtitle}</p>
        <p class="oss-card__desc">${title}</p>
      </div>
      <div class="oss-card__meta">
        <span class="oss-card__tag">${owner}</span>
        <span class="oss-card__badge oss-card__badge--${state}">${stateLabel}</span>
      </div>
    `;
    return card;
  }

  /** Flush the container and paint an array of data objects as cards. */
  function renderOssCards(items) {
    if (!ossContainer) return;
    ossContainer.innerHTML = "";

    if (items.length === 0) {
      const msg = document.createElement("p");
      msg.className = "oss-empty";
      msg.innerHTML = `No public pull requests found yet. — <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener noreferrer">View GitHub profile &#x2197;</a>.`;
      ossContainer.appendChild(msg);
      return;
    }

    items.forEach((item, i) => {
      const card = buildOssCard(item);
      card.style.setProperty("--card-delay", `${i * 80}ms`);
      ossContainer.appendChild(card);
      // Stagger the entrance animation one rAF after mount
      requestAnimationFrame(() => card.classList.add("card--visible"));
    });
  }

  /**
   * Normalise raw Search API items into the card data shape.
   *   • Strips PRs on the user’s own repos.
   *   • Deduplicates by repo, preferring merged PRs.
   *   • Caps the result list at 8 cards.
   */
  function parsePrItems(rawItems) {
    // Keep only PRs on *other people’s* repos
    const external = rawItems.filter((item) => {
      const parts = item.repository_url.split("/");
      const owner = parts[parts.length - 2];
      return owner.toLowerCase() !== GITHUB_USER.toLowerCase();
    });

    // One card per repo — prefer the merged PR if multiple exist
    const byRepo = new Map();
    for (const item of external) {
      const repoPath = item.repository_url.replace(
        "https://api.github.com/repos/",
        "",
      );
      const existing = byRepo.get(repoPath);
      const isMerged = Boolean(item.pull_request?.merged_at);
      const existingMerged = Boolean(existing?.pull_request?.merged_at);

      if (!existing || (isMerged && !existingMerged)) {
        byRepo.set(repoPath, item);
      }
    }

    return Array.from(byRepo.values())
      .slice(0, 8)
      .map((item) => {
        const repoPath = item.repository_url.replace(
          "https://api.github.com/repos/",
          "",
        );
        const repoName = repoPath.split("/")[1];
        // "invoke-ai" → "Invoke Ai" then clean up common acronyms
        const repoDisplayName = repoName
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        let state;
        if (item.pull_request?.merged_at) {
          state = "merged";
        } else if (item.state === "open") {
          state = "open";
        } else {
          state = "closed";
        }

        const raw = item.title;
        const title = raw.length > 100 ? raw.slice(0, 97) + "…" : raw;

        return {
          repoPath,
          repoDisplayName,
          subtitle: repoPath, // "owner/repo" shown as subtitle
          title, // actual PR title, truncated
          state,
          url: item.html_url, // direct link to the PR
        };
      });
  }

  /** Fetch, parse, and render. Falls back to OSS_FALLBACK on any failure. */
  async function fetchOssContributions() {
    if (!ossContainer) return;
    try {
      const res = await fetch(
        `https://api.github.com/search/issues?q=author:${GITHUB_USER}+type:pr&per_page=100&sort=updated&order=desc`,
        { headers: { Accept: "application/vnd.github.v3+json" } },
      );

      if (!res.ok) throw new Error(`Search API ${res.status}`);

      const data = await res.json();
      const parsed = parsePrItems(data.items || []);

      if (parsed.length > 0) {
        renderOssCards(parsed);
      } else {
        // Zero external PRs — use the two confirmed fallback projects
        console.info(
          "[OSS] No external PRs found via Search API; showing approved fallback.",
        );
        renderOssCards(OSS_FALLBACK);
      }
    } catch (err) {
      // Rate-limit, network error, etc. — safe fallback, no broken UI
      console.warn("[OSS] Fetch failed:", err.message);
      renderOssCards(OSS_FALLBACK);
    }
  }

  // Lazy-trigger when the section scrolls near the viewport
  if ("IntersectionObserver" in window && ossContainer) {
    const ossObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchOssContributions();
          ossObserver.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    ossObserver.observe(ossContainer);
  } else if (ossContainer) {
    fetchOssContributions();
  }

  /* ───────────────────────────────────────
     9. CONTACT FORM — submit handler
     ─────────────────────────────────────── */
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");

  if (contactForm && formSuccess) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const btn = contactForm.querySelector(".contact-form__btn");
      const btnText = btn.querySelector(".contact-form__btn-text");
      const originalText = btnText.textContent;

      // Loading state
      btn.disabled = true;
      btnText.textContent = "Sending…";

      // Wire to a real endpoint (Formspree, EmailJS, Netlify Forms…) here.
      // This timeout simulates the network delay for UI demonstration.
      setTimeout(() => {
        contactForm.hidden = true;
        formSuccess.hidden = false;

        // Auto-reset so the user can send another message after 8 s
        setTimeout(() => {
          contactForm.reset();
          contactForm.hidden = false;
          formSuccess.hidden = true;
          btn.disabled = false;
          btnText.textContent = originalText;
        }, 8000);
      }, 1100);
    });
  }

  /* ───────────────────────────────────────
     7. SMOOTH SCROLL OFFSET FOR FIXED NAV
     ─────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });
})();

/* ═══════════════════════════════════════════
   CV PAGE — Bilingual i18n Engine
   Runs only on cv.html (guarded by #cv-root check)
   ═══════════════════════════════════════════ */
(function () {
  "use strict";

  /* ───────────────────────────────────────
     Translation dictionary
     Keys map 1-to-1 with [data-i18n] attributes
     ─────────────────────────────────────── */
  const T = {
    en: {
      back_btn: "Back to Portfolio",
      download_btn: "Download PDF",
      print_btn: "Print",
      name: "Islam El-Nashar",
      headline: "Full-Stack Software &amp; Systems Engineer",
      location: "Egypt",
      /* — Summary — */
      summary_heading: "Professional Summary",
      summary:
        "A 19-year-old passionate Full-Stack Software &amp; Systems Engineer from Egypt, with self-built expertise spanning web platform development, game programming, and local AI infrastructure deployment. Experienced in designing production-grade systems using modern stacks (Node.js, React, Svelte), integrating offline LLM environments via Ollama, and contributing to open-source ecosystems \u2014 including comprehensive Arabic localization work for InvokeAI. Currently advancing toward large-scale AI agent architecture and enterprise web platform engineering.",
      /* — Skills — */
      skills_heading: "Technical Skills",
      skill_languages: "Programming Languages",
      skill_web: "Web &amp; Backend",
      skill_ai: "AI &amp; DevOps",
      skill_tools: "Tools &amp; Game Dev",
      /* — Experience — */
      experience_heading: "Experience &amp; Key Achievements",
      exp1_title: "Karjoka \u2014 Platform Founder &amp; Lead Engineer",
      exp1_org: "Independent / Self-Directed",
      exp1_date: "2023 \u2013 Present",
      exp1_b1:
        "Designed and delivered multiple production-grade web applications under the Karjoka brand",
      exp1_b2:
        "Architected full-stack solutions using Node.js, Bun, Svelte, MongoDB, and tRPC",
      exp1_b3:
        "Implemented CI/CD pipelines and containerized deployment infrastructure via Docker and Netlify",
      exp2_title: "Local AI Infrastructure Specialist",
      exp2_org: "Personal R&amp;D / Open Source",
      exp2_date: "2024 \u2013 Present",
      exp2_b1:
        "Deployed and maintained offline LLM environments using Ollama for local AI workflow acceleration",
      exp2_b2:
        "Engineered agent-based automation systems to amplify developer productivity pipelines",
      exp2_b3:
        "Evaluated and integrated state-of-the-art open models: LLaMA, Gemma, Mistral, Qwen",
      exp3_title: "Open-Source Contributor \u2014 InvokeAI",
      exp3_org: "Community / GitHub",
      exp3_date: "2024",
      exp3_b1:
        "Developed a comprehensive Arabic localization and documentation framework for the InvokeAI AI image generation platform",
      exp3_b2:
        "Authored structured i18n translation files and tooling to serve Arabic-speaking user communities",
      exp4_title: "Game Development Engineer \u2014 Unity Projects",
      exp4_org: "Independent Development",
      exp4_date: "2022 \u2013 2024",
      exp4_b1:
        "Built complex game mechanics, AI behavior trees, and multiplayer networking systems using Unity &amp; C#",
      exp4_b2:
        "Integrated PlayFab cloud backend and Plastic SCM for collaborative game project management",
      /* — Education — */
      education_heading: "Education",
      edu1_degree:
        "Management Information Systems &amp; Business Administration",
      edu1_school: "Undergraduate Studies \u2014 MIS Program",
      edu1_date: "2024 \u2013 Present",
      edu1_desc:
        "Enterprise systems design, database management, software project lifecycle, and business process engineering.",
      edu2_degree: "Electronics Engineering Foundation",
      edu2_school: "Secondary Technical Education",
      edu2_date: "2021 \u2013 2024",
      edu2_desc:
        "Electronics systems, embedded logic, and computational theory fundamentals.",
      certificates_heading: "Certificates &amp; Awards",
      projects_heading: "Featured Projects",
    },

    ar: {
      back_btn:
        "\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a",
      download_btn:
        "\u062a\u062d\u0645\u064a\u0644 PDF",
      print_btn: "\u0637\u0628\u0627\u0639\u0629",
      name: "\u0625\u0633\u0644\u0627\u0645 \u0627\u0644\u0646\u0634\u0627\u0631",
      headline:
        "\u0645\u0647\u0646\u062f\u0633 \u0628\u0631\u0645\u062c\u064a\u0627\u062a \u0648\u0646\u0638\u0645 \u0645\u062a\u0643\u0627\u0645\u0644",
      location: "\u0645\u0635\u0631",
      /* — Summary — */
      summary_heading:
        "\u0627\u0644\u0645\u0644\u062e\u0635 \u0627\u0644\u0645\u0647\u0646\u064a",
      summary:
        "\u0645\u0647\u0646\u062f\u0633 \u0628\u0631\u0645\u062c\u064a\u0627\u062a \u0648\u0646\u0638\u0645 \u0645\u062a\u0643\u0627\u0645\u0644 \u0634\u063a\u0648\u0641 \u0645\u0646 \u0645\u0635\u0631\u060c \u064a\u0628\u0644\u063a \u0645\u0646 \u0627\u0644\u0639\u0645\u0631 19 \u0639\u0627\u0645\u064b\u0627\u060c \u064a\u0645\u062a\u0644\u0643 \u062e\u0628\u0631\u0629 \u0630\u0627\u062a\u064a\u0629 \u0627\u0644\u0628\u0646\u0627\u0621 \u062a\u0645\u062a\u062f \u0639\u0628\u0631 \u062a\u0637\u0648\u064a\u0631 \u0645\u0646\u0635\u0627\u062a \u0627\u0644\u0648\u064a\u0628\u060c \u0648\u0628\u0631\u0645\u062c\u0629 \u0627\u0644\u0623\u0644\u0639\u0627\u0628\u060c \u0648\u0646\u0634\u0631 \u0628\u0646\u064a\u0629 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0627\u0644\u0645\u062d\u0644\u064a\u0629. \u0645\u062a\u0645\u0643\u0646 \u0645\u0646 \u062a\u0635\u0645\u064a\u0645 \u0623\u0646\u0638\u0645\u0629 \u0639\u0644\u0649 \u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0625\u0646\u062a\u0627\u062c \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u062d\u0632\u0645 \u062d\u062f\u064a\u062b\u0629 (Node.js\u060c React\u060c Svelte)\u060c \u0648\u062f\u0645\u062c \u0628\u064a\u0626\u0627\u062a \u0646\u0645\u0627\u0630\u062c \u0627\u0644\u0644\u063a\u0629 \u0627\u0644\u0643\u0628\u064a\u0631\u0629 \u062f\u0648\u0646 \u0625\u0646\u062a\u0631\u0646\u062a \u0639\u0628\u0631 Ollama\u060c \u0648\u0627\u0644\u0645\u0633\u0627\u0647\u0645\u0629 \u0641\u064a \u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0645\u0635\u0627\u062f\u0631 \u0627\u0644\u0645\u0641\u062a\u0648\u062d\u0629 \u2014 \u0628\u0645\u0627 \u0641\u064a\u0647\u0627 \u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u062a\u0639\u0631\u064a\u0628 \u0627\u0644\u0639\u0631\u0628\u064a \u0627\u0644\u0634\u0627\u0645\u0644 \u0644\u0640 InvokeAI. \u064a\u0633\u0639\u0649 \u062d\u0627\u0644\u064a\u064b\u0627 \u0646\u062d\u0648 \u0628\u0646\u0627\u0621 \u0628\u0646\u064a\u0629 \u0648\u0643\u0644\u0627\u0621 \u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0648\u0627\u0633\u0639\u0629 \u0627\u0644\u0646\u0637\u0627\u0642 \u0648\u0647\u0646\u062f\u0633\u0629 \u0645\u0646\u0635\u0627\u062a \u0627\u0644\u0648\u064a\u0628 \u0627\u0644\u0645\u0624\u0633\u0633\u064a\u0629.",
      /* — Skills — */
      skills_heading:
        "\u0627\u0644\u0645\u0647\u0627\u0631\u0627\u062a \u0627\u0644\u062a\u0642\u0646\u064a\u0629",
      skill_languages:
        "\u0644\u063a\u0627\u062a \u0627\u0644\u0628\u0631\u0645\u062c\u0629",
      skill_web:
        "\u0627\u0644\u0648\u064a\u0628 \u0648\u0627\u0644\u062e\u0644\u0641\u064a\u0629",
      skill_ai:
        "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0648\u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a",
      skill_tools:
        "\u0627\u0644\u0623\u062f\u0648\u0627\u062a \u0648\u062a\u0637\u0648\u064a\u0631 \u0627\u0644\u0623\u0644\u0639\u0627\u0628",
      /* — Experience — */
      experience_heading:
        "\u0627\u0644\u062e\u0628\u0631\u0627\u062a \u0648\u0627\u0644\u0625\u0646\u062c\u0627\u0632\u0627\u062a \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629",
      exp1_title:
        "Karjoka \u2014 \u0627\u0644\u0645\u0624\u0633\u0633 \u0648\u0627\u0644\u0645\u0647\u0646\u062f\u0633 \u0627\u0644\u0631\u0626\u064a\u0633\u064a",
      exp1_org:
        "\u0645\u0633\u062a\u0642\u0644 / \u0645\u0648\u062c\u0651\u0647 \u0630\u0627\u062a\u064a\u064b\u0627",
      exp1_date: "2023 \u2013 \u062d\u062a\u0649 \u0627\u0644\u0622\u0646",
      exp1_b1:
        "\u0635\u0645\u0651\u0645 \u0648\u0642\u062f\u0651\u0645 \u062a\u0637\u0628\u064a\u0642\u0627\u062a \u0648\u064a\u0628 \u0645\u062a\u0639\u062f\u062f\u0629 \u0639\u0644\u0649 \u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0625\u0646\u062a\u0627\u062c \u062a\u062d\u062a \u0639\u0644\u0627\u0645\u0629 Karjoka",
      exp1_b2:
        "\u0628\u0646\u0649 \u062d\u0644\u0648\u0644\u064b\u0627 \u062a\u0642\u0646\u064a\u0629 \u0645\u062a\u0643\u0627\u0645\u0644\u0629 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 Node.js \u0648Bun \u0648Svelte \u0648MongoDB \u0648tRPC",
      exp1_b3:
        "\u0646\u0641\u0651\u0630 \u062e\u0637\u0648\u0637 CI/CD \u0648\u0628\u0646\u064a\u0629 \u0646\u0634\u0631 \u0645\u0639\u0628\u0651\u0623\u0629 \u0639\u0628\u0631 Docker \u0648Netlify",
      exp2_title:
        "\u0645\u062a\u062e\u0635\u0635 \u0628\u0646\u064a\u0629 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0627\u0644\u0645\u062d\u0644\u064a\u0629",
      exp2_org:
        "\u0628\u062d\u062b \u0648\u062a\u0637\u0648\u064a\u0631 \u0634\u062e\u0635\u064a / \u0645\u0635\u062f\u0631 \u0645\u0641\u062a\u0648\u062d",
      exp2_date: "2024 \u2013 \u062d\u062a\u0649 \u0627\u0644\u0622\u0646",
      exp2_b1:
        "\u0646\u0634\u0631 \u0648\u0635\u064a\u0651\u0646 \u0628\u064a\u0626\u0627\u062a \u0646\u0645\u0627\u0630\u062c \u0627\u0644\u0644\u063a\u0629 \u0627\u0644\u0643\u0628\u064a\u0631\u0629 \u062f\u0648\u0646 \u0625\u0646\u062a\u0631\u0646\u062a \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 Ollama \u0644\u062a\u0633\u0631\u064a\u0639 \u0633\u064a\u0631 \u0639\u0645\u0644 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a",
      exp2_b2:
        "\u0637\u0648\u0651\u0631 \u0623\u0646\u0638\u0645\u0629 \u0623\u062a\u0645\u062a\u0629 \u0642\u0627\u0626\u0645\u0629 \u0639\u0644\u0649 \u0627\u0644\u0648\u0643\u0644\u0627\u0621 \u0644\u062a\u0636\u062e\u064a\u0645 \u062e\u0637\u0648\u0637 \u0625\u0646\u062a\u0627\u062c\u064a\u0629 \u0627\u0644\u0645\u0637\u0648\u0651\u0631\u064a\u0646",
      exp2_b3:
        "\u0642\u064a\u0651\u0645 \u0648\u062f\u0645\u062c \u0623\u062d\u062f\u062b \u0627\u0644\u0646\u0645\u0627\u0630\u062c \u0627\u0644\u0645\u0641\u062a\u0648\u062d\u0629: LLaMA \u0648Gemma \u0648Mistral \u0648Qwen",
      exp3_title:
        "\u0645\u0633\u0627\u0647\u0645 \u0641\u064a \u0627\u0644\u0645\u0635\u0627\u062f\u0631 \u0627\u0644\u0645\u0641\u062a\u0648\u062d\u0629 \u2014 InvokeAI",
      exp3_org: "\u0645\u062c\u062a\u0645\u0639 / GitHub",
      exp3_date: "2024",
      exp3_b1:
        "\u0637\u0648\u0651\u0631 \u0625\u0637\u0627\u0631\u064b\u0627 \u0634\u0627\u0645\u0644\u064b\u0627 \u0644\u062a\u0639\u0631\u064a\u0628 \u0648\u062a\u0648\u062b\u064a\u0642 \u0645\u0646\u0635\u0629 InvokeAI \u0644\u062a\u0648\u0644\u064a\u062f \u0627\u0644\u0635\u0648\u0631 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a",
      exp3_b2:
        "\u0623\u0639\u062f\u0651 \u0645\u0644\u0641\u0627\u062a \u062a\u0631\u062c\u0645\u0629 i18n \u0645\u0646\u0638\u0651\u0645\u0629 \u0648\u0623\u062f\u0648\u0627\u062a \u0645\u062a\u062e\u0635\u0635\u0629 \u0644\u062e\u062f\u0645\u0629 \u0645\u062c\u062a\u0645\u0639 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u064a\u0646 \u0627\u0644\u0646\u0627\u0637\u0642\u064a\u0646 \u0628\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
      exp4_title:
        "\u0645\u0647\u0646\u062f\u0633 \u062a\u0637\u0648\u064a\u0631 \u0623\u0644\u0639\u0627\u0628 \u2014 \u0645\u0634\u0627\u0631\u064a\u0639 Unity",
      exp4_org: "\u062a\u0637\u0648\u064a\u0631 \u0645\u0633\u062a\u0642\u0644",
      exp4_date: "2022 \u2013 2024",
      exp4_b1:
        "\u0628\u0646\u0649 \u0645\u064a\u0643\u0627\u0646\u064a\u0643\u0627\u062a \u0623\u0644\u0639\u0627\u0628 \u0645\u0639\u0642\u062f\u0629 \u0648\u0623\u0634\u062c\u0627\u0631 \u0633\u0644\u0648\u0643 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0648\u0628\u0646\u064a\u0629 \u0634\u0628\u0643\u0627\u062a \u0645\u062a\u0639\u062f\u062f\u0629 \u0627\u0644\u0644\u0627\u0639\u0628\u064a\u0646 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 Unity \u0648C#",
      exp4_b2:
        "\u062f\u0645\u062c \u062e\u062f\u0645\u0629 PlayFab \u0627\u0644\u0633\u062d\u0627\u0628\u064a\u0629 \u0648Plastic SCM \u0644\u0625\u062f\u0627\u0631\u0629 \u0645\u0634\u0627\u0631\u064a\u0639 \u0627\u0644\u0623\u0644\u0639\u0627\u0628 \u0627\u0644\u062a\u0639\u0627\u0648\u0646\u064a\u0629",
      /* — Education — */
      education_heading: "\u0627\u0644\u062a\u0639\u0644\u064a\u0645",
      edu1_degree:
        "\u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0625\u062f\u0627\u0631\u064a\u0629 \u0648\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0623\u0639\u0645\u0627\u0644",
      edu1_school:
        "\u062f\u0631\u0627\u0633\u0627\u062a \u062c\u0627\u0645\u0639\u064a\u0629 \u2014 \u0628\u0631\u0646\u0627\u0645\u062c MIS",
      edu1_date: "2024 \u2013 \u062d\u062a\u0649 \u0627\u0644\u0622\u0646",
      edu1_desc:
        "\u062a\u0635\u0645\u064a\u0645 \u0627\u0644\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0645\u0624\u0633\u0633\u064a\u0629\u060c \u0648\u0625\u062f\u0627\u0631\u0629 \u0642\u0648\u0627\u0639\u062f \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a\u060c \u0648\u062f\u0648\u0631\u0629 \u062d\u064a\u0627\u0629 \u0645\u0634\u0627\u0631\u064a\u0639 \u0627\u0644\u0628\u0631\u0645\u062c\u064a\u0627\u062a\u060c \u0648\u0647\u0646\u062f\u0633\u0629 \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0644\u062a\u062c\u0627\u0631\u064a\u0629.",
      edu2_degree:
        "\u0623\u0633\u0627\u0633\u064a\u0627\u062a \u0647\u0646\u062f\u0633\u0629 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0627\u062a",
      edu2_school:
        "\u0627\u0644\u062a\u0639\u0644\u064a\u0645 \u0627\u0644\u062b\u0627\u0646\u0648\u064a \u0627\u0644\u062a\u0642\u0646\u064a",
      edu2_date: "2021 \u2013 2024",
      edu2_desc:
        "\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0627\u062a\u060c \u0648\u0627\u0644\u0645\u0646\u0637\u0642 \u0627\u0644\u0645\u0636\u0645\u0651\u0646\u060c \u0648\u0623\u0633\u0633 \u0646\u0638\u0631\u064a\u0629 \u0627\u0644\u062d\u0648\u0633\u0628\u0629.",
      certificates_heading:
        "\u0627\u0644\u0634\u0647\u0627\u062f\u0627\u062a \u0648\u0627\u0644\u062c\u0648\u0627\u0626\u0632",
      projects_heading:
        "\u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639 \u0627\u0644\u0645\u0645\u064a\u0632\u0629",
    },
  };

  /* ───────────────────────────────────────
     Engine: apply a language to the page
     ─────────────────────────────────────── */
  function applyLang(lang, cvRoot) {
    const dict = T[lang];
    if (!dict) return;

    // Update every i18n node's innerHTML
    cvRoot.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        el.innerHTML = dict[key];
      }
    });

    // Flip HTML direction and lang attribute
    cvRoot.setAttribute("lang", lang === "ar" ? "ar" : "en");
    cvRoot.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    // Swap body font-family for instant reflow
    document.body.style.fontFamily =
      lang === "ar"
        ? "'Tajawal', system-ui, sans-serif"
        : "'Inter', system-ui, -apple-system, sans-serif";

    // Update toggle button active + aria-pressed states
    cvRoot.querySelectorAll(".lang-toggle__btn").forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("lang-toggle__btn--active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    var langToggle = cvRoot.querySelector(".lang-toggle");
    if (langToggle) {
      langToggle.setAttribute("data-active", lang);
    }

    document.dispatchEvent(
      new CustomEvent("languageChange", { detail: { lang: lang } }),
    );
  }

  /* ───────────────────────────────────────
     Boot: run only when #cv-root exists
     ─────────────────────────────────────── */
  var cvRoot = document.getElementById("cv-root");
  if (!cvRoot) return; // Not on cv.html — bail silently

  var doc = document.getElementById("cv-document");
  var currentLang = "en";

  // Make applyLang globally accessible for cv-animations.js
  window.switchLanguage = function(lang) {
    if (lang === currentLang) return;
    currentLang = lang;

    if (doc) {
      // Fade out → swap content → fade back in
      doc.classList.add("cv-lang-fade");
      setTimeout(function () {
        applyLang(lang, cvRoot);
        doc.classList.remove("cv-lang-fade");
      }, 190);
    } else {
      applyLang(lang, cvRoot);
    }
  };

  // Wire up language toggle buttons
  cvRoot.querySelectorAll(".lang-toggle__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var lang = btn.getAttribute("data-lang");
      window.switchLanguage(lang);
      btn.style.transform = "scale(0.95)";
      setTimeout(function () {
        btn.style.transform = "";
      }, 150);
    });
  });

  // Wire up the Download / Print button
  var printBtn = document.getElementById("cv-print-btn");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }

  // Initialise with English (HTML default, no DOM mutation needed)
  // Just sync aria-pressed states in case CSS alone isn't enough
  applyLang("en", cvRoot);
})();

/* ═══════════════════════════════════════════
   PREMIUM PORTFOLIO INTERACTION & ANIMATION ENGINE
   Runs only on index.html (guarded by check for #hero)
   ═══════════════════════════════════════════ */
(function () {
  "use strict";

  const heroSection = document.getElementById("hero");
  if (!heroSection) return; // Guard: only run on index.html

  /* ─────────────────────────────────────────
     1. CANVAS PARTICLES BACKGROUND
     ───────────────────────────────────────── */
  const canvas = document.getElementById("hero-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrameId;
    let mouse = { x: null, y: null, radius: 160 };

    // Resize canvas
    function resizeCanvas() {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
      initParticles();
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse interaction (gentle pull)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 0.3;
            this.y += (dy / dist) * force * 0.3;
          }
        }
      }
      draw() {
        ctx.fillStyle = "rgba(114, 47, 55, 0.35)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      const density = Math.floor((canvas.width * canvas.height) / 9500);
      particles = [];
      for (let i = 0; i < Math.min(density, 100); i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 100) {
            const alpha = ((100 - dist) / 100) * 0.07;
            ctx.strokeStyle = `rgba(114, 47, 55, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animateParticles);
    }

    // Event listeners
    window.addEventListener("resize", resizeCanvas);
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    heroSection.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();
    animateParticles();
  }

  /* ─────────────────────────────────────────
     2. DYNAMIC TEXT SPLITTING & STAGGERED REVEAL
     ───────────────────────────────────────── */
  const revealElements = document.querySelectorAll(
    ".hero__greeting.reveal, .hero__name.reveal, .hero__headline.reveal"
  );
  revealElements.forEach((el) => {
    const originalText = el.textContent.trim();
    const words = originalText.split(/\s+/);
    el.innerHTML = "";

    words.forEach((word, idx) => {
      const span = document.createElement("span");
      span.className = "reveal-word";
      span.textContent = word;
      span.style.setProperty("--word-idx", idx);
      el.appendChild(span);

      if (idx < words.length - 1) {
        el.appendChild(document.createTextNode(" "));
      }
    });
  });

  /* ─────────────────────────────────────────
     3. SPOTLIGHT TRACKER & MOUSE GLOW
     ───────────────────────────────────────── */
  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    heroSection.style.setProperty("--hero-mouse-x", `${x}px`);
    heroSection.style.setProperty("--hero-mouse-y", `${y}px`);
  });

  function trackCardGlow(card) {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  }

  // Bind existing cards
  document.querySelectorAll(".skill-card").forEach(trackCardGlow);

  /* ─────────────────────────────────────────
     4. 3D CARD TILT EFFECT
     ───────────────────────────────────────── */
  const MAX_TILT = 8;

  function attachCardTilt(card) {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const w = rect.width;
      const h = rect.height;

      const dx = x / w - 0.5;
      const dy = y / h - 0.5;

      const rotateX = (-dy * MAX_TILT).toFixed(2);
      const rotateY = (dx * MAX_TILT).toFixed(2);

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  }

  // Bind existing cards
  document.querySelectorAll(".skill-card").forEach(attachCardTilt);

  /* ─────────────────────────────────────────
     5. DYNAMIC MUTATION OBSERVER FOR DYNAMIC CARDS
     ───────────────────────────────────────── */
  const observerTarget = document.body;
  const config = { childList: true, subtree: true };
  const mutationObserver = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (
              node.classList.contains("project-card") ||
              node.classList.contains("oss-card")
            ) {
              trackCardGlow(node);
              attachCardTilt(node);
            } else {
              node
                .querySelectorAll(".project-card, .oss-card")
                .forEach((card) => {
                  trackCardGlow(card);
                  attachCardTilt(card);
                });
            }
          }
        });
      }
    }
  });
  mutationObserver.observe(observerTarget, config);

  /* ─────────────────────────────────────────
     6. MAGNETIC BUTTONS
     ───────────────────────────────────────── */
  function attachMagneticEffect(btn) {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const btnX = rect.left + rect.width / 2;
      const btnY = rect.top + rect.height / 2;

      const dx = e.clientX - btnX;
      const dy = e.clientY - btnY;

      const pullX = dx * 0.32;
      const pullY = dy * 0.32;

      btn.style.transform = `translate(${pullX}px, ${pullY}px) scale(1.02)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  }

  document.querySelectorAll(".btn").forEach(attachMagneticEffect);
})();
