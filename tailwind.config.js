/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep petrol — dark bands, footer, hero overlays
        deep: {
          DEFAULT: '#0b3436',
          soft: '#11484b',
        },
        // Primary brand teal
        brand: {
          50: '#f0f9f8',
          100: '#d5efec',
          200: '#aadfd9',
          300: '#75c7bf',
          500: '#14919b',
          600: '#0f766e',
          700: '#0d5f59',
          800: '#0d4f4a',
          900: '#0b3436',
        },
        // Warm terracotta accent — CTAs, highlights
        accent: {
          100: '#fdeae3',
          300: '#f2b09b',
          500: '#e07a5f',
          600: '#c95f43',
          700: '#a44832',
        },
        // Warm paper background
        sand: {
          DEFAULT: '#f7f4ee',
          dark: '#efe9df',
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Fraunces Variable"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
