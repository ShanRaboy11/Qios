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
          primary: "#FFC670",
          secondary: "#FFD77A",
          accent: "#FF5269"
        },
        bg: {
          primary: "#FFF9EF"
        },
        text: {
          primary: "#2D2D2D",
          secondary: "#707070",
          tertiary: "#FFFFFF"
        },
        warning: {
          primary: "#EC1313",
          secondary: "#FFF0F0"
        },
        success: {
          primary: "#1FAD66",
          secondary: "#E0FAD6"
        }
      }
    }
  },
  plugins: []
};

export default config;
