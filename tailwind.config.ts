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
        obsidian: "rgb(var(--nj-obsidian-rgb) / <alpha-value>)",
        charcoal: "rgb(var(--nj-charcoal-rgb) / <alpha-value>)",
        graphite: "rgb(var(--nj-graphite-rgb) / <alpha-value>)",
        ivory: "rgb(var(--nj-ivory-rgb) / <alpha-value>)",
        cream: "rgb(var(--nj-cream-rgb) / <alpha-value>)",
        mist: "rgb(var(--nj-mist-rgb) / <alpha-value>)",
        champagne: "rgb(var(--nj-champagne-rgb) / <alpha-value>)",
        "antique-gold": "rgb(var(--nj-antique-gold-rgb) / <alpha-value>)",
        bronze: "rgb(var(--nj-bronze-rgb) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        hero: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
