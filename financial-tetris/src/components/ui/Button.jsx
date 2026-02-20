import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
    const baseStyles = 'px-6 py-3 rounded-lg font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base';

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors',
        secondary: 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 shadow-sm transition-colors',
        ghost: 'bg-transparent text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
