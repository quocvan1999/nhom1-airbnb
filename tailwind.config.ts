import type { Config } from "tailwindcss";

const config: Config = {
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
      },
    },
  },
  plugins: [],
};
export default config;
