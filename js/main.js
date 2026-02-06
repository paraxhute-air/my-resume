/**
 * Portfolio Main JavaScript
 * Handles data loading, theme toggle, navigation, and PDF export
 */

// ========================================
// Configuration
// ========================================
const DATA_URL = "resources/data.json";
const STORAGE_KEY = "portfolio_data";

// ========================================
// State
// ========================================
let portfolioData = null;

// ========================================
// DOM Elements
// ========================================
const elements = {
  // Theme toggles
  themeToggleDesktop: document.getElementById("theme-toggle-desktop"),
  themeToggleMobile: document.getElementById("theme-toggle-mobile"),

  // Mobile menu
  hamburger: document.getElementById("hamburger"),
  mobileMenu: document.getElementById("mobile-menu"),
  mobileMenuOverlay: document.getElementById("mobile-menu-overlay"),

  // PDF buttons
  pdfBtnDesktop: document.getElementById("pdf-btn-desktop"),
  pdfBtnMobile: document.getElementById("pdf-btn-mobile"),

  // Profile
  profileImg: document.getElementById("profile-img"),
  profileName: document.getElementById("profile-name"),
  profileTitle: document.getElementById("profile-title"),
  profileSummary: document.getElementById("profile-summary"),

  // Lists
  experienceList: document.getElementById("experience-list"),
  projectsList: document.getElementById("projects-list"),
  skillsProgramming: document.getElementById("skills-programming"),
  skillsTools: document.getElementById("skills-tools"),
  skillsLanguages: document.getElementById("skills-languages"),
  strengthsList: document.getElementById("strengths-list"),
  finalNoteText: document.getElementById("final-note-text"),

  // Navigation links
  navLinks: document.querySelectorAll(".nav-link"),
  sections: document.querySelectorAll("section[id]"),
};

// ========================================
// Theme Management
// ========================================
function initTheme() {
  // Check localStorage first, then system preference
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  } else {
    // Use system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    document.documentElement.classList.toggle("dark", prefersDark);
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// ========================================
// Mobile Menu
// ========================================
function initMobileMenu() {
  elements.hamburger?.addEventListener("click", toggleMobileMenu);
  elements.mobileMenuOverlay?.addEventListener("click", closeMobileMenu);

  // Close menu when clicking a link
  elements.mobileMenu?.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
}

function toggleMobileMenu() {
  elements.hamburger?.classList.toggle("open");
  elements.mobileMenu?.classList.toggle("open");
  elements.mobileMenuOverlay?.classList.toggle("hidden");
  document.body.style.overflow = elements.mobileMenu?.classList.contains("open")
    ? "hidden"
    : "";
}

function closeMobileMenu() {
  elements.hamburger?.classList.remove("open");
  elements.mobileMenu?.classList.remove("open");
  elements.mobileMenuOverlay?.classList.add("hidden");
  document.body.style.overflow = "";
}

// ========================================
// Navigation & Scroll
// ========================================
function initNavigation() {
  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").slice(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Intersection Observer for active nav state
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        updateActiveNav(id);
      }
    });
  }, observerOptions);

  elements.sections.forEach((section) => observer.observe(section));
}

function updateActiveNav(activeId) {
  elements.navLinks.forEach((link) => {
    const href = link.getAttribute("href").slice(1);
    link.classList.toggle("active", href === activeId);
  });
}

// ========================================
// Fade-in Animation (Legacy support)
// ========================================
function initFadeAnimations() {
  const fadeElements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 },
  );

  fadeElements.forEach((el) => observer.observe(el));
}

// ========================================
// Reveal Section Animations
// ========================================
function initRevealAnimations() {
  const revealSections = document.querySelectorAll('.reveal-section');
  const staggerContainers = document.querySelectorAll('.stagger-children');
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    { threshold: 0.1, rootMargin: '-50px' }
  );
  
  revealSections.forEach((section) => observer.observe(section));
  staggerContainers.forEach((container) => observer.observe(container));
}

