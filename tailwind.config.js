/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00DDFF",
        secondary: "#FF00D4",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, #00DDFF, #FF00D4)",
        "hover-gradient-primary": "linear-gradient(to left, #00DDFF, #FF00D4)",
      },
    },
  },
  plugins: [],
}