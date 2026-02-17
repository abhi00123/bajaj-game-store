import React from 'react';
import { ArrowRight, CheckCircle2, Home, Utensils, HeartPulse, Zap as UtilityIcon, Truck } from 'lucide-react';
import { ESSENTIALS_OPTIONS } from '../constants/journeySteps';
import Card from './ui/Card';
import Button from './ui/Button';

const iconMap = {
    housing: Home,
    food: Utensils,
    medical: HeartPulse,
    utilities: UtilityIcon,
    transport: Truck,
};

const StepEssentials = ({ selections, handleSelectionChange, handleNext, handleBack, isStepValid }) => {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-800">The Essentials</h2>
                <p className="text-slate-500">Select the core components you have already secured or have a clear plan for.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ESSENTIALS_OPTIONS.map((opt) => {
                    const Icon = iconMap[opt.id];
                    const isSelected = selections.essentials.includes(opt.id);

                    return (
                        <Card
                            key={opt.id}
                            selected={isSelected}
                            onClick={() => handleSelectionChange('essentials', opt.id)}
                            className="flex items-center space-x-4 p-5"
                        >
                            <div className={`p-3 rounded-xl ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                {Icon && <Icon size={24} />}
                            </div>
                            <div className="flex-grow">
                                <p className="font-bold text-slate-700">{opt.label}</p>
                                <p className="text-xs text-slate-400 font-medium">3 pts each</p>
                            </div>
                            {isSelected && <CheckCircle2 className="text-emerald-500" size={20} />}
                        </Card>
                    );
                })}
            </div>

            <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 flex items-start space-x-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <CheckCircle2 className="text-primary-500 w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-primary-900">Expert Note</h4>
                    <p className="text-sm text-primary-700 leading-relaxed mt-1">
                        Securing these five pillars forms the bedrock of a resilient retirement plan. We recommend having at least 3 secured before moving to advanced strategies.
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

export default StepEssentials;
