/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./Frontend/src/**/*.{js,ts,jsx,tsx}", // Added /Frontend/ to the path
    "./Frontend/src/components/**/*.{js,ts,jsx,tsx}",
    "./Frontend/src/views/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}