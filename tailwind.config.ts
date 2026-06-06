import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kenya: {
          green: "#006600",
          "green-light": "#008800",
          "green-muted": "#004d00",
          "green-subtle": "#e8f5e8",
          red: "#BB0000",
          "red-light": "#d40000",
          "red-muted": "#8a0000",
          "red-subtle": "#fdf0f0",
          black: "#000000",
          "black-soft": "#111111",
          "black-muted": "#1a1a1a",
          white: "#FFFFFF",
          "off-white": "#f9f9f7",
          "warm-gray": "#f4f4f0",
          "border-gray": "#e0e0d8",
          "text-gray": "#4a4a4a",
          "text-light": "#717171",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "shield-pattern": "url('/shield-bg.svg')",
        "grain-texture": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        "kenyan-gradient": "linear-gradient(135deg, #006600 0%, #004d00 50%, #000000 100%)",
        "hero-gradient": "linear-gradient(180deg, #000000 0%, #0a1a0a 60%, #001a00 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "slide-in-left": "slideInLeft 0.5s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        "border-flow": "borderFlow 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        borderFlow: {
          "0%, 100%": { borderColor: "#006600" },
          "50%": { borderColor: "#BB0000" },
        },
      },
      boxShadow: {
        "green-glow": "0 0 20px rgba(0, 102, 0, 0.15)",
        "red-glow": "0 0 20px rgba(187, 0, 0, 0.15)",
        "card-hover": "0 8px 32px rgba(0, 0, 0, 0.12)",
        "header-shadow": "0 1px 0 rgba(255,255,255,0.06)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      maxWidth: {
        "8xl": "90rem",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#1a1a1a",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
