import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#FFC670",
          secondary: "#FFD77A",
          accent: "#FF5269",
        },
        bg: {
          primary: "#FFF9EF",
        },
        text: {
          primary: "#2D2D2D",
          secondary: "#707070",
          tertiary: "#FFFFFF",
        },
        warning: {
          primary: "#EC1313",
          secondary: "#FFF0F0",
        },
        success: {
          primary: "#1FAD66",
          secondary: "#E0FAD6",
        },
      },
      fontFamily: {
        figtree: ["var(--font-figtree)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        ibrand: ["var(--font-ibrand)", "serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(60px)" },
        },
        "float-y1": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-60px)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(calc(288px - 2px))" },
          "100%": { transform: "translateY(0%)" },
        },
        "bracket-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "marquee-reverse": "marquee-reverse 30s linear infinite",
        "float-y": "float-y 15s ease-in-out infinite",
        "float-y1": "float-y1 15s ease-in-out infinite",
        "scan-line": "scan-line 2s ease-in-out infinite",
        "bracket-pulse": "bracket-pulse 1.5s ease-in-out infinite",
        
      },
    },
  },
  plugins: [],
};

export default config;
