import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Segment from './Segment';

const Tube = ({
    segments,
    capacity,
    isSelected,
    isValidTarget,
    isSorted,
    onClick,
    index
}) => {
    return (
        <motion.div
            animate={{
                y: 0,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => onClick(index)}
            className={`
                relative w-[3.8rem] h-[12.5rem] sh:w-[2.8rem] sh:h-[9rem] sm:w-[4.5rem] sm:h-[14rem] flex flex-col-reverse
                glass-tube cursor-pointer transition-colors duration-300
                ${isSelected ? 'ring-2 ring-gold shadow-[0_0_30px_rgba(245,200,66,0.6)] z-50' : 'border border-white/10 z-0'}
                ${isValidTarget ? 'ring-2 ring-teal-400/50 animate-pulse-border shadow-[0_0_15px_rgba(45,212,191,0.3)] z-40' : 'z-0'}
                ${isSorted ? 'sorted-tube ring-2 ring-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)] z-20' : 'z-0'}
            `}
        >
            {/* Inner Liquid Container */}
            <div className="h-full w-full flex flex-col-reverse overflow-hidden" style={{ borderRadius: '0 0 41px 41px' }}>
                <AnimatePresence mode="popLayout">
                    {segments.map((segment, idx) => (
                        <Segment
                            key={segment.instanceId}
                            element={segment}
                            isTop={idx === segments.length - 1}
                            isBottom={idx === 0}
                            heightPct={100 / capacity}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Completion Particle / Flare Effect for Sorted Tubes */}
            {isSorted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-gold animate-bounce">
                    <div className="w-1 h-1 bg-gold rounded-full shadow-[0_0_10px_gold]" />
                </div>
            )}

            {/* Perspective Shadow */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-3 bg-black/15 blur-lg rounded-full pointer-events-none" />
        </motion.div>
    );
};

export default Tube;
