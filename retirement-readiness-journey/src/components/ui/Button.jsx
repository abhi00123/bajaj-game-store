import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Button = ({
    children,
    onClick,
    disabled = false,
    className = '',
    variant = 'primary' || 'secondary' || 'outline',
    type = 'button'
}) => {
    const variants = {
        primary: 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-600',
        secondary: 'bg-accent-500 text-white shadow-lg shadow-accent-500/30 hover:bg-accent-600',
        outline: 'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50/',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    };

    return (
        <motion.button
            type={type}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'px-8 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base',
                variants[variant] || variants.primary,
                className
            )}
        >
            {children}
        </motion.button>
    );
};

export default Button;
