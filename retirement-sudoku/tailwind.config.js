/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
        './index.html',
        './src/**/*.{js,jsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
                game: ['Luckiest Guy', 'cursive'],
                body: ['Nunito', 'sans-serif'],
            },
            colors: {
                'sudoku-bg': '#0A0F1E',
                'sudoku-surface': '#111827',
                'sudoku-card': '#1A2235',
                'sudoku-border': '#1E2D45',
                'sudoku-primary': '#1e3a5f',
                'sudoku-accent': '#f59e0b',
                'sudoku-success': '#10b981',
                'sudoku-danger': '#ef4444',
                'sudoku-muted': '#64748B',
                'sudoku-text': '#E2E8F0',
                'sudoku-text-dim': '#94A3B8',
                'pillar-pension': '#6366F1',
                'pillar-rental': '#10B981',
                'pillar-savings': '#F59E0B',
                'pillar-medical': '#EF4444',
                'pillar-leisure': '#8B5CF6',
            },
            borderRadius: {
                xl: '1rem',
                '2xl': '1.25rem',
                '3xl': '1.5rem',
            },
            spacing: {
                '4.5': '1.125rem',
                '13': '3.25rem',
                '15': '3.75rem',
                '18': '4.5rem',
                '22': '5.5rem',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(1.5rem)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.85)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 0.5rem 0.125rem rgba(245, 158, 11, 0.3)' },
                    '50%': { boxShadow: '0 0 1.5rem 0.5rem rgba(245, 158, 11, 0.6)' },
                },
                'pulse-danger': {
                    '0%, 100%': { boxShadow: '0 0 0.5rem 0.125rem rgba(239, 68, 68, 0.4)' },
                    '50%': { boxShadow: '0 0 1.5rem 0.5rem rgba(239, 68, 68, 0.8)' },
                },
                'win-burst': {
                    '0%': { transform: 'scale(0.5)', opacity: '0' },
                    '60%': { transform: 'scale(1.1)', opacity: '1' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'shake': {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-0.375rem)' },
                    '75%': { transform: 'translateX(0.375rem)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-0.5rem)' },
                },
                'timer-warning': {
                    '0%, 100%': { color: '#ef4444', transform: 'scale(1)' },
                    '50%': { color: '#fca5a5', transform: 'scale(1.08)' },
                },
                'confetti-fall': {
                    '0%': { transform: 'translateY(-100%) rotate(0deg)', opacity: '1' },
                    '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(2rem)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'drop-valid': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.08)' },
                    '100%': { transform: 'scale(1)' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.4s ease-out',
                'fade-in-up': 'fade-in-up 0.5s ease-out',
                'scale-in': 'scale-in 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'pulse-danger': 'pulse-danger 1s ease-in-out infinite',
                'win-burst': 'win-burst 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
                'shake': 'shake 0.35s ease-in-out',
                'float': 'float 3s ease-in-out infinite',
                'timer-warning': 'timer-warning 0.8s ease-in-out infinite',
                'slide-up': 'slide-up 0.4s ease-out',
                'drop-valid': 'drop-valid 0.3s ease-out',
            },
        },
    },
    plugins: [],
};
