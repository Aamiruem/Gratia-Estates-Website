/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#1A1A1A",
        navy: "#0D1B2A",
        gold: "#C8A972",
        ivory: "#F7F7F5",
        warmgray: "#E6E6E6",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        sans: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 18px 60px rgba(13,27,42,.10)",
      },
    },
  },
  plugins: [],
};
