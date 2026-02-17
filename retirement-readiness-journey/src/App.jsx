import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRetirementJourney } from './hooks/useRetirementJourney';
import { JOURNEY_STEPS } from './constants/journeySteps';

// Components
import Intro from './components/Intro';
import StepScenario from './components/StepScenario';
import StepLifestyle from './components/StepLifestyle';
import StepEssentials from './components/StepEssentials';
import StepEngine from './components/StepEngine';
import StepSurprises from './components/StepSurprises';
import Results from './components/Results';

// UI
import Progress from './components/ui/Progress';

const stepVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

function App() {
    const journey = useRetirementJourney();
    const { currentStep, currentStepIndex } = journey;

    const renderStep = () => {
        switch (currentStep) {
            case JOURNEY_STEPS.INTRO:
                return <Intro {...journey} />;
            case JOURNEY_STEPS.SCENARIO:
                return <StepScenario {...journey} />;
            case JOURNEY_STEPS.LIFESTYLE:
                return <StepLifestyle {...journey} />;
            case JOURNEY_STEPS.ESSENTIALS:
                return <StepEssentials {...journey} />;
            case JOURNEY_STEPS.ENGINE:
                return <StepEngine {...journey} />;
            case JOURNEY_STEPS.SURPRISES:
                return <StepSurprises {...journey} />;
            case JOURNEY_STEPS.RESULTS:
                return <Results {...journey} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Progress Bar Header (Hidden on Intro and Results) */}
            {currentStep !== JOURNEY_STEPS.INTRO && currentStep !== JOURNEY_STEPS.RESULTS && (
                <Progress currentStepIndex={currentStepIndex} />
            )}

            <main className="flex-grow flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-4xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            variants={stepVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

export default App;
