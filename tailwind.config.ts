import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0B0F14',
        surface: '#121821',
        border: '#1E2633',
        text: '#E5EAF2',
        muted: '#9AA6B2',
        accent: { DEFAULT: '#4FD1C5', 600: '#3BB7AC' },
        danger: '#EF4444',
        success: '#22C55E',
        warning: '#F59E0B'
      },
      boxShadow: { card: '0 6px 24px rgba(0,0,0,0.25)' }
    }
  },
  plugins: []
} satisfies Config;
