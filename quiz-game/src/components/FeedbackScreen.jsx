import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useEffect } from 'react';

const FeedbackScreen = ({ isCorrect, explanation, onNext }) => {
    useEffect(() => {
        const duration = 4000;
        const timer = setTimeout(() => {
            onNext();
        }, duration);
        return () => clearTimeout(timer);
    }, [onNext, isCorrect]);

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-brand-blue/60 backdrop-blur-md">
            <motion.div
                className="w-full max-w-sm"
                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 50, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
                <div className={`bg-white border-4 ${isCorrect ? 'border-brand-blue' : 'border-brand-orange'
                    } shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)] relative overflow-hidden`}>

                    <div className="p-8 text-center">
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", damping: 15, stiffness: 200 }}
                            className="mb-6 inline-block p-4 border-4 border-current shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]"
                            style={{ color: isCorrect ? 'var(--brand-blue)' : 'var(--brand-orange)' }}
                        >
                            {isCorrect ? (
                                <CheckCircle2 className="w-16 h-16" strokeWidth={2.5} />
                            ) : (
                                <XCircle className="w-16 h-16" strokeWidth={2.5} />
                            )}
                        </motion.div>

                        {/* Title */}
                        <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={`text-3xl font-black uppercase tracking-widest mb-4 ${isCorrect ? 'text-brand-blue' : 'text-brand-orange'
                                }`}
                        >
                            {isCorrect ? 'Correct!' : "Incorrect!"}
                        </motion.h3>

                        {/* Explanation */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-gray-900 text-sm font-bold leading-relaxed mb-6 bg-gray-50 p-4 border-2 border-gray-100 uppercase"
                        >
                            {explanation}
                        </motion.p>

                        {/* Progress Bar (Sharp) */}
                        <div className="w-full bg-gray-100 h-3 overflow-hidden border border-gray-200">
                            <motion.div
                                className={`h-full ${isCorrect ? 'bg-brand-blue' : 'bg-brand-orange'}`}
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 4, ease: "linear" }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default FeedbackScreen;
