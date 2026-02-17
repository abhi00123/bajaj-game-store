import React from 'react';
import { Clock, Calendar, Compass, Map, Search, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SCENARIO_OPTIONS } from '../constants/journeySteps';
import Card from './ui/Card';
import Button from './ui/Button';

const iconMap = {
    Clock,
    Calendar,
    Compass,
    Map,
    Search,
    Star
};

const StepScenario = ({ selections, handleSelectionChange, handleNext, handleBack, isStepValid }) => {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-800">Time to Prepare</h2>
                <p className="text-slate-500">“How much time do you have to prepare for your retirement?”</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SCENARIO_OPTIONS.map((opt) => {
                    const Icon = iconMap[opt.icon];
                    const isSelected = selections.scenario === opt.id;

                    return (
                        <Card
                            key={opt.id}
                            selected={isSelected}
                            onClick={() => handleSelectionChange('scenario', opt.id)}
                            className="flex items-center space-x-4 p-5"
                        >
                            <div className={`p-3 rounded-xl ${isSelected ? 'bg-primary-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                <Icon size={24} />
                            </div>
                            <div className="flex-grow">
                                <p className="font-bold text-slate-700">{opt.label}</p>
                                <p className="text-xs text-slate-400 font-medium">{opt.points} Readiness Points</p>
                            </div>
                            {isSelected && <CheckCircle2 className="text-emerald-500" size={20} />}
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

export default StepScenario;
