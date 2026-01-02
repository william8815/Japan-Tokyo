/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'snow-white': '#F8FAFC',
        'ice-blue': '#38BDF8',
        'soft-blue': '#E2E8F0',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
