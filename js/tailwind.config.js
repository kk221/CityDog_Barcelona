/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {}, // This preserves existing styles
  },
  plugins: [],
  important: false, // This prevents Tailwind from overriding your existing styles
  corePlugins: {
    preflight: false // This prevents Tailwind from resetting your existing styles
  }
}
