/**
 * i18n.js — Bilingual support (English / Arabic) for the portfolio
 * Approach: data-i18n attributes on elements, swapped by JS
 */

const translations = {
    en: {
        // ── Navigation ──────────────────────────────────────────
        "nav.about":    "About",
        "nav.skills":   "Skills",
        "nav.projects": "Projects",
        "nav.contact":  "Contact",

        // ── Hero ─────────────────────────────────────────────────
        "hero.greeting":  "Hi, I'm",
        "hero.headline":  "Web Developer (Next.js/TS/Prisma) from Egypt",
        "hero.desc":      "-year-old Web Developer from Egypt — I build websites & web apps, with AI integration and site hardening as supporting skills.",
        "hero.cta1":      "Explore My Projects",
        "hero.cta2":      "Let's Talk",

        // ── About ─────────────────────────────────────────────────
        "about.title":    "About Me",
        "about.p1":       "I'm <strong>Islam El-Nashar</strong> (إسلام النشار), a <strong>Web Developer (Next.js/TS/Prisma)</strong> from Egypt — I build websites & web apps, with AI integration and site hardening as supporting skills.",
        "about.p2":       "Freelance Web Developer <strong>2023 - Present (3 years)</strong>: <strong>business sites, stores, and custom web apps</strong> — plus Arabic-first AI and website hardening.",
        "about.p3":       "Focused on <strong>full-stack web</strong> and <strong>AI integration</strong>. Game dev, mobile/desktop and long language lists are curiosity only — see docs for honest scope.",
        "about.cv":       "View CV",
        "about.stat1":    "Years Old",
        "about.stat2":    "Languages",
        "about.stat3":    "Technologies",
        "about.stat4":    "Curiosity",

        // ── GitHub Activity ─────────────────────────────────────
        "github.heading": "GitHub Contribution Ecosystem",
        "github.sub":     "A live snapshot of my public activity and coding stats.",
        "github.trophies":"Collaboration & Badges",

        // ── Open Source Impact ──────────────────────────────────
        "oss.title":    "Open Source Impact",
        "oss.subtitle": "Real pull requests fetched live from the GitHub API — every card links directly to the actual contribution.",

        // ── Skills ──────────────────────────────────────────────
        "skills.title":    "Tech Stack",
        "skills.subtitle": "Production web stack first. Explored tech is Familiar — full map in docs.",
        "skills.tab1":     "Languages",
        "skills.tabFrontend": "Frontend",
        "skills.tabBackend": "Backend",
        "skills.tabDatabases": "Databases",
        "skills.tabGame": "Game • Unity",
        "skills.tab2":     "Web & Backend",
        "skills.tab3":     "AI & DevOps",
        "skills.tab4":     "Design & Tools",

        // ── Projects ────────────────────────────────────────────
        "projects.title":    "Projects",
        "projects.subtitle": "Pulled live from my GitHub — always up to date.",
        "projects.loadmore": "Load More Projects",

        // ── Contact / Footer ─────────────────────────────────────
        "contact.title":       "Get In Touch",
        "contact.subtitle":    "Open to collaborations, freelance projects, and interesting conversations — let's build something great together.",
        "contact.email.label": "Drop an Email",
        "contact.socials":     "Social Hubs",
        "contact.soon":        "Coming Soon",
        "contact.form.name":   "Name",
        "contact.form.email":  "Email",
        "contact.form.msg":    "Message",
        "contact.form.btn":    "Send Message",
        "contact.success":     "Message received — I'll get back to you very soon!",
        "footer.rights":       "Islam El-Nashar. All rights reserved.",

        // ── Lang button ─────────────────────────────────────────
        "lang.btn": "عربي",
    },

    ar: {
        // ── Navigation ──────────────────────────────────────────
        "nav.about":    "عني",
        "nav.skills":   "المهارات",
        "nav.projects": "المشاريع",
        "nav.contact":  "تواصل",

        // ── Hero ─────────────────────────────────────────────────
        "hero.greeting":  "مرحباً، أنا",
        "hero.headline":  "مطوّر ويب (Next.js/TS/Prisma) من مصر",
        "hero.desc":      "-سنة، مطوّر ويب من مصر — أبني مواقع وتطبيقات ويب، مع تكامل AI وتقوية الحماية كمهارات مساندة.",
        "hero.cta1":      "استعرض مشاريعي",
        "hero.cta2":      "لنتحدث",

        // ── About ─────────────────────────────────────────────────
        "about.title":    "عنّي",
        "about.p1":       "أنا <strong>إسلام النشار</strong> (Islam El-Nashar)، <strong>مطوّر ويب (Next.js/TS/Prisma)</strong> من مصر — أبني مواقع وتطبيقات ويب، مع تكامل AI وتقوية الحماية كمهارات مساندة.",
        "about.p2":       "مطور ويب حر <strong>2023 - الحاضر (3 سنوات)</strong>: <strong>مواقع شركات ومتاجر وتطبيقات مخصصة</strong> — مع AI عربي أولاً وتقوية المواقع.",
        "about.p3":       "أركّز على <strong>الويب الشامل</strong> و<strong>تكامل AI</strong>. تطوير الألعاب والموبايل وقوائم اللغات الطويلة فضول فقط — راجع docs للنطاق الصادق.",
        "about.cv":       "عرض السيرة الذاتية",
        "about.stat1":    "سنة عمر",
        "about.stat2":    "لغات برمجية",
        "about.stat3":    "تقنيات",
        "about.stat4":    "فضول لا حدود له",

        // ── GitHub Activity ─────────────────────────────────────
        "github.heading": "نشاط GitHub",
        "github.sub":     "لقطة مباشرة من نشاطي العام وإحصاءات الكود.",
        "github.trophies":"التعاون والإنجازات",

        // ── Open Source Impact ──────────────────────────────────
        "oss.title":    "أثري في المصادر المفتوحة",
        "oss.subtitle": "طلبات سحب حقيقية مجلوبة مباشرة من GitHub API — كل بطاقة تربط بالمساهمة الفعلية.",

        // ── Skills ──────────────────────────────────────────────
        "skills.title":    "مجموعة التقنيات",
        "skills.subtitle": "الويب الإنتاجي أولاً. التقنيات المستكشفة Familiar — الخريطة الكاملة في docs.",
        "skills.tab1":     "اللغات",
        "skills.tabFrontend": "واجهة أمامية",
        "skills.tabBackend": "خلفية",
        "skills.tabDatabases": "قواعد بيانات",
        "skills.tabGame": "ألعاب • يونتي",
        "skills.tab2":     "الويب والخوادم",
        "skills.tab3":     "AI وDevOps",
        "skills.tab4":     "التصميم والأدوات",

        // ── Projects ────────────────────────────────────────────
        "projects.title":    "المشاريع",
        "projects.subtitle": "مجلوبة مباشرة من GitHub — دائمًا محدّثة.",
        "projects.loadmore": "تحميل المزيد",

        // ── Contact / Footer ─────────────────────────────────────
        "contact.title":       "تواصل معي",
        "contact.subtitle":    "مفتوح للتعاون، والمشاريع الحرة، والمحادثات الشيّقة — لنبني شيئًا رائعًا معًا.",
        "contact.email.label": "أرسل بريدًا إلكترونيًا",
        "contact.socials":     "مراكز التواصل الاجتماعي",
        "contact.soon":        "قريبًا",
        "contact.form.name":   "الاسم",
        "contact.form.email":  "البريد الإلكتروني",
        "contact.form.msg":    "الرسالة",
        "contact.form.btn":    "إرسال الرسالة",
        "contact.success":     "تم استلام رسالتك — سأرد عليك قريبًا جدًا!",
        "footer.rights":       "إسلام النشار. جميع الحقوق محفوظة.",

        // ── Lang button ─────────────────────────────────────────
        "lang.btn": "English",
    }
};

