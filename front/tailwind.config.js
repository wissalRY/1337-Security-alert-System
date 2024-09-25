const colors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        'xsmm': {"max":'350px'},
      },
      height: {
        100: "45.55rem",
      },
      animation: {
        getbig: "getbig 0.2s cubic-bezier(0, 0, 0.3, 1.50)",
        getbigY: "getbigY 0.3s cubic-bezier(0, 0, 0.3, 1.50) forwards",
      },
      keyframes: {
        getbigY: {
          "0%": {
            maxHeight: "0",
            opacity: "0",
          },
          "100%": {
            maxHeight: "250px",
            opacity: "1",
          },
        },
        getbig: {
          "0%": {
            transform: " scaleX(0)",
          },

          "100%": {
            transform: "scaleX(1)",
          },
        },
      },
      colors: colors,
      colors: {
        backgroundC: "#6042F5",
        mainTextC: "#FAE09B",
        primaryC: "#FFFF",
        secondaryC: "#f7f9fb",
        shC: "#64748B",
        ghC: "#475569",
        phC: "#F1F5F9",
        pcC: "#1E293B",
        fC: "#334155",
        dPrimary: "#121212",
        dSecondary: "#1c2739",
        dHeading: "#18142c",
        dHeadingC: "#94A3B8",
      },
      rotate: {
        350: "350deg",
        20: "20deg",
      },
    },
    colors: colors,
    container: {
      center: true,
      screens: {
        lg: "1124px",
        xl: "1124px",
        "2xl": "1124px",
      },
    },
    screens: {
      "2xl": { max: "1535px" },
      // => @media (max-width: 1535px) { ... }

      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      xll: { max: "1200px" },
      // => @media (max-width: 1200px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }

      smm: { max: "415px" },
      // => @media (max-width: 415px) { ... }
    },
  },
};
