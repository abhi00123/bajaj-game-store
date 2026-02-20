import React from 'react';
import { motion } from 'framer-motion';

const MobileControls = ({ onLeft, onRight, onRotate, onDown, onDrop }) => {
    return (
        <div className="w-full max-w-[360px] mx-auto mt-2 px-4 grid grid-cols-3 gap-2 auto-rows-auto select-none touch-manipulation">
            {/* Row 1: Rotate and Drop */}
            <div className="col-start-2 flex justify-center">
                <ControlButton onClick={onRotate} label="Rotate" icon="↻" color="bg-gradient-to-br from-purple-500 to-purple-700" />
            </div>

            {/* Row 2: Directionals */}
            <div className="col-span-3 grid grid-cols-3 gap-2 mt-1">
                <div className="flex justify-center">
                    <ControlButton onClick={onLeft} label="Left" icon="←" color="bg-gradient-to-br from-blue-400 to-blue-600" />
                </div>
                <div className="flex justify-center">
                    <ControlButton onClick={onDown} label="Down" icon="↓" color="bg-gradient-to-br from-yellow-400 to-yellow-600" />
                </div>
                <div className="flex justify-center">
                    <ControlButton onClick={onRight} label="Right" icon="→" color="bg-gradient-to-br from-blue-400 to-blue-600" />
                </div>
            </div>
        </div>
    );
};

const ControlButton = ({ onClick, label, color, icon }) => (
    <motion.button
        whileTap={{ scale: 0.9, y: 4 }}
        onClick={(e) => {
            e.preventDefault();
            onClick();
        }}
        className={`w-14 h-14 rounded-xl ${color} border-b-4 border-r-4 border-black/30 shadow-[inset_2px_2px_0px_rgba(255,255,255,0.4),0px_4px_0px_rgba(0,0,0,0.3)] 
        flex items-center justify-center text-white text-xl font-bold active:border-b-0 active:border-r-0 active:shadow-none active:translate-y-1 transition-all`}
        aria-label={label}
    >
        {icon || label}
    </motion.button>
);

export default React.memo(MobileControls);
