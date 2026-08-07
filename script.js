'use strict';

(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function closeMenu() {
    const nav = $('#nav');
    const button = $('#menu-btn');
    nav?.classList.remove('active');
    button?.setAttribute('aria-expanded', 'false');
    button?.setAttribute('aria-label', 'Open navigation menu');
  }

  function setupNavigation() {
    const button = $('#menu-btn');
    const nav = $('#nav');
    if (!button || !nav) return;

    button.addEventListener('click', () => {
      const open = nav.classList.toggle('active');
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });

    $$('a', nav).forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', event => {
      if (window.innerWidth <= 768 && nav.classList.contains('active') && !nav.contains(event.target) && !button.contains(event.target)) closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    }, { passive: true });
  }

  function setupReveal() {
    const elements = $$('.reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('active'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    elements.forEach(el => observer.observe(el));
  }

  function setupSkillBars() {
    const bars = $$('.progress');
    if (!bars.length) return;

    const apply = () => bars.forEach(bar => {
      const width = bar.dataset.width;
      if (width) bar.style.width = width;
    });

    if (!('IntersectionObserver' in window)) {
      apply();
      return;
    }

    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        apply();
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    const section = $('#skills');
    if (section) observer.observe(section);
  }

  function setupBackToTop() {
    const button = $('#backToTop');
    if (!button) return;

    const update = () => {
      button.hidden = window.scrollY < 500;
    };

    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function setupYear() {
    const year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function setupParticles() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;
    if (typeof window.particlesJS !== 'function') return;

    try {
      window.particlesJS('particles-js', {
        particles: {
          number: { value: 45, density: { enable: true, value_area: 1000 } },
          color: { value: '#00f7ff' },
          shape: { type: 'circle' },
          opacity: { value: 0.28, random: true },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 170, color: '#00f7ff', opacity: 0.16, width: 1 },
          move: { enable: true, speed: 1, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
          detect_on: 'canvas',
          events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: false }, resize: true },
          modes: { repulse: { distance: 120, duration: 0.4 } }
        },
        retina_detect: true
      });
    } catch (error) {
      console.warn('Particles disabled:', error);
    }
  }

  function hideLoader() {
    const loader = $('#loader');
    if (!loader) return;
    requestAnimationFrame(() => loader.classList.add('hidden'));
  }

  function init() {
    setupNavigation();
    setupReveal();
    setupSkillBars();
    setupBackToTop();
    setupYear();
    hideLoader();
    setupParticles();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
