import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { useQuiz } from '../context/QuizContext';
import { ShieldCheck, X } from 'lucide-react';

const WelcomeScreen = ({ onStart }) => {
    const { onLeadSubmit, leadName: savedName, leadPhone: savedPhone, isLeadSubmitted, isTermsAccepted, setIsTermsAccepted } = useQuiz();
    const [isOpen, setIsOpen] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false);

    // Form state
    const [name, setName] = useState(savedName || '');
    const [phone, setPhone] = useState(savedPhone || '');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validatePhone = (p) => /^[6-9]\d{9}$/.test(p);
    const isValidName = name.trim().length > 0;
    const isFormValid = isValidName && validatePhone(phone) && isTermsAccepted;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isValidName) {
            setError('Please enter your name');
            return;
        }
        if (!validatePhone(phone)) {
            setError('Please enter a valid 10-digit mobile number starting with 6–9');
            return;
        }
        if (!isTermsAccepted) {
            setError('Please accept the Terms & Conditions');
            return;
        }

        setIsSubmitting(true);
        const result = await onLeadSubmit(name, phone);
        setIsSubmitting(false);

        if (result.success) {
            setIsOpen(false);
            onStart();
        } else {
            setError(result.error || 'Something went wrong. Please try again.');
        }
    };

    const handleStartClick = () => {
        if (!isLeadSubmitted) {
            setIsOpen(true);
        } else {
            onStart();
        }
    };

    return (
        <motion.div
            className="w-full h-full flex flex-col justify-start py-4 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            {/* Character Section */}
            <div className="w-full h-[40vh] flex items-center justify-center min-h-0 shrink-0">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
                    className="w-full h-full max-w-[80%] sm:max-w-[317px]"
                >
                    <img
                        src="./assets/gst.png"
                        alt="GST Quiz Character"
                        className="w-full h-full object-contain"
                    />
                </motion.div>
            </div>

            {/* Title Section */}
            <div className="text-center space-y-3 sm:space-y-4">
                <h1 className="text-4xl font-black text-white uppercase tracking-tight">
                    Life Insurance<br />GST Quiz
                </h1>

                <div className="bg-white/10 border-2 border-white/30 p-4 mx-2 text-left backdrop-blur-sm rounded-xl">
                    <p className="text-lg text-brand-orange font-black mb-1 uppercase">
                        Did you know?
                    </p>
                    <p className="text-sm text-white font-bold leading-tight uppercase">
                        Life insurance attracts 0% GST! Test your knowledge now.
                    </p>
                </div>
            </div>

            {/* Action Section */}
            <div className="space-y-3 sm:space-y-4 pt-4">
                <button
                    onClick={handleStartClick}
                    className="w-full game-btn-orange text-2xl py-4 shadow-[0px_6px_0px_0px_rgba(194,65,12,1)]"
                >
                    START GAME
                </button>

            </div>

            {/* Lead Gen Modal */}
            <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
                    <Dialog.Content asChild>
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="bg-white/10 border-2 border-white/30 backdrop-blur-xl rounded-3xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden ring-1 ring-white/20"
                            >
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/20 rounded-full blur-3xl -mr-16 -mt-16" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -ml-16 -mb-16" />

                                <Dialog.Title className="text-2xl font-black text-white text-center mb-6 uppercase tracking-tight">
                                    WELCOME<br />
                                    <span className="text-sm opacity-70">Enter your details to start</span>
                                </Dialog.Title>
                                <Dialog.Description className="sr-only">
                                    Please provide your name and mobile number to start the quiz quest.
                                </Dialog.Description>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-white/70 uppercase tracking-widest ml-1">Your Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                                            placeholder="Enter your name"
                                            className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 font-bold focus:outline-none focus:border-brand-orange/50 transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-white/70 uppercase tracking-widest ml-1">Mobile Number</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            placeholder="10-digit mobile number"
                                            className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 font-bold focus:outline-none focus:border-brand-orange/50 transition-colors"
                                        />
                                    </div>

                                    <div className="flex items-start gap-3 group cursor-pointer" onClick={() => setIsTermsAccepted(!isTermsAccepted)}>
                                        <div className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isTermsAccepted ? 'bg-brand-orange border-brand-orange' : 'border-white/30 bg-white/5'}`}>
                                            {isTermsAccepted && <ShieldCheck className="w-4 h-4 text-white" />}
                                        </div>
                                        <div className="text-[11px] text-white/80 font-bold leading-tight uppercase">
                                            I accept the{' '}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsTermsOpen(true);
                                                }}
                                                className="text-brand-orange hover:underline decoration-2"
                                            >
                                                Terms & Conditions
                                            </button>
                                            {' '}and acknowledge the privacy policy.
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="text-red-400 text-xs font-black text-center uppercase"
                                        >
                                            {error}
                                        </motion.p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !isFormValid}
                                        className="w-full game-btn-orange text-2xl py-3.5 shadow-[0px_4px_0px_0px_rgba(194,65,12,1)] disabled:opacity-50 disabled:translate-y-1 disabled:shadow-none transition-all"
                                    >
                                        {isSubmitting ? 'PROCESSING...' : "LET'S GO!"}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Terms Sub-Modal */}
            <AnimatePresence>
                {isTermsOpen && (
                    <Dialog.Root open={isTermsOpen} onOpenChange={setIsTermsOpen}>
                        <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]" />
                            <Dialog.Content asChild>
                                <div className="fixed inset-0 z-[60] grid place-items-center p-4">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-zinc-900 border-2 border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative"
                                    >
                                        <button
                                            onClick={() => setIsTermsOpen(false)}
                                            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>

                                        <Dialog.Title className="text-xl font-black text-white mb-6 uppercase tracking-tight">
                                            Terms & Conditions
                                        </Dialog.Title>
                                        <Dialog.Description className="sr-only">
                                            Terms and conditions for Bajaj Life Insurance communication.
                                        </Dialog.Description>
                                        <div className="text-sm text-white/70 font-medium space-y-4 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                                            <p>I hereby authorize Bajaj Life Insurance Limited to call me on the contact number made available by me on the website with a specific request to call back. I further declare that, irrespective of my contact number being registered on National Customer Preference Register (NCPR) or on National Do Not Call Registry (NDNC), any call made, SMS or WhatsApp sent in response to my request shall not be construed as an Unsolicited Commercial Communication even though the content of the call may be for the purposes of explaining various insurance products and services or solicitation and procurement of insurance business.</p>
                                            <p>Please refer to <a href="https://www.bajajallianzlife.com/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline font-bold">BALIC Privacy Policy</a>.</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default WelcomeScreen;                                                                                                                          