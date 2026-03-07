import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Phone, Calendar, Clock, ChevronDown, ShieldCheck, X, RefreshCw, Trophy, Star, Target } from 'lucide-react';
import Modal from './Modal';
import { updateLeadNew } from '../../../services/api';
import { getArchetypeDetails } from '../utils/archetypeResolver';
import ScoreRing from '../../../components/ui/ScoreRing';

const FinalScreen = ({ results, onRetry, leadData, onBookingSuccess }) => {
    const archetype = getArchetypeDetails(results.archetype);

    // Appointment Booking State
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingTermsAccepted, setBookingTermsAccepted] = useState(true);
    const [bookingData, setBookingData] = useState({
        name: leadData?.name || '',
        mobile_no: leadData?.phone || '',
        date: '',
        timeSlot: ''
    });
    const [errors, setErrors] = useState({});

    const today = new Date().toISOString().split("T")[0];
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const maxDate = thirtyDaysFromNow.toISOString().split("T")[0];

    const timeSlots = [
        "9:00 AM - 10:00 AM",
        "10:00 AM - 11:00 AM",
        "11:00 AM - 12:00 PM",
        "12:00 PM - 1:00 PM",
        "1:00 PM - 2:00 PM",
        "2:00 PM - 3:00 PM",
        "3:00 PM - 4:00 PM",
        "4:00 PM - 5:00 PM",
        "5:00 PM - 6:00 PM",
        "6:00 PM - 7:00 PM",
        "7:00 PM - 8:00 PM",
        "8:00 PM - 9:00 PM"
    ];

    const handleShare = async () => {
        const text = `I just achieved a Life Clarity Score of ${results.score}! I'm a ${results.archetype} in Life Sorted 3D. See your clarity score here!`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Life Sorted 3D',
                    text,
                    url: window.location.href,
                });
            } catch (err) {
                copyToClipboard(text);
            }
        } else {
            copyToClipboard(text);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Progress copied to clipboard!');
    };

    const validateBooking = () => {
        const errs = {};
        if (!bookingData.name.trim()) errs.name = "Name is required";
        if (!bookingData.mobile_no.trim()) errs.mobile_no = "Mobile is required";
        else if (!/^[6-9]\d{9}$/.test(bookingData.mobile_no)) errs.mobile_no = "Invalid 10-digit number";
        if (!bookingData.date) errs.date = "Select a date";
        if (!bookingData.timeSlot) errs.timeSlot = "Select a slot";
        if (!bookingTermsAccepted) errs.terms = "Accept terms";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!validateBooking()) return;

        setIsSubmitting(true);
        const result = await updateLeadNew(leadData?.leadNo, {
            ...bookingData,
            remarks: `Life Sorted Appointment - Score: ${results.score}`
        });
        setIsSubmitting(false);

        if (result.success) {
            setIsBookingOpen(false);
            onBookingSuccess?.();
        } else {
            setErrors({ submit: result.error || 'Failed to book slot. Please try again.' });
        }
    };

    return (
        <motion.div
            className="w-full min-h-[100dvh] flex flex-col items-center p-4 pb-20 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Top Right Share Icon */}
            <button
                onClick={handleShare}
                className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 transition-all border border-white/10"
            >
                <Share2 className="w-5 h-5" />
            </button>

            <div className="w-full max-w-sm flex flex-col items-center flex-1 gap-y-6 z-10 pt-8">
                <div className="text-center">
                    <h2 className="text-4xl font-black text-white tracking-tight uppercase">
                        HII <span className="text-gold">{leadData?.name || 'GUEST'}</span>
                    </h2>
                </div>

                {/* Visual Score */}
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gold/10 blur-3xl rounded-full scale-150 animate-pulse" />
                        <ScoreRing score={results.score} />
                    </div>

                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-8 py-2.5 bg-gold/10 border border-gold/30 rounded-full text-gold font-bold text-sm tracking-wide hover:bg-gold/20 transition-all active:scale-95"
                    >
                        <Share2 className="w-4 h-4" /> Share Score
                    </button>
                </div>

                {/* Archetype Card - Restored Box */}
                <div className="w-full text-center px-2">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-black mb-2 px-6">Your Life Archetype</p>
                    <h3 className="text-3xl font-black text-white mb-3 tracking-tighter italic uppercase leading-none">{results.archetype}</h3>
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-2xl rounded-full -mr-12 -mt-12 group-hover:bg-gold/10 transition-all duration-700" />
                        <p className="text-base font-bold text-teal mb-3 leading-tight">{archetype.traits}</p>
                        <p className="text-sm text-white/40 leading-relaxed italic border-t border-white/5 pt-3">
                            "{archetype.description}"
                        </p>
                    </div>
                </div>

                {/* Action Card Section */}
                <div className="w-full bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/10 space-y-5 relative shadow-2xl overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal/5 blur-3xl rounded-full -mb-16 -mr-16" />

                    <div className="text-center space-y-1">
                        <p className="text-white text-base font-black leading-tight">
                            Build a strong financial foundation
                        </p>
                        <p className="text-white/40 text-[11px] font-bold uppercase tracking-wider">
                            Connect with our expert manager
                        </p>
                    </div>

                    <div className="flex flex-col gap-3.5">
                        <a
                            href="tel:18002097272"
                            className="bg-white text-black font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all text-lg hover:bg-gray-100 active:scale-95 shadow-xl"
                        >
                            <Phone className="w-5 h-5 text-black/40" />
                            <span>Call now</span>
                        </a>

                        <div className="flex items-center gap-4 py-1">
                            <div className="h-[1px] flex-1 bg-white/10" />
                            <span className="text-white/20 font-black text-[10px] tracking-widest uppercase">OR</span>
                            <div className="h-[1px] flex-1 bg-white/10" />
                        </div>

                        <button
                            onClick={() => setIsBookingOpen(true)}
                            className="bg-gold text-black font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all text-lg hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] active:scale-95"
                        >
                            <Calendar className="w-5 h-5 text-black/40" />
                            <span>Book a slot</span>
                        </button>
                    </div>
                </div>

                {/* Play Again Action */}
                <button
                    onClick={onRetry}
                    className="flex items-center gap-3 text-white/70 hover:text-white font-black text-xl transition-all active:scale-95 py-4 mt-1 mb-4"
                >
                    <RefreshCw className="w-6 h-6 text-gold" />
                    <span>Play again</span>
                </button>
            </div>

            {/* Booking Modal */}
            <Modal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)}>
                <div className="bg-[#0B1221] rounded-[32px] p-8 w-full max-w-md shadow-2xl border-2 border-white/10 relative overflow-hidden text-left translate-z-0">
                    <button onClick={() => setIsBookingOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>

                    <h2 className="text-3xl font-black text-white text-center mb-1 tracking-tight">Book a slot</h2>
                    <p className="text-center text-white/40 font-bold mb-8 text-sm italic">Connect with an expert</p>

                    <form onSubmit={handleBookingSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={bookingData.name}
                                onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                                placeholder="Your name"
                                className={`w-full bg-white/5 border-2 rounded-2xl px-5 py-3 text-white font-bold focus:outline-none focus:border-gold transition-all ${errors.name ? 'border-red-500' : 'border-white/5'}`}
                            />
                            <input
                                type="tel"
                                value={bookingData.mobile_no}
                                onChange={(e) => setBookingData({ ...bookingData, mobile_no: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                placeholder="Mobile number"
                                className={`w-full bg-white/5 border-2 rounded-2xl px-5 py-3 text-white font-bold focus:outline-none focus:border-gold transition-all ${errors.mobile_no ? 'border-red-500' : 'border-white/5'}`}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#005faa] pointer-events-none" strokeWidth={2.5} />
                                <input
                                    type="date"
                                    min={today}
                                    max={maxDate}
                                    value={bookingData.date}
                                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                    className={`w-full bg-white/5 border-2 rounded-2xl pl-12 pr-10 py-4 text-white font-bold focus:outline-none focus:border-gold appearance-none uppercase text-sm [&::-webkit-calendar-picker-indicator]:opacity-0 ${errors.date ? 'border-red-500' : 'border-white/5'}`}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Calendar className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#005faa] pointer-events-none" strokeWidth={2.5} />
                                <select
                                    value={bookingData.timeSlot}
                                    onChange={(e) => setBookingData({ ...bookingData, timeSlot: e.target.value })}
                                    className={`w-full bg-white/5 border-2 rounded-2xl pl-12 pr-10 py-4 text-white font-bold focus:outline-none focus:border-gold appearance-none text-sm ${errors.timeSlot ? 'border-red-500' : 'border-white/5'}`}
                                >
                                    <option value="" className="bg-[#0B1221]">Choose a slot</option>
                                    {timeSlots.map(s => <option key={s} value={s} className="bg-[#0B1221]">{s}</option>)}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <ChevronDown className="w-5 h-5 text-white/40" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 cursor-pointer" onClick={() => setBookingTermsAccepted(!bookingTermsAccepted)}>
                            <div className={`shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${bookingTermsAccepted ? 'bg-[#005faa] border-[#005faa]' : 'border-white/10 bg-white/5'}`}>
                                {bookingTermsAccepted && <ShieldCheck className="w-4 h-4 text-white" />}
                            </div>
                            <div className="text-[10px] text-white/50 font-medium leading-[1.4]">
                                I agree to the <span className="text-[#005faa] font-bold">Terms & Conditions</span> and allow Bajaj Life Insurance to contact me even if registered on DND.
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gold text-black font-black py-4 rounded-2xl text-xl transition-all hover:translate-y-[-2px] active:translate-y-0 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Confirming...' : 'Confirm booking'}
                        </button>
                    </form>
                </div>
            </Modal>
        </motion.div >
    );
};

export default FinalScreen;
