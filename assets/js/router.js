const routes = {
	"/": "pages/home.html",
	"/about": "pages/about.html",
};

const loadContent = async (path) => {
	const mainContent = document.getElementById("main-content");
	const response = await fetch(path);
	mainContent.innerHTML = await response.text();
	// After loading content, initialize scripts
	if (typeof initMain === "function") {
		initMain();
	}
};

const handleRouteChange = () => {
	const path = window.location.hash.substring(1) || "/";
	const route = routes[path] || routes["/"]; // Default to home
	loadContent(route);
};

const loadComponents = async () => {
	const navContainer = document.getElementById("nav-container");
	const footerContainer = document.getElementById("footer-container");

	const navResponse = await fetch("components/nav.html");
	navContainer.innerHTML = await navResponse.text();

	const footerResponse = await fetch("components/footer.html");
	footerContainer.innerHTML = await footerResponse.text();
};

window.addEventListener("hashchange", handleRouteChange);
window.addEventListener("load", () => {
	loadComponents().then(() => {
		handleRouteChange();
	});
});
