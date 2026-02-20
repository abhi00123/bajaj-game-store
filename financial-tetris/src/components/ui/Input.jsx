import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, error, className = '' }) => {
    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            {label && <label className="text-xs font-black uppercase tracking-widest text-blue-500 ml-1">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`bg-slate-50 border-2 ${error ? 'border-red-500' : 'border-blue-100 focus:border-blue-400'} rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-bold`}
            />
            {error && <span className="text-[10px] text-red-500 font-black uppercase tracking-wider ml-1">{error}</span>}
        </div>
    );
};

export default Input;
