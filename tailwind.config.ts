import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#f5f0e8',
          dark: '#ece4d6',
          light: '#faf7f0',
        },
        ink: {
          DEFAULT: '#2c2c2c',
          light: '#5a5a5a',
          lighter: '#8a8a8a',
        },
        pencil: {
          DEFAULT: '#f5c542',
          dark: '#d4a830',
          light: '#f8d97a',
        },
        correct: '#4a9c6f',
        error: '#c0392b',
        accent: '#5b7db5',
        warm: {
          border: '#d4c9b8',
          shadow: 'rgba(180, 160, 140, 0.25)',
        },
      },
      fontFamily: {
        handwriting: ['"Ma Shan Zheng"', '"ZCOOL XiaoWei"', 'cursive'],
        cursive: ['"Caveat"', 'cursive'],
        mono: ['"JetBrains Mono"', 'monospace'],
        body: ['"Noto Sans SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      borderRadius: {
        sketch: '255px 15px 225px 15px / 15px 225px 15px 255px',
        'sketch-sm': '60px 8px 80px 8px / 8px 60px 8px 80px',
      },
      boxShadow: {
        'pencil': '3px 3px 0 rgba(180, 160, 140, 0.3), -1px -1px 0 rgba(180, 160, 140, 0.15)',
        'pencil-md': '4px 4px 0 rgba(180, 160, 140, 0.25), -2px -2px 0 rgba(180, 160, 140, 0.1)',
        'pencil-lg': '6px 6px 0 rgba(180, 160, 140, 0.2), -3px -3px 0 rgba(180, 160, 140, 0.08)',
      },
      animation: {
        'sketch-in': 'sketch-in 0.4s ease-out',
        'pop': 'pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'doodle': 'doodle 3s ease-in-out infinite',
        'float': 'float 2s ease-in-out infinite',
      },
      keyframes: {
        'sketch-in': {
          '0%': { opacity: '0', transform: 'scale(0.95) rotate(-0.5deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'doodle': {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
