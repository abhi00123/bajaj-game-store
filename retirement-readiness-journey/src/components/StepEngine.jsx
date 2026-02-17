import React from 'react';
import { ArrowRight, CheckCircle2, Shield, TrendingUp, Wallet, Sparkles } from 'lucide-react';
import { ENGINE_OPTIONS } from '../constants/journeySteps';
import Card from './ui/Card';
import Button from './ui/Button';

const iconMap = {
    safety: Shield,
    growth: TrendingUp,
    income: Wallet,
};

const StepEngine = ({ selections, handleSelectionChange, handleNext, handleBack, isStepValid }) => {
    const isAllSelected = selections.engine.length === 3;

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-800">Retirement Engine</h2>
                <p className="text-slate-500">What strategies are powering your retirement fund?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ENGINE_OPTIONS.map((opt) => {
                    const Icon = iconMap[opt.id];
                    const isSelected = selections.engine.includes(opt.id);

                    return (
                        <Card
                            key={opt.id}
                            selected={isSelected}
                            onClick={() => handleSelectionChange('engine', opt.id)}
                            className="flex flex-col items-center text-center p-8 space-y-4 relative overflow-hidden"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isSelected ? 'bg-primary-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                {Icon && <Icon size={28} />}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">{opt.label}</h3>
                                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{opt.description}</p>
                            </div>
                            <div className="pt-4">
                                <span className={`text-xs font-black tracking-tighter ${isSelected ? 'text-primary-600' : 'text-slate-300'}`}>
                                    +{opt.points} POINTS
                                </span>
                            </div>
                            {isSelected && <div className="absolute top-4 right-4 text-emerald-500"><CheckCircle2 size={24} /></div>}
                        </Card>
                    );
                })}
            </div>

            {isAllSelected && (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-[1px] rounded-2xl shadow-lg shadow-emerald-500/20">
                    <div className="bg-white rounded-[15px] p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-emerald-50 rounded-xl">
                                <Sparkles className="text-emerald-500 w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-slate-800">Balanced Strategy Bonus!</h4>
                                <p className="text-sm text-slate-500">All columns selected. Maximum points unlocked (25 TOTAL).</p>
                            </div>
                        </div>
                        <div className="text-2xl font-black text-emerald-500">+25</div>
                    </div>
                </div>
            )}

            <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 flex items-start space-x-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Sparkles className="text-primary-500 w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-primary-900">Pro Tip</h4>
                    <p className="text-sm text-primary-700 leading-relaxed mt-1">
                        Diversifying across safety, growth, and income creation is the hallmarks of a "Champion" readiness level.
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                <Button variant="ghost" onClick={handleBack}>
                    Back
                </Button>
                <Button disabled={!isStepValid} onClick={handleNext} className="flex items-center">
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default StepEngine;
