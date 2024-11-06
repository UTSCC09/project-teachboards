/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./Global.css",
    "./page.js",
    "./layout.js",
    "./app/Components/**/*.{js,ts,jsx,tsx}",
    "./app/Components/**/*.{css,scss}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
