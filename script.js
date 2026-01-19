/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BIRTHDAY WEBSITE - PREMIUM JAVASCRIPT
 * Magical animations, countdown, cursor effects, and scroll reveals
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  // Birthday date - January 20th
  birthdayMonth: 0, // January (0-indexed)
  birthdayDay: 20,

  // Particles
  lockScreenParticleCount: 50,
  lockScreenStarCount: 80,
  heroParticleCount: 30,

  // Animation
  unlockDuration: 1500,
  scrollThreshold: 0.12,

  // Cursor
  cursorSmoothness: 0.15,
};

// ─────────────────────────────────────────────────────────────────────────────
// DOM ELEMENTS
// ─────────────────────────────────────────────────────────────────────────────
const elements = {
  lockScreen: document.getElementById("lockScreen"),
  birthdayContent: document.getElementById("birthdayContent"),
  particles: document.getElementById("particles"),
  stars: document.getElementById("stars"),
  heroParticles: document.getElementById("heroParticles"),
  cursorGlow: document.getElementById("cursorGlow"),
  countdown: {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pads number with leading zeros
 */
function padNumber(num, size = 2) {
  return String(num).padStart(size, "0");
}

/**
 * Random number between min and max
 */
function random(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Random item from array
 */
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Linear interpolation
 */
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/**
 * Throttle function
 */
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DATE & COUNTDOWN LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gets the birthday date for current or next year
 */
function getBirthdayDate() {
  const now = new Date();
  const currentYear = now.getFullYear();

  let birthday = new Date(
    currentYear,
    CONFIG.birthdayMonth,
    CONFIG.birthdayDay,
    0,
    0,
    0,
    0,
  );
  const endOfBirthday = new Date(
    currentYear,
    CONFIG.birthdayMonth,
    CONFIG.birthdayDay,
    23,
    59,
    59,
    999,
  );

  if (now > endOfBirthday) {
    birthday = new Date(
      currentYear + 1,
      CONFIG.birthdayMonth,
      CONFIG.birthdayDay,
      0,
      0,
      0,
      0,
    );
  }

  return birthday;
}

/**
 * Checks if birthday content should be shown
 */
function shouldShowBirthdayContent() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const birthdayStart = new Date(
    currentYear,
    CONFIG.birthdayMonth,
    CONFIG.birthdayDay,
    0,
    0,
    0,
    0,
  );
  const birthdayEnd = new Date(
    currentYear,
    CONFIG.birthdayMonth,
    CONFIG.birthdayDay,
    23,
    59,
    59,
    999,
  );

  return now >= birthdayStart && now <= birthdayEnd;
}

/**
 * Updates the countdown display
 */
function updateCountdown() {
  const now = new Date();
  const birthday = getBirthdayDate();
  const diff = birthday - now;

  if (diff <= 0) {
    unlockBirthdayContent();
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Update with animation
  updateCountdownValue(elements.countdown.days, padNumber(days));
  updateCountdownValue(elements.countdown.hours, padNumber(hours));
  updateCountdownValue(elements.countdown.minutes, padNumber(minutes));
  updateCountdownValue(elements.countdown.seconds, padNumber(seconds));
}

/**
 * Updates countdown value with subtle animation
 */
function updateCountdownValue(element, newValue) {
  if (!element) return;

  if (element.textContent !== newValue) {
    element.style.transform = "scale(1.1)";
    element.textContent = newValue;
    setTimeout(() => {
      element.style.transform = "scale(1)";
    }, 100);
  }
}

/**
 * Starts the countdown timer
 */
function startCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ─────────────────────────────────────────────────────────────────────────────
// PARTICLE SYSTEMS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates stars for the lock screen
 */
function createStars() {
  if (!elements.stars) return;

  for (let i = 0; i < CONFIG.lockScreenStarCount; i++) {
    const star = document.createElement("div");
    star.className = "star-particle";
    star.style.left = `${random(0, 100)}%`;
    star.style.top = `${random(0, 100)}%`;
    star.style.animationDelay = `${random(0, 3)}s`;
    star.style.animationDuration = `${random(2, 4)}s`;
    star.style.width = `${random(2, 4)}px`;
    star.style.height = star.style.width;
    star.style.opacity = random(0.3, 0.8);
    elements.stars.appendChild(star);
  }
}

/**
 * Creates floating particles for the lock screen
 */
function createParticles() {
  if (!elements.particles) return;

  const types = ["circle", "star", "heart"];
  const symbols = {
    star: "✦",
    heart: "♡",
  };

  for (let i = 0; i < CONFIG.lockScreenParticleCount; i++) {
    const particle = document.createElement("div");
    const type = randomItem(types);
    particle.className = `particle ${type}`;

    if (type !== "circle") {
      particle.textContent = symbols[type];
    }

    particle.style.left = `${random(0, 100)}%`;
    particle.style.animationDelay = `${random(0, 20)}s`;
    particle.style.animationDuration = `${random(15, 25)}s`;

    if (type === "circle") {
      const size = random(4, 10);
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
    } else {
      particle.style.fontSize = `${random(10, 18)}px`;
    }

    particle.style.opacity = random(0.3, 0.7);
    elements.particles.appendChild(particle);
  }
}

/**
 * Creates particles for the hero section
 */
function createHeroParticles() {
  if (!elements.heroParticles) return;

  for (let i = 0; i < CONFIG.heroParticleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle star";
    particle.textContent = randomItem(["✦", "✧", "·"]);
    particle.style.position = "absolute";
    particle.style.left = `${random(0, 100)}%`;
    particle.style.top = `${random(0, 100)}%`;
    particle.style.fontSize = `${random(8, 16)}px`;
    particle.style.color = randomItem(["#d4a574", "#e8b4c4", "#d4c4e8"]);
    particle.style.opacity = random(0.2, 0.5);
    particle.style.animation = `twinkle-star ${random(2, 4)}s infinite ease-in-out`;
    particle.style.animationDelay = `${random(0, 3)}s`;
    elements.heroParticles.appendChild(particle);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CURSOR GLOW EFFECT
// ─────────────────────────────────────────────────────────────────────────────

let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

/**
 * Updates cursor glow position smoothly
 */
function updateCursorGlow() {
  if (!elements.cursorGlow) return;

  currentX = lerp(currentX, mouseX, CONFIG.cursorSmoothness);
  currentY = lerp(currentY, mouseY, CONFIG.cursorSmoothness);

  elements.cursorGlow.style.left = `${currentX}px`;
  elements.cursorGlow.style.top = `${currentY}px`;

  requestAnimationFrame(updateCursorGlow);
}

/**
 * Handles mouse movement
 */
function handleMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

/**
 * Initializes cursor glow effect
 */
function initCursorGlow() {
  if (!elements.cursorGlow) return;

  document.addEventListener("mousemove", handleMouseMove);
  updateCursorGlow();
}

// ─────────────────────────────────────────────────────────────────────────────
// UNLOCK MECHANISM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Unlocks and reveals the birthday content
 */
function unlockBirthdayContent() {
  if (!elements.lockScreen || !elements.birthdayContent) return;

  // Add unlock animation
  elements.lockScreen.classList.add("unlocking");

  // After animation, hide lock screen and show content
  setTimeout(() => {
    elements.lockScreen.classList.add("hidden");
    elements.birthdayContent.classList.remove("hidden");
    elements.birthdayContent.classList.add("revealing");

    // Initialize main content features
    setTimeout(() => {
      createHeroParticles();
      initScrollAnimations();
      checkElementsInView();
    }, 100);
  }, CONFIG.unlockDuration);
}

/**
 * Shows birthday content immediately
 */
function showBirthdayContentImmediately() {
  if (!elements.lockScreen || !elements.birthdayContent) return;

  elements.lockScreen.classList.add("hidden");
  elements.birthdayContent.classList.remove("hidden");

  setTimeout(() => {
    createHeroParticles();
    initScrollAnimations();
    checkElementsInView();
  }, 100);
}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL ANIMATIONS
// ─────────────────────────────────────────────────────────────────────────────

let scrollObserver = null;

/**
 * Initializes scroll-based animations
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  if (!animatedElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -80px 0px",
    threshold: CONFIG.scrollThreshold,
  };

  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((element) => {
    scrollObserver.observe(element);
  });
}

/**
 * Checks and animates elements currently in view
 */
function checkElementsInView() {
  const animatedElements = document.querySelectorAll(
    ".animate-on-scroll:not(.visible)",
  );

  animatedElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (
      rect.top < windowHeight * (1 - CONFIG.scrollThreshold) &&
      rect.bottom > 0
    ) {
      element.classList.add("visible");
      if (scrollObserver) {
        scrollObserver.unobserve(element);
      }
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPEWRITER EFFECT FOR HERO QUOTES (Optional Enhancement)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates typewriter effect on quote lines
 */
function initTypewriterEffect() {
  const quoteLines = document.querySelectorAll(".quote-line");

  quoteLines.forEach((line, index) => {
    const text = line.textContent;
    line.textContent = "";
    line.style.opacity = "1";

    const delay = index * 1500;

    setTimeout(() => {
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex < text.length) {
          line.textContent += text[charIndex];
          charIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 50);
    }, delay);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SMOOTH SCROLL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Initializes smooth scrolling for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PARALLAX EFFECT (Subtle)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Applies subtle parallax to background shapes
 */
function initParallax() {
  const shapes = document.querySelectorAll(".bg-shape");

  if (!shapes.length) return;

  window.addEventListener(
    "scroll",
    throttle(() => {
      const scrolled = window.pageYOffset;

      shapes.forEach((shape, index) => {
        const speed = 0.02 + index * 0.01;
        const yPos = -(scrolled * speed);
        shape.style.transform = `translate(0, ${yPos}px)`;
      });
    }, 16),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD TILT EFFECT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Adds subtle tilt effect to cards on hover
 */
function initCardTilt() {
  const cards = document.querySelectorAll(".about-card, .career-card-main");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Main initialization function
 */
function init() {
  // Initialize cursor glow (desktop only)
  if (window.matchMedia("(pointer: fine)").matches) {
    initCursorGlow();
  }

  // Check if it's already the birthday
  if (shouldShowBirthdayContent()) {
    showBirthdayContentImmediately();
  } else {
    // Show countdown
    createStars();
    createParticles();
    startCountdown();
  }

  // Initialize smooth scroll
  initSmoothScroll();

  // Add scroll listener
  window.addEventListener("scroll", throttle(checkElementsInView, 100), {
    passive: true,
  });
  window.addEventListener("resize", debounce(checkElementsInView, 200), {
    passive: true,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// DOM READY
// ─────────────────────────────────────────────────────────────────────────────

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING COMPLETE EFFECTS
// ─────────────────────────────────────────────────────────────────────────────

window.addEventListener("load", () => {
  // Add loaded class to body for any post-load animations
  document.body.classList.add("loaded");

  // Initialize effects that need full page load
  setTimeout(() => {
    if (!shouldShowBirthdayContent()) return;
    initParallax();
    initCardTilt();
  }, 500);
});

// ─────────────────────────────────────────────────────────────────────────────
// CONSOLE GREETING
// ─────────────────────────────────────────────────────────────────────────────

console.log(
  `%c✨ Happy Birthday! ✨`,
  `background: linear-gradient(135deg, #f4d7e0, #e6dff0); 
     color: #2a2a35; 
     padding: 15px 30px; 
     border-radius: 10px; 
     font-size: 18px; 
     font-weight: bold;
     font-family: 'Georgia', serif;`,
);
console.log(
  `%cMade with 💝 for someone special`,
  `color: #9b6b8e; 
     font-size: 14px; 
     font-family: 'Georgia', serif;
     font-style: italic;`,
);
