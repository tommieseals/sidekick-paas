/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        finance: {
          dark: '#0F172A',
          darker: '#020617',
          card: '#1E293B',
          border: '#334155',
          green: '#10B981',
          red: '#EF4444',
          blue: '#3B82F6',
          yellow: '#F59E0B',
          purple: '#8B5CF6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
