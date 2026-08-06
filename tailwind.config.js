/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./app/error.vue",
  ],
  theme: {
    extend: {
      colors: {
        royalBlue: '#002366',
        skyBlue: '#00BFFF',
        gold: '#FFD700',
      },
      fontFamily: {
        display: ['Clash Display Variable', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