// ========================================
// 3D Tilt Effect
// ========================================
function initTiltEffect() {
  const tiltElement = document.querySelector('.profile-3d');
  if (!tiltElement) return;
  
  tiltElement.addEventListener('mousemove', (e) => {
    const rect = tiltElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    tiltElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  
  tiltElement.addEventListener('mouseleave', () => {
    tiltElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
}

// ========================================
// Navigation Connection Lines
// ========================================
function initConnectionLines() {
  const svg = document.getElementById('connection-svg');
  const navLinks = document.querySelectorAll('.nav-link[data-target]');
  
  if (!svg || navLinks.length === 0) return;
  
  // Create connection elements
  navLinks.forEach((link) => {
    const targetId = link.getAttribute('data-target');
    
    // Create path element
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'connection-line');
    path.setAttribute('data-connection', targetId);
    svg.appendChild(path);
    
    // Create start dot
    const startDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    startDot.setAttribute('class', 'connection-dot');
    startDot.setAttribute('r', '4');
    startDot.setAttribute('data-dot-start', targetId);
    svg.appendChild(startDot);
    
    // Create end dot
    const endDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    endDot.setAttribute('class', 'connection-dot');
    endDot.setAttribute('r', '4');
    endDot.setAttribute('data-dot-end', targetId);
    svg.appendChild(endDot);
  });
  
  // Update line positions
  function updateConnectionLines(activeId = null, hoverId = null) {
    navLinks.forEach((link) => {
      const targetId = link.getAttribute('data-target');
      const targetSection = document.querySelector(`[data-section="${targetId}"]`);
      const navDot = link.querySelector('.nav-dot');
      
      if (!targetSection) return;
      
      const path = svg.querySelector(`[data-connection="${targetId}"]`);
      const startDot = svg.querySelector(`[data-dot-start="${targetId}"]`);
      const endDot = svg.querySelector(`[data-dot-end="${targetId}"]`);
      
      if (!path || !startDot || !endDot) return;
      
      // Get positions
      const linkRect = link.getBoundingClientRect();
      const sectionRect = targetSection.getBoundingClientRect();
      
      const startX = linkRect.right - 4;
      const startY = linkRect.top + linkRect.height / 2;
      const endX = sectionRect.left + 20;
      const endY = sectionRect.top + 40;
      
      // Create curved path
      const midX = startX + (endX - startX) / 2;
      const pathD = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
      
      path.setAttribute('d', pathD);
      startDot.setAttribute('cx', startX);
      startDot.setAttribute('cy', startY);
      endDot.setAttribute('cx', endX);
      endDot.setAttribute('cy', endY);
      
      // Handle active/hover states
      const isActive = targetId === activeId;
      const isHover = targetId === hoverId;
      
      path.classList.toggle('active', isActive && !isHover);
      path.classList.toggle('hover', isHover);
      startDot.classList.toggle('active', isActive || isHover);
      startDot.classList.toggle('hover', isHover);
      endDot.classList.toggle('active', isActive || isHover);
      endDot.classList.toggle('hover', isHover);
      
      // Update nav dot visibility
      if (navDot) {
        navDot.style.opacity = (isActive || isHover) ? '1' : '0';
      }
    });
  }
  
  // Initialize with scroll position
  let currentActiveId = null;
  
  // Intersection observer for active section
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          currentActiveId = entry.target.getAttribute('data-section');
          updateConnectionLines(currentActiveId);
          
          // Spotlight/Lift Effect
          document.querySelectorAll('section').forEach(s => s.classList.remove('active-section'));
          entry.target.classList.add('active-section');
        }
      });
    },
    { rootMargin: '-20% 0px -60% 0px' }
  );
  
  document.querySelectorAll('[data-section]').forEach((section) => {
    sectionObserver.observe(section);
  });
  
  // Hover effects
  navLinks.forEach((link) => {
    const targetId = link.getAttribute('data-target');
    
    link.addEventListener('mouseenter', () => {
      updateConnectionLines(currentActiveId, targetId);
    });
    
    link.addEventListener('mouseleave', () => {
      updateConnectionLines(currentActiveId);
    });
  });
  
  // Update on scroll/resize
  let ticking = false;
  const updateOnScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateConnectionLines(currentActiveId);
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', updateOnScroll, { passive: true });
  window.addEventListener('resize', updateOnScroll, { passive: true });
  
  // Initial update
  setTimeout(() => updateConnectionLines(currentActiveId), 100);
}

