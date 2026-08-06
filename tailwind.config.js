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
        royalBlue: '#167a9e',
        skyBlue: '#2db8e6',
        gold: '#eb7d16',
      },
      fontFamily: {
        sans: ['Satoshi', 'sans-serif'],
        display: ['Clash Display Variable', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
