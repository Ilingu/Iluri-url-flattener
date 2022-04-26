const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main Colors
        main: {
          50: "#f9ffe6",
          100: "#f1ffc8",
          200: "#e3fe98",
          300: "#ccfa5c",
          400: "#b5f02b",
          500: "#a2e70d",
          600: "#73ab05",
          700: "#588209",
          800: "#47660e",
          900: "#3b5611",
        },
      },
    },
    // Responsive
    screens: {
      xs: "450px",
      ...defaultTheme.screens,
    },
  },
  plugins: [],
};
