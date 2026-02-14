/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 背景色
        'bg-primary': '#FAF9F6',
        'bg-secondary': '#F5F3EF',
        'bg-tertiary': '#FFFFFF',
        
        // 主色
        'primary-light': '#A8C9B4',
        'primary': '#7BA58F',
        'primary-dark': '#5A8A6F',
        
        // 强调色
        'accent-light': '#E8C4BE',
        'accent': '#D4A59A',
        'accent-dark': '#C08A82',
        
        // 图表色
        'chart-income': '#8DB6A3',
        'chart-expense': '#D4A59A',
        'chart-savings': '#9BB5CE',
        'chart-investment': '#B5A9A9',
        'chart-target': '#A8B5A0',
        'chart-insurance': '#C4B5C4',
        
        // 文字色
        'text-primary': '#2D2D2D',
        'text-secondary': '#6B6B6B',
        'text-tertiary': '#9B9B9B',
        
        // 边框
        'border-light': '#F0EDE8',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'PingFang SC',
          'Microsoft YaHei',
          'sans-serif'
        ],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'soft': '0 8px 32px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 16px 48px rgba(0, 0, 0, 0.08)',
        'soft-hover': '0 12px 40px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'card': '20px',
        'button': '16px',
        'tag': '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
