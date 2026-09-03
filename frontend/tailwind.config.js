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
        govt: {
          navy: '#1a2744',
          navyDark: '#0f1a2e',
          blue: '#2c5282',
          blueLight: '#3182ce',
          accent: '#c53030',
          green: '#276749',
          greenLight: '#38a169',
          saffron: '#dd6b20',
          gold: '#d69e2e',
          gray: {
            50: '#f7fafc',
            100: '#edf2f7',
            200: '#e2e8f0',
            300: '#cbd5e0',
            400: '#a0aec0',
            500: '#718096',
            600: '#4a5568',
            700: '#2d3748',
            800: '#1a202c',
            900: '#171923',
          },
        },
        navy: { DEFAULT: '#1a2744', light: '#2c5282', dark: '#0f1a2e' },
        saffron: { DEFAULT: '#dd6b20', light: '#ed8936', dark: '#c05621' },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'panel': '0 2px 8px -2px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
