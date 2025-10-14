document.addEventListener("DOMContentLoaded", () => {
	const routes = {
		"/": "pages/home.html",
		"/about": "pages/about.html",
		"/contact": "pages/contact.html",
	};

	const mainContent = document.getElementById("main-content");

	const loadContent = async (path) => {
		try {
			const response = await fetch(path);
			if (!response.ok) {
				throw new Error("Page not found");
			}
			mainContent.innerHTML = await response.text();
			if (typeof initTheme === "function") initTheme();
			if (typeof initMain === "function") initMain();
		} catch (error) {
			const response = await fetch("pages/404.html");
			mainContent.innerHTML = await response.text();
		}
	};

	const handleRouteChange = () => {
		const path = window.location.pathname;
		const route = routes[path] || "pages/404.html";
		loadContent(route);
	};

	// Handle navigation for internal links
	document.body.addEventListener("click", (e) => {
		if (e.target.matches("[data-link]")) {
			e.preventDefault();
			history.pushState(null, "", e.target.href);
			handleRouteChange();
		}
	});

	// Load initial components and content
	const loadInitialPage = async () => {
		const navContainer = document.getElementById("nav-container");
		const footerContainer = document.getElementById("footer-container");

		const navResponse = await fetch("/components/nav.html");
		navContainer.innerHTML = await navResponse.text();

		const footerResponse = await fetch("/components/footer.html");
		footerContainer.innerHTML = await footerResponse.text();

		handleRouteChange(); // Load content based on the initial URL
	};

	window.addEventListener("popstate", handleRouteChange);
	loadInitialPage();
});
