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
                'game-body': ['Nunito', 'sans-serif'],
            },
            colors: {
                'bajaj-blue': '#0066B2',
                'bajaj-orange': '#FF6600',
                'race-dark': '#0B1120',
                'race-card': '#131B2E',
                'race-border': '#1E2A45',
                'race-accent': '#3B82F6',
                'race-success': '#10B981',
                'race-danger': '#EF4444',
                'race-warning': '#F59E0B',
                'race-muted': '#64748B',
                'race-surface': '#1A2332',
            },
            borderRadius: {
                lg: '0.75rem',
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
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 0.5rem 0.125rem rgba(59, 130, 246, 0.3)' },
                    '50%': { boxShadow: '0 0 1.25rem 0.375rem rgba(59, 130, 246, 0.6)' },
                },
                'meter-fill': {
                    '0%': { width: '0%' },
                    '100%': { width: 'var(--meter-width)' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(2rem)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'slide-in-right': {
                    '0%': { transform: 'translateX(2rem)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                'countdown-pulse': {
                    '0%': { transform: 'scale(1)', opacity: '1' },
                    '50%': { transform: 'scale(1.2)', opacity: '0.7' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'speedometer-needle': {
                    '0%': { transform: 'rotate(-90deg)' },
                    '100%': { transform: 'rotate(var(--needle-rotation))' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'shake': {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-0.25rem)' },
                    '75%': { transform: 'translateX(0.25rem)' },
                },
            },
            animation: {
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'meter-fill': 'meter-fill 0.8s ease-out forwards',
                'slide-up': 'slide-up 0.5s ease-out',
                'slide-in-right': 'slide-in-right 0.4s ease-out',
                'countdown-pulse': 'countdown-pulse 1s ease-in-out infinite',
                'speedometer-needle': 'speedometer-needle 1.5s ease-out forwards',
                'fade-in': 'fade-in 0.4s ease-out',
                'shake': 'shake 0.3s ease-in-out',
            },
        },
    },
    plugins: [],
};
