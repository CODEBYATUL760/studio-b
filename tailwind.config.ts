import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          950: "#09090B", // Pure Matte Obsidian
          900: "#121215", // Elevated Surface
          850: "#18181B",
          800: "#27272A",
          750: "#3F3F46",
          700: "#52525B",
          600: "#71717A",
          500: "#A1A1AA",
        },
        obsidian: "#09090B",
        zincCard: "#121215",
        gold: {
          300: "#FFFFFF",
          400: "#FFFFFF",
          500: "#FFFFFF",
          600: "#E4E4E7",
          700: "#A1A1AA",
        },
        champagne: {
          300: "#FFFFFF",
          400: "#F4F4F5",
          500: "#E4E4E7",
        },
        cinema: {
          red: "#F43F5E",
          amber: "#FFFFFF",
          emerald: "#FFFFFF",
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Cinzel', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gold-shimmer": "linear-gradient(135deg, #FFFFFF 0%, #E4E4E7 50%, #A1A1AA 100%)",
        "dark-grain": "none",
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "marquee": "marquee 25s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
