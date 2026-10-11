/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmos: {
          950: '#02040a',
          900: '#040817',
          850: '#070c24',
          800: '#0b1338',
          700: '#111b4a',
          600: '#1b2a6b',
        },
        nebula: {
          cyan: '#00f2fe',
          blue: '#4facfe',
          violet: '#8a2be2',
          purple: '#c084fc',
          magenta: '#f43f5e',
          amber: '#fbbf24',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'Outfit', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 242, 254, 0.45)',
        'glow-blue': '0 0 25px -5px rgba(79, 172, 254, 0.45)',
        'glow-violet': '0 0 25px -5px rgba(138, 43, 226, 0.45)',
        'glow-magenta': '0 0 25px -5px rgba(244, 63, 94, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
