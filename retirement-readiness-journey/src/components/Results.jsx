import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Calendar, Mail, User, ArrowRight, RefreshCcw, Award, Lightbulb } from 'lucide-react';
import { READINESS_BANDS } from '../constants/journeySteps';
import Button from './ui/Button';
import Card from './ui/Card';

const Results = ({ totalScore, readinessBand, resetJourney, formData, setFormData, formSuccess, setFormSuccess }) => {
    const [displayScore, setDisplayScore] = useState(0);
    const band = READINESS_BANDS.find(b => b.label === readinessBand) || READINESS_BANDS[4];

    useEffect(() => {
        const duration = 1500;
        const start = 0;
        const end = totalScore;
        const startTime = performance.now();

        const updateScore = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * (end - start) + start);

            setDisplayScore(current);

            if (progress < 1) {
                requestAnimationFrame(updateScore);
            }
        };

        requestAnimationFrame(updateScore);
    }, [totalScore]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name && formData.email) {
            setFormSuccess(true);
        }
    };

    const circumference = 2 * Math.PI * 90;
    const strokeDashoffset = circumference - (displayScore / 100) * circumference;

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-12">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-extrabold text-slate-800">Your Retirement Readiness</h2>
                <p className="text-slate-500 max-w-xl mx-auto">Based on your selections, we've calculated your personalized readiness profile.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Score Ring */}
                <div className="flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="relative w-64 h-64">
                        {/* Progress Ring */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="128"
                                cy="128"
                                r="90"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                className="text-slate-100"
                            />
                            <motion.circle
                                cx="128"
                                cy="128"
                                r="90"
                                stroke="currentColor"
                                strokeWidth="12"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                fill="transparent"
                                strokeLinecap="round"
                                className={
                                    totalScore >= 85 ? 'text-emerald-500' :
                                        totalScore >= 50 ? 'text-primary-500' :
                                            'text-accent-500'
                                }
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-6xl font-black text-slate-800 leading-none">{displayScore}</span>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Readiness Score</span>
                        </div>
                    </div>

                    <div className="mt-8 text-center px-4">
                        <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-3 ${band.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                                band.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                    'bg-orange-100 text-orange-600'
                            }`}>
                            <Award className="w-3 h-3 mr-2" />
                            {band.label}
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed">{band.description}</p>
                    </div>
                </div>

                {/* insights and booking */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-primary-500" />
                        Personalized Insights
                    </h3>
                    <div className="space-y-4">
                        <Card hoverable={false} className="p-5 border-l-4 border-l-primary-500 bg-white shadow-md">
                            <h4 className="font-bold text-slate-800">Growth Optimization</h4>
                            <p className="text-sm text-slate-500 mt-1">Your strategy shows strong potential. Consider tax-efficient legacy planning to boost your score to the next level.</p>
                        </Card>
                        <Card hoverable={false} className="p-5 border-l-4 border-l-accent-500 bg-white shadow-md">
                            <h4 className="font-bold text-slate-800">Risk Mitigation</h4>
                            <p className="text-sm text-slate-500 mt-1">Inflation is your biggest silent risk. We recommend exploring inflation-indexed instruments for your fixed income portion.</p>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Booking Form */}
            <div className="max-w-2xl mx-auto bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                <AnimatePresence mode="wait">
                    {!formSuccess ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative z-10 space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <h3 className="text-3xl font-bold">Secure Your Strategy</h3>
                                <p className="text-slate-400">Book a complimentary 15-minute diagnostic session with a Senior Wealth Architect.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="Full Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                        <input
                                            required
                                            type="email"
                                            placeholder="Work Email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-lg font-bold">
                                    BOOK SESSION
                                </Button>
                            </form>
                            <p className="text-center text-xs text-slate-500 font-medium">Limited availability for Q1 2026 diagnostic sessions.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative z-10 flex flex-col items-center justify-center text-center space-y-6 py-12"
                        >
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-bold">Booking Confirmed!</h3>
                                <p className="text-slate-400 max-w-sm">We've sent a confirmation email to <span className="text-white font-bold">{formData.email}</span>. A wealth architect will reach out shortly.</p>
                            </div>
                            <Button onClick={resetJourney} variant="ghost" className="text-white hover:bg-white/10">
                                <RefreshCcw className="w-4 h-4 mr-2" /> Start Over
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="text-center">
                <button onClick={resetJourney} className="text-slate-400 hover:text-slate-600 flex items-center justify-center mx-auto text-sm font-bold tracking-widest uppercase transition-colors">
                    <RefreshCcw className="w-4 h-4 mr-2" /> Reset Assessment
                </button>
            </div>
        </div>
    );
};

export default Results;
