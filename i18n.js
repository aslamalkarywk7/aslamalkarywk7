/**
 * i18n.js — Bilingual support (English / Arabic) for the portfolio
 * Approach: data-i18n attributes on elements, swapped by JS
 */

const translations = {
    en: {
        // ── Navigation ──────────────────────────────────────────
        "nav.about":    "About",
        "nav.skills":   "Skills",
        "nav.certificates": "Certificates",
        "nav.services": "Services",
        "nav.projects": "Projects",
        "nav.contact":  "Contact",
        "nav.logoAria": "Home — Islam Al-Nasher aslamalkarywk7",

        // ── Name / metadata / image alt ───────────────────────────
        "name":                "Islam Al-Nasher",
        "footer.identity":     "Islam Al-Nasher — Developer",
        "footer.identityAria": "Islam Al-Nasher — Developer — identity badge",
        "hero.imageAlt":       "Islam Al-Nasher — Web Developer",
        "footer.imageAlt":     "Islam Al-Nasher — Web & Game Developer",
        "github.chartAlt":     "Islam Al-Nasher's GitHub Contribution Chart",
        "github.streakAlt":    "Islam Al-Nasher's GitHub Streak Stats",
        "github.activityAlt":  "Islam Al-Nasher's GitHub Activity Graph",
        "contact.namePlaceholder": "Islam Al-Nasher",
        "meta.title":          "Islam Al-Nasher — Full-Stack Developer (Next.js/TS/Prisma)",
        "meta.description":    "Islam Al-Nasher — Full-Stack Developer (Next.js/TS/Prisma) from Egypt. I build websites & web apps, with AI integration and site hardening as supporting skills.",
        "meta.author":         "Islam Al-Nasher",
        "meta.ogTitle":        "Islam Al-Nasher - Full-Stack Developer (Next.js/TS/Prisma)",
        "meta.ogDescription":  "Full-Stack Developer from Egypt. I build websites & web apps, with AI integration and site hardening as supporting skills.",
        "meta.twitterTitle":   "Islam Al-Nasher - Full-Stack Developer (Next.js/TS/Prisma)",
        "meta.twitterDescription": "Full-Stack Developer from Egypt. Websites & web apps, AI integration, site hardening.",
        "meta.keywords":       "Islam Al-Nasher, Web Developer, Next.js, TypeScript, Prisma, Portfolio, Egypt, مطور ويب, برمجيات",
        "meta.copyright":      "© 2026 Islam Al-Nasher. All rights reserved.",

        // ── Hero ─────────────────────────────────────────────────
        "hero.greeting":  "Hi, I'm",
        "hero.headline":  "Full-Stack Developer (Next.js/TS/Prisma) from Egypt",
        "hero.desc":      "I build websites and web applications end to end — from databases and APIs to polished interfaces — with a focus on AI integration and site hardening.",
        "hero.cta1":      "Explore My Projects",
        "hero.cta2":      "Let's Talk",
        "hero.watchIntro": "Watch intro",
        "hero.playAria":  "Watch intro — watch the introduction video",
        "video.title":    "Introduction — Islam Al-Nasher",
        "video.hint":     "2:09 · English subtitles burned in",
        "video.close":    "Close video",

        // ── Selected work ─────────────────────────────────────────────
        "work.title":    "Selected Work",
        "work.subtitle": "Four projects that show how I think — the problem, what I built, and the result.",
        "work.link":     "View project ↗",
        "work.c1.tag":   "LANGUAGE ENGINE",
        "work.c1.title": "Yakout",
        "work.c1.body":  "Arabic speakers couldn't write code in their own language. I built a Lua-based interpreter with Arabic keywords, variables and a localised standard library.",
        "work.c1.metric":"C · open source · 1★",
        "work.c2.tag":   "SAAS PLATFORM",
        "work.c2.title": "OpsDesk",
        "work.c2.body":  "Teams juggle roles, permissions and audit trails across tools. I built one Next.js 14 + Prisma platform with role-aware dashboards, team management and audit logs.",
        "work.c2.metric":"Next.js · Prisma · RBAC",
        "work.c3.tag":   "COMPRESSION",
        "work.c3.title": "TurboQuant",
        "work.c3.body":  "Files need to shrink without losing a single byte. I built a lossless compressor with a web console that verifies every round-trip is identical.",
        "work.c3.metric":"Python · web console · 1★",
        "work.c4.tag":   "ARABIC AI",
        "work.c4.title": "MasryGPT",
        "work.c4.body":  "General models miss the nuances of Egyptian Arabic. I trained a 1.5B chat model and adapter on Arabic datasets so the dialect is treated as a first-class language.",
        "work.c4.metric":"579 downloads · 4 datasets",

        // ── About ─────────────────────────────────────────────────
        "about.title":    "About Me",
        "about.p1":       "I'm <strong>Islam Al-Nasher</strong> (اسلام النشار), a <strong>Full-Stack Developer (Next.js/TS/Prisma)</strong> from Egypt — I build websites & web apps, with AI integration and site hardening as supporting skills.",
        "about.p2":       "Full-Stack Web Developer <strong>2023 - Present (3 years)</strong>: <strong>business sites, stores, and custom web apps</strong> — plus Arabic-first AI and website hardening. Open to full-time roles & freelance projects. MIS undergraduate, expected 2029.",
        "about.p3":       "My focus is <strong>full-stack web development</strong> and <strong>practical AI integration</strong>. Game dev, mobile and extra languages are side interests — the work I take on is web products built to last.",
        "about.stat1":    "Years Old",
        "about.stat2":    "Languages",
        "about.stat3":    "Technologies",
        "about.stat4":    "Curiosity",

        // ── GitHub Activity ─────────────────────────────────────
        "github.heading": "GitHub Contribution Ecosystem",
        "github.sub":     "A live snapshot of my public activity and coding stats.",
        "github.trophies":"Collaboration & Badges",

        // ── Profiles & Datasets ─────────────────────────────────
        "profiles.title":    "Profiles & Datasets",
        "profiles.subtitle": "My AI work on Hugging Face — Arabic-first models and datasets, loaded live from the source.",

        // ── Open Source Impact ──────────────────────────────────
        "oss.title":    "Open Source Impact",
        "oss.subtitle": "Real pull requests fetched live from the GitHub API — every card links directly to the actual contribution.",

        // ── Skills ──────────────────────────────────────────────
        "skills.title":    "Tech Stack",
        "skills.subtitle": "Production web stack first. Everything else is clearly marked as explored — my focus is shipping reliable products.",
        "skills.tab1":     "Languages",
        "skills.tabFrontend": "Frontend",
        "skills.tabBackend": "Backend",
        "skills.tabDatabases": "Databases",
        "skills.tabGame": "Game • Unity",
        "skills.tab2":     "Web & Backend",
        "skills.tab3":     "AI & DevOps",
        "skills.tab4":     "Design & Tools",
        "skills.tabEditors": "Code Editors",

        // ── Certificates ─────────────────────────────────────────
        "certs.showAll":     "View all {n} certificates",
        "certs.showLess":    "Show fewer certificates",
        "certs.title":       "Certificates",
        "certs.subtitle":    "Verified certificates from universities and training providers — open any card to view the full document.",
        "certs.filter.all":       "All",
        "certs.filter.fullstack": "Full-Stack",
        "certs.filter.ai":        "AI & Machine Learning",
        "certs.filter.data":      "Data & Analytics",
        "certs.filter.english":   "English",
        "certs.cat.fullstack": "Full-Stack",
        "certs.cat.ai":      "AI & ML",
        "certs.cat.data":    "Data & Analytics",
        "certs.cat.english": "English",
        "certs.verify":  "Verify",
        "certs.pdf":     "PDF",
        "certs.open":    "Open",
        "certs.close":   "Close",
        "certs.prev":    "Previous",
        "certs.next":    "Next",
        "certs.empty":   "No certificates in this category yet.",

        // ── Services ────────────────────────────────────────────
        "services.eyebrow": "WHAT I CAN DO FOR YOU",
        "services.title":   "Full-Stack Services",
        "services.subtitle":"Practical help with clear scope and real deliverables.",
        "services.s1title": "Business websites, portfolios & stores",
        "services.s1desc":  "React / Next.js / Node.js — the stack I use every day.",
        "services.s2title": "Arabic-first AI for your site",
        "services.s2desc":  "Chat assistants, content and translation — built for real users, not experiments.",
        "services.s3title": "Website hardening & protection",
        "services.s3desc":  "Audits, fixes and monitoring against common attacks — I harden the products I build.",
        "services.s4title": "Linux & Deploy",
        "services.s4desc":  "Bash, Docker, GitHub Actions CI, Nginx / Vercel — from code to live product.",
        "services.s4link":  "Open-source work on GitHub ↗",

        // ── Projects ────────────────────────────────────────────
        "projects.title":    "Projects",
        "projects.subtitle": "Pulled live from my GitHub — always up to date.",
        "projects.loadmore": "Load More Projects",

        // ── Contact / Footer ─────────────────────────────────────
        "contact.title":       "Get In Touch",
        "contact.subtitle":    "Open to full-time Full-Stack roles, collaborations, and freelance projects — let's build something great together.",
        "contact.email.label": "Drop an Email",
        "contact.email.aria":  "Drop an Email aslamalkarywka@gmail.com — send email to Islam Al-Nasher",
        "contact.socials":     "Social Hubs",
        "contact.soon":        "Coming Soon",
        "contact.form.name":   "Name",
        "contact.form.email":  "Email",
        "contact.form.msg":    "Message",
        "contact.form.btn":    "Send Message",
        "contact.success":     "Opening your email app — message addressed to me, just press send!",
        "footer.rights":       "Islam Al-Nasher. All rights reserved.",

        // ── Lang button ─────────────────────────────────────────
        "lang.btn": "عربي",
        "lang.aria": "Switch language — عربي",
    },

    ar: {
        // ── Navigation ──────────────────────────────────────────
        "nav.about":    "عني",
        "nav.skills":   "المهارات",
        "nav.certificates": "الشهادات",
        "nav.services": "الخدمات",
        "nav.projects": "المشاريع",
        "nav.contact":  "تواصل",
        "nav.logoAria": "الرئيسية — اسلام النشار aslamalkarywk7",

        // ── Name / metadata / image alt ───────────────────────────
        "name":                "اسلام النشار",
        "footer.identity":     "اسلام النشار — مطوّر",
        "footer.identityAria": "اسلام النشار — مطوّر — شارة الهوية",
        "hero.imageAlt":       "اسلام النشار — مطور ويب",
        "footer.imageAlt":     "اسلام النشار — مطور ويب وألعاب",
        "github.chartAlt":     "مخطط مساهمات اسلام النشار على GitHub",
        "github.streakAlt":    "إحصائيات سلسلة المساهمات لاسلام النشار على GitHub",
        "github.activityAlt":  "رسم نشاط اسلام النشار على GitHub",
        "contact.namePlaceholder": "اسلام النشار",
        "meta.title":          "اسلام النشار — مطور Full-Stack (Next.js/TS/Prisma)",
        "meta.description":    "اسلام النشار — مطور Full-Stack (Next.js/TS/Prisma) من مصر. أبني مواقع وتطبيقات ويب، مع تكامل الذكاء الاصطناعي وتقوية الحماية كمهارات مساندة.",
        "meta.author":         "اسلام النشار",
        "meta.ogTitle":        "اسلام النشار — مطور Full-Stack (Next.js/TS/Prisma)",
        "meta.ogDescription":  "مطور Full-Stack من مصر. أبني مواقع وتطبيقات ويب، مع تكامل الذكاء الاصطناعي وتقوية الحماية.",
        "meta.twitterTitle":   "اسلام النشار — مطور Full-Stack (Next.js/TS/Prisma)",
        "meta.twitterDescription": "مطور Full-Stack من مصر. مواقع وتطبيقات ويب، ذكاء اصطناعي، وتقوية حماية.",
        "meta.keywords":       "اسلام النشار, مطور ويب, Next.js, TypeScript, Prisma, بورتفوليو, مصر, برمجيات",
        "meta.copyright":      "© 2026 اسلام النشار. جميع الحقوق محفوظة.",

        // ── Hero ─────────────────────────────────────────────────
        "hero.greeting":  "مرحباً، أنا",
        "hero.headline":  "مطوّر Full-Stack (Next.js/TS/Prisma) من مصر",
        "hero.desc":      "أبني مواقع وتطبيقات ويب من الألف للياء — من قواعد بيانات وAPIs لواجهات مصقولة — مع تركيز على تكامل AI وتقوية حماية المواقع.",
        "hero.cta1":      "استعرض مشاريعي",
        "hero.cta2":      "لنتحدث",
        "hero.watchIntro": "شاهد التعريف",
        "hero.playAria":  "شاهد التعريف — فيديو التعريف",
        "video.title":    "فيديو التعريف — اسلام النشار",
        "video.hint":     "2:09 · ترجمة إنجليزية مدمجة",
        "video.close":    "إغلاق الفيديو",

        // ── Selected work ─────────────────────────────────────────────
        "work.title":    "أعمال مختارة",
        "work.subtitle": "أربعة مشاريع بتوري كيف أفكر — المشكلة، اللي بنيته، والنتيجة.",
        "work.link":     "عرض المشروع ↗",
        "work.c1.tag":   "محرك لغة",
        "work.c1.title": "يعقوب",
        "work.c1.body":  "الناطقين بالعربي ما كانوش يقدروا يكتبوا كود بلغتهم. بنيت مفسّر مبني على Lua بكلمات ومتغيرات عربية ومكتبة قياسية معرّبة.",
        "work.c1.metric":"C · مفتوح المصدر · 1★",
        "work.c2.tag":   "منصة SaaS",
        "work.c2.title": "OpsDesk",
        "work.c2.body":  "الفرق بتتشتت بين الصلاحيات والمستخدمين وسجلات التغيير. بنيت منصة واحدة بـ Next.js 14 وPrisma فيها لوحة حسب الدور وإدارة فرق وسجل تدقيق.",
        "work.c2.metric":"Next.js · Prisma · صلاحيات",
        "work.c3.tag":   "ضغط ملفات",
        "work.c3.title": "TurboQuant",
        "work.c3.body":  "الملفات محتاجة تصغر من غير ما نفقد ولا بايت. بنيت ضاغط lossless مع كونسول ويبيأكد إن كل عملية فك مطابقة تماماً للأصل.",
        "work.c3.metric":"Python · كونسول ويب · 1★",
        "work.c4.tag":   "ذكاء اصطناعي عربي",
        "work.c4.title": "MasryGPT",
        "work.c4.body":  "الموديلات العامة بيفوّتوا تفاصيل المصرية. درّبت موديل محادثة 1.5B ومحول على بيانات عربية عشان اللهجة تبقى لغة أساسية مش استثناء.",
        "work.c4.metric":"579 تحميل · 4 داتاسيتس",

        // ── About ─────────────────────────────────────────────────
        "about.title":    "عنّي",
        "about.p1":       "أنا <strong>اسلام النشار</strong>، <strong>مطوّر Full-Stack (Next.js/TS/Prisma)</strong> من مصر — أبني مواقع وتطبيقات ويب، مع تكامل AI وتقوية الحماية كمهارات مساندة.",
        "about.p2":       "مطور Full-Stack <strong>2023 - الحاضر (3 سنوات)</strong>: <strong>مواقع شركات ومتاجر وتطبيقات مخصصة</strong> — مع AI عربي أولاً وتقوية المواقع. متاح للوظائف بدوام كامل والمشاريع الحرة. طالب في نظم المعلومات الإدارية، من المتوقع التخرج سنة 2029.",
        "about.p3":       "تركيزي على <strong>تطوير الويب الشامل</strong> و<strong>تكامل AI عملي</strong>. تطوير الألعاب والموبايل واللغات الإضافية اهتمامات جانبية — والخدمات اللي أقدّمها هي منتجات ويب تُبنى لتدوم.",
        "about.stat1":    "سنة عمر",
        "about.stat2":    "لغات برمجية",
        "about.stat3":    "تقنيات",
        "about.stat4":    "فضول لا حدود له",

        // ── GitHub Activity ─────────────────────────────────────
        "github.heading": "نشاط GitHub",
        "github.sub":     "لقطة مباشرة من نشاطي العام وإحصاءات الكود.",
        "github.trophies":"التعاون والإنجازات",

        // ── Profiles & Datasets ─────────────────────────────────
        "profiles.title":    "الملفات الشخصية ومجموعات البيانات",
        "profiles.subtitle": "أعمالي في الذكاء الاصطناعي على Hugging Face — موديلات وداتاسيتس عربية أولاً، مجلوبة مباشرة من المصدر.",

        // ── Open Source Impact ──────────────────────────────────
        "oss.title":    "أثري في المصادر المفتوحة",
        "oss.subtitle": "طلبات سحب حقيقية مجلوبة مباشرة من GitHub API — كل بطاقة تربط بالمساهمة الفعلية.",

        // ── Skills ──────────────────────────────────────────────
        "skills.title":    "مجموعة التقنيات",
        "skills.subtitle": "الويب الإنتاجي أولاً. أي تقنيات تانية متصنّفة كـ «مستكشفة» — تركيزي على تسليم منتجات موثوقة.",
        "skills.tab1":     "اللغات",
        "skills.tabFrontend": "واجهة أمامية",
        "skills.tabBackend": "خلفية",
        "skills.tabDatabases": "قواعد بيانات",
        "skills.tabGame": "ألعاب • يونتي",
        "skills.tab2":     "الويب والخوادم",
        "skills.tab3":     "AI وDevOps",
        "skills.tab4":     "التصميم والأدوات",
        "skills.tabEditors": "محررات الكود",

        // ── Certificates ─────────────────────────────────────────
        "certs.showAll":     "عرض كل الشهادات ({n})",
        "certs.showLess":    "عرض أقل",
        "certs.title":       "الشهادات",
        "certs.subtitle":    "شهادات موثّقة من جامعات ومزوّدي تدريب — اضغط أي بطاقة لعرض المستند كاملًا.",
        "certs.filter.all":       "الكل",
        "certs.filter.fullstack": "Full-Stack",
        "certs.filter.ai":        "الذكاء الاصطناعي وتعلّم الآلة",
        "certs.filter.data":      "البيانات والتحليلات",
        "certs.filter.english":   "اللغة الإنجليزية",
        "certs.cat.fullstack": "Full-Stack",
        "certs.cat.ai":      "ذكاء اصطناعي",
        "certs.cat.data":    "بيانات وتحليلات",
        "certs.cat.english": "إنجليزي",
        "certs.verify":  "تحقّق",
        "certs.pdf":     "PDF",
        "certs.open":    "فتح",
        "certs.close":   "إغلاق",
        "certs.prev":    "السابق",
        "certs.next":    "التالي",
        "certs.empty":   "لا توجد شهادات في هذا التصنيف بعد.",

        // ── Services ────────────────────────────────────────────
        "services.eyebrow": "ما الذي أستطيع فعله من أجلك",
        "services.title":   "خدمات تطوير الويب الشامل",
        "services.subtitle":"مساعدة عملية بنطاق واضح ومخرجات حقيقية يمكنك الاعتماد عليها.",
        "services.s1title": "مواقع شركات ومعارض أعمال ومتاجر إلكترونية",
        "services.s1desc":  "React / Next.js / Node.js — نفس التقنيات اللي بستخدمها كل يوم.",
        "services.s2title": "ذكاء اصطناعي عربي أولاً لموقعك",
        "services.s2desc":  "مساعدات محادثة ومحتوى وترجمة — مبنية لمستخدمين حقيقيين، مش تجارب معملية.",
        "services.s3title": "تقوية حماية المواقع وتأمينها",
        "services.s3desc":  "فحص وإصلاح ومراقبة ضد الهجمات الشائعة — بُقوّي حماية المنتجات اللي أبنيها.",
        "services.s4title": "لينكس ونشر المواقع",
        "services.s4desc":  "Bash وDocker وGitHub Actions CI وNginx / Vercel — من الكود لمنتج شغّال على الإنترنت.",
        "services.s4link":  "أعمال مفتوحة المصدر على GitHub ↗",

        // ── Projects ────────────────────────────────────────────
        "projects.title":    "المشاريع",
        "projects.subtitle": "مجلوبة مباشرة من GitHub — دائمًا محدّثة.",
        "projects.loadmore": "تحميل المزيد",

        // ── Contact / Footer ─────────────────────────────────────
        "contact.title":       "تواصل معي",
        "contact.subtitle":    "مفتوح لوظائف Full-Stack بدوام كامل، والتعاون، والمشاريع الحرة — لنبني شيئًا رائعًا معًا.",
        "contact.email.label": "أرسل بريدًا إلكترونيًا",
        "contact.email.aria":  "أرسل بريدًا إلكترونيًا aslamalkarywka@gmail.com — إرسال بريد إلى اسلام النشار",
        "contact.socials":     "مراكز التواصل الاجتماعي",
        "contact.soon":        "قريبًا",
        "contact.form.name":   "الاسم",
        "contact.form.email":  "البريد الإلكتروني",
        "contact.form.msg":    "الرسالة",
        "contact.form.btn":    "إرسال الرسالة",
        "contact.success":     "جاري فتح تطبيق البريد — الرسالة موجهة إليّ، اضغط إرسال!",
        "footer.rights":       "اسلام النشار. جميع الحقوق محفوظة.",

        // ── Lang button ─────────────────────────────────────────
        "lang.btn": "English",
        "lang.aria": "تغيير اللغة — English",
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

    // ARIA labels — keep accessible names in sync with the visible text
    document.querySelectorAll("[data-i18n-aria-label]").forEach(el => {
        const key = el.getAttribute("data-i18n-aria-label");
        if (t[key]) el.setAttribute("aria-label", t[key]);
    });

    // Image alt text (never leave the English name in the Arabic version)
    document.querySelectorAll("[data-i18n-alt]").forEach(el => {
        const key = el.getAttribute("data-i18n-alt");
        if (t[key]) el.alt = t[key];
    });

    // Metadata (title / description / social tags)
    document.querySelectorAll("[data-i18n-content]").forEach(el => {
        const key = el.getAttribute("data-i18n-content");
        if (t[key]) el.setAttribute("content", t[key]);
    });
    if (t["meta.title"]) document.title = t["meta.title"];

    // Hero description is plain copy now — age belongs in the About section.
    const heroDescEl = document.getElementById("hero-desc-text");
    if (heroDescEl && t["hero.desc"]) heroDescEl.textContent = t["hero.desc"];

    // Direction + lang attribute
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    // Persist
    currentLang = lang;
    localStorage.setItem("portfolio-lang", lang);

    // Notify listeners (e.g. the certificates grid, which re-renders on switch)
    document.dispatchEvent(
        new CustomEvent("portfolio:langchange", { detail: { lang: lang } })
    );
}

/* ── Public API ──────────────────────────────────────────────────────────────
   Lets other scripts read the active language / a single key without
   reaching into this module's internals.
   ─────────────────────────────────────────────────────────────────────────── */
window.portfolioI18n = {
    get lang() {
        return currentLang;
    },
    t(key) {
        const dict = translations[currentLang];
        return dict && dict[key] ? dict[key] : null;
    },
};

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
