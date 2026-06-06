import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./client/**/*.{js,ts,jsx,tsx}",
    "./shared/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
      },
    },
  },

  plugins: [
    typography,
    animate,
  ],
};
