/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── InfiniWear Design System ───
        iw: {
          // Backgrounds
          base:      "#08090a",
          surface:   "#0e0f11",
          card:      "#141618",
          "card-hover": "#1a1d20",
          elevated:  "#1f2226",
          // Text
          primary:   "#f5f5f5",
          secondary: "#9ca3af",
          muted:     "#4b5563",
          // Accents
          blue:      "#ffffff",
          "blue-dim":"#e5e5e5",
          electric:  "#f5f5f5",
          rose:      "#e5e5e5",
          emerald:   "#ffffff",
          amber:     "#a3a3a3",
        },
      },
      fontFamily: {
        display: ["var(--font-bodoni)", "Georgia", "serif"],
        body: ["var(--font-hanken)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        sm:   "2px",
        md:   "4px",
        lg:   "8px",
        xl:   "12px",
      },
      backgroundImage: {
        "iw-gradient": "linear-gradient(135deg, #1f2226 0%, #141618 50%, #1f2226 100%)",
      },
      animation: {
        "fade-up":    "fadeUp 0.5s ease forwards",
        "fade-in":    "fadeIn 0.4s ease forwards",
        "slide-in":   "slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "ticker":     "ticker 25s linear infinite",
        "float":      "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:  { "0%": { opacity: 0, transform: "translateY(16px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        fadeIn:  { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideIn: { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(0)" } },
        ticker:  { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        float:   { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } },
      },
    },
  },
  plugins: [],
};
