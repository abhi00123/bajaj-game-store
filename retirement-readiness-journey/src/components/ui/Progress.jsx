import React from 'react';
import { motion } from 'framer-motion';
import { STEP_ORDER } from '../../constants/journeySteps';

const Progress = ({ currentStepIndex }) => {
    // Exclude intro and results from progress calculation for the bar
    const totalSteps = STEP_ORDER.length - 2;
    const progressPercent = Math.max(0, Math.min(100, ((currentStepIndex) / (STEP_ORDER.length - 1)) * 100));

    return (
        <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-100 z-50">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-primary-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            />
            <div className="absolute top-4 right-6 text-xs font-bold text-slate-400 tracking-widest uppercase">
                Step {currentStepIndex} of {STEP_ORDER.length - 1}
            </div>
        </div>
    );
};

export default Progress;
