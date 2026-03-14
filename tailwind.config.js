/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cm-green':  '#007a5e',
        'cm-red':    '#ce1126',
        'cm-yellow': '#fcd116',
        'navy':      '#1e3a8a',
        'navy-dark': '#0f172a',
        cream:       '#faf9f7',
        warm:        '#f5f0e8',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        syne:  ['Syne', 'sans-serif'],
        body:  ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      keyframes: {
        flagSlide:   { '0%': { backgroundPosition: '0% 50%' }, '100%': { backgroundPosition: '200% 50%' } },
        fadeUp:      { from: { opacity: '0', transform: 'translateY(18px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        heartbeat:   { '0%, 100%': { transform: 'scale(1)' }, '14%': { transform: 'scale(1.12)' }, '28%': { transform: 'scale(1)' } },
        gentlePulse: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
        toastIn:     { from: { opacity: '0', transform: 'translate(-50%, -16px) scale(0.95)' }, to: { opacity: '1', transform: 'translate(-50%, 0) scale(1)' } },
      },
      animation: {
        'flag-slide':   'flagSlide 12s linear infinite',
        'fade-up':      'fadeUp 0.6s cubic-bezier(.22,1,.36,1) both',
        'heartbeat':    'heartbeat 2.5s ease-in-out infinite',
        'gentle-pulse': 'gentlePulse 3s ease-in-out infinite',
        'toast-in':     'toastIn 0.4s cubic-bezier(.22,1,.36,1) both',
      },
    },
  },
  plugins: [],
}