// ── State ──────────────────────────────────────────────────────────────────
let currentLang = localStorage.getItem("portfolio-lang") || "en";

// ── Core apply function ────────────────────────────────────────────────────
function applyLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    // Update every element that has data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (!t[key]) return;

        // Elements that allow inner HTML (paragraphs with <strong> etc.)
        if (el.hasAttribute("data-i18n-html")) {
            el.innerHTML = t[key];
        } else {
            el.textContent = t[key];
        }
    });

    // Placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (t[key]) el.placeholder = t[key];
    });

    // Special: hero desc injects age span
    const heroDescEl = document.getElementById("hero-desc-text");
    if (heroDescEl) {
        const ageSpan = document.getElementById("age");
        const ageVal  = ageSpan ? ageSpan.textContent : "19";
        if (lang === "ar") {
            heroDescEl.innerHTML = `<span id="age" class="hero__age" aria-label="العمر الديناميكي">${ageVal}</span>${t["hero.desc"]}`;
        } else {
            heroDescEl.innerHTML = `A <span id="age" class="hero__age" aria-label="Dynamic age">${ageVal}</span>${t["hero.desc"]}`;
        }
    }

    // Direction + lang attribute
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    // Persist
    currentLang = lang;
    localStorage.setItem("portfolio-lang", lang);
}

// ── Toggle ─────────────────────────────────────────────────────────────────
function toggleLanguage() {
    const next = currentLang === "en" ? "ar" : "en";

    // Animate the button
    const btn = document.getElementById("lang-toggle-btn");
    if (btn) {
        btn.classList.add("lang-btn--spinning");
        setTimeout(() => btn.classList.remove("lang-btn--spinning"), 400);
    }

    applyLanguage(next);
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("lang-toggle-btn");
    if (btn) btn.addEventListener("click", toggleLanguage);
    applyLanguage(currentLang);
});
