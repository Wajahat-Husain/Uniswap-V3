/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {

          "primary": "#19e016",

          "secondary": "#1ace95",

          "accent": "#e89ddf",

          "neutral": "#1c2331",

          "base-100": "#243842",

          "info": "#65ccec",

          "success": "#1aa267",

          "warning": "#b07c0c",

          "error": "#f2545f",
        },
      },
    ],
  },
}