// ========================================
// Typing Animation
// ========================================
function initTypingAnimation() {
  const typingElements = document.querySelectorAll('.typing-text');
  
  typingElements.forEach((el) => {
    // Remove cursor after animation completes
    el.addEventListener('animationend', () => {
      el.classList.add('done');
    });
  });
}

// ========================================
// Data Loading & Rendering
// ========================================
async function loadData() {
  try {
    // Check localStorage first (where editor saves data)
    const storedData = localStorage.getItem(STORAGE_KEY);
    
    if (storedData) {
      portfolioData = JSON.parse(storedData);
      renderPortfolio();
      return;
    }
    
    // Fallback to JSON file if no localStorage data
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error("Failed to load data");
    portfolioData = await response.json();
    
    // Save to localStorage for next time
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolioData));

    renderPortfolio();
  } catch (error) {
    console.error("Error loading data:", error);
    showPlaceholderContent();
  }
}

function renderPortfolio() {
  if (!portfolioData) return;

  // Render Profile
  renderProfile();

  // Render Experience
  renderExperience();

  // Render Projects
  renderProjects();

  // Render Skills
  renderSkills();

  // Render Strengths
  renderStrengths();

  // Render Final Note
  renderFinalNote();
}

function renderProfile() {
  const { profile } = portfolioData;
  if (!profile) return;

  if (elements.profileName)
    elements.profileName.textContent = profile.name || "";
  if (elements.profileTitle)
    elements.profileTitle.textContent = profile.title || "";
  if (elements.profileSummary)
    elements.profileSummary.textContent = profile.summary || "";

  if (elements.profileImg && profile.image) {
    // Check if it's a base64 image or a file path
    if (profile.image.startsWith("data:")) {
      elements.profileImg.src = profile.image;
    } else {
      elements.profileImg.src = profile.image;
    }
  }
}

function renderExperience() {
  const { experience } = portfolioData;
  if (!experience || !elements.experienceList) return;

  elements.experienceList.innerHTML = experience
    .map(
      (exp, index) => `
    <div class="timeline-item timeline-animated pb-6" style="--delay: ${index * 0.1}s">
      <div class="timeline-dot"></div>
      <div class="card card-lift p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <h3 class="text-lg font-semibold">${escapeHtml(exp.company)}</h3>
          <span class="text-sm text-[var(--accent)]">${escapeHtml(exp.period)}</span>
        </div>
        <p class="font-medium text-[var(--text-secondary)] mb-2">${escapeHtml(exp.role)}</p>
        <p class="text-[var(--text-muted)]">${escapeHtml(exp.description)}</p>
      </div>
    </div>
  `,
    )
    .join("");
    
  // Trigger timeline animation
  setTimeout(() => {
    document.querySelectorAll('.timeline-animated').forEach((el) => {
      el.classList.add('visible');
    });
  }, 300);
}

function renderProjects() {
  const { projects } = portfolioData;
  if (!projects || !elements.projectsList) return;

  elements.projectsList.innerHTML = projects
    .map(
      (project) => `
    <div class="card card-lift p-6">
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-lg font-semibold">${escapeHtml(project.name)}</h3>
      </div>
      <p class="text-sm text-[var(--accent)] mb-3">${escapeHtml(project.period)}</p>
      <p class="text-[var(--text-secondary)] mb-4">${escapeHtml(project.description)}</p>
      <div class="flex flex-wrap gap-2">
        ${(project.tech || [])
          .map(
            (tech) => `
          <span class="skill-tag text-xs">${escapeHtml(tech)}</span>
        `,
          )
          .join("")}
      </div>
    </div>
  `,
    )
    .join("");
}

function renderSkills() {
  const { skills } = portfolioData;
  if (!skills) return;

  if (elements.skillsProgramming) {
    elements.skillsProgramming.innerHTML = (skills.programming || [])
      .map((skill) => `<span class="skill-tag">${escapeHtml(skill)}</span>`)
      .join("");
  }

  if (elements.skillsTools) {
    elements.skillsTools.innerHTML = (skills.tools || [])
      .map((skill) => `<span class="skill-tag">${escapeHtml(skill)}</span>`)
      .join("");
  }

  if (elements.skillsLanguages) {
    elements.skillsLanguages.innerHTML = (skills.languages || [])
      .map((skill) => `<span class="skill-tag">${escapeHtml(skill)}</span>`)
      .join("");
  }
}

