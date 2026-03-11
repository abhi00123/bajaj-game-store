import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, Clock } from 'lucide-react';

const Toast = ({ message, type = 'info', onDismiss }) => {
    const icons = {
        info: <Info className="text-blue-400 w-5 h-5" />,
        success: <CheckCircle2 className="text-emerald-400 w-5 h-5" />,
        error: <AlertCircle className="text-red-400 w-5 h-5" />,
        warning: <Clock className="text-amber-400 w-5 h-5 animate-pulse" />,
    };

    const styles = {
        info: 'border-blue-500/30 bg-blue-950/80 shadow-[0_4px_24px_rgba(59,130,246,0.15)]',
        success: 'border-emerald-500/30 bg-emerald-950/80 shadow-[0_4px_24px_rgba(16,185,129,0.15)]',
        error: 'border-red-500/30 bg-red-950/80 shadow-[0_4px_24px_rgba(239,68,68,0.15)]',
        warning: 'border-amber-500/30 bg-amber-950/80 shadow-[0_4px_24px_rgba(245,158,11,0.2)]',
    };

    const textColors = {
        info: 'text-blue-100',
        success: 'text-emerald-100',
        error: 'text-red-100',
        warning: 'text-amber-100',
    };

    return (
        <div className="fixed top-16 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, y: -15 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className={`
                            flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-xl
                            pointer-events-auto max-w-sm w-full
                            ${styles[type]}
                        `}
                    >
                        <div className="shrink-0">
                            {icons[type]}
                        </div>
                        <p className={`text-sm font-bold ${textColors[type]}`}>{message}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Toast;
