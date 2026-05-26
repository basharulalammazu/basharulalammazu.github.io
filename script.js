/* ══════════════════════════════════════
   PORTFOLIO SCRIPT — Professional Edition
══════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Year ── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Reading Progress Bar ── */
  var progressBar = document.getElementById('progress-bar');
  function updateProgress() {
    if (!progressBar) return;
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ── Dark Mode ── */
  var themeBtn = document.getElementById('themeToggle');
  var themeLabel = document.getElementById('themeLabel');
  var saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeLabel) themeLabel.textContent = 'Light';
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var isDark = document.body.classList.toggle('dark-mode');
      if (themeLabel) themeLabel.textContent = isDark ? 'Light' : 'Dark';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  /* ── Hamburger ── */
  var ham = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  if (ham && navLinks) {
    ham.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      ham.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', open);
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        ham.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !ham.contains(e.target)) {
        navLinks.classList.remove('open');
        ham.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Active Nav Link on Scroll ── */
  var sections = document.querySelectorAll('section[id]');
  var navAs = document.querySelectorAll('.nav-links a');
  function onScroll() {
    var pos = window.scrollY + 120;
    sections.forEach(function (s) {
      if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
        navAs.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + s.id);
        });
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Scroll Reveal ── */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Skill Bars — animate on scroll ── */
  var skillBars = document.querySelectorAll('.skill-bar');
  if ('IntersectionObserver' in window) {
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    skillBars.forEach(function (bar) {
      // Set CSS var from the inline width
      var inner = bar.querySelector('span');
      if (inner) {
        var w = inner.getAttribute('data-width') || inner.style.getPropertyValue('--w') || inner.style.width;
        if (w) {
          bar.style.setProperty('--w', w);
          inner.style.width = '0'; // reset for animation
          inner.removeAttribute('style');
        }
      }
      barObserver.observe(bar);
    });
  } else {
    skillBars.forEach(function (bar) { bar.classList.add('animated'); });
  }

  /* ── Animated Counter ── */
  function animateCounter(el) {
    var target = parseFloat(el.textContent);
    var suffix = el.textContent.replace(target, '');
    var start = 0;
    var duration = 1400;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * ease) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var metricNums = document.querySelectorAll('.metric-number');
  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    metricNums.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ── Typing Effect ── */
  var roles = ['ML Engineer', 'Deep Learning Researcher', 'Backend Developer', 'AI Enthusiast', 'CSE Student'];
  var roleEl = document.getElementById('typed-role');
  var cursorEl = document.querySelector('.cursor');
  if (roleEl) {
    var roleIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typingDelay = 110;
    var deletingDelay = 60;
    var pauseDelay = 1800;
    function type() {
      var current = roles[roleIndex];
      if (isDeleting) {
        roleEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        roleEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }
      var delay = isDeleting ? deletingDelay : typingDelay;
      if (!isDeleting && charIndex === current.length) {
        delay = pauseDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
      }
      setTimeout(type, delay);
    }
    setTimeout(type, 800);
  }

  /* ── Project Filter ── */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectItems = document.querySelectorAll('.project-card');
  var summary = document.getElementById('filterSummary');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = this.dataset.filter;
      filterBtns.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');
      var count = 0;
      projectItems.forEach(function (item) {
        var show = filter === 'all' || item.dataset.category === filter;
        if (show) {
          item.classList.remove('hidden');
          item.style.animation = 'none';
          requestAnimationFrame(function () {
            item.style.animation = '';
          });
          count++;
        } else {
          item.classList.add('hidden');
        }
      });
      if (summary) {
        summary.textContent = filter === 'all'
          ? 'Showing all ' + count + ' projects'
          : 'Showing ' + count + ' ' + filter.toUpperCase() + ' project' + (count === 1 ? '' : 's');
      }
    });
  });

  /* ── Experience Data ── */
  function formatMonth(value) {
    if (!value) return '';
    var parts = value.split('-');
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    return new Date(year, month).toLocaleString('en-US', { month: 'short', year: 'numeric' });
  }
  function getExperienceDuration(startValue, endValue) {
    if (!startValue) return '';
    var startParts = startValue.split('-');
    var endParts = (endValue || '').split('-');
    var start = new Date(parseInt(startParts[0], 10), parseInt(startParts[1], 10) - 1);
    var end = endValue ? new Date(parseInt(endParts[0], 10), parseInt(endParts[1], 10) - 1) : new Date();
    var months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (months < 1) months = 1;
    var years = Math.floor(months / 12);
    var rem = months % 12;
    var label = '· ';
    if (years) label += years + ' yr' + (years > 1 ? 's' : '');
    if (years && rem) label += ' ';
    if (rem) label += rem + ' mo' + (rem > 1 ? 's' : '');
    return label;
  }
  function getStatusBadge(status) {
    var n = String(status || '').trim().toLowerCase();
    if (!n) return '';
    if (n === 'active')
      return '<span class="exp-badge-active"><span class="exp-badge-dot"></span> Active</span>';
    if (n === 'completed' || n === 'complete' || n === 'finished')
      return '<span class="exp-badge-completed"><span class="exp-badge-dot"></span> Completed</span>';
    return '<span class="exp-badge-muted">' + status + '</span>';
  }
  function renderExperience(entries) {
    var list = document.getElementById('experienceList');
    if (!list) return;
    if (!entries || !entries.length) {
      list.innerHTML = '<p class="section-sub">No experience data available.</p>';
      return;
    }
    list.innerHTML = entries.map(function (e) {
      var isActive = String(e.status || '').toLowerCase() === 'active';
      var duration = getExperienceDuration(e.startDate, isActive ? null : e.endDate);
      var dateRange = [formatMonth(e.startDate), isActive ? 'Present' : formatMonth(e.endDate)].filter(Boolean).join(' – ');
      var projects = (e.projects || []).map(function (p) {
        return '<div class="exp-project"><div class="exp-project-dot"></div><div>' +
          '<div class="exp-project-title">' + p.title + '</div>' +
          '<div class="exp-project-desc">' + p.description + '</div>' +
          '</div></div>';
      }).join('');
      var skills = (e.skills || []).map(function (s) {
        return '<span class="exp-skill">' + s + '</span>';
      }).join('');
      return '<article class="exp-card reveal">' +
        '<div class="exp-header">' +
        '<img src="' + e.logo + '" alt="' + e.company + ' logo" class="exp-logo-img" loading="lazy" width="54" height="54" />' +
        '<div class="exp-info">' +
        '<div class="exp-title-row"><h3 class="exp-job-title">' + e.title + '</h3>' + getStatusBadge(e.status) + '</div>' +
        '<div class="exp-company-row"><strong>' + e.company + '</strong>' +
        (e.employmentType || e.engagementType ? ' · ' + [e.employmentType, e.engagementType].filter(Boolean).join(' · ') : '') + '</div>' +
        '<div class="exp-meta-row">' +
        '<span class="exp-meta-chip">📅 ' + dateRange + ' ' + duration + '</span>' +
        (e.location || e.workMode ? '<span class="exp-meta-chip">📍 ' + [e.location, e.workMode].filter(Boolean).join(' · ') + '</span>' : '') +
        '</div></div></div>' +
        '<p class="exp-desc">' + e.description + '</p>' +
        (projects ? '<div class="exp-projects-panel"><div class="exp-projects-header">🗂 Key Projects</div>' + projects + '</div>' : '') +
        (skills ? '<div class="exp-skills-row"><span class="exp-skills-label">Stack:</span>' + skills + '</div>' : '') +
        '</article>';
    }).join('');

    // Trigger reveal for dynamically added cards
    var newCards = list.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      newCards.forEach(function (el) { obs.observe(el); });
    } else {
      newCards.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  fetch('assets/data/experience.json', { cache: 'no-store' })
    .then(function (r) {
      if (!r.ok) throw new Error('Failed to load experience data');
      return r.json();
    })
    .then(function (data) {
      renderExperience(Array.isArray(data) ? data : data.experience);
    })
    .catch(function (err) {
      // Fallback: Try XMLHttpRequest for file:// protocol
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'assets/data/experience.json', true);
      xhr.onload = function () {
        if (xhr.status === 0 || xhr.status === 200) {
          try {
            var data = JSON.parse(xhr.responseText);
            renderExperience(Array.isArray(data) ? data : data.experience);
          } catch (e) {
            showExperienceFallback();
          }
        } else {
          showExperienceFallback();
        }
      };
      xhr.onerror = function () {
        showExperienceFallback();
      };
      xhr.send();
    });

  function showExperienceFallback() {
    var fallback = document.getElementById('experienceList');
    if (fallback) {
      fallback.innerHTML = '<p class="section-sub">⚠️ Experience data loading issue. Please ensure you are running this site via an HTTP server (not file:// protocol). Try: <code style="background: var(--border); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono);">python -m http.server 8000</code> or use VS Code Live Server extension.</p>';
    }
  }

  /* ── Tooltip for interest chips ── */
  var chips = document.querySelectorAll('[data-tooltip]');
  chips.forEach(function (chip) {
    chip.setAttribute('title', chip.dataset.tooltip || '');
  });

  /* ── Smooth hover tilt on project cards ── */
  var projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      var y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      card.style.transform = 'translateY(-5px) rotateX(' + y + 'deg) rotateY(' + x + 'deg)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ── Subtle floating particles ── */
  var particleContainer = document.getElementById('particles');
  if (particleContainer) {
    for (var i = 0; i < 12; i++) {
      (function (idx) {
        var p = document.createElement('div');
        p.className = 'particle';
        var size = 2 + Math.random() * 4;
        p.style.cssText = [
          'left:' + (5 + Math.random() * 90) + '%',
          'width:' + size + 'px',
          'height:' + size + 'px',
          'animation-duration:' + (8 + Math.random() * 14) + 's',
          'animation-delay:' + (Math.random() * -20) + 's',
          'opacity:0'
        ].join(';');
        particleContainer.appendChild(p);
      })(i);
    }
  }

  /* ── Copy email on click ── */
  var emailLinks = document.querySelectorAll('[data-copy-email]');
  emailLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var email = this.dataset.copyEmail;
      if (navigator.clipboard && email) {
        e.preventDefault();
        navigator.clipboard.writeText(email).then(function () {
          var orig = link.textContent;
          link.textContent = '✓ Copied!';
          setTimeout(function () { link.textContent = orig; }, 1800);
        }).catch(function () {
          window.location.href = 'mailto:' + email;
        });
      }
    });
  });

})();