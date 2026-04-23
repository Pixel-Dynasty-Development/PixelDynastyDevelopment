import { projects } from "./projects.js";

export function initTheme() {
  // Find ALL theme toggle buttons on the page
  const themeToggleBtns = document.querySelectorAll('[data-js="theme-toggle"]');
  if (themeToggleBtns.length === 0) return;

  // Find ALL icons on the page
  const allDarkIcons = document.querySelectorAll(".theme-toggle-dark-icon");
  const allLightIcons = document.querySelectorAll(".theme-toggle-light-icon");

  const setTheme = (isDark) => {
    document.documentElement.classList.toggle("dark", isDark);

    // Toggle all icons
    allLightIcons.forEach((icon) => icon.classList.toggle("hidden", !isDark));
    allDarkIcons.forEach((icon) => icon.classList.toggle("hidden", isDark));

    localStorage.setItem("color-theme", isDark ? "dark" : "light");
  };

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("color-theme");

  // Set initial theme
  setTheme(savedTheme === "dark" || (!savedTheme && prefersDark));

  // Add click listener to ALL toggle buttons
  themeToggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setTheme(!document.documentElement.classList.contains("dark"));
    });
  });
}

/**
 * Initializes the mobile menu toggle button.
 */
export function initMobileMenu() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    // Close menu when a link is clicked
    mobileMenu.addEventListener("click", (e) => {
      if (e.target.closest("[data-link]")) {
        mobileMenu.classList.add("hidden");
      }
    });
  }
}
/**
 * Initializes scripts that are common across the main website pages (not the portal).
 */
export function initMainSite() {
  const backToTopButton = document.getElementById("back-to-top");
  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      backToTopButton.classList.toggle("hidden", window.pageYOffset <= 300);
    });
    backToTopButton.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }

  const currentYear = document.getElementById("currentYear");
  if (currentYear) currentYear.textContent = new Date().getFullYear();

  updateNavLinks();
}

/**
 * Dynamically generates the portfolio project cards.
 */
export function initPortfolio() {
  const grid = document.getElementById("project-grid");
  if (!grid) return;

  // Added a container wrapper for better horizontal padding and max-width
  grid.className =
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto px-6 py-12";

  grid.innerHTML = projects
    .map((project) => {
      const tagClass = project.isProduction ? "bg-green-600" : "bg-amber-500";
      const tagLabel = project.isProduction ? "Production" : "Dev Link";
      const btnClass = project.isProduction
        ? "bg-blue-600 hover:bg-blue-700"
        : "bg-gray-700 hover:bg-gray-900";

      return `
      <div class="group relative bg-white dark:bg-gray-800/50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col">
        <!-- Absolute Tag -->
        <span class="absolute top-4 left-4 z-10 px-3 py-1 text-[11px] font-black uppercase tracking-widest rounded-full ${tagClass} text-white shadow-lg">
          ${tagLabel}
        </span>
        
        <!-- Image with more height for 'Wider' feel -->
        <div class="aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-900">
          <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
        </div>

        <!-- Content with more padding (p-6) -->
        <div class="p-6 flex-grow flex flex-col justify-between">
          <div class="mb-4">
            <h3 class="font-bold text-gray-900 dark:text-white text-lg mb-2">${project.title}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">${project.description}</p>
          </div>
          <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="inline-block text-center w-full py-3 ${btnClass} text-white text-sm font-bold rounded-xl transition-all active:scale-95">
            ${project.isProduction ? "Visit Live Site" : "View Staging Area"}
          </a>
        </div>
      </div>
    `;
    })
    .join("");
}

/**
 * Updates the 'Client Login' button to 'Client Portal' if the user is logged in.
 */
function updateNavLinks() {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  document
    .querySelectorAll("#portal-nav-link, #mobile-portal-nav-link")
    .forEach((link) => {
      if (link) {
        link.href = isLoggedIn ? "/portal" : "/login";
        link.textContent = isLoggedIn ? "Client Portal" : "Client Login";
      }
    });
}

/**
 * Initializes the login form functionality.
 */
export function initLogin() {
  updateNavLinks();
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = e.target.username.value;
      const password = e.target.password.value;
      const errorDiv = document.getElementById("login-error");

      if (username === "client" && password === "password") {
        sessionStorage.setItem("isLoggedIn", "true");
        history.pushState(null, "", "/portal");
        window.dispatchEvent(new PopStateEvent("popstate"));
      } else {
        errorDiv?.classList.remove("hidden");
      }
    });
  }
}

/**
 * Initializes the interactive elements of the client portal AFTER the content is loaded.
 */
export function initPortalInteractivity() {
  const portalLinks = document.querySelectorAll("[data-portal-link]");
  const portalSections = document.querySelectorAll(".portal-section");
  const logoutButton = document.getElementById("logout-button");

  const showSection = (hash) => {
    const targetId = hash ? hash.substring(1) : "dashboard";
    portalSections.forEach((section) =>
      section.classList.toggle("hidden", section.id !== targetId),
    );
    portalLinks.forEach((link) =>
      link.classList.toggle("active-link", link.hash === `#${targetId}`),
    );
  };

  portalLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const hash = e.currentTarget.hash;
      if (window.location.hash !== hash)
        history.pushState(null, null, `/portal${hash}`);
      showSection(hash);
    });
  });

  logoutButton?.addEventListener("click", () => {
    sessionStorage.removeItem("isLoggedIn");
    history.pushState(null, "", "/login");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });

  const taskTypeSelector = document.getElementById("task-type");
  const taskFieldsContainer = document.getElementById("task-fields");
  if (taskTypeSelector && taskFieldsContainer) {
    const updateTaskForm = () => {
      const selectedType = taskTypeSelector.value;
      const template = document.getElementById(`template-${selectedType}`);
      if (template) {
        taskFieldsContainer.innerHTML = template.innerHTML;
      }
    };
    taskTypeSelector.addEventListener("change", updateTaskForm);
    updateTaskForm();
  }

  showSection(window.location.hash);
}
