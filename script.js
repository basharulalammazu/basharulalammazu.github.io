document.addEventListener("DOMContentLoaded", function () {
  // Flag JS availability for CSS gating
  document.body.classList.add("js-enabled");
  const body = document.body;
  const navbarTogglerIcon = document.querySelector(".navbar-toggler-icon");
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const THEME_KEY = "preferred-theme";

  // Create theme toggle button icons if button exists later
  function ensureToggleIcons(btn) {
    if (!btn) return;
    if (!btn.querySelector(".icon-sun")) {
      btn.innerHTML =
        '<span class="icon-sun" aria-hidden="true">☀️</span><span class="icon-moon" aria-hidden="true">🌙</span>';
    }
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }

  function systemPrefersDark() {
    return darkModeMediaQuery.matches;
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    body.classList.toggle("dark-mode", isDark);
    if (navbarTogglerIcon) {
      navbarTogglerIcon.classList.toggle("light-mode", !isDark);
      navbarTogglerIcon.classList.toggle("dark-mode", isDark);
    }
    // Update social icons for theme
    const socialIcons = document.querySelectorAll("#socials-container img");
    socialIcons.forEach((img) => {
      const alt = img.alt.toLowerCase();
      if (alt.includes("cv")) {
        img.src = isDark ? "./assets/cv_dark.png" : "./assets/cv.png";
      } else if (alt.includes("email") || alt.includes("mail")) {
        img.src = isDark ? "./assets/mail_dark.png" : "./assets/mail.png";
      } else if (alt.includes("linkedin")) {
        img.src = isDark
          ? "./assets/linkedin_dark.png"
          : "./assets/linkedin.png";
      } else if (alt.includes("github")) {
        img.src = isDark ? "./assets/github_dark.png" : "./assets/github.png";
      }
    });
  }

  function initTheme() {
    const stored = getStoredTheme();
    if (stored) {
      applyTheme(stored);
    } else {
      applyTheme(systemPrefersDark() ? "dark" : "light");
    }
  }

  // Responsive to system changes ONLY if user hasn't overridden manually
  darkModeMediaQuery.addEventListener
    ? darkModeMediaQuery.addEventListener("change", (e) => {
        const stored = getStoredTheme();
        if (!stored) {
          applyTheme(e.matches ? "dark" : "light");
        }
      })
    : darkModeMediaQuery.addListener((e) => {
        const stored = getStoredTheme();
        if (!stored) {
          applyTheme(e.matches ? "dark" : "light");
        }
      });

  initTheme();

  // Toggle button logic (delegated so we don't need to inject into every page's JS separately)
  const observer = new MutationObserver(() => {
    let btn = document.getElementById("theme-toggle");
    if (btn) {
      ensureToggleIcons(btn);
      btn.addEventListener(
        "click",
        () => {
          const isDark = body.classList.contains("dark-mode");
          const newTheme = isDark ? "light" : "dark";
          applyTheme(newTheme);
          storeTheme(newTheme);
        },
        { once: true }
      ); // attach once then reattach to avoid multiple bindings
      // Reattach persistent listener
      btn.addEventListener("click", () => {
        const isDark = body.classList.contains("dark-mode");
        const newTheme = isDark ? "light" : "dark";
        applyTheme(newTheme);
        storeTheme(newTheme);
      });
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Highlight active nav link based on current page
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

  // Project Filter and Meta (auto-detected on projects.html)
  if (document.querySelector(".project-item")) {
    const projectItems = document.querySelectorAll(".project-item");

    // Ensure project images are lazy-loaded for performance
    document.querySelectorAll(".image-container-project img").forEach((img) => {
      if (!img.hasAttribute("loading")) {
        img.setAttribute("loading", "lazy");
      }
      img.setAttribute("decoding", "async");
    });

    // Helper to map category to label
    const mapCategoryLabel = (cat) => {
      if (!cat) return "Other";
      const lc = cat.toLowerCase();
      const map = {
        python: "Python",
        r: "R",
        cpp: "C++",
        csharp: "C#",
        java: "Java",
        php: "PHP",
      };
      return map[lc] || lc.charAt(0).toUpperCase() + lc.slice(1);
    };

    // Auto-generate meta pill per project
    projectItems.forEach((item) => {
      const category = item.getAttribute("data-category");
      const label = mapCategoryLabel(category);
      const rightOverlay = item.querySelector(".right-overlay");
      const titleEl = item.querySelector(".project-title");
      if (rightOverlay && titleEl) {
        let meta = rightOverlay.querySelector(".project-meta");
        if (!meta) {
          meta = document.createElement("div");
          meta.className = "project-meta";
          titleEl.insertAdjacentElement("afterend", meta);
        }
        meta.innerHTML = `<span class="meta-pill">${label}</span>`;
      }
    });

    // Build filter buttons dynamically from categories
    const categories = Array.from(
      new Set(
        Array.from(projectItems)
          .map((it) => it.getAttribute("data-category"))
          .filter(Boolean)
      )
    );
    const filterBar =
      document.querySelector("#projects .text-center.mb-4") ||
      (document.querySelector(".project-filter-btn") &&
        document.querySelector(".project-filter-btn").parentElement);
    let filterButtons = [];
    if (filterBar) {
      filterBar.innerHTML = "";
      // All button first
      const allBtn = document.createElement("button");
      allBtn.className = "project-filter-btn";
      allBtn.setAttribute("data-filter", "all");
      allBtn.textContent = "All";
      filterBar.appendChild(allBtn);
      // Category buttons
      categories
        .sort((a, b) => mapCategoryLabel(a).localeCompare(mapCategoryLabel(b)))
        .forEach((cat) => {
          const btn = document.createElement("button");
          btn.className = "project-filter-btn";
          btn.setAttribute("data-filter", cat);
          btn.textContent = mapCategoryLabel(cat);
          filterBar.appendChild(btn);
        });
      filterButtons = Array.from(
        filterBar.querySelectorAll(".project-filter-btn")
      );
    }

    const applyFilter = (filter) => {
      projectItems.forEach((item, index) => {
        const category = item.getAttribute("data-category");
        const isVisible = filter === "all" || category === filter;
        if (isVisible) {
          item.style.display = "block";
          setTimeout(() => item.classList.add("visible"), index * 100);
          const card = item.querySelector(".project-card");
          if (card && "IntersectionObserver" in window) {
            setTimeout(() => card.classList.remove("in-view"), 0);
          }
        } else {
          item.classList.remove("visible");
          setTimeout(() => {
            if (!item.classList.contains("visible"))
              item.style.display = "none";
          }, 500);
        }
      });
    };

    // Wire up buttons
    if (filterButtons.length) {
      filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
          filterButtons.forEach((b) => b.classList.remove("active"));
          button.classList.add("active");
          applyFilter(button.getAttribute("data-filter"));
        });
      });
      // Initial: All
      filterButtons[0].click();
    } else {
      // No buttons container found; default to showing all
      applyFilter("all");
    }
  }

  // Back-to-Top Button
  const backToTop = document.createElement("button");
  backToTop.innerHTML = "↑";
  backToTop.className = "back-to-top";
  document.body.appendChild(backToTop);
  window.addEventListener("scroll", () => {
    backToTop.style.opacity = window.scrollY > 300 ? "1" : "0";
  });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Inject Back-to-Top CSS
  document.head.insertAdjacentHTML(
    "beforeend",
    `
        <style>
            .back-to-top {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #042C3E, rgb(43, 43, 150));
                color: #fff;
                border: none;
                border-radius: 50%;
                font-size: 28px;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.3s ease, transform 0.3s ease;
                z-index: 1000;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            .back-to-top:hover {
                transform: scale(1.2) rotate(360deg);
                background: linear-gradient(135deg, rgb(238, 168, 255), #9C4EAF);
            }
        </style>
    `
  );

  // Set the current year in the footer
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // IntersectionObserver for on-scroll animations (metrics & tags)
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
    // Prepare count-up for metrics
    const countUpOnce = new WeakSet();
    function startCountUp(box) {
      if (countUpOnce.has(box)) return;
      const numberEl = box.querySelector(".metric-number");
      if (!numberEl) return;
      // Extract target number by stripping non-digits
      const raw = numberEl.textContent.trim();
      const hasPlus = raw.endsWith("+");
      const target = parseInt(raw.replace(/\D/g, ""), 10) || 0;
      const duration = 900; // ms
      const start = performance.now();
      const formatter = (v) => (hasPlus ? `${v}+` : `${v}`);

      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3);
        const value = Math.round(target * eased);
        numberEl.textContent = formatter(value);
        if (t < 1) {
          requestAnimationFrame(tick);
        }
      }
      requestAnimationFrame(tick);
      countUpOnce.add(box);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            // If a metric-box entered, start its count-up once
            if (entry.target.classList.contains("metric-box")) {
              startCountUp(entry.target);
            }
          } else {
            entry.target.classList.remove("in-view");
          }
        });
      },
      {
        root: null,
        rootMargin: "-5% 0px -10% 0px",
        threshold: 0.08,
      }
    );
    toObserve.forEach((el) => observer.observe(el));
  } else {
    // Fallback: if IO not supported, show immediately for all gated elements
    document
      .querySelectorAll(
        ".metric-box, .tag-pill, .timeline-edu .edu-card, .publication-card, .timeline .timeline-content, .project-card, .achievement-item"
      )
      .forEach((el) => el.classList.add("in-view"));
    // Fallback: no IO, trigger count-up for metrics immediately
    document.querySelectorAll(".metric-box").forEach((box) => {
      const numberEl = box.querySelector(".metric-number");
      if (!numberEl) return;
      const raw = numberEl.textContent.trim();
      const hasPlus = raw.endsWith("+");
      const target = parseInt(raw.replace(/\D/g, ""), 10) || 0;
      numberEl.textContent = hasPlus ? `${target}+` : `${target}`;
    });
  }
});
