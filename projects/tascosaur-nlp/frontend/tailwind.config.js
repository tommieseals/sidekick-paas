/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#0a0a0f',
          darker: '#0d0d14',
          dark: '#12121a',
          pink: '#ff2a6d',
          cyan: '#05d9e8',
          yellow: '#f9f002',
          purple: '#d300c5',
          green: '#01ff70',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        cyber: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        'neon-pink': '0 0 5px #ff2a6d, 0 0 20px #ff2a6d, 0 0 40px #ff2a6d',
        'neon-cyan': '0 0 5px #05d9e8, 0 0 20px #05d9e8, 0 0 40px #05d9e8',
        'neon-green': '0 0 5px #01ff70, 0 0 20px #01ff70',
        'neon-yellow': '0 0 5px #f9f002, 0 0 20px #f9f002',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'flicker': 'flicker 0.15s infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        'flicker': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
};
