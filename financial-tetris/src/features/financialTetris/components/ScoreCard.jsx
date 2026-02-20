import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const ScoreCard = ({ score, total }) => {
    const count = useMotionValue(0);
    const roundedCount = useTransform(count, (latest) => Math.round(latest));

    useEffect(() => {
        const controls = animate(count, score, { duration: 2, ease: "easeOut" });
        return controls.stop;
    }, [score, count]);

    // Circle properties
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 2000) * circumference; // Assuming 2000 as a benchmark high score

    return (
        <div className="flex justify-center items-center py-1">
            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="12"
                        className="drop-shadow-sm"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="12"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: circumference - Math.min(progress, circumference) }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    />
                </svg>

                {/* Score Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="uppercase tracking-widest text-[10px] font-black text-gray-400 mb-1">
                        SCORE
                    </div>
                    <div className="flex items-baseline justify-center text-blue-500 gap-0.5">
                        <motion.span className="text-4xl font-black leading-none">
                            {roundedCount}
                        </motion.span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreCard;
