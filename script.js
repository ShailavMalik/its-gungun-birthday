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
  loadingScreen: document.getElementById("loadingScreen"),
  loadingParticles: document.getElementById("loadingParticles"),
  birthdayContent: document.getElementById("birthdayContent"),
  heroParticles: document.getElementById("heroParticles"),
  cursorGlow: document.getElementById("cursorGlow"),
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
// EMAIL SERVICE SETUP (SECURE BACKEND)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Initialize EmailJS service
 * Credentials are now handled securely by Node.js backend (Vercel)
 */
function initializeEmailJS() {
  console.log("✅ Secure email service initialized (Node.js backend)");
}

/**
 * Send email via secure Node.js backend
 * Endpoint: /api/send-email
 * This prevents exposing credentials to the client
 */
async function sendEmailViaBackend(action = "send_test_email") {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: action,
      }),
    });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!response.ok) {
      const fallbackMessage =
        response.status === 405 ?
          "API not available here. Use Vercel deployment or vercel dev."
        : `Request failed (${response.status}).`;
      console.error("❌ Email request failed:", response.status);
      showNotification(`❌ ${fallbackMessage}`, "error");
      return false;
    }

    if (!isJson) {
      console.error("❌ Email API returned non-JSON response");
      showNotification(
        "❌ Email API response invalid. Check server setup.",
        "error",
      );
      return false;
    }

    const data = await response.json();

    if (data.success) {
      console.log("✅ Email sent successfully!");
      showNotification("✅ Email sent successfully!", "success");
      return true;
    }

    console.error("❌ Failed to send email:", data.message);
    showNotification("❌ " + data.message, "error");
    return false;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    showNotification("❌ Error sending email. Please try again.", "error");
    return false;
  }
}

/**
 * Send birthday email automatically
 * Called on January 20th at 12 AM IST
 */
function sendBirthdayEmail() {
  sendEmailViaBackend("send_birthday_email");
}

/**
 * Send test email (manual trigger)
 */
function sendTestEmail() {
  sendEmailViaBackend("send_test_email");
}

/**
 * Show notification to user
 */
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => notification.remove(), 500);
  }, 5000);
}

/**
 * Check if today is birthday and send email at 12 AM IST
 * This should be called periodically
 */
function checkAndSendBirthdayEmail() {
  const now = new Date();
  const istTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  );

  const isBirthdayMonth = istTime.getMonth() === CONFIG.birthdayMonth;
  const isBirthdayDay = istTime.getDate() === CONFIG.birthdayDay;
  const isNoon = istTime.getHours() === 0 && istTime.getMinutes() < 1;

  if (isBirthdayMonth && isBirthdayDay && isNoon) {
    console.log("🎂 It's the birthday! Sending email...");
    sendBirthdayEmail();
  }
}

/**
 * Set up automated email check
 * Checks every minute for birthday
 */
function setupAutomaticEmailScheduler() {
  // Initial check
  checkAndSendBirthdayEmail();

  // Check every minute
  setInterval(checkAndSendBirthdayEmail, 60000);

  console.log(
    "📧 Birthday email scheduler activated for January 20th at 12 AM IST",
  );
}

/**
 * Initialize test email button
 */
