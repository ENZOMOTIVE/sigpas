/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff6b00',
          dark: '#e65100',
          light: '#ff9e40',
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#ff6b00',
          600: '#e65100',
          700: '#d84315',
          800: '#bf360c',
          900: '#9f2f00',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 2px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
        'custom-md': '0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1)',
        'custom-lg': '0 10px 15px rgba(0,0,0,0.05), 0 4px 6px rgba(0,0,0,0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}

