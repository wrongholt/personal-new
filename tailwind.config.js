/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/app/pages/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/app/components/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/app/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  safelist: [
    "from-orange-500",
    "to-red-600",
    "from-yellow-600",
    "to-orange-700",
    "from-blue-500",
    "to-purple-600",
    "from-teal-500",
    "to-blue-600",
    "from-indigo-500",
    "to-purple-600",
    "from-green-500",
    "to-teal-600",
  ],
  theme: {
    extend: {
      fontFamily: {
        unbounded: ['"Unbounded"', "sans-serif"],
        zen: ['"Zen Kaku Gothic Antique"', "sans-serif"],
        fell: ['"IM Fell English SC"', "serif"],
        orbitron: ['"Orbitron"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
