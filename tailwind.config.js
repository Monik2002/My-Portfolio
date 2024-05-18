/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Extend your colors here if needed
        "dark-bg": "#121212", // Dark background color
        "dark-text": "#ffffff", // Dark mode text color
        "gray-800": "#1f2937", // Adjust this color to be darker
        "gray-300": "#d1d5db", // Adjust this color for text in dark mode
      },
    },
  },
  plugins: [],
};
