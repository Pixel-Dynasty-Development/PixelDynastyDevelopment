function initMain() {
	// Mobile Menu
	const mobileMenuButton = document.getElementById("mobile-menu-button");
	const mobileMenu = document.getElementById("mobile-menu");
	if (mobileMenuButton) {
		mobileMenuButton.addEventListener("click", () => {
			mobileMenu.classList.toggle("hidden");
		});
	}
	document.querySelectorAll("#mobile-menu a").forEach((item) => {
		item.addEventListener("click", () => {
			mobileMenu.classList.add("hidden");
		});
	});

	// Back to Top Button
	const backToTopButton = document.getElementById("back-to-top");
	if (backToTopButton) {
		window.addEventListener("scroll", () => {
			if (window.pageYOffset > 300) {
				backToTopButton.classList.remove("hidden");
			} else {
				backToTopButton.classList.add("hidden");
			}
		});
		backToTopButton.addEventListener("click", () => {
			window.scrollTo({ top: 0, behavior: "smooth" });
		});
	}

	// Form Submission
	const form = document.getElementById("form");
	if (form) {
		form.addEventListener("submit", function (e) {
			// Your form submission logic here...
		});
	}

	// Set current year in footer
	const currentYear = document.getElementById("currentYear");
	if (currentYear) {
		currentYear.textContent = new Date().getFullYear();
	}
}

// Initial call in case router loads content before this script is fully parsed
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initMain);
} else {
	initMain();
}
