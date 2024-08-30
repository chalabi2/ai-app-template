import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    extend: {
      keyframes: {
        typing: {
          "0%": {
            width: "0%",
            visibility: "hidden"
          },
          "100%": {
            width: "100%"
          }
        }
      },
      animation: {
        typing: "typing 2s steps(20) infinite alternate"
      },
      colors: {
        'win-gray': '#c0c0c0',
        'win-blue': '#000080',
        'win-teal': '#008080',
        'win-green': '#39ff14',
        'win-purple': '#9932cc',
        'win-red': '#ff0000',
        'win-yellow': '#ffff00',
        'win-cyan': '#00ffff',
        'win-pink': '#ff69b4',
      },
      boxShadow: {
        'win': 'inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px #fff',
        'win-inset': 'inset -1px -1px #fff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px grey',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
    function ({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        ".animation-delay-200": {
          "animation-delay": "200ms",
        },
        ".animation-delay-400": {
          "animation-delay": "400ms",
        },
        ".win-border": {
          "border-style": "solid",
          "border-width": "3px",
          "border-left-color": "#dfdfdf",
          "border-top-color": "#dfdfdf",
          "border-right-color": "#0a0a0a",
          "border-bottom-color": "#0a0a0a",
        },
        ".win-border-inset": {
          "border-style": "solid",
          "border-width": "3px",
          "border-left-color": "#0a0a0a",
          "border-top-color": "#0a0a0a",
          "border-right-color": "#dfdfdf",
          "border-bottom-color": "#dfdfdf",
        },
        ".pixelated": {
          "image-rendering": "pixelated",
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config

export default config