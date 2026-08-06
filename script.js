'use strict';

/* Utilities */
function debounce(fn, wait = 100) {
  let timeout;
  return function (...args) {
    const ctx = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(ctx, args), wait);
  };
}
function throttle(fn, limit = 120) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/* Mobile menu */
function toggleMenu() {
  const nav = document.getElementById('nav');
  const btn = document.getElementById('menu-btn');
  if (!nav || !btn) return;
  const isExpanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', (!isExpanded).toString());
  nav.classList.toggle('active');
}
function closeMenu() {
  const nav = document.getElementById('nav');
  const btn = document.getElementById('menu-btn');
  if (nav) nav.classList.remove('active');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
  document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
});

/* Loader & startup */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.classList.add('hidden');
      loader.style.display = 'none';
    }, 500);
  }
  startTyping();
  initParticles();
  handleScroll(); // initial
});

/* Reveal & progress */
let progressInitialized = false;
function onScrollRevealAndProgress() {
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 50) el.classList.add('active');
  });
  if (!progressInitialized) {
    const bars = document.querySelectorAll('.progress');
    const anyVisible = Array.from(bars).some(bar => bar.getBoundingClientRect().top < window.innerHeight);
    if (anyVisible) {
      bars.forEach(bar => { if (bar.dataset.width) bar.style.width = bar.dataset.width; });
      progressInitialized = true;
    }
  }
}

/* Back-to-top logic */
const backToTopBtn = (() => document.getElementById('backToTop'))();

function showBackToTop() {
  if (!backToTopBtn) return;
  const scrolled = window.scrollY || window.pageYOffset;
  const threshold = 350;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (scrolled > threshold) {
    backToTopBtn.classList.add('visible');
    backToTopBtn.setAttribute('aria-hidden', 'false');
    backToTopBtn.setAttribute('tabindex', '0');
    if (!prefersReduced) backToTopBtn.setAttribute('aria-live', 'polite');
  } else {
    backToTopBtn.classList.remove('visible');
    backToTopBtn.setAttribute('aria-hidden', 'true');
    backToTopBtn.removeAttribute('tabindex');
    backToTopBtn.removeAttribute('aria-live');
  }
}

function scrollToTopOrFocusMain() {
  const main = document.getElementById('main-content');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => { if (main) main.focus({ preventScroll: true }); }, 420);
  } else {
    window.scrollTo(0, 0);
    if (main) main.focus({ preventScroll: true });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!backToTopBtn) return;
  backToTopBtn.addEventListener('click', (e) => { e.preventDefault(); scrollToTopOrFocusMain(); });
  backToTopBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToTopOrFocusMain(); }
  });
  backToTopBtn.addEventListener('mouseup', () => backToTopBtn.blur());
});

/* Composite scroll handler */
function handleScroll() {
  onScrollRevealAndProgress();
  showBackToTop();
}
const throttledHandleScroll = throttle(handleScroll, 120);
window.addEventListener('scroll', throttledHandleScroll, { passive: true });

/* Typing */
const typingText = 'MD. Raiyan Sazid Khan';
let typingIndex = 0;
function startTyping() {
  typingIndex = 0;
  const el = document.getElementById('typing');
  if (el) el.textContent = '';
  type();
}
function type() {
  const el = document.getElementById('typing');
  if (!el) return;
  if (typingIndex < typingText.length) {
    el.textContent += typingText.charAt(typingIndex);
    typingIndex++;
    setTimeout(type, 100);
  }
}

/* Particles */
function initParticles() {
  const loaderEl = document.getElementById('particles-loader');
  const fallbackEl = document.getElementById('particles-fallback');
  if (loaderEl) { loaderEl.hidden = false; loaderEl.setAttribute('aria-hidden', 'false'); }
  if (fallbackEl) { fallbackEl.hidden = true; fallbackEl.setAttribute('aria-hidden', 'true'); }
  let attempts = 0; const maxAttempts = 8; const attemptDelay = 250;
  const attemptInit = () => {
    if (typeof particlesJS !== 'undefined') {
      try {
        createParticles();
        if (loaderEl) { loaderEl.hidden = true; loaderEl.setAttribute('aria-hidden', 'true'); }
        if (fallbackEl) { fallbackEl.hidden = true; fallbackEl.setAttribute('aria-hidden', 'true'); }
        return;
      } catch (e) { console.warn('particlesJS error:', e.message); }
    }
    attempts++;
    if (attempts <= maxAttempts) setTimeout(attemptInit, attemptDelay);
    else {
      if (loaderEl) { loaderEl.hidden = true; loaderEl.setAttribute('aria-hidden', 'true'); }
      if (fallbackEl) { fallbackEl.hidden = false; fallbackEl.setAttribute('aria-hidden', 'false'); }
      console.warn('particles.js failed to initialize after retries.');
    }
  };
  attemptInit();
}
function createParticles() {
  try {
    particlesJS('particles-js', {
      particles: { number: { value: 90, density: { enable: true, value_area: 800 } }, color: { value: '#00f7ff' }, shape: { type: 'circle' }, opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } }, size: { value: 5, random: true }, line_linked: { enable: true, distance: 150, color: '#00f7ff', opacity: 0.3, width: 1 }, move: { enable: true, speed: 2, direction: 'none', out_mode: 'out' } }, interactivity: { detect_on: 'canvas', events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true }, modes: { repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 } } }, retina_detect: true
    });
  } catch (e) {
    const fallbackEl = document.getElementById('particles-fallback');
    const loaderEl = document.getElementById('particles-loader');
    if (loaderEl) { loaderEl.hidden = true; loaderEl.setAttribute('aria-hidden', 'true'); }
    if (fallbackEl) { fallbackEl.hidden = false; fallbackEl.setAttribute('aria-hidden', 'false'); }
    console.error('Particle initialization failed:', e.message);
  }
}

/* Lazy load images */
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
          observer.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLazyLoading); else initLazyLoading();

/* Smooth scroll fallback */
if (!('scrollBehavior' in document.documentElement.style)) {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}
