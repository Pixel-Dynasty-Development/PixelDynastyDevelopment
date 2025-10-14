/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: ["./*.html", "./pages/**/*.html", "./components/**/*.html"],
	theme: {
		extend: {
			colors: {
				primary: {
					light: "#3B82F6", // Light mode blue
					dark: "#60A5FA", // Dark mode blue (brighter)
				},
				secondary: {
					light: "#EC4899", // Light mode pink
					dark: "#F472B6", // Dark mode pink (brighter)
				},
				accent: "#10B981", // A fresh green
				dark: {
					bg: "#111827", // Main dark background
					card: "#1F2937", // Card background
					text: "#E5E7EB", // Main dark text
					heading: "#FFFFFF", // Heading dark text
				},
				light: {
					bg: "#F9FAFB", // Main light background
					card: "#FFFFFF", // Card background
					text: "#374151", // Main light text
					heading: "#111827", // Heading light text
				},
			},
			fontFamily: {
				sans: ["Inter", "sans-serif"],
			},
		},
	},
	plugins: [],
};
