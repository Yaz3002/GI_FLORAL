/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9f1',
          100: '#dcf1de',
          200: '#bce3c1',
          300: '#92ce99',
          400: '#67b46f',
          500: '#4CAF50', // Main primary color
          600: '#3a8c3e',
          700: '#2f7034',
          800: '#29592d',
          900: '#244a27',
          950: '#0f2911',
        },
        secondary: {
          50: '#fdf2f7',
          100: '#fce7f1',
          200: '#fbcee4',
          300: '#f9a6ca',
          400: '#f470a4',
          500: '#E91E63', // Main secondary color
          600: '#d41557',
          700: '#b21148',
          800: '#931240',
          900: '#7c113a',
          950: '#4a0520',
        },
        accent: {
          50: '#f8f8fd',
          100: '#ededfa',
          200: '#d7d7f3',
          300: '#b5b4e9',
          400: '#8f8bdd',
          500: '#7269D1', // Main accent color
          600: '#5a4ec1',
          700: '#4c3ea9',
          800: '#3f348b',
          900: '#362e71',
          950: '#211c42',
        },
        success: {
          500: '#10b981',
        },
        warning: {
          500: '#f59e0b',
        },
        error: {
          500: '#ef4444',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      boxShadow: {
        card: '0 2px 10px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 20px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};