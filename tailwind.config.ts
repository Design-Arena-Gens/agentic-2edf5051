import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/styles/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6246EA",
          dark: "#4537B8",
          light: "#A093FF"
        }
      },
      boxShadow: {
        glass: "0 16px 60px rgba(98, 70, 234, 0.15)"
      }
    }
  },
  plugins: []
};

export default config;
