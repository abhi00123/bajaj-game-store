import { memo, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GAME_PHASES, LIFE_STAGES, EVENTS_PER_STAGE } from './constants/lifeStages';
import { useRaceEngine } from './hooks/useRaceEngine';
import { useTimer } from './hooks/useTimer';
import RaceLayout from '../../components/layout/RaceLayout';
import IntroScreen from './components/IntroScreen';
import StageSelection from './components/StageSelection';
import EventCard from './components/EventCard';
import ProtectionMeter from './components/ProtectionMeter';
import DecisionButtons from './components/DecisionButtons';
import SpeedometerScore from './components/SpeedometerScore';
import TimelineSummary from './components/TimelineSummary';
import ConversionScreen from './components/ConversionScreen';
import LeadForm from './components/LeadForm';
import ThankYou from './components/ThankYou';
import QuestionScreen from './components/QuestionScreen';
import ResultScreen from './components/ResultScreen';

const EVENT_TIMER_SECONDS = 10;

// ... (Imports remain the same)

/**
 * Feedback overlay shown as a POPUP on top of the screen.
 */
const FeedbackOverlay = memo(function FeedbackOverlay({ feedback, onContinue }) {
    if (!feedback) return null;

    const isProtected = feedback.decision === 'protected';
    const isPositive = feedback.delta > 0;

    return (
        <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="w-[85%] max-w-[300px] rounded-[2rem] p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden ring-2 ring-white/10"
                style={{
                    background: isProtected
                        ? 'linear-gradient(145deg, #1e1b4b 0%, #431407 100%)' // Dark Blue to Dark Orange for Protected
                        : 'linear-gradient(145deg, #1e1b4b 0%, #172554 100%)', // Dark Blue for Exposed
                }}
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
                {/* Background Glows */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[40px] opacity-40 ${isProtected ? 'bg-orange-500' : 'bg-blue-500'}`} />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-[40px] opacity-20 bg-white" />
                </div>

                {/* Circular Icon with Pulse */}
                <div className="relative mb-3">
                    <div className={`absolute inset-0 rounded-full blur-lg opacity-60 animate-pulse ${isProtected ? 'bg-orange-500' : 'bg-blue-500'}`} />
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-[2.2rem] relative z-10 shadow-xl border-[4px] border-white/10"
                        style={{
                            background: isProtected
                                ? 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)'
                                : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        }}
                    >
                        {isProtected ? '🛡️' : '⚠️'}
                    </div>
                </div>

                {/* Main Text */}
                <h3 className="text-[1.4rem] font-black uppercase italic tracking-tighter mb-1 leading-none text-white drop-shadow-md relative z-10">
                    {isProtected ? 'YOU\'RE PROTECTED!' : 'YOU\'RE EXPOSED!'}
                </h3>

                <p className="text-blue-100 font-bold leading-tight mb-4 text-[0.7rem] px-1 relative z-10 opacity-90">
                    {feedback.title}
                </p>

                {/* Score Update Circle */}
                <div className="relative z-10 mb-5">
                    <div className="flex flex-col items-center">
                        <span className="text-white/60 text-[0.55rem] font-bold uppercase tracking-[0.2em] mb-0.5">Impact on Score</span>
                        <div className={`text-[2.2rem] font-black leading-none flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? '+' : ''}{feedback.delta}
                        </div>
                    </div>
                </div>

                {/* Continue Button */}
                <motion.button
                    onClick={onContinue}
                    whileTap={{ scale: 0.96 }}
                    className="w-full py-3 rounded-xl font-black text-white text-sm uppercase tracking-wide shadow-lg relative z-10 overflow-hidden group"
                    style={{
                        background: 'linear-gradient(90deg, #FFFFFF 0%, #F0F9FF 100%)',
                        color: isProtected ? '#ea580c' : '#1e3a8a'
                    }}
                >
                    <span className="relative z-10">CONTINUE</span>
                    <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-20 transition-opacity" />
                </motion.button>
            </motion.div>
        </motion.div>
    );
});

// ... (StageHeader, RaceProgress remain but might be unused if we switch fully to QuestionScreen layout)

/**
 * Main page for the Life Milestone Race feature.
 * Orchestrates the game flow by rendering phase-appropriate components.
 * Business logic lives in useRaceEngine; this component is purely presentational.
 */
const LifeMilestoneRacePage = memo(function LifeMilestoneRacePage() {
    const engine = useRaceEngine();

    const {
        gameId,
        phase,
        score,
        currentEvent,
        currentEventIndex,
        eventQueue,
        timeline,
        lastFeedback,
        isTimerActive,
        protectionCategory,
        finalScore,
        riskGaps,
        progressPercent,
        userName,
        userPhone,
        selectedStageData,
        startGame,
        selectStage,
        makeDecision,
        handleTimerExpire,
        advanceToNextEvent,
        showScoreReveal,
        showTimeline,
        showConversion,
        showLeadForm,
        showThankYou,
        restartGame,
    } = engine;

    const { timeLeft, progress: timerProgress } = useTimer(
        EVENT_TIMER_SECONDS,
        handleTimerExpire,
        isTimerActive,
    );

    const handleLeadSuccess = useCallback((formData) => {
        showThankYou(formData?.name);
    }, [showThankYou]);

    const renderPhase = () => {
        switch (phase) {
            case GAME_PHASES.INTRO:
                return <IntroScreen key="intro" onStart={startGame} />;

            case GAME_PHASES.STAGE_SELECTION:
                return <StageSelection key="stage-select" onSelectStage={selectStage} />;

            case GAME_PHASES.RACING:
            case GAME_PHASES.EVENT_FEEDBACK:
                return (
                    <div className="w-full h-full relative">
                        <QuestionScreen
                            key="question-screen"
                            stageData={selectedStageData}
                            questionNumber={currentEventIndex + 1}
                            totalQuestions={eventQueue.length}
                            currentEvent={currentEvent}
                            timeLeft={timeLeft}
                            timerProgress={timerProgress}
                            onDecision={makeDecision}
                        />

                        <AnimatePresence>
                            {phase === GAME_PHASES.EVENT_FEEDBACK && (
                                <FeedbackOverlay
                                    key="feedback-popup"
                                    feedback={lastFeedback}
                                    onContinue={advanceToNextEvent}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                );

            case GAME_PHASES.FINISH:
            case GAME_PHASES.SCORE_REVEAL:
            case GAME_PHASES.TIMELINE:
            case GAME_PHASES.CONVERSION:
            case GAME_PHASES.LEAD_FORM:
                // Consolidated Result Screen
                return (
                    <ResultScreen
                        key="result-screen"
                        score={score}
                        finalScore={finalScore}
                        userName={userName}
                        userPhone={userPhone}
                        timeline={timeline}
                        category={protectionCategory}
                        onRestart={restartGame}
                        gameId={gameId}
                        riskGaps={riskGaps}
                        onBookSlot={handleLeadSuccess}
                    />
                );

            case GAME_PHASES.THANK_YOU:
                return <ThankYou key="thank-you" onRestart={restartGame} userName={userName} />;

            default:
                return null;
        }
    };

    return (
        <RaceLayout fullScreen={phase === GAME_PHASES.INTRO}>
            <AnimatePresence mode="wait">
                {renderPhase()}
            </AnimatePresence>
        </RaceLayout>
    );
});

LifeMilestoneRacePage.displayName = 'LifeMilestoneRacePage';

export default LifeMilestoneRacePage;
