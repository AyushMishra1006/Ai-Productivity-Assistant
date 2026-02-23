/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // Modern Dark Theme (like Orchestra AI)
          bg: '#0f1419',           // Dark navy background
          darker: '#1a1f2e',       // Darker panels
          surface: '#16202f',      // Card surfaces
          text: '#e4e6eb',         // Light text
          textMuted: '#8892a6',    // Muted text

          // Vibrant Accent Colors
          primary: '#6366f1',      // Indigo
          secondary: '#ec4899',    // Pink/Magenta
          accent: '#f59e0b',       // Amber
          success: '#10b981',      // Emerald
          warning: '#f97316',      // Orange
          danger: '#ef4444',       // Red
          info: '#06b6d4',         // Cyan

          // Gradient pairs
          blue: '#3b82f6',         // Blue
          purple: '#a855f7',       // Purple
          cyan: '#06b6d4',         // Cyan

          border: '#2d3748',       // Dark borders
          inputBg: '#1f2937',      // Input backgrounds
        }
      },
      keyframes: {
        'ticker-scroll': {
          '0%': { transform: 'translateX(100vw)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        }
      },
      animation: {
        'ticker': 'ticker-scroll 35s linear infinite',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-lg': '0 10px 40px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
      }
    }
  },
  plugins: []
}
