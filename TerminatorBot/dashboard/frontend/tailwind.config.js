/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Trading terminal dark theme
        terminal: {
          bg: '#0a0e17',
          card: '#111827',
          border: '#1f2937',
          text: '#e5e7eb',
          muted: '#6b7280',
        },
        profit: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        loss: {
          DEFAULT: '#ef4444',
          light: '#f87171',
          dark: '#dc2626',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
