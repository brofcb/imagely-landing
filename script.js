// =========================================================
// Imagely Landing Page Interactions
// =========================================================

const siteHeader = document.getElementById("siteHeader");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("mainNav");
const yearNode = document.getElementById("currentYear");
const themeToggle = document.getElementById("themeToggle");
const themeMeta = document.querySelector("meta[name='theme-color']");
const carousel = document.getElementById("demoCarousel");
const carouselTrack = document.getElementById("carouselTrack");
const carouselDots = document.getElementById("carouselDots");

// Sticky header shadow on scroll
const handleHeader = () => {
  const shouldElevate = window.scrollY > 8;
  siteHeader.classList.toggle("scrolled", shouldElevate);
};

window.addEventListener("scroll", handleHeader, { passive: true });
handleHeader();

// Theme toggle and persistence
const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);

  if (themeToggle) {
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    const nextLabel = isDark ? "Switch to light mode" : "Switch to dark mode";
    themeToggle.setAttribute("aria-label", nextLabel);
    themeToggle.setAttribute("title", nextLabel);
  }

  if (themeMeta) {
    themeMeta.setAttribute("content", theme === "dark" ? "#0b1119" : "#f7fbff");
  }
};

const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
applyTheme(currentTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("imagely-theme", nextTheme);
    } catch (error) {
      // Ignore storage failures in strict/private browser contexts.
    }
    applyTheme(nextTheme);
  });
}

// Demo carousel
if (carousel && carouselTrack && carouselDots) {
  const slides = Array.from(carouselTrack.querySelectorAll(".demo-slide"));
  const prevBtn = carousel.querySelector(".carousel-btn.prev");
  const nextBtn = carousel.querySelector(".carousel-btn.next");
  let index = 0;

  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to screenshot ${i + 1}`);
    dot.addEventListener("click", () => {
      index = i;
      updateCarousel();
    });
    carouselDots.appendChild(dot);
    return dot;
  });

  const updateCarousel = () => {
    carouselTrack.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  };

  prevBtn?.addEventListener("click", () => {
    index = index === 0 ? slides.length - 1 : index - 1;
    updateCarousel();
  });

  nextBtn?.addEventListener("click", () => {
    index = index === slides.length - 1 ? 0 : index + 1;
    updateCarousel();
  });

  // Touch swipe support
  let startX = 0;
  let endX = 0;
  carouselTrack.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].clientX;
  });
  carouselTrack.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    const delta = endX - startX;
    if (Math.abs(delta) > 45) {
      if (delta < 0) {
        index = index === slides.length - 1 ? 0 : index + 1;
      } else {
        index = index === 0 ? slides.length - 1 : index - 1;
      }
      updateCarousel();
    }
  });

  updateCarousel();
}

// Mobile nav toggle
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Reveal elements when entering viewport
const revealTargets = document.querySelectorAll(".reveal");
const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (motionReduced) {
  revealTargets.forEach((el) => el.classList.add("visible"));
} else {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  revealTargets.forEach((target) => observer.observe(target));
}

// Dynamic year in footer
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}
