/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Scans the main HTML file (index.html)
    "./index.html", 
    // CRITICAL: Scans ALL JavaScript and React files inside the 'src' directory
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
