/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        card: {
          back: "#1e3a8a",
          front: "#f8fafc",
        },
        table: {
          felt: "#059669",
        },
        chip: {
          white: "#f8fafc",
          red: "#dc2626",
          green: "#16a34a",
          black: "#1f2937",
          blue: "#2563eb",
        },
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
