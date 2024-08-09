const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx',
    './public/index.html',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 16px rgba(255, 255, 255, 1)'
      },
      dropShadow: {
        glow: '0 0 8px rgba(255, 255, 255, 1)'
      }
    }
  },
  darkMode: 'class',
  plugins: [nextui()]
};
