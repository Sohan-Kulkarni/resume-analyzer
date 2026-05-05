/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101426",
        mist: "#f5f7ff",
        violetGlow: "#8b5cf6",
        blueGlow: "#38bdf8",
        coral: "#fb7185",
        success: "#34d399",
      },
      boxShadow: {
        glass: "0 24px 80px rgba(31, 41, 85, 0.22)",
        soft: "0 18px 55px rgba(17, 24, 39, 0.14)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      keyframes: {
        pulseRing: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.78" },
          "50%": { transform: "scale(1.06)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-220px 0" },
          "100%": { backgroundPosition: "220px 0" },
        },
      },
      animation: {
        pulseRing: "pulseRing 1.9s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
