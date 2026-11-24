/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#050510",
        cyan: { glow: "#c8c8d0" },
        violet: { glow: "#ff3d00" },
      },
      fontFamily: { display: ['"Space Grotesk"', "sans-serif"] },
    },
  },
  plugins: [],
};
