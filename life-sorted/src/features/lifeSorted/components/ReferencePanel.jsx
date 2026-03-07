import React from 'react';
import { CATEGORY_CONFIG } from '../constants/categoryConfig';

const ReferencePanel = ({ activeCategories }) => {
    return (
        <div className="w-full max-w-sm flex flex-wrap justify-center gap-x-4 gap-y-3 mt-10 animate-fade-in px-4">
            {activeCategories.map(catKey => {
                const config = CATEGORY_CONFIG[catKey];
                if (!config) return null;
                return (
                    <div
                        key={catKey}
                        className="flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel border border-white/5 bg-white/[0.02] backdrop-blur-md shadow-lg"
                    >
                        <div
                            className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor] animate-pulse"
                            style={{ backgroundColor: config.color, color: config.color }}
                        />
                        <span className="text-[0.6rem] font-black uppercase tracking-[0.15em] text-white/50">
                            {config.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default ReferencePanel;
