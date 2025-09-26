/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6", // A vibrant blue
        secondary: "#EC4899", // A bright pink
        accent: "#10B981", // A fresh green
        dark: "#1F2937", // Dark gray for text and backgrounds
        light: "#F9FAFB", // Light gray for backgrounds
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
