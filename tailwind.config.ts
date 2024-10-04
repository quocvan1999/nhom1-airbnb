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
      colors: {
        primary: {
          "100": "#FF385C",
          "200": "#E21B60",
        },
        "custome-gray": {
          "100": "#f7f7f7",
          "200": "#6A6A6A",
        },
        "custome-black": {
          "100": "#222222",
        },
        customerBG:
          "linear-gradient(to left bottom, #ff385c, #db2e4d, #b8233e, #961a30, #761023);",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        custom: ["AirbnbCerealVF", "sans-serif"],
      },
      screens: {
        mdc: "850px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
