import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f6f8f4",
          100: "#e6ede0",
          200: "#cfddc2",
          300: "#b2c99e",
          400: "#96b47d",
          500: "#78975f",
          600: "#5d7749",
          700: "#465a37",
          800: "#313f27",
          900: "#1d2618"
        }
      }
    }
  },
  plugins: []
};

export default config;
