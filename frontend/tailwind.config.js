/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#1B2A4A', light: '#2D3E5F' },
        saffron: { DEFAULT: '#FF6B35', light: '#FF8A5C' },
      }
    },
  },
  plugins: [],
}
