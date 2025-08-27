/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./pages/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/**/*.{ts,tsx,js,jsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        "noid-gold": "#D4AF37",
        "noid-onyx": "#0A0E1A",
        "noid-teal": "#14B8A6",
        primary: "#0A0E1A",
        "muted-foreground": "#6B7280",
      },
    },
  },
  plugins: [],
};
