(function () {
  'use strict';

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current =
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}
      themeToggle.setAttribute(
        'aria-label',
        next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', targetId);
    });
  });

  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('in-view');
    });
  }

  const navLinkMap = new Map();
  document.querySelectorAll('.nav-link[data-nav]').forEach(function (link) {
    navLinkMap.set(link.getAttribute('data-nav'), link);
  });
  const sections = ['intro', 'about', 'contact']
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        const visible = entries.filter(function (entry) {
          return entry.isIntersecting;
        });
        if (!visible.length) return;
        const topEntry = visible.reduce(function (best, entry) {
          return entry.intersectionRatio > best.intersectionRatio ? entry : best;
        }, visible[0]);

        navLinkMap.forEach(function (l) {
          l.classList.remove('is-active');
        });
        const link = navLinkMap.get(topEntry.target.id);
        if (link) link.classList.add('is-active');
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach(function (s) {
      navObserver.observe(s);
    });
  }

  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = function () {
      if (window.scrollY > 12) navbar.classList.add('is-scrolled');
      else navbar.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  document.querySelectorAll('.contact-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', e.clientX - rect.left + 'px');
      card.style.setProperty('--my', e.clientY - rect.top + 'px');
    });
    card.addEventListener('mouseleave', function () {
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
