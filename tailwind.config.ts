import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Lakespring brand palette
        teal: {
          50: "#E8F1F2",
          100: "#C5DCDE",
          200: "#9FC4C8",
          400: "#347278",
          500: "#1B5A60",
          600: "#034147", // primary brand
          700: "#023438",
          800: "#01262A",
          900: "#01191C",
        },
        sage: {
          100: "#E1F5EE",
          200: "#9FE1CB",
          300: "#5DCAA5",
          500: "#1D9E75",
          700: "#0F6E56",
        },
        cream: {
          50: "#FAF8F3",
          100: "#F4F0E6",
          200: "#E8E1CF",
        },
        ink: {
          900: "#0F1419",
          700: "#2C353D",
          500: "#5A6670",
          400: "#7E8990",
          300: "#A8B0B6",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
