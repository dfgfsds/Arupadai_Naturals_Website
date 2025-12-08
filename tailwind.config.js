/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      cursor: {
        custom: "url('/cursor.png'), auto",
      },
      fontFamily: {
        afacad: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
