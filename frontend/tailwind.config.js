/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#000080', light: '#0000a0', dark: '#000060' },
        saffron: { DEFAULT: '#FF9933', light: '#FFB366', dark: '#E88A2D' },
        panel: {
          light: '#f7f8fa',
          dark: '#1a1d23',
        },
        sidebar: {
          light: '#ffffff',
          dark: '#111318',
        },
        chat: {
          light: '#f9fafb',
          dark: '#0f1115',
        },
      },
    },
  },
  plugins: [],
}
