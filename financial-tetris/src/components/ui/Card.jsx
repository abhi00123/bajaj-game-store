import React from 'react';

const Card = ({ children, className = '', variant = 'light' }) => {
    const bgStyles = variant === 'dark'
        ? 'bg-tetris-grid bg-opacity-95 border-tetris-blue border-opacity-30'
        : 'bg-white bg-opacity-95 border-blue-200/50';

    return (
        <div className={`${bgStyles} backdrop-blur-md border rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] ${className}`}>
            {children}
        </div>
    );
};

export default Card;
