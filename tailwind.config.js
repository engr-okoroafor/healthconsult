/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        medical: {
          primary: '#10B981', // Brighter, more vibrant green
          secondary: '#059669',
          accent: '#34D399',
          light: '#F0FDF4',
          dark: '#064E3B',
          bright: '#00D563', // Life-giving bright green
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.95)',
          green: 'rgba(16, 185, 129, 0.05)',
        }
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'medical': '0 4px 14px 0 rgba(16, 185, 129, 0.1), 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'medical-lg': '0 10px 25px -3px rgba(16, 185, 129, 0.15), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
        'green-glow': '0 0 20px rgba(16, 185, 129, 0.2)',
        'green-stroke': 'inset 0 0 0 1px rgba(16, 185, 129, 0.2)',
        'white-glow': '0 4px 20px rgba(255, 255, 255, 0.8)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-out-left': 'slideOutLeft 0.3s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
};