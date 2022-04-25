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
        primary: {
          50: "#f5f9f4",
          100: "#e7f3e5",
          200: "#d0e6cc",
          300: "#aad1a4",
          400: "#7cb375",
          500: "#5a9651",
          600: "#4d8745",
          700: "#396134",
          800: "#314e2d",
          900: "#284126",
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
