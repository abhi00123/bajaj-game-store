import React from 'react';
import { motion } from 'framer-motion';

const PouringStream = ({ sourceX, sourceY, targetX, targetY, color, isStreaming }) => {
    if (!isStreaming) return null;

    const streamHeight = Math.abs(targetY - sourceY);

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
                height: streamHeight,
                opacity: 1,
            }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
            style={{
                position: 'fixed',
                left: sourceX,
                top: sourceY,
                width: '12px',
                // Tapered shape: wider at top (lip), narrower at bottom (surface)
                clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)',
                background: `linear-gradient(to bottom, ${color} 0%, ${color} 100%)`,
                zIndex: 45,
                boxShadow: `0 0 10px ${color}88`,
                pointerEvents: 'none',
                transform: 'translateX(-50%)',
                filter: 'blur(0.3px)',
                overflow: 'hidden'
            }}
            transition={{
                height: { duration: 0.3, ease: "easeOut" },
                opacity: { duration: 0.2 }
            }}
        >
            {/* Flow Velocity Simulation */}
            <motion.div
                animate={{ y: [0, 40] }}
                transition={{
                    repeat: Infinity,
                    duration: 0.4,
                    ease: "linear"
                }}
                style={{
                    width: '100%',
                    height: '200%',
                    background: `repeating-linear-gradient(
                        to bottom,
                        transparent,
                        transparent 20px,
                        rgba(255,255,255,0.1) 21px,
                        transparent 22px
                    )`
                }}
            />
        </motion.div>
    );
};

export default PouringStream;
