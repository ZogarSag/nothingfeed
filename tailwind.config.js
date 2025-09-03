/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark mode specific colors
        'dark-bg': '#000000',
        'dark-card': '#000000', 
        'dark-border': '#ffffff',
        'dark-text': '#ffffff',
        'dark-text-secondary': '#cccccc',
      }
    },
  },
  plugins: [],
}