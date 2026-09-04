/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tanvo-bg': '#0B0B0D',
        'tanvo-primary': '#F4F1EA',
        'tanvo-secondary': '#A7A39C',
        'tanvo-accent': '#2080FC',
        'tanvo-cyan': '#6AE8FC',
        'tanvo-border': 'rgba(255, 255, 255, 0.12)',
      },
      fontFamily: {
        sans: ['Manrope', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
