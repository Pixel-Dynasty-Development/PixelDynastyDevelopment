function initTheme() {
	const themeToggleBtn = document.getElementById("theme-toggle");
	const themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
	const themeToggleLightIcon = document.getElementById(
		"theme-toggle-light-icon"
	);

	// Function to set the theme
	const setTheme = (isDark) => {
		if (isDark) {
			document.documentElement.classList.add("dark");
			themeToggleLightIcon.classList.remove("hidden");
			themeToggleDarkIcon.classList.add("hidden");
			localStorage.setItem("color-theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			themeToggleDarkIcon.classList.remove("hidden");
			themeToggleLightIcon.classList.add("hidden");
			localStorage.setItem("color-theme", "light");
		}
	};

	// Initial theme check
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const savedTheme = localStorage.getItem("color-theme");

	if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
		setTheme(true);
	} else {
		setTheme(false);
	}

	// Event listener for the toggle button
	themeToggleBtn.addEventListener("click", () => {
		const isCurrentlyDark = document.documentElement.classList.contains("dark");
		setTheme(!isCurrentlyDark);
	});
}

function initMain() {
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

// Initial theme setup on script load
initTheme();
