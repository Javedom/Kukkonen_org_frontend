/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables manual toggling via a CSS class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Tai Lora/JetBrains jos haluat
        serif: ['Lora', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Määritelty styles.css:n muuttujien perusteella
        lacquer: {
          DEFAULT: '#0f0905', // Deep background
          surface: '#1c1510', // Card background
        },
        cream: '#FAF6F2',
        brown: {
          DEFAULT: '#683B2B',
          light: '#9c7b70',
          dark: '#4a2a1f',
        },
        gold: {
          DEFAULT: '#B08401',
          light: '#d6a100',
        },
        pink: '#D49E8D',
        beige: '#DED1BD',
      },
      backgroundImage: {
        'glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(250, 246, 242, 0.8) 100%)',
        'grid-pattern': 'linear-gradient(rgba(104, 59, 43, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(104, 59, 43, 0.03) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}