import React from 'react';
import { Target, ShieldCheck, Zap } from 'lucide-react';
import Button from './ui/Button';

const Intro = ({ handleNext }) => {
    return (
        <div className="text-center max-w-2xl mx-auto space-y-8">
            <div className="flex justify-center">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center animate-bounce">
                    <Target className="w-10 h-10 text-primary-500" />
                </div>
            </div>

            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
                    Retirement Readiness <span className="text-primary-500">Journey</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
                    Embark on a premium guided experience to assess your financial future. Discover your readiness score and get personalized expert insights.
                </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
                <Button onClick={handleNext} className="w-full md:w-auto px-12 py-4 text-lg">
                    BEGIN ASSESSMENT
                </Button>
                <div className="flex items-center space-x-6 text-sm text-slate-400 font-medium">
                    <div className="flex items-center">
                        <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-500" />
                        No credit card required
                    </div>
                    <div className="flex items-center">
                        <Zap className="w-4 h-4 mr-1.5 text-accent-500" />
                        Instant results
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex justify-center space-x-8 opacity-50">
                <div className="text-xs uppercase tracking-widest font-bold">Scalable</div>
                <div className="text-xs uppercase tracking-widest font-bold">Secure</div>
                <div className="text-xs uppercase tracking-widest font-bold">Precise</div>
            </div>
        </div>
    );
};

export default Intro;
