/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // Sucht in allen Dateien in den pages-Ordnern
    "./components/**/*.{js,ts,jsx,tsx}", // Sucht in allen Dateien in den components-Ordnern
    "./app/**/*.{js,ts,jsx,tsx}", // Wenn du die App-Ordnerstruktur verwendest
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


