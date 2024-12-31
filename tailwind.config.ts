import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xss: "320px", // Extra small screens
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      minHeight: {
        screen: "100vh", // Default for full height
        "750px": "750px", // For tablets
        "95vh": "95vh", // Laptops
        "100vh": "100vh", // Desktops
      },
    },
  },
  darkMode: "selector",
  plugins: [nextui(), require('@tailwindcss/typography'),],
} satisfies Config;
