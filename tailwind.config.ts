import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
  
    content: [
      "./index.html",
      "./client/**/*.{js,ts,jsx,tsx}",
      "./shared/**/*.{js,ts,jsx,tsx}",
    ],
  
    theme: {
      extend: {
        colors: {
          primary: "#2563eb",
          secondary: "#64748b",
        },
  
        borderRadius: {
          lg: "0.75rem",
          xl: "1rem",
        },
      },
    },
  
    plugins: [
      typography,
      animate,
    ],
  };