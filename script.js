/* =============================================
   Atharv Kukade — Portfolio JavaScript
   ============================================= */

"use strict";

// ─── Initialize Lucide Icons ───────────────────
document.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== "undefined") lucide.createIcons();
  initAll();
});

function initAll() {
  initNavbar();
  initHamburger();
  initThemeToggle();
  initScrollReveal();
  initActiveNavLinks();
  initTypingEffect();
}

// ─── Navbar Scroll Effect ──────────────────────
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run on load
}

// ─── Mobile Hamburger Menu ─────────────────────
function initHamburger() {
  const btn   = document.getElementById("hamburger");
  const links = document.getElementById("navLinks");
  if (!btn || !links) return;

  btn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    btn.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open);
  });

  // Close on nav-link click
  links.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      btn.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove("open");
      btn.classList.remove("open");
    }
  });
}

// ─── Dark Mode Toggle ──────────────────────────
function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  // Load saved preference or system preference
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = saved || (prefersDark ? "dark" : "light");
  applyTheme(initial);

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
    // Re-render Lucide icons after DOM update
    if (typeof lucide !== "undefined") {
      requestAnimationFrame(() => lucide.createIcons());
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

// ─── Scroll Reveal + Skill/Acad Bar Animation ──
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.getAttribute("data-delay") || "0", 10);

      setTimeout(() => {
        el.classList.add("visible");
        // Trigger skill bars
        if (el.classList.contains("skill-card")) {
          const fill = el.querySelector(".skill-fill");
          if (fill) fill.style.width = fill.style.getPropertyValue("--w") || getComputedStyle(fill).getPropertyValue("--w");
        }
        // Trigger acad bars
        if (el.classList.contains("acad-card")) {
          const fill = el.querySelector(".acad-fill");
          if (fill) {
            const target = fill.style.width; // already set inline
            fill.style.width = "0"; // reset then animate
            setTimeout(() => { fill.style.width = target; }, 50);
          }
        }
      }, delay);

      observer.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  elements.forEach(el => observer.observe(el));
}

// ─── Active Nav Link on Scroll ─────────────────
function initActiveNavLinks() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(a => {
        a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
      });
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

// ─── Hero Typing / Role Text Effect ───────────
function initTypingEffect() {
  const roleEl = document.querySelector(".hero-role");
  if (!roleEl) return;

  const roles = [
    "Information Technology Student  ·  Tech Enthusiast  ·  Future Software Engineer",
    "C++ Programmer  ·  DSA Learner  ·  Web Developer",
    "Problem Solver  ·  PCCOE IT  ·  Batch of 2028",
  ];

  let roleIndex = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let pauseTimer = null;

  function type() {
    const current = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    roleEl.textContent = current.substring(0, charIndex);

    let speed = isDeleting ? 28 : 48;

    if (!isDeleting && charIndex === current.length) {
      // Pause at end
      speed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
      speed = 400;
    }

    pauseTimer = setTimeout(type, speed);
  }

  // Start after 1.4s (hero reveal animation)
  setTimeout(type, 1400);
}

// ─── Contact Form Handler ──────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const form    = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  const btn     = form.querySelector("[type='submit']");

  // Simulate sending
  btn.disabled    = true;
  btn.textContent = "Sending…";

  setTimeout(() => {
    form.reset();
    btn.disabled    = false;
    btn.innerHTML   = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
    success.classList.add("show");
    // Re-render icons
    if (typeof lucide !== "undefined") lucide.createIcons();
    setTimeout(() => success.classList.remove("show"), 4500);
  }, 1200);
}

// ─── Smooth scroll polyfill for older browsers ─
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ─── Skill bar width from CSS var fix ──────────
// Ensure CSS custom property --w is read properly for skill bars on reveal
function fixSkillBars() {
  document.querySelectorAll(".skill-fill").forEach(fill => {
    const w = fill.style.cssText.match(/--w:\s*([^;]+)/)?.[1]?.trim();
    if (w) fill.dataset.targetWidth = w;
  });
}
fixSkillBars();
