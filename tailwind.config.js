const { nextui } = require('@nextui-org/react');
// const defaultTheme = require('tailwindcss/defaultTheme');

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
        glow: '0 0 16px theme("colors.slate.200")'
      }
    }
  },
  darkMode: 'class',
  plugins: [nextui()]
};
