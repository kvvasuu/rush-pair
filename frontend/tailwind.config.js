/** @type {import('tailwindcss').Config} */
export default {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "main-gradient":
          "linear-gradient(20deg, rgba(255,32,108,1) 0%, rgba(255,127,88,1) 87%)",
        "main-gradient-dark":
          "linear-gradient(20deg, rgba(201,26,86,1) 0%, rgba(226,100,62,1) 87%)",
      },
      colors: {
        "neutral-750": "#313131",
      },
    },
  },
  plugins: [],
};
