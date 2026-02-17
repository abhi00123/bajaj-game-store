import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Card = ({
    children,
    className = '',
    onClick,
    selected = false,
    hoverable = true,
}) => {
    return (
        <motion.div
            whileHover={hoverable ? { y: -4, scale: 1.01 } : {}}
            onClick={onClick}
            className={cn(
                'glass-card p-6 transition-all duration-300',
                selected ? 'neon-ring border-primary-500/50 transform scale-[1.02]' : 'hover:border-primary-500/20',
                onClick ? 'cursor-pointer' : '',
                className
            )}
        >
            {children}
        </motion.div>
    );
};

export default Card;
