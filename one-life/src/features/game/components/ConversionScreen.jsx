import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Phone, Calendar, Clock, ChevronDown, ShieldCheck, X } from 'lucide-react';
import Modal from './Modal';
import ThankYouScreen from './ThankYouScreen';

const ConversionScreen = ({ score, leadData, onBookSlot, onRestart }) => {

    const today = new Date().toISOString().split("T")[0];
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const maxDate = thirtyDaysFromNow.toISOString().split("T")[0];

    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isBookingSuccess, setIsBookingSuccess] = useState(false);
    const [bookingTermsAccepted, setBookingTermsAccepted] = useState(true);
    const [bookingData, setBookingData] = useState({
        name: leadData?.name || '',
        mobile_no: leadData?.phone || '',
        date: '',
        timeSlot: ''
    });
    const [errors, setErrors] = useState({});

    const name = leadData?.name || 'Player';
    const firstName = name.split(' ')[0];

    const timeSlots = [
        "9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM",
        "12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "2:00 PM - 3:00 PM",
        "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM",
        "6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM", "8:00 PM - 9:00 PM"
    ];

    const handleShare = async () => {
        const shareMessage = `I just experienced how unpredictable life can be with ONE LIFE! 🎮 Life is full of surprises — make sure you're protected. Play now!`;
        const shareUrl = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: 'One Life – Expect the Unexpected', text: shareMessage, url: shareUrl });
            } catch (error) { console.log('Error sharing:', error); }
        } else {
            try {
                await navigator.clipboard.writeText(`${shareMessage} ${shareUrl}`);
                alert('Message and link copied to clipboard!');
            } catch (err) { console.error('Failed to copy text: ', err); }
        }
    };

    const handleTryAgain = () => { if (onRestart) onRestart(); };

    const validate = () => {
        const errs = {};
        if (!bookingData.name.trim()) errs.name = "Name is required";
        else if (!/^[A-Za-z\s]+$/.test(bookingData.name.trim())) errs.name = "Letters only";
        if (!bookingData.mobile_no.trim()) errs.mobile_no = "Mobile is required";
        else if (!/^[6-9]\d{9}$/.test(bookingData.mobile_no)) errs.mobile_no = "Invalid 10-digit number (starts 6-9)";
        if (!bookingData.date) errs.date = "Select a date";
        if (!bookingData.timeSlot) errs.timeSlot = "Select a slot";
        if (!bookingTermsAccepted) errs.terms = "Accept terms";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        const result = await onBookSlot({ ...bookingData, summary_dtls: 'One Life - Appointment' });
        setIsSubmitting(false);
        if (result.success) { setIsBookingSuccess(true); setIsBookingOpen(false); }
        else { setErrors({ submit: result.error || 'Failed to book slot. Please try again.' }); }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            style={{
                width: '100%',
                height: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to bottom, #0d1b3e 0%, #1a3a6c 50%, #295599 100%)',
                padding: '24px 16px',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
            }}
        >
            {/* Share icon - top right */}
            <button
                onClick={handleShare}
                style={{
                    position: 'absolute', right: '16px', top: '16px', padding: '10px',
                    color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none',
                    cursor: 'pointer', zIndex: 20,
                }}
                title="Share"
            >
                <Share2 style={{ width: '22px', height: '22px' }} />
            </button>

            {/* Main Content */}
            <div style={{
                width: '100%', maxWidth: '320px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10,
            }}>
                {/* Greeting */}
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        fontSize: '26px', fontWeight: 900, color: '#ffffff',
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        lineHeight: 1, marginTop: '8px',
                        textShadow: '0 2px 10px rgba(0,0,0,0.4)',
                    }}
                >
                    HI {firstName.toUpperCase()}!
                </motion.h1>

                <div style={{ height: '16px' }} />

                {/* Personal message */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ textAlign: 'center', padding: '0 8px' }}
                >
                    <p style={{
                        color: 'rgba(255,255,255,0.9)', fontSize: '15px',
                        fontWeight: 600, lineHeight: 1.6, marginBottom: '8px',
                    }}>
                        You braved the unexpected, but life had other plans.
                    </p>
                    <p style={{
                        color: '#60A5FA', fontSize: '14px', fontWeight: 700,
                        lineHeight: 1.5, fontStyle: 'italic',
                    }}>
                        "The best time to protect your family was yesterday. The second best time is now."
                    </p>
                </motion.div>

                <div style={{ height: '20px' }} />

                {/* SHARE button — above the CTA info */}
                <motion.button
                    onClick={handleShare}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{
                        width: '100%', height: '48px', backgroundColor: '#f97316',
                        color: '#ffffff', fontWeight: 800, fontSize: '14px',
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        borderRadius: '12px', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                    }}
                >
                    SHARE
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                        <path d="M14 5V2L22 9L14 16V13C7 13 4 15 2 20C4 12 7 8 14 8V5Z" />
                    </svg>
                </motion.button>

                <div style={{ height: '16px' }} />

                {/* Info box */}
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        backgroundColor: 'rgba(30, 58, 138, 0.4)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '12px', padding: '14px 16px', width: '100%',
                        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                    }}
                >
                    <p style={{
                        color: 'rgba(255,255,255,0.9)', fontSize: '13px',
                        lineHeight: 1.5, fontWeight: 600, textAlign: 'center',
                    }}>
                        Life is unpredictable. Your family's future doesn't have to be. Connect with our relationship manager to learn more.
                    </p>
                </motion.div>

                <div style={{ height: '16px' }} />

                {/* CTA buttons */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* CALL NOW */}
                    <button
                        onClick={() => window.location.href = "tel:18002099999"}
                        style={{
                            width: '100%', height: '48px', backgroundColor: '#2563eb',
                            color: '#ffffff', fontWeight: 800, fontSize: '14px',
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                            borderRadius: '12px', border: '2px solid transparent',
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '8px',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                        }}
                    >
                        <Phone style={{ width: '16px', height: '16px', fill: 'currentColor' }} />
                        CALL NOW
                    </button>

                    {/* BOOK SLOT */}
                    <button
                        onClick={() => setIsBookingOpen(true)}
                        style={{
                            width: '100%', height: '48px', backgroundColor: '#d97706',
                            color: '#ffffff', fontWeight: 800, fontSize: '14px',
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                            borderRadius: '12px', border: '2px solid transparent',
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '8px',
                            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
                        }}
                    >
                        <Calendar style={{ width: '16px', height: '16px' }} />
                        BOOK SLOT
                    </button>
                </div>

                {/* TRY AGAIN */}
                <button
                    onClick={handleTryAgain}
                    style={{
                        color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 800,
                        textTransform: 'uppercase', letterSpacing: '0.15em',
                        background: 'none', border: 'none', cursor: 'pointer',
                        textDecoration: 'underline', textUnderlineOffset: '4px',
                        marginTop: '12px', padding: '8px',
                    }}
                >
                    Try Again
                </button>

                {/* Branding */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    style={{
                        color: 'rgba(147, 197, 253, 0.3)', fontSize: '10px',
                        fontWeight: 800, letterSpacing: '0.2em',
                        textTransform: 'uppercase', marginTop: '20px',
                    }}
                >
                    Bajaj Life Insurance
                </motion.p>
            </div>

            {/* Thank You Screen */}
            <AnimatePresence>
                {isBookingSuccess && (
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 110,
                        backgroundColor: '#020617',
                    }}>
                        <ThankYouScreen leadName={bookingData.name} />
                    </div>
                )}
            </AnimatePresence>

            {/* Booking Modal */}
            <Modal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)}>
                <div style={{
                    backgroundColor: '#0f172a', borderRadius: '24px', padding: '28px',
                    width: '100%', maxWidth: '400px',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    border: '2px solid rgba(255,255,255,0.08)',
                    position: 'relative', textAlign: 'left',
                }}>
                    <button
                        onClick={() => setIsBookingOpen(false)}
                        style={{
                            position: 'absolute', top: '20px', right: '20px',
                            color: '#64748b', background: 'none', border: 'none', cursor: 'pointer',
                        }}
                    >
                        <X style={{ width: '24px', height: '24px' }} />
                    </button>

                    <h2 style={{
                        fontSize: '24px', fontWeight: 900, color: '#ffffff',
                        textAlign: 'center', marginBottom: '8px',
                    }}>Book a slot</h2>
                    <p style={{
                        textAlign: 'center', color: '#64748b', fontWeight: 700,
                        marginBottom: '24px', fontSize: '14px',
                    }}>Pick your preferred time</p>

                    <form onSubmit={handleBookingSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
                            <div>
                                <input
                                    type="text" value={bookingData.name}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                        setBookingData(prev => ({ ...prev, name: val }));
                                        setErrors(prev => ({ ...prev, name: val.trim() ? null : "Name is required" }));
                                    }}
                                    placeholder="Your name"
                                    style={{
                                        width: '100%', backgroundColor: '#1e293b',
                                        border: `2px solid ${errors.name ? '#ef4444' : '#334155'}`,
                                        borderRadius: '14px', padding: '12px 18px',
                                        color: '#ffffff', fontWeight: 700, fontSize: '14px',
                                        outline: 'none', boxSizing: 'border-box',
                                    }}
                                />
                                {errors.name && <p style={{ color: '#ef4444', fontSize: '11px', fontWeight: 700, marginTop: '4px', marginLeft: '8px' }}>{errors.name}</p>}
                            </div>
                            <div>
                                <input
                                    type="text" value={bookingData.mobile_no}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setBookingData(prev => ({ ...prev, mobile_no: val }));
                                        if (!val.trim()) setErrors(prev => ({ ...prev, mobile_no: "Mobile is required" }));
                                        else if (val.length < 10) setErrors(prev => ({ ...prev, mobile_no: "Enter 10 digits" }));
                                        else setErrors(prev => ({ ...prev, mobile_no: null }));
                                    }}
                                    placeholder="Mobile number"
                                    style={{
                                        width: '100%', backgroundColor: '#1e293b',
                                        border: `2px solid ${errors.mobile_no ? '#ef4444' : '#334155'}`,
                                        borderRadius: '14px', padding: '12px 18px',
                                        color: '#ffffff', fontWeight: 700, fontSize: '14px',
                                        outline: 'none', boxSizing: 'border-box',
                                    }}
                                />
                                {errors.mobile_no && <p style={{ color: '#ef4444', fontSize: '11px', fontWeight: 700, marginTop: '4px', marginLeft: '8px' }}>{errors.mobile_no}</p>}
                            </div>
                            <div>
                                <input
                                    type="date" value={bookingData.date} min={today} max={maxDate}
                                    onChange={(e) => {
                                        setBookingData(prev => ({ ...prev, date: e.target.value }));
                                        setErrors(prev => ({ ...prev, date: null }));
                                    }}
                                    style={{
                                        width: '100%', backgroundColor: '#1e293b',
                                        border: `2px solid ${errors.date ? '#ef4444' : '#334155'}`,
                                        borderRadius: '14px', padding: '12px 18px',
                                        color: '#ffffff', fontWeight: 700, fontSize: '14px',
                                        outline: 'none', boxSizing: 'border-box', colorScheme: 'dark',
                                    }}
                                />
                                {errors.date && <p style={{ color: '#ef4444', fontSize: '11px', fontWeight: 700, marginTop: '4px', marginLeft: '8px' }}>{errors.date}</p>}
                            </div>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={bookingData.timeSlot}
                                    onChange={(e) => {
                                        setBookingData(prev => ({ ...prev, timeSlot: e.target.value }));
                                        setErrors(prev => ({ ...prev, timeSlot: null }));
                                    }}
                                    style={{
                                        width: '100%', backgroundColor: '#1e293b',
                                        border: `2px solid ${errors.timeSlot ? '#ef4444' : '#334155'}`,
                                        borderRadius: '14px', padding: '12px 18px', paddingRight: '40px',
                                        color: '#ffffff', fontWeight: 700, fontSize: '14px',
                                        outline: 'none', boxSizing: 'border-box', appearance: 'none',
                                    }}
                                >
                                    <option value="" style={{ backgroundColor: '#0f172a', color: '#fff' }}>Choose a slot</option>
                                    {timeSlots.map(slot => (
                                        <option key={slot} value={slot} style={{ backgroundColor: '#0f172a', color: '#fff' }}>{slot}</option>
                                    ))}
                                </select>
                                <ChevronDown style={{
                                    position: 'absolute', right: '14px', top: '50%',
                                    transform: 'translateY(-50%)', width: '18px', height: '18px',
                                    color: '#64748b', pointerEvents: 'none',
                                }} />
                                {errors.timeSlot && <p style={{ color: '#ef4444', fontSize: '11px', fontWeight: 700, marginTop: '4px', marginLeft: '8px' }}>{errors.timeSlot}</p>}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                            <div onClick={() => setBookingTermsAccepted(!bookingTermsAccepted)}
                                style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                                <div style={{
                                    flexShrink: 0, width: '26px', height: '26px', borderRadius: '8px',
                                    border: `2px solid ${bookingTermsAccepted ? '#16a34a' : '#334155'}`,
                                    backgroundColor: bookingTermsAccepted ? '#16a34a' : '#1e293b',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {bookingTermsAccepted && <ShieldCheck style={{ width: '18px', height: '18px', color: '#fff' }} />}
                                </div>
                                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700, lineHeight: 1.4 }}>
                                    I accept the terms & conditions and acknowledge the privacy policy.
                                </div>
                            </div>
                            {errors.terms && <p style={{ color: '#ef4444', fontSize: '11px', fontWeight: 700, marginLeft: '8px' }}>{errors.terms}</p>}
                        </div>

                        {errors.submit && <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>{errors.submit}</p>}

                        <button
                            type="submit" disabled={isSubmitting}
                            style={{
                                width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                                fontSize: '17px', fontWeight: 900, color: '#ffffff',
                                backgroundColor: isSubmitting ? '#15803d' : '#16a34a',
                                opacity: isSubmitting ? 0.5 : 1,
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)',
                            }}
                        >
                            {isSubmitting ? 'Booking...' : 'Confirm booking'}
                        </button>
                    </form>
                </div>
            </Modal>
        </motion.div>
    );
};

export default ConversionScreen;
