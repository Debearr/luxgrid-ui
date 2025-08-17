/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx,html}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0E1A",
        surface: "#1A2332",
        gold: "#C9A96E",
        blue: "#4A9EFF",
        text: "#FFFFFF",
        muted: "#A8B2C7",
      },
      borderRadius: {
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(0,0,0,0.12)",
        medium: "0 6px 16px rgba(0,0,0,0.18)",
        dramatic: "0 16px 40px rgba(0,0,0,0.35)",
      },
      fontFamily: {
        heading: ['"SF Pro Display"', "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
