import { motion } from 'framer-motion';
import { CheckCircle2, RotateCcw } from "lucide-react";
import { useQuiz } from '../context/QuizContext';

const ThankYouScreen = () => {
    const { retakeQuiz, leadName } = useQuiz();

    return (
        <motion.div
            className="w-full h-full flex flex-col justify-between py-10 px-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex-1 flex flex-col justify-center space-y-10">
                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    className="flex justify-center"
                >
                    <div className="bg-brand-orange p-6 rounded-full shadow-2xl relative">
                        <div className="absolute inset-0 bg-brand-orange/30 rounded-full animate-ping" />
                        <CheckCircle2 className="w-20 h-20 text-white relative z-10" strokeWidth={2.5} />
                    </div>
                </motion.div>

                {/* Thank You Message */}
                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tight leading-tight">
                        Thank You {leadName ? leadName : ''} for<br />sharing your details
                    </h2>
                    <p className="text-lg text-white/80 font-bold uppercase tracking-wide max-w-[280px] mx-auto leading-relaxed">
                        Our Relationship Manager will reach out to you
                    </p>
                </div>
            </div>

            {/* Action Section */}
            <div className="space-y-6">
                <button
                    onClick={retakeQuiz}
                    className="w-full game-btn-orange text-3xl py-6 shadow-[0px_8px_0px_0px_rgba(194,65,12,1)] rounded-2xl"
                >
                    <div className="flex items-center justify-center gap-4">
                        <RotateCcw className="w-8 h-8" />
                        <span>RETAKE</span>
                    </div>
                </button>
                <p className="text-[10px] text-white/40 font-black text-center uppercase tracking-[0.2em]">
                    Bajaj Life Insurance
                </p>
            </div>
        </motion.div>
    );
};

export default ThankYouScreen;
