/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  // Theme customizations migrated to CSS via `@theme` and `@utility` (Tailwind v4)
  theme: {},
  plugins: [],
};
