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
 * Handle page load completion with optimized timing
 */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    // Add slight delay for smooth transition
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.classList.add('hidden');
        loader.style.display = 'none';
      }, 500);
    }, 300);
  }

  // Start animations after page load with staggered timing
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

  // Initialize progress bars only once with improved performance
  if (!progressInitialized) {
    const bars = document.querySelectorAll('.progress');
    const anyVisible = Array.from(bars).some(
      bar => bar.getBoundingClientRect().top < window.innerHeight
    );

    if (anyVisible) {
      requestAnimationFrame(() => {
        bars.forEach(bar => {
          if (bar.dataset.width) {
            bar.style.width = bar.dataset.width;
          }
        });
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
 * Animate typing character by character with variable speed
 */
function type() {
  const el = document.getElementById('typing');
  if (!el) return;

  if (typingIndex < typingText.length) {
    el.textContent += typingText.charAt(typingIndex);
    typingIndex++;
    
    // Slight variation in typing speed for natural feel
    const speed = typingIndex > 15 ? 120 : 100;
    typingTimeout = setTimeout(type, speed);
  }
}

// ==================== PARTICLE BACKGROUND ====================

/**
 * Initialize particle background animation with retry logic
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
  const maxAttempts = 10;
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
 * Create particle configuration with enhanced visuals
 */
function createParticles() {
  try {
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 100,
          density: {
            enable: true,
            value_area: 850
          }
        },
        color: {
          value: ['#00f7ff', '#6c63ff', '#00d4ff']
        },
        shape: {
          type: 'circle'
        },
        opacity: {
          value: 0.6,
          random: true,
          anim: {
            enable: true,
            speed: 1.2,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 4,
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
          distance: 160,
          color: ['#00f7ff', '#6c63ff'],
          opacity: 0.35,
          width: 1.5
        },
        move: {
          enable: true,
          speed: 2.2,
          direction: 'none',
          random: true,
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
            distance: 220,
            duration: 0.5
          },
          push: {
            particles_nb: 5
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
 * Initialize lazy loading for images with improved performance
 */
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageLoadConfig = {
      root: null,
      rootMargin: '50px',
      threshold: 0.01
    };

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
          }
          imageObserver.unobserve(img);
        }
      });
    }, imageLoadConfig);

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Initialize on DOM ready with performance optimization
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

// ==================== PERFORMANCE MONITORING ====================

/**
 * Monitor and log performance metrics
 */
if ('PerformanceObserver' in window) {
  try {
    const perfObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.log(`${entry.name}: ${entry.duration}ms`);
      }
    });
    
    perfObserver.observe({ entryTypes: ['measure'] });
  } catch (e) {
    console.warn('Performance observer not available:', e.message);
  }
}

// ==================== RESOURCE HINTS ====================

/**
 * Optimize resource loading with preload/prefetch
 */
function optimizeResourceLoading() {
  // Prefetch particles.js library
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js';
  document.head.appendChild(link);
}

optimizeResourceLoading();

console.log('Portfolio script loaded successfully with enhancements!');
