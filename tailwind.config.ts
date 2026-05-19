import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-plus-jakarta-sans)", "sans-serif"],
      },
      colors: {
        banking: {
          blue: "#014EA1",
          navy: "#003B7A",
          sky: "#3878B8",
          gold: "#FDC205",
          goldLight: "#FCD854",
          offWhite: "#F8FAFC",
          border: "#E5EAF1",
          text: "#0B1220",
          muted: "#64748B",
          ink: "#07111F",
        },
      },
      boxShadow: {
        glow: "0 24px 80px rgba(1, 78, 161, 0.28)",
        gold: "0 18px 45px rgba(253, 194, 5, 0.2)",
      },
      backgroundImage: {
        "auth-radial":
          "radial-gradient(circle at top left, rgba(253,194,5,0.20), transparent 30%), radial-gradient(circle at bottom right, rgba(56,120,184,0.32), transparent 34%), linear-gradient(135deg, #002D5F 0%, #003B7A 42%, #07111F 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
