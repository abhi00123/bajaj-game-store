import { useState, useMemo } from 'react';
import {
    JOURNEY_STEPS,
    STEP_ORDER,
    SCENARIO_OPTIONS,
    LIFESTYLE_OPTIONS,
    ESSENTIALS_OPTIONS,
    ENGINE_OPTIONS,
    SURPRISE_CATEGORIES
} from '../constants/journeySteps';

export const useRetirementJourney = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [selections, setSelections] = useState({
        scenario: null,
        lifestyle: null,
        essentials: [],
        engine: [],
        surprises: {
            medical: null,
            inflation: null,
            longevity: null,
        },
    });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });
    const [formSuccess, setFormSuccess] = useState(false);

    const currentStep = STEP_ORDER[currentStepIndex];

    const totalScore = useMemo(() => {
        let score = 0;

        // 1. Scenario
        const selectedScenario = SCENARIO_OPTIONS.find(opt => opt.id === selections.scenario);
        if (selectedScenario) score += selectedScenario.points;

        // 2. Lifestyle
        const selectedLifestyle = LIFESTYLE_OPTIONS.find(opt => opt.id === selections.lifestyle);
        if (selectedLifestyle) score += selectedLifestyle.points;

        // 3. Essentials
        selections.essentials.forEach(id => {
            const opt = ESSENTIALS_OPTIONS.find(o => o.id === id);
            if (opt) score += opt.points;
        });

        // 4. Engine
        if (selections.engine.length === 3) {
            score += 25; // Bonus for all 3
        } else {
            selections.engine.forEach(id => {
                const opt = ENGINE_OPTIONS.find(o => o.id === id);
                if (opt) score += opt.points;
            });
        }

        // 5. Surprises
        Object.values(selections.surprises).forEach(val => {
            if (val) {
                // Find the points for the selected option in any surprise category
                SURPRISE_CATEGORIES.forEach(cat => {
                    const opt = cat.options.find(o => o.id === val);
                    if (opt) score += opt.points;
                });
            }
        });

        return Math.min(score, 100);
    }, [selections]);

    const readinessBand = useMemo(() => {
        if (totalScore >= 85) return 'CHAMPION';
        if (totalScore >= 70) return 'STRATEGIST';
        if (totalScore >= 50) return 'PLANNER';
        if (totalScore >= 30) return 'STARTER';
        return 'JUST BEGINNING';
    }, [totalScore]);

    const isStepValid = useMemo(() => {
        switch (currentStep) {
            case JOURNEY_STEPS.INTRO:
                return true;
            case JOURNEY_STEPS.SCENARIO:
                return selections.scenario !== null;
            case JOURNEY_STEPS.LIFESTYLE:
                return selections.lifestyle !== null;
            case JOURNEY_STEPS.ESSENTIALS:
                return selections.essentials.length > 0;
            case JOURNEY_STEPS.ENGINE:
                return true; // Optional or multi-select without min requirement specified, but usually people want next to be enabled.
            case JOURNEY_STEPS.SURPRISES:
                return (
                    selections.surprises.medical !== null &&
                    selections.surprises.inflation !== null &&
                    selections.surprises.longevity !== null
                );
            case JOURNEY_STEPS.RESULTS:
                return true;
            default:
                return false;
        }
    }, [currentStep, selections]);

    const handleNext = () => {
        if (isStepValid && currentStepIndex < STEP_ORDER.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    const handleSelectionChange = (category, value) => {
        setSelections(prev => {
            if (Array.isArray(prev[category])) {
                const exists = prev[category].includes(value);
                return {
                    ...prev,
                    [category]: exists
                        ? prev[category].filter(item => item !== value)
                        : [...prev[category], value]
                };
            }
            return {
                ...prev,
                [category]: value
            };
        });
    };

    const handleSurpriseChange = (subCategory, value) => {
        setSelections(prev => ({
            ...prev,
            surprises: {
                ...prev.surprises,
                [subCategory]: value
            }
        }));
    };

    const resetJourney = () => {
        setCurrentStepIndex(0);
        setSelections({
            scenario: null,
            lifestyle: null,
            essentials: [],
            engine: [],
            surprises: {
                medical: null,
                inflation: null,
                longevity: null,
            },
        });
        setFormSuccess(false);
    };

    return {
        currentStep,
        currentStepIndex,
        selections,
        totalScore,
        readinessBand,
        isStepValid,
        formData,
        setFormData,
        formSuccess,
        setFormSuccess,
        handleNext,
        handleBack,
        handleSelectionChange,
        handleSurpriseChange,
        resetJourney,
    };
};
