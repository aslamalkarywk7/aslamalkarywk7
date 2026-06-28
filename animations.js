/* ═══════════════════════════════════════════
   ADVANCED ANIMATIONS SUITE
   Islam El-Nashar Portfolio — All Animations
   ═══════════════════════════════════════════ */

(function () {
  "use strict";

  /* ─────────────────────────────────────────
     1. PARTICLE NETWORK CANVAS ANIMATION
     ───────────────────────────────────────── */
  const heroCanvas = document.getElementById("hero-canvas");
  if (heroCanvas) {
    const ctx = heroCanvas.getContext("2d");
    let particles = [];
    let animationId;
    let mouse = { x: null, y: null, radius: 150 };

    function resizeCanvas() {
      heroCanvas.width = heroCanvas.offsetWidth;
      heroCanvas.height = heroCanvas.offsetHeight;
      initParticles();
    }

    class Particle {
      constructor() {
        this.x = Math.random() * heroCanvas.width;
        this.y = Math.random() * heroCanvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const dirX = dx / distance;
          const dirY = dy / distance;
          this.vx -= dirX * force * 0.2;
          this.vy -= dirY * force * 0.2;
        }

        // Boundaries
        if (this.x < 0 || this.x > heroCanvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > heroCanvas.height) this.vy *= -1;

        // Damping
        this.vx *= 0.99;
        this.vy *= 0.99;
      }

      draw() {
        ctx.fillStyle = "rgba(114, 47, 55, 0.6)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const particleCount = Math.floor((heroCanvas.width * heroCanvas.height) / 15000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.3;
            ctx.strokeStyle = `rgba(114, 47, 55, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      animationId = requestAnimationFrame(animate);
    }

    // Mouse tracking
    window.addEventListener("mousemove", (e) => {
      const rect = heroCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();
    animate();
    window.addEventListener("resize", resizeCanvas);
  }

  /* ─────────────────────────────────────────
     2. TYPEWRITER EFFECT FOR HERO NAME
     ───────────────────────────────────────── */
  const heroName = document.querySelector(".hero__name");
  if (heroName) {
    const originalText = heroName.textContent;
    heroName.textContent = "";
    heroName.style.opacity = "1";

    let index = 0;
    function typeWriter() {
      if (index < originalText.length) {
        heroName.textContent += originalText.charAt(index);
        index++;
        setTimeout(typeWriter, 80);
      }
    }
    setTimeout(typeWriter, 500);
  }

  /* ─────────────────────────────────────────
     3. NUMBER COUNTER ANIMATION
     ───────────────────────────────────────── */
  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    function update() {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        return;
      }
      element.textContent = Math.floor(current);
      requestAnimationFrame(update);
    }
    update();
  }

  const aboutStats = document.querySelectorAll(".about__stat-number");
  if ("IntersectionObserver" in window && aboutStats.length > 0) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const text = entry.target.textContent.trim();
            if (text === "∞") return; // Skip infinity

            const match = text.match(/(\d+)/);
            if (match) {
              const target = parseInt(match[1]);
              animateCounter(entry.target, target);
            }
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    aboutStats.forEach((stat) => statsObserver.observe(stat));
  }

  /* ─────────────────────────────────────────
     4. 3D TILT EFFECT FOR HERO IMAGE
     ───────────────────────────────────────── */
  const heroImage = document.querySelector(".hero__image");
  if (heroImage) {
    const wrapper = heroImage.closest(".hero__image-wrapper");

    wrapper.addEventListener("mousemove", (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      heroImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    wrapper.addEventListener("mouseleave", () => {
      heroImage.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    });

    heroImage.style.transition = "transform 0.1s ease-out";
  }

  /* ─────────────────────────────────────────
     5. STAGGER ANIMATION FOR SKILL CARDS
     ───────────────────────────────────────── */
  const skillCards = document.querySelectorAll(".skill-card");
  if ("IntersectionObserver" in window && skillCards.length > 0) {
    skillCards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
    });

    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.transition = "opacity 0.6s ease, transform 0.6s ease";
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
            }, index * 50);
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    skillCards.forEach((card) => skillObserver.observe(card));
  }

  /* ─────────────────────────────────────────
     6. MAGNETIC EFFECT FOR PROJECT CARDS
     ───────────────────────────────────────── */
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) / 25;
      const deltaY = (y - centerY) / 25;

      card.style.transform = `translate(${deltaX}px, ${deltaY}px) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* ─────────────────────────────────────────
     7. SCROLL PROGRESS BAR
     ───────────────────────────────────────── */
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.appendChild(progressBar);

  function updateScrollProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
    progressBar.style.width = `${scrollPercentage}%`;
  }

  window.addEventListener("scroll", updateScrollProgress, { passive: true });

  /* ─────────────────────────────────────────
     8. CURSOR FOLLOW EFFECT WITH GLOW
     ───────────────────────────────────────── */
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  document.body.appendChild(cursor);

  const cursorGlow = document.createElement("div");
  cursorGlow.className = "custom-cursor-glow";
  document.body.appendChild(cursorGlow);

  let cursorX = 0,
    cursorY = 0;
  let glowX = 0,
    glowY = 0;

  document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  function animateCursor() {
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    glowX += (cursorX - glowX) * 0.1;
    glowY += (cursorY - glowY) * 0.1;
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects
  const interactiveElements = document.querySelectorAll("a, button, .skill-card, .project-card");
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("cursor-hover");
      cursorGlow.classList.add("cursor-hover");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("cursor-hover");
      cursorGlow.classList.remove("cursor-hover");
    });
  });

  /* ─────────────────────────────────────────
     9. MORPHING LOGO ANIMATION
     ───────────────────────────────────────── */
  const logoOrbit = document.querySelector(".logo-orbit");
  if (logoOrbit) {
    let angle = 0;
    function animateLogo() {
      angle += 0.02;
      const x = 50 + Math.cos(angle) * 35;
      const y = 55 + Math.sin(angle) * 40;
      logoOrbit.setAttribute("cx", x);
      logoOrbit.setAttribute("cy", y);
      requestAnimationFrame(animateLogo);
    }
    animateLogo();
  }

  /* ─────────────────────────────────────────
     10. RIPPLE EFFECT ON CLICK
     ───────────────────────────────────────── */
  document.addEventListener("click", (e) => {
    const ripple = document.createElement("div");
    ripple.className = "ripple-effect";
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 1000);
  });

  /* ─────────────────────────────────────────
     11. PARALLAX SCROLLING FOR HERO
     ───────────────────────────────────────── */
  const heroContent = document.querySelector(".hero__content");
  const heroVisual = document.querySelector(".hero__visual");

  function parallaxScroll() {
    const scrolled = window.scrollY;
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
      heroContent.style.opacity = `${1 - scrolled / 800}`;
    }
    if (heroVisual) {
      heroVisual.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
  }

  window.addEventListener("scroll", parallaxScroll, { passive: true });

  /* ─────────────────────────────────────────
     12. TEXT REVEAL ANIMATION
     ───────────────────────────────────────── */
  const textReveals = document.querySelectorAll(".about__text p");
  if ("IntersectionObserver" in window && textReveals.length > 0) {
    textReveals.forEach((p) => {
      p.style.opacity = "0";
      p.style.transform = "translateY(20px)";
    });

    const textObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.transition = "opacity 0.8s ease, transform 0.8s ease";
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
            }, index * 200);
            textObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    textReveals.forEach((p) => textObserver.observe(p));
  }

  /* ─────────────────────────────────────────
     13. ANIMATED UNDERLINE FOR NAV LINKS
     ───────────────────────────────────────── */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  function highlightNavigation() {
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNavigation, { passive: true });

  /* ─────────────────────────────────────────
     14. HOVER SCALE & GLOW FOR BUTTONS
     ───────────────────────────────────────── */
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px) scale(1.02)";
    });
    btn.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });
  });

  /* ─────────────────────────────────────────
     15. LOADING SKELETON SHIMMER
     ───────────────────────────────────────── */
  const skeletons = document.querySelectorAll(".skeleton__bar");
  skeletons.forEach((skeleton) => {
    skeleton.style.backgroundImage =
      "linear-gradient(90deg, var(--surface) 0%, var(--border) 50%, var(--surface) 100%)";
    skeleton.style.backgroundSize = "200% 100%";
    skeleton.style.animation = "shimmer 1.5s infinite";
  });

  /* ─────────────────────────────────────────
     16. GRADIENT ANIMATION FOR BACKGROUNDS
     ───────────────────────────────────────── */
  const hero = document.querySelector(".hero");
  if (hero) {
    let gradientAngle = 0;
    function animateGradient() {
      gradientAngle += 0.5;
      hero.style.background = `
        linear-gradient(${gradientAngle}deg, 
          rgba(10, 10, 10, 1) 0%, 
          rgba(20, 10, 12, 1) 50%, 
          rgba(10, 10, 10, 1) 100%)
      `;
      requestAnimationFrame(animateGradient);
    }
    // Uncomment to enable (may be heavy on performance)
    // animateGradient();
  }

  /* ─────────────────────────────────────────
     17. FLIP CARDS ANIMATION (for future use)
     ───────────────────────────────────────── */
  const flipCards = document.querySelectorAll(".flip-card");
  flipCards.forEach((card) => {
    card.addEventListener("click", function () {
      this.classList.toggle("flipped");
    });
  });

  /* ─────────────────────────────────────────
     18. SECTION TRANSITIONS WITH FADE
     ───────────────────────────────────────── */
  const sectionsForFade = document.querySelectorAll(".section");
  if ("IntersectionObserver" in window && sectionsForFade.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsForFade.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(50px)";
      section.style.transition = "opacity 1s ease, transform 1s ease";
      sectionObserver.observe(section);
    });
  }

  /* ─────────────────────────────────────────
     19. CHART ANIMATION FOR GITHUB STATS
     ───────────────────────────────────────── */
  const githubImages = document.querySelectorAll(".github-activity-chart__img");
  if ("IntersectionObserver" in window && githubImages.length > 0) {
    githubImages.forEach((img) => {
      img.style.opacity = "0";
      img.style.transform = "scale(0.9)";
    });

    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.transition = "opacity 0.8s ease, transform 0.8s ease";
              entry.target.style.opacity = "1";
              entry.target.style.transform = "scale(1)";
            }, index * 300);
            imageObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    githubImages.forEach((img) => imageObserver.observe(img));
  }

  /* ─────────────────────────────────────────
     20. SMOOTH PAGE LOAD ANIMATION
     ───────────────────────────────────────── */
  window.addEventListener("load", () => {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.5s ease";
    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 100);
  });

  console.log("🎨 All animations loaded successfully!");
})();
