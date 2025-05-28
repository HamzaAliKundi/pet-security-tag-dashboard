/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'afacad': ['Afacad', 'sans-serif'],
        'space-grotesk': ['"Space Grotesk"', 'sans-serif']
      }
    },
  },
  plugins: [],
};
