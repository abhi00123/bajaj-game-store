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
    index,
    isPouring = false,
    isBeingPouredInto = false,
    tiltDirection = 'right',
    pourOffset = null,
    pouringState = null
}) => {
    // Sharper tilt for more "real" look
    const tiltAngle = tiltDirection === 'right' ? 75 : -75;

    // FIXED: Tilting should start as soon as the tube is in pouring mode
    const isCurrentlyTilting = isPouring;

    const movedCount = pouringState?.movedCount || 0;
    const movedColor = pouringState?.movedColor;

    return (
        <motion.div
            animate={{
                rotate: isCurrentlyTilting ? tiltAngle : 0,
                y: isPouring ? (pourOffset?.y || -60) : (isSelected ? -6.4 : 0),
                x: isPouring ? (pourOffset?.x || 0) : 0,
                zIndex: isPouring ? 100 : (isSelected || isBeingPouredInto ? 20 : 1)
            }}
            style={{ transformOrigin: 'top center' }}
            transition={{
                rotate: { duration: 0.3, ease: "easeInOut" },
                x: { duration: 0.4, ease: "easeInOut" },
                y: { duration: 0.4, ease: "easeInOut" },
                zIndex: { duration: 0 }
            }}
            onClick={() => onClick(index)}
            className={`
        relative w-[3rem] h-[13rem] flex flex-col-reverse
        glass-tube cursor-pointer transition-shadow duration-300
        ${isSelected ? 'ring-[3px] ring-gold/40 shadow-[0_0_20px_rgba(244,211,94,0.3)]' : ''}
        ${isValidTarget ? 'ring-[3px] ring-teal/30' : ''}
        ${isSorted ? 'sorted-tube ring-[3px] ring-gold shadow-[0_0_30px_rgba(244,211,94,0.4)]' : ''}
      `}
        >


            {/* Inner Liquid Container */}
            <div className="h-full w-full flex flex-col-reverse overflow-hidden" style={{ borderRadius: '0 0 41px 41px' }}>
                <AnimatePresence mode="popLayout">
                    {/* Existing Segments */}
                    {segments.map((segment, idx) => {
                        // Drainage: Source tube segments shrink to 0 height
                        const isSourceSegmentBeingPoured = isCurrentlyTilting && idx >= (segments.length - movedCount);
                        const isVisualTop = !isBeingPouredInto && !isCurrentlyTilting && (idx === segments.length - 1);

                        return (
                            <Segment
                                key={segment.instanceId}
                                element={segment}
                                isTop={isVisualTop}
                                isBottom={idx === 0}
                                isBeingPoured={isSourceSegmentBeingPoured}
                                tiltAngle={isCurrentlyTilting ? tiltAngle : 0}
                                heightPct={100 / capacity}
                                isStreaming={pouringState?.isStreaming}
                            />
                        );
                    })}

                    {/* Phantom Filling Segments for Target Tube */}
                    {isBeingPouredInto && (pouringState?.isStreaming) && Array.from({ length: movedCount }).map((_, i) => (
                        <Segment
                            key={`phantom-${i}`}
                            element={{ color: movedColor, label: '' }}
                            isTop={i === movedCount - 1}
                            isBottom={segments.length === 0 && i === 0}
                            isFilling={true}
                            tiltAngle={0}
                            heightPct={100 / capacity}
                            isStreaming={pouringState?.isStreaming}
                        />
                    ))}
                </AnimatePresence>

                {/* Filling Splash Ripple Effect - Sync with top filling segment */}
                {isBeingPouredInto && (pouringState?.isStreaming) && (
                    <motion.div
                        initial={{ opacity: 0, bottom: `${segments.length * (100 / capacity)}%` }}
                        animate={{
                            opacity: 1,
                            bottom: `${(segments.length + movedCount) * (100 / capacity)}%`
                        }}
                        transition={{
                            bottom: { duration: 0.6, ease: "linear", delay: 0.2 },
                            opacity: { duration: 0.2, delay: 0.2 }
                        }}
                        className="splash-ripple"
                    />
                )}
            </div>

            {/* Completion Particle / Flare Effect for Sorted Tubes */}
            {isSorted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-gold animate-bounce">
                    <div className="w-1 h-1 bg-gold rounded-full shadow-[0_0_10px_gold]" />
                </div>
            )}

            {/* Hidden placeholders for grid alignment */}
            <div className="absolute inset-0 flex flex-col-reverse p-[0.3rem] pointer-events-none opacity-0">
                {Array.from({ length: capacity }).map((_, i) => (
                    <div key={i} className="w-full" style={{ height: `${100 / capacity}%` }} />
                ))}
            </div>

            {/* Perspective Shadow */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-3 bg-black/15 blur-lg rounded-full pointer-events-none" />
        </motion.div>
    );
};

export default Tube;
