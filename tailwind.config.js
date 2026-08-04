/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08111D",
        card: "#111827",
        border: "#1F2937",
        accent: {
          blue: "#3B82F6",
          cyan: "#06B6D4",
          teal: "#14B8A6",
        },
      },
      fontFamily: {
        sans: ["Inter", "SF Pro Display", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(6, 182, 212, 0.3)",
      },
    },
  },
  plugins: [],
};