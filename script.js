'use strict';

// ==================== UTILITY FUNCTIONS ====================

/**
 * Debounce function to limit function call frequency
 * @param {Function} fn - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(fn, wait = 100) {
  let timeout;
  return function (...args) {
    const ctx = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(ctx, args), wait);
  };
}

/**
 * Throttle function to limit function call frequency
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Limit time in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(fn, limit = 100) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ==================== MOBILE MENU ====================

/**
 * Toggle mobile navigation menu
 */
function toggleMenu() {
  const nav = document.getElementById('nav');
  const btn = document.getElementById('menu-btn');

  if (!nav || !btn) return;

  const isExpanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', (!isExpanded).toString());
  nav.classList.toggle('active');
}

/**
 * Close mobile menu
 */
function closeMenu() {
  const nav = document.getElementById('nav');
  const btn = document.getElementById('menu-btn');

  if (nav) nav.classList.remove('active');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

// Menu button click handler
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
  }

  // Close menu when clicking on links
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
});

// ==================== PAGE LOADER ====================

/**
 * Handle page load completion
 */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.classList.add('hidden');
      loader.style.display = 'none';
    }, 500);
  }

  // Start animations after page load
  startTyping();
  initParticles();
  debouncedOnScroll();
});

// ==================== SCROLL ANIMATIONS ====================

let progressInitialized = false;

/**
 * Reveal elements on scroll and animate progress bars
 */
function onScroll() {
  // Reveal sections
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 50) {
      el.classList.add('active');
    }
  });

  // Initialize progress bars only once
  if (!progressInitialized) {
    const bars = document.querySelectorAll('.progress');
    const anyVisible = Array.from(bars).some(
      bar => bar.getBoundingClientRect().top < window.innerHeight
    );

    if (anyVisible) {
      bars.forEach(bar => {
        if (bar.dataset.width) {
          bar.style.width = bar.dataset.width;
        }
      });
      progressInitialized = true;
    }
  }
}

const debouncedOnScroll = debounce(onScroll, 100);
window.addEventListener('scroll', debouncedOnScroll, { passive: true });

// ==================== TYPING EFFECT ====================

const typingText = 'MD. Raiyan Sazid Khan';
let typingIndex = 0;
let typingTimeout;

/**
 * Start typing animation
 */
function startTyping() {
  typingIndex = 0;
  const el = document.getElementById('typing');
  if (el) {
    el.textContent = ''; // Use textContent to avoid XSS
  }
  type();
}

/**
 * Animate typing character by character
 */
function type() {
  const el = document.getElementById('typing');
  if (!el) return;

  if (typingIndex < typingText.length) {
    // Use textContent for security (no XSS)
    el.textContent += typingText.charAt(typingIndex);
    typingIndex++;
    typingTimeout = setTimeout(type, 100);
  }
}

// ==================== PARTICLE BACKGROUND ====================

/**
 * Initialize particle background animation
 */
function initParticles() {
  const loaderEl = document.getElementById('particles-loader');
  const fallbackEl = document.getElementById('particles-fallback');

  if (loaderEl) {
    loaderEl.hidden = false;
    loaderEl.setAttribute('aria-hidden', 'false');
  }
  if (fallbackEl) {
    fallbackEl.hidden = true;
    fallbackEl.setAttribute('aria-hidden', 'true');
  }

  let attempts = 0;
  const maxAttempts = 8;
  const attemptDelay = 250;

  const attemptInit = () => {
    if (typeof particlesJS !== 'undefined') {
      try {
        createParticles();
        if (loaderEl) {
          loaderEl.hidden = true;
          loaderEl.setAttribute('aria-hidden', 'true');
        }
        if (fallbackEl) {
          fallbackEl.hidden = true;
          fallbackEl.setAttribute('aria-hidden', 'true');
        }
        return;
      } catch (e) {
        console.warn('particlesJS initialization error:', e.message);
      }
    }

    attempts++;
    if (attempts <= maxAttempts) {
      setTimeout(attemptInit, attemptDelay);
    } else {
      // Show fallback after retries exhausted
      if (loaderEl) {
        loaderEl.hidden = true;
        loaderEl.setAttribute('aria-hidden', 'true');
      }
      if (fallbackEl) {
        fallbackEl.hidden = false;
        fallbackEl.setAttribute('aria-hidden', 'false');
      }
      console.warn('particles.js failed to initialize after retries.');
    }
  };

  attemptInit();
}

/**
 * Create particle configuration
 */
function createParticles() {
  try {
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 90,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#00f7ff'
        },
        shape: {
          type: 'circle'
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 5,
          random: true,
          anim: {
            enable: false,
            speed: 4,
            size_min: 0.3,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#00f7ff',
          opacity: 0.3,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'repulse'
          },
          onclick: {
            enable: true,
            mode: 'push'
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 400,
            line_linked: {
              opacity: 1
            }
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3
          },
          repulse: {
            distance: 200,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        }
      },
      retina_detect: true
    });
  } catch (e) {
    // Fallback: show background without particles
    const fallbackEl = document.getElementById('particles-fallback');
    const loaderEl = document.getElementById('particles-loader');
    if (loaderEl) {
      loaderEl.hidden = true;
      loaderEl.setAttribute('aria-hidden', 'true');
    }
    if (fallbackEl) {
      fallbackEl.hidden = false;
      fallbackEl.setAttribute('aria-hidden', 'false');
    }
    console.error('Particle initialization failed:', e.message);
  }
}

// ==================== LAZY LOADING IMAGES ====================

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      observer.observe(img);
    });
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
  initLazyLoading();
}

// ==================== SMOOTH SCROLL POLYFILL ====================

/**
 * Smooth scroll fallback for older browsers
 */
if (!('scrollBehavior' in document.documentElement.style)) {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

console.log('Portfolio script loaded successfully!');