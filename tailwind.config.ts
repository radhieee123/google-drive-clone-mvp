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
        gdrive: {
          // Primary Blue
          primary: "#1a73e8",
          "primary-hover": "#1765cc",
          "primary-light": "#e8f0fe",

          // Text Colors
          text: "#202124",
          "text-secondary": "#5f6368",
          "text-disabled": "#9aa0a6",

          bg: "#ffffff",
          "bg-secondary": "#f8f9fa",
          "bg-hover": "#f1f3f4",
          "bg-active": "#e8f0fe",

          "border-light": "#e8eaed",
          border: "#dadce0",
          "border-dark": "#5f6368",

          success: "#1e8e3e",
          warning: "#f9ab00",
          error: "#d93025",
        },
      },
      screens: {
        tablet: "768px",
      },
      fontFamily: {
        sans: ["Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      boxShadow: {
        "gdrive-sm":
          "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
        "gdrive-md":
          "0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)",
        "gdrive-lg": "0 2px 6px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.3)",
      },
      borderRadius: {
        gdrive: "8px",
        "gdrive-lg": "12px",
        "gdrive-xl": "16px",
        "gdrive-2xl": "20px",
      },

      keyframes: {
        in: {
          "0%": { opacity: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        in: "in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
