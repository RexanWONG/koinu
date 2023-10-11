/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      'animation': {
        'text':'text 5s ease infinite',
        'run': 'slide-right 2s infinite',
      },
      'keyframes': {
          'text': {
              '0%, 100%': {
                'background-size':'200% 200%',
                  'background-position': 'left center'
              },
              '50%': {
                'background-size':'200% 200%',
                  'background-position': 'right center'
              }
          },
          'slide-right': {
            '0%': { transform: 'translateX(0)' },
            '50%': { transform: 'translateX(200px)' },
            '100%': { transform: 'translateX(0)' },
          },
      }
    },
  },
  plugins: [],
}