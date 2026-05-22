import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"]
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        surface: {
          DEFAULT: "#141416",
          elevated: "#111113",
          base: "#0a0a0c"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      spacing: {
        section: "5rem",
        "section-lg": "6rem"
      },
      maxWidth: {
        content: "72rem"
      },
      transitionDuration: {
        DEFAULT: "300ms"
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.25, 0.4, 0.25, 1)"
      },
      boxShadow: {
        subtle: "0 1px 0 0 rgba(255, 255, 255, 0.04) inset",
        elevated: "0 24px 48px -12px rgba(0, 0, 0, 0.5)"
      },
      animation: {
        "fade-in": "fadeIn 0.7s cubic-bezier(0.25, 0.4, 0.25, 1) forwards"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
