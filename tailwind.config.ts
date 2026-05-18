import type { Config } from "tailwindcss";

/**
 * SEAL LOGISTICS — DESIGN TOKEN SYSTEM
 * --------------------------------------------------------------------------
 * This file is the single source of truth for the visual language. It plays
 * the role a third-party design-system tool ("UI Pro") would otherwise fill:
 * every colour, radius, shadow, font and motion duration used across the app
 * is defined here and consumed through Tailwind utilities. No component is
 * permitted to introduce ad-hoc hex values or magic numbers.
 *
 * Brand DNA is derived directly from the SHIPT ET AL LLC logo:
 *   - Indigo  #2E3092  → `brand`  (primary, structure, trust)
 *   - Orange  #F5821F  → `accent` (energy, motion, calls-to-action)
 *   - Deep navy        → `ink`    (cinematic dark canvas)
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Cinematic navy canvas — the "night sky" the brand flies through.
        ink: {
          950: "#060A1A",
          900: "#0A1130",
          850: "#0E1740",
          800: "#131F52",
          700: "#1A2A6B",
          600: "#243584",
        },
        // Primary brand indigo.
        brand: {
          50: "#EEF0FB",
          100: "#DADDF6",
          200: "#BBC0EE",
          300: "#9298E1",
          400: "#6B71CF",
          500: "#4A4FB5",
          600: "#2E3092",
          700: "#282A7D",
          800: "#222367",
          900: "#1B1C4F",
          950: "#0F0F2E",
        },
        // Accent orange — the logo's "flight arc".
        accent: {
          50: "#FEF3E8",
          100: "#FDE4CB",
          200: "#FBC795",
          300: "#F9A861",
          400: "#F7913B",
          500: "#F5821F",
          600: "#DC6C0C",
          700: "#B5530A",
          800: "#8C400E",
          900: "#6F360F",
          950: "#3D1B05",
        },
        // Light neutrals for type + surfaces.
        cloud: {
          50: "#FBFCFF",
          100: "#F2F4FB",
          200: "#E4E8F4",
          300: "#CBD2E6",
          400: "#9AA4C4",
          500: "#6E7AA0",
        },
        success: "#1FB877",
        warning: "#F5A623",
        danger: "#E5484D",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.06em" }],
      },
      borderRadius: {
        xs: "0.375rem",
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "2.75rem",
      },
      boxShadow: {
        // Layered, atmospheric shadows — depth without harshness.
        glow: "0 0 0 1px rgba(245,130,31,0.18), 0 18px 60px -12px rgba(245,130,31,0.45)",
        panel:
          "0 1px 0 0 rgba(255,255,255,0.06) inset, 0 30px 80px -28px rgba(3,6,20,0.9)",
        lift: "0 24px 70px -24px rgba(3,6,20,0.85)",
        ring: "0 0 0 1px rgba(155,164,196,0.16)",
      },
      spacing: {
        section: "clamp(5rem, 10vw, 9rem)",
        gutter: "clamp(1.25rem, 4vw, 3rem)",
      },
      maxWidth: {
        shell: "1280px",
        prose: "68ch",
      },
      letterSpacing: {
        kicker: "0.22em",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(155,164,196,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(155,164,196,0.06) 1px, transparent 1px)",
        "radial-brand":
          "radial-gradient(ellipse at top, rgba(46,48,146,0.55), transparent 60%)",
        "runway":
          "repeating-linear-gradient(90deg, #F5821F 0 28px, transparent 28px 56px)",
      },
      transitionTimingFunction: {
        // Motion tokens — every animation eases on one of these curves.
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-soft": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      keyframes: {
        "marquee-x": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "drift": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "dash": {
          to: { strokeDashoffset: "-1000" },
        },
        "shine": {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" },
        },
      },
      animation: {
        marquee: "marquee-x 38s linear infinite",
        "marquee-slow": "marquee-x 64s linear infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        drift: "drift 9s ease-in-out infinite",
        dash: "dash 22s linear infinite",
        shine: "shine 1.1s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
