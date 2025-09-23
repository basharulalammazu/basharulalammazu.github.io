document.addEventListener("DOMContentLoaded", function () {
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
    } else {
      link.classList.remove("active");
    }
  });

  // Project Filter (only applicable on projects.html)
  if (document.querySelector(".project-filter-btn")) {
    const filterButtons = document.querySelectorAll(".project-filter-btn");
    const projectItems = document.querySelectorAll(".project-item");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Update active button state
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.getAttribute("data-filter");

        // Animate items
        projectItems.forEach((item, index) => {
          const category = item.getAttribute("data-category");
          const isVisible = filter === "all" || category === filter;

          if (isVisible) {
            item.style.display = "block";
            setTimeout(() => {
              item.classList.add("visible");
            }, index * 100); // Stagger by 100ms per item
          } else {
            item.classList.remove("visible");
            setTimeout(() => {
              if (!item.classList.contains("visible")) {
                item.style.display = "none";
              }
            }, 500); // Match CSS transition duration
          }
        });
      });
    });

    // Trigger initial filter (All)
    filterButtons[0].click();
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
});
