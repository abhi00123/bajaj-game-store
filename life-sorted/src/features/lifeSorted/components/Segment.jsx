import React from 'react';
import { motion } from 'framer-motion';

const Segment = ({
    element,
    isTop,
    isBottom,
    isBeingPoured = false,
    isFilling = false,
    tiltAngle = 0,
    heightPct = 25,
    isStreaming = false
}) => {
    const baseColor = element.color;

    // Calculate counter-rotation to keep liquid surface level with horizon
    const surfaceRotation = -tiltAngle;

    return (
        <motion.div
            layout
            initial={isFilling ? { height: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
            animate={{
                // ONLY drain/fill if streaming is active
                height: (isStreaming && isBeingPoured) ? 0 : `${heightPct}%`,
                opacity: (isBeingPoured && !isFilling) ? 0 : 1,
                rotate: surfaceRotation,
                transition: {
                    height: { duration: 0.6, ease: "linear" },
                    opacity: { duration: 0.3 },
                    rotate: { duration: 0.3, ease: "easeInOut" }
                }
            }}
            className={`relative w-full flex-shrink-0 flex items-center justify-center
                ${isBottom ? 'rounded-b-[2rem]' : 'rounded-none'}
            `}
            style={{
                backgroundColor: baseColor,
                marginBottom: '-1px',
                transformOrigin: 'center center',
                scale: tiltAngle !== 0 ? 1.6 : 1, // Sharper scale for 75deg tilt
                x: tiltAngle !== 0 ? (tiltAngle > 0 ? 2 : -2) : 0 // Subtle shift to center liquid during tilt
            }}
        >


            {/* Label - Hidden during animation/tilt for clarity */}
            {!isBeingPoured && !isFilling && tiltAngle === 0 && (
                <span className="relative z-10 text-[0.45rem] font-bold text-white/50 uppercase tracking-tighter select-none leading-none">
                    {element.label}
                </span>
            )}
        </motion.div>
    );
};

export default Segment;