function initTestEmailButton() {
  const btn = document.getElementById("testEmailBtn");
  if (!btn) return;

  // Click handler
  btn.addEventListener("click", () => {
    btn.classList.add("loading");
    sendTestEmail();
    setTimeout(() => btn.classList.remove("loading"), 3000);
  });
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
// HOLOGRAPHIC LOADING SCREEN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates floating stars for the loading screen
 */
function createLoadingStars() {
  const starField = document.getElementById("starField");
  if (!starField) return;

  const starCount = 100;
  const colors = [
    "#ff2d95",
    "#a855f7",
    "#3b82f6",
    "#06b6d4",
    "#fbbf24",
    "#ffffff",
  ];

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    const size = random(1, 4);
    const color = randomItem(colors);

    star.style.cssText = `
      position: absolute;
      left: ${random(0, 100)}%;
      top: ${random(0, 100)}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      box-shadow: 0 0 ${size * 3}px ${color};
      animation: star-twinkle ${random(2, 5)}s ease-in-out infinite;
      animation-delay: ${random(-3, 0)}s;
      opacity: ${random(0.3, 1)};
    `;

    starField.appendChild(star);
  }

  // Add star twinkle animation dynamically
  if (!document.getElementById("starKeyframes")) {
    const style = document.createElement("style");
    style.id = "starKeyframes";
    style.textContent = `
      @keyframes star-twinkle {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.5); }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Creates floating particles for loading screen
 */
function createLoadingParticles() {
  const container = document.getElementById("loadingParticles");
  if (!container) return;

  const particleCount = 50;
  const colors = ["#ff2d95", "#a855f7", "#3b82f6", "#06b6d4", "#fbbf24"];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    const size = random(2, 6);
    const color = randomItem(colors);

    particle.style.cssText = `
      position: absolute;
      left: ${random(0, 100)}%;
      top: ${random(100, 120)}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      box-shadow: 0 0 ${size * 4}px ${color};
      animation: particle-float-up ${random(4, 8)}s linear infinite;
      animation-delay: ${random(-5, 0)}s;
    `;

    container.appendChild(particle);
  }

  // Add particle animation dynamically
  if (!document.getElementById("particleKeyframes")) {
    const style = document.createElement("style");
    style.id = "particleKeyframes";
    style.textContent = `
      @keyframes particle-float-up {
        0% { 
          transform: translateY(0) translateX(0) scale(1);
          opacity: 0;
        }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { 
          transform: translateY(-120vh) translateX(${random(-50, 50)}px) scale(0.5);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Animates the futuristic progress bar
 */
function animateProgress() {
  const progressFill = document.getElementById("progressFill");
  const percentEl = document.getElementById("progressPercent");
  if (!percentEl) return;

  let progress = 0;
  const duration = 4000; // 4 seconds
  const interval = 30; // Update every 30ms
  const increment = 100 / (duration / interval);

  const timer = setInterval(() => {
    progress += increment;
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);
    }
    percentEl.textContent = Math.floor(progress) + "%";
    if (progressFill) {
      progressFill.style.width = progress + "%";
    }
  }, interval);
}

/**
 * Hides the loading screen with animation
 */
function hideLoadingScreen() {
  if (!elements.loadingScreen) return;

  // Start the fade out animation after progress completes
  setTimeout(() => {
    elements.loadingScreen.classList.add("hidden");

    // After animation completes, reveal the birthday content
    setTimeout(() => {
      showBirthdayContentImmediately();
    }, 1200);
  }, 4500); // Match progress animation duration + buffer
}

/**
 * Initializes all loading screen animations
 */
function initLoadingScreen() {
  createLoadingStars();
  createLoadingParticles();
  animateProgress();
  hideLoadingScreen();
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
  if (!elements.birthdayContent) return;

  // Remove hidden class if present
  if (elements.lockScreen) {
    elements.lockScreen.classList.add("hidden");
  }
  elements.birthdayContent.classList.remove("hidden");

  // Immediately show hero section elements (first screen)
  const heroElements = document.querySelectorAll(".hero .animate-on-scroll");
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add("visible");
    }, index * 100); // Staggered reveal
  });

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
  const cards = document.querySelectorAll(".about-card, .mca-card-main");

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
  // Initialize EmailJS for automatic birthday emails
  initializeEmailJS();
  setupAutomaticEmailScheduler();
  initTestEmailButton();

  // Initialize cursor glow (desktop only)
  if (window.matchMedia("(pointer: fine)").matches) {
    initCursorGlow();
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

  // Show loading screen with new 3D animations
  if (elements.loadingScreen) {
    initLoadingScreen();
  } else {
    // Fallback if loading screen doesn't exist
    showBirthdayContentImmediately();
  }
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
