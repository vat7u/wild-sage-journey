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
        paper: {
          50: "#FCFAF7",
          100: "#FAF8F5",
          200: "#F4F0E8",
          300: "#EAE4D8",
          400: "#DED6C7",
        },
        ink: {
          900: "#181715",
          800: "#2B2824",
          700: "#454039",
          600: "#635D53",
          500: "#857D71",
          400: "#A8A093",
        },
        sage: {
          DEFAULT: "#475B4B",
          dark: "#364639",
          light: "#EAF0EB",
          accent: "#5C7561",
        },
        terracotta: {
          DEFAULT: "#A85D41",
          dark: "#8D4A31",
          light: "#F9EDE8",
        },
        border: {
          subtle: "#EAE5DC",
          medium: "#DCD5C9",
          dark: "#B8ADA0",
        },
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Newsreader", "Georgia", "serif"],
        display: ["var(--font-cinzel)", "Cinzel", "serif"],
        sans: ["var(--font-outfit)", "Outfit", "system-ui", "sans-serif"],
      },
      typography: {
        editorial: {
          css: {
            maxWidth: "65ch",
            color: "#2B2824",
            lineHeight: "1.8",
            fontSize: "1.125rem",
            p: {
              marginBottom: "1.75em",
            },
            h1: {
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontWeight: "500",
              letterSpacing: "-0.02em",
            },
            h2: {
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontWeight: "500",
              letterSpacing: "-0.01em",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
