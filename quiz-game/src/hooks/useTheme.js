import { useState, useEffect } from 'react';

/**
 * Custom hook for theme management (dark/light mode)
 */
export const useTheme = () => {
    // Check for saved theme preference or default to 'light'
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('quiz-theme');
        return savedTheme || 'light';
    });

    useEffect(() => {
        // Update localStorage when theme changes
        localStorage.setItem('quiz-theme', theme);

        // Update document root class for CSS
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return { theme, toggleTheme, isDark: theme === 'dark' };
};
