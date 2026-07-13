/* Mobile menu (with aria-expanded toggle) */
function toggleMenu() {
  const nav = document.getElementById("nav");
  const btn = document.querySelector(".menu-toggle");
  const expanded = btn && btn.getAttribute("aria-expanded") === "true";

  if (nav) nav.classList.toggle("active");
  if (btn) btn.setAttribute("aria-expanded", (!expanded).toString());
}

/* Loader (safe + smooth) */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 1000);
  }

  // Start typing after load (so it's visible)
  startTyping();

  // Initialize particles after load (with loader + fallback)
  initParticles();

  // Run one initial scroll pass to reveal elements already in view
  debouncedOnScroll();
});

/* Debounce utility */
function debounce(fn, wait = 100) {
  let timeout;
  return function(...args) {
    const ctx = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(ctx, args), wait);
  };
}

/* Scroll animations + skill bars (debounced for performance) */
let progressInitialized = false;
function onScroll() {
  document.querySelectorAll(".reveal").forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 50) {
      el.classList.add("active");
    }
  });

  // Set progress bars only once when they become visible
  if (!progressInitialized) {
    const bars = Array.from(document.querySelectorAll(".progress"));
    const anyVisible = bars.some(bar => bar.getBoundingClientRect().top < window.innerHeight);
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
const debouncedOnScroll = debounce(onScroll, 120);
window.addEventListener("scroll", debouncedOnScroll);

/* Typing effect (deferred start) */
const text = "MD. Raiyan Sazid Khan";
let i = 0;

function startTyping() {
  i = 0;
  const el = document.getElementById("typing");
  if (el) el.innerHTML = "";
  type();
}

function type() {
  const el = document.getElementById("typing");
  if (el && i < text.length) {
    el.innerHTML += text.charAt(i);
    i++;
    setTimeout(type, 100);
  }
}

/* Particles background with loader + fallback */
function initParticles() {
  const loaderEl = document.getElementById('particles-loader');
  const fallbackEl = document.getElementById('particles-fallback');

  // show small loader badge
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
    if (typeof particlesJS !== "undefined") {
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
        console.warn("particlesJS init threw:", e);
      }
    }

    attempts++;
    if (attempts <= maxAttempts) {
      setTimeout(attemptInit, attemptDelay);
    } else {
      // show fallback after retries exhausted
      if (loaderEl) {
        loaderEl.hidden = true;
        loaderEl.setAttribute('aria-hidden', 'true');
      }
      if (fallbackEl) {
        fallbackEl.hidden = false;
        fallbackEl.setAttribute('aria-hidden', 'false');
      }
      console.warn("particles.js failed to load/initialize after retries.");
    }
  };

  attemptInit();
}

function createParticles() {
  // safe create, handle possible exceptions
  try {
    particlesJS("particles-js", {
      particles: {
        number: { value: 90 },
        size: { value: 5 },
        move: { speed: 1 },
        line_linked: { enable: true }
      }
    });
  } catch (e) {
    // if create fails show fallback badge if present
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
    throw e;
  }
}
