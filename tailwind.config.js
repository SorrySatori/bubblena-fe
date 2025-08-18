/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#41b883',
        secondary: '#35495e',
        accent: '#00c58e',
        light: '#f8f9fa',
        dark: '#343a40',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-20px) translateX(10px)' },
        },
      },
    },
  },
  plugins: [],
}
