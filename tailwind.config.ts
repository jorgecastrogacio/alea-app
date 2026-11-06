import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        alea: {
          50: '#F4F5FD',
          100: '#E8EAFD',
          200: '#D5D8FA',
          300: '#B6BAF5',
          400: '#8E94EE',
          500: '#696DE4',
          600: '#5356D4',
          700: '#4345B5',
          800: '#383A93',
          900: '#2C2D6E',
          accent: '#4F46E5',
          card: '#FFFFFF',
          lavender: '#EFEFFC',
          twilight: '#26245C',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'soft-purple': '0 8px 30px -4px rgba(79, 70, 229, 0.08), 0 2px 10px -2px rgba(79, 70, 229, 0.04)',
        'magical': '0 12px 36px -6px rgba(105, 109, 228, 0.18)',
      },
    },
  },
  plugins: [],
};
export default config;
