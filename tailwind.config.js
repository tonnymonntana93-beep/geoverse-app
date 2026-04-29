/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        'geo-bg': '#1a1025',
        'geo-panel': '#2a1b38',
        'geo-neon-blue': '#00f3ff',
        'geo-neon-purple': '#b535f6',
      }
    },
  },
  plugins: [],
}
