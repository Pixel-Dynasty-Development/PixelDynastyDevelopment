// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyC2L3eRqz5g_p2b53pWaqXgDslLviPogLg",
	authDomain: "pixel-dynasty.firebaseapp.com",
	projectId: "pixel-dynasty",
	storageBucket: "pixel-dynasty.firebasestorage.app",
	messagingSenderId: "509298042821",
	appId: "1:509298042821:web:117862a522d6e940e8cdac",
	measurementId: "G-D0DZQ50C13",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function initTheme() {
	const themeToggleBtn = document.getElementById("theme-toggle");
	if (!themeToggleBtn) return;

	const themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
	const themeToggleLightIcon = document.getElementById(
		"theme-toggle-light-icon"
	);

	const setTheme = (isDark) => {
		document.documentElement.classList.toggle("dark", isDark);
		if (themeToggleLightIcon)
			themeToggleLightIcon.classList.toggle("hidden", !isDark);
		if (themeToggleDarkIcon)
			themeToggleDarkIcon.classList.toggle("hidden", isDark);
		localStorage.setItem("color-theme", isDark ? "dark" : "light");
	};

	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const savedTheme = localStorage.getItem("color-theme");

	setTheme(savedTheme === "dark" || (!savedTheme && prefersDark));

	themeToggleBtn.addEventListener("click", () => {
		setTheme(!document.documentElement.classList.contains("dark"));
	});
}

/**
 * Initializes scripts that are common across the main website pages (not the portal).
 */
function initMainSite() {
	const backToTopButton = document.getElementById("back-to-top");
	if (backToTopButton) {
		window.addEventListener("scroll", () => {
			backToTopButton.classList.toggle("hidden", window.pageYOffset <= 300);
		});
		backToTopButton.addEventListener("click", () =>
			window.scrollTo({ top: 0, behavior: "smooth" })
		);
	}

	

	const currentYear = document.getElementById("currentYear");
	if (currentYear) currentYear.textContent = new Date().getFullYear();

	updateNavLinks();
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
function initLogin() {
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
function initPortalInteractivity() {
	const portalLinks = document.querySelectorAll("[data-portal-link]");
	const portalSections = document.querySelectorAll(".portal-section");
	const logoutButton = document.getElementById("logout-button");

	const showSection = (hash) => {
		const targetId = hash ? hash.substring(1) : "dashboard";
		portalSections.forEach((section) =>
			section.classList.toggle("hidden", section.id !== targetId)
		);
		portalLinks.forEach((link) =>
			link.classList.toggle("active-link", link.hash === `#${targetId}`)
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
