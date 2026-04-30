document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("js-enabled");

  const body = document.body;
  const THEME_KEY = "preferred-theme";
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  // ── Theme helpers ──────────────────────────────────────────────────────────
  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch { return null; }
  }
  function storeTheme(theme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* ignore */ }
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    body.classList.toggle("dark-mode", isDark);

    // Social icon swap
    const socialIcons = document.querySelectorAll("#socials-container img");
    socialIcons.forEach((img) => {
      const alt = img.alt.toLowerCase();
      if (alt.includes("cv"))       img.src = isDark ? "./assets/cv_dark.png"       : "./assets/cv.png";
      else if (alt.includes("mail"))     img.src = isDark ? "./assets/mail_dark.png"     : "./assets/mail.png";
      else if (alt.includes("linkedin")) img.src = isDark ? "./assets/linkedin_dark.png" : "./assets/linkedin.png";
      else if (alt.includes("github"))   img.src = isDark ? "./assets/github_dark.png"   : "./assets/github.png";
    });
  }

  function initTheme() {
    const stored = getStoredTheme();
    applyTheme(stored || (darkModeMediaQuery.matches ? "dark" : "light"));
  }

  darkModeMediaQuery.addEventListener
    ? darkModeMediaQuery.addEventListener("change", (e) => {
        if (!getStoredTheme()) applyTheme(e.matches ? "dark" : "light");
      })
    : darkModeMediaQuery.addListener((e) => {
        if (!getStoredTheme()) applyTheme(e.matches ? "dark" : "light");
      });

  initTheme();

  // ── Theme toggle button ────────────────────────────────────────────────────
  function wireToggle() {
    const btn = document.getElementById("theme-toggle");
    if (!btn || btn._wired) return;
    btn._wired = true;
    btn.addEventListener("click", () => {
      const newTheme = body.classList.contains("dark-mode") ? "light" : "dark";
      applyTheme(newTheme);
      storeTheme(newTheme);
    });
  }
  wireToggle();
  // Safety: also observe in case button is deferred
  new MutationObserver(wireToggle).observe(body, { childList: true, subtree: true });

  // ── Active nav link ────────────────────────────────────────────────────────
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });

  // ── Navbar scroll shadow ───────────────────────────────────────────────────
  const navbar = document.querySelector("nav.navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.style.boxShadow = window.scrollY > 20
        ? "0 4px 24px rgba(0,0,0,0.12)"
        : "";
    }, { passive: true });
  }

  // ── Project filter & meta ──────────────────────────────────────────────────
  if (document.querySelector(".project-item")) {
    const projectItems = document.querySelectorAll(".project-item");

    document.querySelectorAll(".image-container-project img").forEach((img) => {
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
    });

    const categoryLabel = (cat) => {
      if (!cat) return "Other";
      const map = { python:"Python", r:"R", cpp:"C++", csharp:"C#", java:"Java",
                    php:"PHP", go:"Go", javascript:"JavaScript", js:"JavaScript" };
      const lc = cat.toLowerCase();
      return map[lc] || lc.charAt(0).toUpperCase() + lc.slice(1);
    };

    // Auto-generate meta pill
    projectItems.forEach((item) => {
      const cat = item.getAttribute("data-category");
      const rightOverlay = item.querySelector(".right-overlay");
      const titleEl = item.querySelector(".project-title");
      if (rightOverlay && titleEl) {
        let meta = rightOverlay.querySelector(".project-meta");
        if (!meta) {
          meta = document.createElement("div");
          meta.className = "project-meta";
          titleEl.insertAdjacentElement("afterend", meta);
        }
        meta.innerHTML = `<span class="meta-pill">${categoryLabel(cat)}</span>`;
      }
    });

    // Build filter buttons
    const categories = [...new Set(
      [...projectItems].map((it) => it.getAttribute("data-category")).filter(Boolean)
    )];
    const filterBar = document.querySelector("#projects .text-center.mb-4") ||
      (document.querySelector(".project-filter-btn") &&
       document.querySelector(".project-filter-btn").parentElement);
    let filterButtons = [];
    if (filterBar) {
      filterBar.innerHTML = "";
      const allBtn = document.createElement("button");
      allBtn.className = "project-filter-btn";
      allBtn.setAttribute("data-filter", "all");
      allBtn.textContent = "All";
      filterBar.appendChild(allBtn);
      categories.sort((a, b) => categoryLabel(a).localeCompare(categoryLabel(b))).forEach((cat) => {
        const btn = document.createElement("button");
        btn.className = "project-filter-btn";
        btn.setAttribute("data-filter", cat);
        btn.textContent = categoryLabel(cat);
        filterBar.appendChild(btn);
      });
      filterButtons = [...filterBar.querySelectorAll(".project-filter-btn")];
    }

    const applyFilter = (filter) => {
      projectItems.forEach((item, i) => {
        const isVisible = filter === "all" || item.getAttribute("data-category") === filter;
        if (isVisible) {
          item.style.display = "block";
          setTimeout(() => item.classList.add("visible"), i * 80);
        } else {
          item.classList.remove("visible");
          setTimeout(() => { if (!item.classList.contains("visible")) item.style.display = "none"; }, 400);
        }
      });
    };

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        applyFilter(btn.getAttribute("data-filter"));
      });
    });
    if (filterButtons.length) filterButtons[0].click();
    else applyFilter("all");
  }

  // ── Back to top ────────────────────────────────────────────────────────────
  const btt = document.createElement("button");
  btt.innerHTML = "↑";
  btt.className = "back-to-top";
  btt.setAttribute("aria-label", "Back to top");
  btt.title = "Back to top";
  document.body.appendChild(btt);
  window.addEventListener("scroll", () => {
    btt.style.opacity = window.scrollY > 300 ? "1" : "0";
    btt.style.pointerEvents = window.scrollY > 300 ? "auto" : "none";
  }, { passive: true });
  btt.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // ── Footer year ───────────────────────────────────────────────────────────
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── IntersectionObserver for scroll animations ─────────────────────────────
  const ioSupported = "IntersectionObserver" in window;
  if (ioSupported) {
    const toObserve = [
      ...document.querySelectorAll(".metric-box"),
      ...document.querySelectorAll(".tag-pill"),
      ...document.querySelectorAll(".timeline-edu .edu-card"),
      ...document.querySelectorAll(".publication-card"),
      ...document.querySelectorAll(".timeline .timeline-content"),
      ...document.querySelectorAll(".project-card"),
      ...document.querySelectorAll(".achievement-item"),
    ];

    const countedOnce = new WeakSet();
    function runCountUp(box) {
      if (countedOnce.has(box)) return;
      const numEl = box.querySelector(".metric-number");
      if (!numEl) return;
      const raw = numEl.textContent.trim();
      const hasPlus = raw.endsWith("+");
      const target = parseInt(raw.replace(/\D/g, ""), 10) || 0;
      const duration = 900;
      const start = performance.now();
      const format = (v) => hasPlus ? `${v}+` : `${v}`;
      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        numEl.textContent = format(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countedOnce.add(box);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          if (entry.target.classList.contains("metric-box")) runCountUp(entry.target);
        } else {
          entry.target.classList.remove("in-view");
        }
      });
    }, { rootMargin: "-5% 0px -10% 0px", threshold: 0.06 });

    toObserve.forEach((el) => observer.observe(el));
  } else {
    // Fallback
    document.querySelectorAll(
      ".metric-box,.tag-pill,.timeline-edu .edu-card,.publication-card,.timeline .timeline-content,.project-card,.achievement-item"
    ).forEach((el) => el.classList.add("in-view"));
  }
});