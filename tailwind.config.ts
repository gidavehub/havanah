import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c3d66',
          DEFAULT: '#2badef',
          light: '#4bbef5',
          dark: '#1e8ac4',
        },
        secondary: '#a368d9',
        accent: '#ff6b9d',
      },
      fontFamily: {
        sans: ['Manrope', ...defaultTheme.fontFamily.sans],
        mono: ['Fira Code', ...defaultTheme.fontFamily.mono],
      },
      backdropBlur: {
        md: '12px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(43, 173, 238, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(43, 173, 238, 0.4)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        blob: 'blob 7s infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;
