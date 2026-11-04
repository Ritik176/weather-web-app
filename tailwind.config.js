/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        skycast: {
          bg: '#050814',
          card: 'rgba(11, 19, 43, 0.65)',
          border: 'rgba(0, 242, 254, 0.2)',
          accent: '#00f2fe',
          accentGlow: '#4facfe',
          neon: '#a855f7',
          surface: '#0B132B',
          text: '#f1f5f9',
          muted: '#94a3b8',
        },
        weatherly: {
          bg: '#f0f4f9',
          card: 'rgba(255, 255, 255, 0.75)',
          border: 'rgba(203, 213, 225, 0.7)',
          accent: '#3b82f6',
          accentGlow: '#60a5fa',
          surface: '#ffffff',
          text: '#1e293b',
          muted: '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'spin-reverse': 'spin-reverse 15s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 7s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'rain-drop': 'rainDrop 0.8s linear infinite',
        'lightning': 'lightning 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'sun-glow': 'sunGlow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(0.98)' },
        },
        rainDrop: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '30%': { opacity: '1' },
          '100%': { transform: 'translateY(40px)', opacity: '0' },
        },
        lightning: {
          '0%, 90%, 100%': { opacity: '0' },
          '92%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.9))' },
          '94%': { opacity: '0.2' },
          '96%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(168,85,247,0.9))' },
          '98%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        sunGlow: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 35px rgba(245, 158, 11, 0.8))' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
