'use strict';

const onReady = (callback) => {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback, { once: true });
  else callback();
};

onReady(() => {
  const loader = document.getElementById('loader');
  const menuBtn = document.getElementById('menu-btn');
  const nav = document.getElementById('nav');
  const backToTop = document.getElementById('backToTop');
  const year = document.getElementById('year');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Keep the original typing animation, but avoid running it when the user requests reduced motion.
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle && !prefersReducedMotion) {
    const fullText = heroTitle.textContent.trim();
    heroTitle.textContent = '';
    let index = 0;
    const type = () => {
      if (index < fullText.length) {
        heroTitle.textContent += fullText.charAt(index++);
        window.setTimeout(type, 90);
      }
    };
    type();
  }

  // Keep the original smooth scroll behavior while closing the mobile menu correctly.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      const target = id && document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      if (nav?.classList.contains('active')) closeMenu();
    });
  });

  function closeMenu() {
    nav?.classList.remove('active');
    menuBtn?.setAttribute('aria-expanded', 'false');
    menuBtn?.setAttribute('aria-label', 'Open navigation menu');
  }

  menuBtn?.addEventListener('click', () => {
    const open = nav?.classList.toggle('active') ?? false;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  // Reveal sections without repeatedly calculating positions during every scroll event.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('active'));
  }

  // Animate skill bars only when they become visible.
  const progressBars = document.querySelectorAll('.progress[data-width]');
  if ('IntersectionObserver' in window) {
    const progressObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    progressBars.forEach((bar) => progressObserver.observe(bar));
  } else {
    progressBars.forEach((bar) => { bar.style.width = bar.dataset.width; });
  }

  // Keep the back-to-top feature lightweight.
  let ticking = false;
  const updateTopButton = () => {
    if (backToTop) backToTop.hidden = window.scrollY < 500;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateTopButton);
      ticking = true;
    }
  }, { passive: true });
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  if (year) year.textContent = String(new Date().getFullYear());

  // Preserve the original particle background, while reducing needless work on small devices.
  const initParticles = () => {
    if (typeof window.particlesJS !== 'function' || !document.getElementById('particles-js')) return;
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    window.particlesJS('particles-js', {
      particles: {
        number: { value: mobile ? 35 : 70, density: { enable: true, value_area: 900 } },
        color: { value: '#00f7ff' },
        shape: { type: 'circle' },
        opacity: { value: 0.45, random: true },
        size: { value: mobile ? 2 : 3, random: true },
        line_linked: { enable: !mobile, distance: 150, color: '#6c63ff', opacity: 0.22, width: 1 },
        move: { enable: true, speed: mobile ? 1 : 1.5, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: !mobile, mode: 'grab' },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 0.45 } },
          push: { particles_nb: 3 }
        }
      },
      retina_detect: true
    });
  };

  if (!prefersReducedMotion) {
    if (typeof window.particlesJS === 'function') initParticles();
    else window.addEventListener('load', initParticles, { once: true });
  }

  // Do not hold the page behind the loader while third-party particles load.
  requestAnimationFrame(() => loader?.classList.add('hidden'));
});