function renderStrengths() {
  const { strengths } = portfolioData;
  if (!strengths || !elements.strengthsList) return;

  elements.strengthsList.innerHTML = strengths
    .map(
      (strength) => `
    <div class="card card-lift strength-card p-6">
      <h3 class="text-lg font-semibold mb-2">${escapeHtml(strength.title)}</h3>
      <p class="text-[var(--text-secondary)]">${escapeHtml(strength.description)}</p>
    </div>
  `,
    )
    .join("");
}

function renderFinalNote() {
  const { finalNote } = portfolioData;
  if (!finalNote || !elements.finalNoteText) return;

  elements.finalNoteText.textContent = finalNote;
}

function showPlaceholderContent() {
  // Show default placeholder content when data fails to load
  console.log("Showing placeholder content");
}

// ========================================
// PDF Export
// ========================================
function initPdfExport() {
  elements.pdfBtnDesktop?.addEventListener("click", exportPdf);
  elements.pdfBtnMobile?.addEventListener("click", exportPdf);
}

async function exportPdf() {
  const mainContent = document.getElementById("main-content");
  if (!mainContent) return;

  // Show loading state
  const btn = document.activeElement;
  const originalText = btn?.textContent;
  if (btn) btn.textContent = "⏳ 생성 중...";

  const options = {
    margin: [10, 10, 10, 10],
    filename: "portfolio.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  try {
    await html2pdf().set(options).from(mainContent).save();
  } catch (error) {
    console.error("PDF export failed:", error);
    alert("PDF 생성에 실패했습니다.");
  } finally {
    if (btn) btn.textContent = originalText;
  }
}

// ========================================
// Utility Functions
// ========================================
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ========================================
// Event Listeners
// ========================================
function initEventListeners() {
  // Theme toggles
  elements.themeToggleDesktop?.addEventListener("click", toggleTheme);
  elements.themeToggleMobile?.addEventListener("click", toggleTheme);
  
  // PC View Toggle
  const pcViewBtn = document.getElementById("pc-view-btn");
  const mobileViewBtnDesktop = document.getElementById("mobile-view-btn-desktop");
  
  if (pcViewBtn) {
    pcViewBtn.addEventListener("click", togglePcView);
  }
  if (mobileViewBtnDesktop) {
    mobileViewBtnDesktop.addEventListener("click", togglePcView);
  }
}

// ========================================
// PC View Toggle
// ========================================
function togglePcView() {
  const meta = document.querySelector('meta[name="viewport"]');
  const mobileBtn = document.getElementById("pc-view-btn"); // Button in mobile menu
  const desktopBtn = document.getElementById("mobile-view-btn-desktop"); // Button in desktop sidebar
  
  if (!meta) return;
  
  const isMobile = meta.content.includes("width=device-width");
  
  if (isMobile) {
    // Switch to PC View
    meta.setAttribute("content", "width=1200");
    
    // Update buttons
    if (mobileBtn) {
      mobileBtn.innerHTML = "📱 모바일 버전으로 보기";
      mobileBtn.classList.add("text-[var(--accent)]", "font-bold");
    }
    
    // Show desktop button (since sidebar will appear)
    if (desktopBtn) {
      desktopBtn.classList.remove("hidden");
    }
    
  } else {
    // Switch back to Mobile
    meta.setAttribute("content", "width=device-width, initial-scale=1.0");
    
    // Update buttons
    if (mobileBtn) {
      mobileBtn.innerHTML = "🖥️ PC 버전으로 보기";
      mobileBtn.classList.remove("text-[var(--accent)]", "font-bold");
    }
    
    // Hide desktop button
    if (desktopBtn) {
      desktopBtn.classList.add("hidden");
    }
  }
}

// ========================================
// Initialize
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileMenu();
  initNavigation();
  initFadeAnimations();
  initRevealAnimations();
  initTiltEffect();
  initConnectionLines();
  initTypingAnimation();
  initEventListeners();
  initPdfExport();
  loadData();
});
