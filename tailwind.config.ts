/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgc: "#f6f9fc",
        darkC: "#dfe5ec",
        darkC2: "#e8ecf1",
        textC: "#444746",
        textC2: "#5e5e5e",
      },
      screens: {
        tablet: "768px",
      },
    },
  },
  plugins: [],
};
