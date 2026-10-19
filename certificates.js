/* ═══════════════════════════════════════════
   CERTIFICATES — catalogue, grid, filters, lightbox
   Islam Al-Nashar Portfolio
   ---------------------------------------------------------------
   The catalogue below is the single source of truth for every
   certificate shown in the #certificates section. Files live in
   /certificates and are named <provider>-<topic>.png
   ═══════════════════════════════════════════ */

import { CERTIFICATES as CERTIFICATE_LIST } from "./data/certificates.mjs";

(function () {
  "use strict";

  /* ─────────────────────────────────────────
     1. CATALOGUE
     cat   → one of: fullstack | ai | data | english
     img   → preview image inside /certificates
     pdf   → original document (optional)
     verify → public verification link (optional)
     ───────────────────────────────────────── */
  const CERTIFICATES = CERTIFICATE_LIST;

  /* ─────────────────────────────────────────
     2. STATE + HELPERS
     ───────────────────────────────────────── */
  const grid = document.getElementById("certs-grid");
  const filterBar = document.querySelector(".certs__filters");

  let activeFilter = "all";
  let visibleItems = [];
  let lightboxIndex = -1;
  let lastFocused = null;

  function t(key) {
    const api = window.portfolioI18n;
    return (api && api.t(key)) || "";
  }

  function currentLang() {
    const api = window.portfolioI18n;
    return (api && api.lang) || "en";
  }

  function pick(item) {
    const lang = currentLang();
    return item[lang] || item.en;
  }

  /* Grid uses the small WebP preview, the lightbox the full-size PNG. */
  function thumbPath(item) {
    return "certificates/thumbs/" + item.file.replace(/\.png$/, ".webp");
  }

  function fullPath(item) {
    return "certificates/" + item.file;
  }

  function filtered() {
    return activeFilter === "all"
      ? CERTIFICATES.slice()
      : CERTIFICATES.filter((c) => c.cat === activeFilter);
  }

  /* ─────────────────────────────────────────
     3. RENDER
     ───────────────────────────────────────── */
  function buildCard(item, index) {
    const copy = pick(item);

    const card = document.createElement("article");
    card.className = "cert-card";
    card.dataset.cat = item.cat;

    /* preview → opens the lightbox */
    const media = document.createElement("button");
    media.type = "button";
    media.className = "cert-card__media";
    media.setAttribute("aria-label", t("certs.open") + " — " + copy.title);

    const img = document.createElement("img");
    img.className = "cert-card__img";
    img.src = thumbPath(item);
    img.alt = copy.title;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = item.w;
    img.height = item.h;
    media.appendChild(img);

    media.addEventListener("click", () => openLightbox(index));

    /* body */
    const body = document.createElement("div");
    body.className = "cert-card__body";
    const title = document.createElement("h3");
    title.className = "cert-card__title";
    title.textContent = copy.title;
    const note = document.createElement("p");
    note.className = "cert-card__note";
    note.textContent = copy.note;
    body.appendChild(title);
    body.appendChild(note);

    /* meta + links */
    const meta = document.createElement("div");
    meta.className = "cert-card__meta";

    const tag = document.createElement("span");
    tag.className = "cert-card__tag";
    tag.textContent = t("certs.cat." + item.cat);
    meta.appendChild(tag);

    const links = document.createElement("span");
    links.className = "cert-card__links";

    if (item.pdf) {
      const pdf = document.createElement("a");
      pdf.className = "cert-card__link";
      pdf.href = item.pdf;
      pdf.target = "_blank";
      pdf.rel = "noopener noreferrer";
      pdf.textContent = t("certs.pdf");
      links.appendChild(pdf);
    }

    if (item.verify) {
      const verify = document.createElement("a");
      verify.className = "cert-card__link";
      verify.href = item.verify;
      verify.target = "_blank";
      verify.rel = "noopener noreferrer";
      verify.textContent = t("certs.verify") + " ↗";
      links.appendChild(verify);
    }

    meta.appendChild(links);
    card.appendChild(media);
    card.appendChild(body);
    card.appendChild(meta);
    return card;
  }

  function render() {
    if (!grid) return;
    visibleItems = filtered();
    grid.innerHTML = "";

    if (visibleItems.length === 0) {
      const empty = document.createElement("p");
      empty.className = "certs__empty";
      empty.textContent = t("certs.empty");
      grid.appendChild(empty);
      return;
    }

    visibleItems.forEach((item, i) => {
      const card = buildCard(item, i);
      card.style.setProperty("--card-delay", i * 40 + "ms");
      card.classList.add("card--enter");
      grid.appendChild(card);
      requestAnimationFrame(() => card.classList.add("card--visible"));
    });
  }

  /* ─────────────────────────────────────────
     4. FILTERS
     ───────────────────────────────────────── */
  function setFilter(id) {
    activeFilter = id;
    if (filterBar) {
      filterBar.querySelectorAll(".certs__filter").forEach((btn) => {
        const on = btn.dataset.filter === id;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-selected", on ? "true" : "false");
      });
    }
    render();
  }

  function initFilters() {
    if (!filterBar) return;
    filterBar.querySelectorAll(".certs__filter").forEach((btn) => {
      btn.addEventListener("click", () => setFilter(btn.dataset.filter));
    });
  }

  /* ─────────────────────────────────────────
     5. LIGHTBOX
     ───────────────────────────────────────── */
  let lb = null;

  function buildLightbox() {
    const root = document.createElement("div");
    root.className = "cert-lightbox";
    root.id = "cert-lightbox";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.hidden = true;

    const backdrop = document.createElement("div");
    backdrop.className = "cert-lightbox__backdrop";

    const close = document.createElement("button");
    close.type = "button";
    close.className = "cert-lightbox__close";
    close.setAttribute("aria-label", t("certs.close"));
    close.innerHTML = "&times;";

    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "cert-lightbox__nav cert-lightbox__nav--prev";
    prev.setAttribute("aria-label", t("certs.prev"));
    prev.innerHTML = "&#8249;";

    const next = document.createElement("button");
    next.type = "button";
    next.className = "cert-lightbox__nav cert-lightbox__nav--next";
    next.setAttribute("aria-label", t("certs.next"));
    next.innerHTML = "&#8250;";

    const figure = document.createElement("figure");
    figure.className = "cert-lightbox__figure";
    const img = document.createElement("img");
    img.className = "cert-lightbox__img";
    img.alt = "";
    const caption = document.createElement("figcaption");
    caption.className = "cert-lightbox__caption";
    const capTitle = document.createElement("h3");
    capTitle.className = "cert-lightbox__title";
    const capNote = document.createElement("p");
    capNote.className = "cert-lightbox__note";
    const capLinks = document.createElement("div");
    capLinks.className = "cert-lightbox__links";
    caption.appendChild(capTitle);
    caption.appendChild(capNote);
    caption.appendChild(capLinks);
    figure.appendChild(img);
    figure.appendChild(caption);

    root.appendChild(backdrop);
    root.appendChild(prev);
    root.appendChild(next);
    root.appendChild(close);
    root.appendChild(figure);
    document.body.appendChild(root);

    close.addEventListener("click", closeLightbox);
    backdrop.addEventListener("click", closeLightbox);
    prev.addEventListener("click", () => stepLightbox(-1));
    next.addEventListener("click", () => stepLightbox(1));

    return {
      root: root,
      img: img,
      title: capTitle,
      note: capNote,
      links: capLinks,
    };
  }

  function paintLightbox() {
    if (!lb || lightboxIndex < 0) return;
    const item = visibleItems[lightboxIndex];
    if (!item) return;
    const copy = pick(item);

    lb.img.src = fullPath(item);
    lb.img.alt = copy.title;
    lb.title.textContent = copy.title;
    lb.note.textContent = copy.note;
    lb.links.innerHTML = "";

    if (item.pdf) {
      const pdf = document.createElement("a");
      pdf.className = "cert-card__link";
      pdf.href = item.pdf;
      pdf.target = "_blank";
      pdf.rel = "noopener noreferrer";
      pdf.textContent = t("certs.pdf");
      lb.links.appendChild(pdf);
    }
    if (item.verify) {
      const verify = document.createElement("a");
      verify.className = "cert-card__link";
      verify.href = item.verify;
      verify.target = "_blank";
      verify.rel = "noopener noreferrer";
      verify.textContent = t("certs.verify") + " ↗";
      lb.links.appendChild(verify);
    }
  }

  function openLightbox(index) {
    if (!lb) lb = buildLightbox();
    lightboxIndex = index;
    lastFocused = document.activeElement;
    paintLightbox();
    lb.root.hidden = false;
    document.body.style.overflow = "hidden";
    const closeBtn = lb.root.querySelector(".cert-lightbox__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!lb || lb.root.hidden) return;
    lb.root.hidden = true;
    document.body.style.overflow = "";
    lightboxIndex = -1;
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function stepLightbox(step) {
    if (lightboxIndex < 0 || visibleItems.length === 0) return;
    lightboxIndex =
      (lightboxIndex + step + visibleItems.length) % visibleItems.length;
    paintLightbox();
  }

  function onKeydown(e) {
    if (!lb || lb.root.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") stepLightbox(-1);
    else if (e.key === "ArrowRight") stepLightbox(1);
  }

  /* ─────────────────────────────────────────
     6. INIT
     ───────────────────────────────────────── */
  document.addEventListener("keydown", onKeydown);
  document.addEventListener("portfolio:langchange", () => {
    if (lb) {
      const btn = lb.root.querySelector(".cert-lightbox__close");
      if (btn) btn.setAttribute("aria-label", t("certs.close"));
      const prev = lb.root.querySelector(".cert-lightbox__nav--prev");
      const next = lb.root.querySelector(".cert-lightbox__nav--next");
      if (prev) prev.setAttribute("aria-label", t("certs.prev"));
      if (next) next.setAttribute("aria-label", t("certs.next"));
    }
    if (lightboxIndex >= 0) paintLightbox();
    render();
  });

  document.addEventListener("DOMContentLoaded", () => {
    initFilters();
    render();
  });
})();
