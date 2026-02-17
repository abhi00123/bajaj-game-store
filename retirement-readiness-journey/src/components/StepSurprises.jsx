import React from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, TrendingUp, HelpCircle } from 'lucide-react';
import { SURPRISE_CATEGORIES } from '../constants/journeySteps';
import Card from './ui/Card';
import Button from './ui/Button';

const iconMap = {
    medical: AlertTriangle,
    inflation: TrendingUp,
    longevity: HelpCircle,
};

const StepSurprises = ({ selections, handleSurpriseChange, handleNext, handleBack, isStepValid }) => {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-800">Handling Surprises</h2>
                <p className="text-slate-500">How prepared are you for the three biggest retirement risks?</p>
            </div>

            <div className="space-y-6">
                {SURPRISE_CATEGORIES.map((cat) => {
                    const Icon = iconMap[cat.id];
                    return (
                        <div key={cat.id} className="space-y-4">
                            <div className="flex items-center space-x-3 text-slate-700">
                                {Icon && <Icon size={20} className="text-primary-500" />}
                                <h4 className="font-bold uppercase tracking-wider text-sm">{cat.label}</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {cat.options.map((opt) => (
                                    <Card
                                        key={opt.id}
                                        selected={selections.surprises[cat.id] === opt.id}
                                        onClick={() => handleSurpriseChange(cat.id, opt.id)}
                                        className="flex items-center justify-between p-4"
                                    >
                                        <div>
                                            <p className="font-bold text-slate-800">{opt.label}</p>
                                            <p className="text-xs text-slate-400 mt-1">{opt.subLabel}</p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className={`text-[10px] font-black px-2 py-1 rounded border ${opt.label === 'Strong'
                                                    ? 'border-primary-200 text-primary-600 bg-primary-50'
                                                    : 'border-accent-200 text-accent-600 bg-accent-50'
                                                }`}>
                                                +{opt.points} PTS
                                            </span>
                                            {selections.surprises[cat.id] === opt.id && <CheckCircle2 className="text-emerald-500" size={18} />}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                <Button variant="ghost" onClick={handleBack}>
                    Back
                </Button>
                <Button disabled={!isStepValid} onClick={handleNext} className="flex items-center">
                    See Results <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default StepSurprises;
