import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2 } from "lucide-react";
import bgImg from "../assets/front-page/NewSartScreen.png";
import { useGameState } from "../hooks/useGameState";
import { submitToLMS } from "../utils/api";

export default function StartScreen({ onStart }) {
    const { lastSubmittedPhone, setLastSubmittedPhone, showToast } = useGameState();

    // Local State
    const [showNamePopup, setShowNamePopup] = useState(false);
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    // Validation & Loading State
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleStartClick = () => {
        setShowNamePopup(true);
    };

    const validateForm = () => {
        const newErrors = {};

        // Name Validation
        if (!userName.trim()) {
            newErrors.name = 'Please enter your name';
        } else if (!/^[A-Za-z\s]+$/.test(userName.trim())) {
            newErrors.name = 'Name must contain only letters';
        }

        // Phone Validation (Indian: 10 digits, starts with 6-9 usually)
        if (!phone) {
            newErrors.phone = 'Please enter mobile number';
        } else if (!/^[6-9]\d{9}$/.test(phone)) {
            newErrors.phone = 'Enter valid 10-digit mobile number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNameSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        if (!termsAccepted) return;

        // Duplicate Check
        if (lastSubmittedPhone === phone) {
            showToast("You have already registered.", "info");
            setTimeout(() => {
                onStart(userName.trim());
            }, 1000);
            return;
        }

        setIsSubmitting(true);

        try {
            // Calculate Preferred Date (Tomorrow) & Time (09:00 AM)
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const dateStr = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD

            const payload = {
                name: userName.trim(),
                mobile_no: phone,
                param4: dateStr,      // Preferred Date
                param19: "09:00 AM",   // Preferred Time
                summary_dtls: "Game Lead Generator",
                p_data_source: "SCRAMBLE_GAME_LEAD"
            };

            const result = await submitToLMS(payload);

            if (result.success) {
                setLastSubmittedPhone(phone);
                onStart(userName.trim());
            } else {
                showToast("Submission failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            showToast("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full h-dvh flex items-center justify-center bg-[#0d1b3e]">
            {/* Phone-width container — same look on mobile & desktop */}
            <div
                className="relative w-full max-w-[480px] h-full flex flex-col items-center justify-end overflow-hidden"
                style={{
                    backgroundImage: `url(${bgImg})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                {/* Start Button */}
                <div className="z-20 w-[45%] max-w-[170px] sm:w-[55%] sm:max-w-[220px] mb-1 sm:mb-3">
                    <motion.button
                        onClick={handleStartClick}
                        className="game-button-blue w-full py-2 sm:py-3 rounded-[1.2rem] sm:rounded-[1.5rem] font-game text-sm sm:text-lg md:text-xl tracking-widest uppercase"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Start
                    </motion.button>
                </div>

                {/* Name Input Popup */}
                <AnimatePresence>
                    {showNamePopup && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
                            onClick={() => setShowNamePopup(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative bg-white shadow-2xl w-full max-w-[320px] min-[375px]:max-w-[340px] p-5 min-[375px]:p-6 border-[4px] sm:border-[6px] border-[#0066B2] rounded-2xl"
                            >
                                <button
                                    onClick={() => setShowNamePopup(false)}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-5 h-5 min-[375px]:w-6 min-[375px]:h-6" />
                                </button>

                                <div className="text-center mb-4 min-[375px]:mb-6">
                                    <div className="w-14 h-14 min-[375px]:w-16 min-[375px]:h-16 sm:w-20 sm:h-20 bg-[#0066B2] flex items-center justify-center mx-auto mb-3 min-[375px]:mb-4 shadow-xl border-4 border-white rounded-full">
                                        <span className="text-2xl min-[375px]:text-3xl sm:text-4xl">👋</span>
                                    </div>
                                    <h2 className="text-[#0066B2] text-lg min-[375px]:text-xl sm:text-2xl font-black mb-1">Welcome!</h2>
                                    <p className="text-slate-500 font-bold text-xs min-[375px]:text-sm sm:text-base">Enter your details to start.</p>
                                </div>

                                <form onSubmit={handleNameSubmit} className="space-y-3 min-[375px]:space-y-4">
                                    {/* Name Field */}
                                    <div className="space-y-1 min-[375px]:space-y-1.5">
                                        <label className="block text-slate-700 text-[9px] min-[375px]:text-[10px] sm:text-xs font-black uppercase tracking-widest ml-1" htmlFor="userName">
                                            Your Name
                                        </label>
                                        <input
                                            id="userName"
                                            type="text"
                                            value={userName}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                // Only allow letters and spaces
                                                if (/^[A-Za-z\s]*$/.test(val)) {
                                                    setUserName(val);
                                                    if (errors.name) setErrors({ ...errors, name: '' });
                                                }
                                            }}
                                            placeholder="Full Name"
                                            className={`w-full px-3 py-2.5 min-[375px]:px-4 min-[375px]:py-3 sm:py-3.5 border-4 ${errors.name ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-100 focus:border-[#0066B2]'} focus:outline-none focus:ring-4 focus:ring-[#0066B2]/10 text-slate-800 font-bold text-sm min-[375px]:text-base sm:text-lg transition-all rounded-lg`}
                                            autoFocus
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-[9px] min-[375px]:text-[10px] font-black uppercase tracking-wider ml-1">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Phone Field */}
                                    <div className="space-y-1 min-[375px]:space-y-1.5">
                                        <label className="block text-slate-700 text-[9px] min-[375px]:text-[10px] sm:text-xs font-black uppercase tracking-widest ml-1" htmlFor="phone">
                                            Mobile Number
                                        </label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            maxLength={10}
                                            value={phone}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);

                                                // Only allow validation if empty or starts with 6-9
                                                if (val === '' || /^[6-9]/.test(val)) {
                                                    setPhone(val);
                                                    if (errors.phone) setErrors({ ...errors, phone: '' });
                                                }
                                            }}
                                            placeholder="9876543210"
                                            className={`w-full px-3 py-2.5 min-[375px]:px-4 min-[375px]:py-3 sm:py-3.5 border-4 ${errors.phone ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-100 focus:border-[#0066B2]'} focus:outline-none focus:ring-4 focus:ring-[#0066B2]/10 text-slate-800 font-bold text-sm min-[375px]:text-base sm:text-lg transition-all rounded-lg`}
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-[9px] min-[375px]:text-[10px] font-black uppercase tracking-wider ml-1">{errors.phone}</p>
                                        )}
                                    </div>

                                    {/* Terms Checkbox */}
                                    <div className="flex items-start space-x-3 pt-1">
                                        <div className="relative flex items-center">
                                            <input
                                                id="terms"
                                                type="checkbox"
                                                checked={termsAccepted}
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                                className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-slate-300 bg-slate-50 transition-all checked:border-[#0066B2] checked:bg-[#0066B2] hover:border-[#0066B2]"
                                            />
                                            <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={4} />
                                        </div>
                                        <label htmlFor="terms" className="text-[10px] sm:text-xs font-semibold text-slate-500 leading-tight select-none">
                                            I agree to the <button type="button" onClick={() => setShowTerms(true)} className="text-[#0066B2] hover:underline font-bold inline">Term & condition</button> and Acknowledge the Privacy Policy.
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!userName.trim() || phone.length !== 10 || !termsAccepted || isSubmitting}
                                        className="game-button-blue w-full py-2.5 min-[375px]:py-3 sm:py-4 rounded-xl font-game text-sm sm:text-lg tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Starting...</span>
                                            </>
                                        ) : (
                                            "Let's Go!"
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Terms Popup Overlay */}
                <AnimatePresence>
                    {showTerms && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md"
                            onClick={() => setShowTerms(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl border-4 border-[#0066B2] relative"
                            >
                                <button
                                    onClick={() => setShowTerms(false)}
                                    className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <h3 className="text-[#0066B2] font-black text-lg uppercase mb-4 tracking-tight">Terms & Conditions</h3>
                                <div className="text-xs sm:text-sm text-slate-600 space-y-3 font-medium leading-relaxed max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                    <p>
                                        I hereby authorize Bajaj Life Insurance Limited to call me on the contact number made available by me on the website with a specific request to call back. I further declare that, irrespective of my contact number being registered on National Customer Preference Register (NCPR) or on National Do Not Call Registry (NDNC), any call made, SMS or WhatsApp sent in response to my request shall not be construed as an Unsolicited Commercial Communication even though the content of the call may be for the purposes of explaining various insurance products and services or solicitation and procurement of insurance business.
                                    </p>
                                    <p>
                                        Please refer to BALIC Privacy Policy.
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setShowTerms(false); setTermsAccepted(true); }}
                                    className="w-full mt-6 py-3 bg-[#0066B2] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm uppercase tracking-wider"
                                >
                                    I Agree
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
