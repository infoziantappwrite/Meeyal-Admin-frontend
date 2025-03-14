/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    
  ],
  theme: {
    extend: {
      colors: {
        primary: "#dc4298",
        secondary: "#d8e029",
        darkc:"#241f20",
        hover_primary:"rgb(215, 12, 127)"
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right,rgb(215, 12, 127), #d8e029)",
        "hover-gradient-primary": "linear-gradient(to left, #dc4298, #d8e029)",
      },
    },
  },
  plugins: [],
}