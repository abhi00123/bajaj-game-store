import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, RotateCcw } from "lucide-react";

const ThankYouScreen = ({ leadName, onRestart }) => {
    return (
        <motion.div
            className="w-full flex-1 flex flex-col items-center justify-between py-10 px-6 text-center overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex-1 flex flex-col justify-center space-y-10 min-h-0 w-full max-w-sm">
                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    className="flex justify-center"
                >
                    <div className="bg-[#005faa] p-6 rounded-full shadow-2xl relative">
                        <div className="absolute inset-0 bg-[#005faa]/30 rounded-full animate-ping" />
                        <CheckCircle2 className="w-20 h-20 text-white relative z-10" strokeWidth={2.5} />
                    </div>
                </motion.div>

                {/* Thank You Message */}
                <div className="space-y-4 px-4">
                    <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-[1.1] flex flex-col items-center gap-2">
                        <span>THANK YOU</span>
                        <span className="text-gold drop-shadow-[0_0_15px_rgba(251,191,36,0.4)] break-words max-w-full italic px-2">
                            {leadName ? leadName : 'GUEST'}
                        </span>
                        <span className="text-center text-xl sm:text-2xl opacity-90">FOR BOOKING A SLOT</span>
                    </h2>
                    <p className="text-sm sm:text-base text-white/50 font-bold uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed border-t border-white/10 pt-4">
                        Our Relationship Manager will reach out to you
                    </p>
                </div>
            </div>

            {/* Action Section */}
            <div className="w-full max-w-xs pt-4 pb-2 text-center">
                <button
                    onClick={onRestart}
                    className="w-full bg-white/10 text-white font-black text-xl py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/20 transition-all active:scale-95 border border-white/10"
                >
                    <RotateCcw className="w-6 h-6 text-gold" />
                    <span>PLAY AGAIN</span>
                </button>
            </div>
        </motion.div>
    );
};

export default ThankYouScreen;
