/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-to-r': 'linear-gradient(105deg, #7d6db7, #e0b9c9)',
        'gradient-to-l': 'linear-gradient(-55deg, #e0b9c9, #7d6db7)',
        'gradient-to-b': 'linear-gradient(to bottom, #7d6db7, #e0b9c9)',
      },
      colors: {
        'primary-purple': '#7d6db7',  // buttons, headings
        'accent-pink': '#e0b9c9',   // highlights, borders
        'dark-gray': '#333333',   // main text color
        'light-gray': '#f7f7f7',    // secondary text color (on dark backgrounds)
        'muted-purple': '#6a5da3',    // primary-dark
        'muted-pink': '#d8a2b8',    // accent-light
      },
      keyframes: {
        skeletonWave: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'skeleton-wave': 'skeletonWave 1.5s infinite linear',
      },
      transform: {
        'preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        'backface-hidden': {
          'backface-visibility': 'hidden',
        },
      }
    },
  },
  plugins: [],
};
