/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F9F8F6',
          100: '#F3F1EC',
          200: '#E6E2D8',
          300: '#D5CEC0',
          400: '#B0A591',
          500: '#8E826C',
          600: '#6B6150',
          700: '#4D463A',
          800: '#2A2721',
          900: '#141310',
          dark: '#0D0D0E',
          accent: '#C5A880',
          'accent-hover': '#B3956B',
        },
        surface: {
          light: '#FAFAF9',
          cream: '#F5F4F0',
          border: '#E8E6E1',
          dark: '#121214',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      letterSpacing: {
        widest2: '.2em',
      }
    },
  },
  plugins: [],
}
