import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#05060a",
          900: "#0a0d16",
          850: "#0d1120",
          800: "#111627",
          700: "#1a2036",
        },
        brand: {
          cyan: "#22d3ee",
          blue: "#3b82f6",
          purple: "#7c3aed",
          violet: "#8b5cf6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "brand-gradient": "linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #7c3aed 100%)",
        "radial-glow": "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.25), transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(59,130,246,0.25)",
        "glow-purple": "0 0 40px rgba(124,58,237,0.25)",
        card: "0 8px 32px rgba(0,0,0,0.35)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%,100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "dash": {
          to: { strokeDashoffset: "0" },
        },
        scan: {
          "0%,100%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(94%)" },
        },
        "dot-move": {
          "0%": { left: "0%", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { left: "100%", opacity: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        dash: "dash 2s linear forwards",
        scan: "scan 2.4s ease-in-out infinite",
        "dot-move": "dot-move 1.4s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.4s ease-out both",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
