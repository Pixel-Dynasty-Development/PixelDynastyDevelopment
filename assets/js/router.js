import {
	initTheme,
	initMainSite,
	initLogin,
	initPortalInteractivity,
	initMobileMenu,
} from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
	const routes = {
		"/": "pages/home.html",
		"/about": "pages/about.html",
		"/contact": "pages/contact.html",
		"/login": "pages/login.html",
		"/portal": "pages/portal.html",
	};

	const mainContent = document.getElementById("main-content");
	const navContainer = document.getElementById("nav-container");
	const footerContainer = document.getElementById("footer-container");
	const contactFormContainer = document.getElementById("contactform-container");

	const isAuthenticated = () => sessionStorage.getItem("isLoggedIn") === "true";

	const loadContent = async (filePath) => {
		try {
			const response = await fetch(filePath);
			if (!response.ok) throw new Error("Page not found");

			mainContent.innerHTML = await response.text();
			const contactFormContainer = document.getElementById(
				"contactform-container"
			);
			if (contactFormContainer) {
				console.log("Loading contact form component...");
				const contactFormResponse = await fetch("/components/contactform.html");
				contactFormContainer.innerHTML = await contactFormResponse.text();
			}

			// If it's the portal page, we need to load its components AND then init interactivity
			if (filePath.includes("portal.html")) {
				// 1. Load included components first.
				const includeElements = mainContent.querySelectorAll("[include]");
				const promises = Array.from(includeElements).map(async (el) => {
					const file = el.getAttribute("include");
					try {
						const componentResponse = await fetch(file);
						el.innerHTML =
							componentResponse.ok ?
								await componentResponse.text()
							:	"Component not found.";
					} catch (error) {
						console.error(`Failed to include HTML from ${file}`, error);
						el.innerHTML = "Error loading component.";
					}
				});
				await Promise.all(promises);

				// 2. NOW that components are loaded, initialize portal interactivity.
				if (typeof initPortalInteractivity === "function") {
					initPortalInteractivity();
				}
			} else if (
				filePath.includes("login.html") &&
				typeof initLogin === "function"
			) {
				initLogin();
			} else if (typeof initMainSite === "function") {
				initMainSite();
			}
		} catch (error) {
			console.error("Error loading page:", error);
			const response = await fetch("pages/404.html");
			mainContent.innerHTML = await response.text();
		}
	};

	const handleRouteChange = async () => {
		const urlPath = window.location.pathname;

		if (urlPath.startsWith("/portal") && !isAuthenticated()) {
			history.replaceState(null, "", "/login");
			handleRouteChange();
			return;
		}

		const isPortal = urlPath.startsWith("/portal");
		navContainer.style.display = isPortal ? "none" : "block";
		footerContainer.style.display = isPortal ? "none" : "block";

		const filePath = routes[urlPath] || "pages/404.html";

		await loadContent(filePath);
		window.scrollTo(0, 0);
	};

	document.body.addEventListener("click", (e) => {
		const link = e.target.closest("[data-link]");
		if (link) {
			e.preventDefault();
			history.pushState(null, "", link.href);
			handleRouteChange();
		}
	});

	const loadInitialPage = async () => {
		const navResponse = await fetch("/components/nav.html");
		navContainer.innerHTML = await navResponse.text();
		if (typeof initTheme === "function") initTheme();
		if (typeof initMobileMenu === "function") initMobileMenu();

		const footerResponse = await fetch("/components/footer.html");
		footerContainer.innerHTML = await footerResponse.text();

		handleRouteChange();
	};

	window.addEventListener("popstate", handleRouteChange);
	loadInitialPage();
});
