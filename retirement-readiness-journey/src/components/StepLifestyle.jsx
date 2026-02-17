import React from 'react';
import { Home, Coffee, Crown, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LIFESTYLE_OPTIONS } from '../constants/journeySteps';
import Card from './ui/Card';
import Button from './ui/Button';

const iconMap = {
    Home,
    Coffee,
    Crown
};

const StepLifestyle = ({ selections, handleSelectionChange, handleNext, handleBack, isStepValid }) => {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-800">Desired Lifestyle</h2>
                <p className="text-slate-500">Pick the vision that best describes your ideal retirement.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {LIFESTYLE_OPTIONS.map((opt) => {
                    const Icon = iconMap[opt.icon];
                    const isSelected = selections.lifestyle === opt.id;

                    return (
                        <Card
                            key={opt.id}
                            selected={isSelected}
                            onClick={() => handleSelectionChange('lifestyle', opt.id)}
                            className="flex flex-col items-center text-center p-8 space-y-4"
                        >
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-slate-50 text-slate-400'}`}>
                                <Icon size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">{opt.label}</h3>
                                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{opt.description}</p>
                            </div>
                            <div className="pt-4 mt-auto">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest ${isSelected ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {opt.points} pts
                                </span>
                            </div>
                            {isSelected && <div className="absolute top-4 right-4 text-emerald-500"><CheckCircle2 size={24} /></div>}
                        </Card>
                    );
                })}
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

export default StepLifestyle;
