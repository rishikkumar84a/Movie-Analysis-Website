/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ecf0ff',
          200: '#d8e0ff',
          300: '#b6c6ff',
          400: '#8aa1ff',
          500: '#627dff',
          600: '#3a56ff',
          700: '#2031e0',
          800: '#1d2db3',
          900: '#1c2b8f',
        },
        dark: {
          100: '#d5d5d5',
          200: '#ababab',
          300: '#808080',
          400: '#565656',
          500: '#2b2b2b',
          600: '#232323',
          700: '#1a1a1a',
          800: '#121212',
          900: '#090909',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'neumorphic-light': '12px 12px 24px #d1d9e6, -12px -12px 24px #ffffff',
        'neumorphic-dark': '5px 5px 10px #151515, -5px -5px 10px #1f1f1f',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
    },
  },
  plugins: [],
} 