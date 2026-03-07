import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const SplashScreen = ({ onStart }) => {
    return (
        <div className="max-w-[190px] w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full"
            >
                <button
                    onClick={onStart}
                    className="group relative w-full overflow-hidden rounded-[2rem] bg-gold p-1 shadow-[0_6px_0_0_#b45309,0_10px_20px_rgba(251,191,36,0.25)] transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_0_0_#b45309,0_15px_30px_rgba(251,191,36,0.35)] active:translate-y-[4px] active:shadow-none"
                >
                    <div className="bg-gold rounded-[1.8rem] py-3.5 border-t-2 border-white/40 flex items-center justify-center gap-2">
                        <span className="relative z-10 block text-3xl font-black tracking-tighter text-black uppercase italic">
                            Start
                        </span>
                        <ArrowRight className="w-6 h-6 text-black" strokeWidth={3} />
                    </div>
                </button>
            </motion.div>
        </div>
    );
};

export default SplashScreen;
