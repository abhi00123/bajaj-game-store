import React, { useState, useEffect, useRef } from 'react';
import {
    BOARD_SIZE,
    getCellData,
    GameState,
    ScreenState,
    Cell
} from './features/GameLogic';
import { audioService } from './services/AudioService';

// Screens
import WelcomeScreen from './components/screens/WelcomeScreen';

import GameScreen from './components/screens/GameScreen';
import EventOverlay from './components/screens/EventOverlay';
import EndScreen from './components/screens/EndScreen';
import LeadCaptureScreen from './components/screens/LeadCaptureScreen';
import ThankYouScreen from './components/screens/ThankYouScreen';

interface AppProps {
    campaignId?: string;
    leadEndpoint?: string;
    environment?: 'dev' | 'prod';
    onGameStart?: () => void;
    onLeadSubmitted?: (payload: any) => void;
    onSnakeTriggered?: (snake: string) => void;
    onShieldActivated?: (shield: string) => void;
    onGameCompleted?: (score: number) => void;
}

const App: React.FC<AppProps> = ({
    onGameStart,
    onGameCompleted,
    onShieldActivated,
    onSnakeTriggered,
    onLeadSubmitted
}) => {
    const [gameState, setGameState] = useState<GameState>({
        playerPosition: 0,
        isGameOver: false,
        hasShield: false,
        lastDiceValue: 0,
        message: 'Roll the dice to move!',
        isMoving: false,
        currentScreen: 'welcome',
        isShieldOffer: false,
        gameHistory: [1],
        hadShieldAtEnd: false,
        playerName: undefined,
        playerMobile: undefined,
        frozenSnakes: [],
        stats: { snakesLanded: [], snakesAvoided: [], laddersClimbed: [] },
        shieldBoughtOnCurrentTurn: false
    });

    const movementTimeoutRef = useRef<number | null>(null);

    // Core Dice logic
    const handleRoll = () => {
        if (gameState.isMoving || gameState.isGameOver) return;

        audioService.playDiceRoll();
        const dice = Math.floor(Math.random() * 6) + 1;
        const requiredToWin = BOARD_SIZE - gameState.playerPosition;

        if (dice > requiredToWin) {
            setGameState(prev => ({
                ...prev,
                lastDiceValue: dice,
                message: `You rolled a ${dice}. You need exactly a ${requiredToWin} to finish!`
            }));
            return; // Don't move
        }

        setGameState(prev => ({
            ...prev,
            lastDiceValue: dice,
            isMoving: true,
            message: `You rolled a ${dice}!`
        }));

        animateMove(gameState.playerPosition, dice);
    };

    const animateMove = (startPos: number, steps: number) => {
        let currentStep = 1;

        const moveOneStep = () => {
            if (currentStep <= steps) {
                const nextPos = startPos + currentStep;
                if (nextPos <= BOARD_SIZE) {
                    setGameState(prev => ({ ...prev, playerPosition: nextPos }));
                    currentStep++;
                    // GDD 9.3: 90ms/step
                    movementTimeoutRef.current = window.setTimeout(moveOneStep, 90);
                } else {
                    finalizeMove(startPos + steps);
                }
            } else {
                finalizeMove(startPos + steps);
            }
        };

        moveOneStep();
    };

    const finalizeMove = (endPos: number) => {
        // Correct for board size
        const actualEndPos = endPos > BOARD_SIZE ? gameState.playerPosition : endPos;
        const cell = getCellData(actualEndPos);

        const isFrozenSnake = cell.type === 'snake' && gameState.frozenSnakes.includes(cell.id);

        if (cell.type !== 'normal' && !isFrozenSnake) {
            if (cell.type === 'snake') {
                audioService.playSnakeBite();
                if (onSnakeTriggered) onSnakeTriggered(cell.label!);

                // Start sliding to tail immediately
                setGameState(prev => ({
                    ...prev,
                    playerPosition: cell.target!,
                    isMoving: true,
                    stats: { ...prev.stats, snakesLanded: [...prev.stats.snakesLanded, cell.label || `Snake at ${actualEndPos}`] }
                }));

                // Wait for slide to finish, then show event overlay
                setTimeout(() => {
                    setGameState(prev => ({
                        ...prev,
                        isMoving: false,
                        activeEvent: cell,
                        currentScreen: 'event'
                    }));
                }, 700);
            } else if (cell.type === 'ladder') {
                audioService.playLadderClimb();

                // Start sliding up ladder immediately
                setGameState(prev => ({
                    ...prev,
                    playerPosition: cell.target!,
                    isMoving: true,
                    stats: { ...prev.stats, laddersClimbed: [...prev.stats.laddersClimbed, cell.label || `Ladder at ${actualEndPos}`] }
                }));

                // Wait for slide to finish, then show event overlay
                setTimeout(() => {
                    setGameState(prev => ({
                        ...prev,
                        isMoving: false,
                        activeEvent: cell,
                        currentScreen: 'event'
                    }));
                }, 700);
            }
        } else {
            setGameState(prev => {
                const isOver = actualEndPos === BOARD_SIZE;
                if (isOver) {
                    audioService.playWin();
                    if (onGameCompleted) onGameCompleted(100);
                    return {
                        ...prev,
                        isMoving: false,
                        isGameOver: true,
                        currentScreen: 'end',
                        hadShieldAtEnd: prev.hasShield,
                        playerPosition: actualEndPos
                    };
                }

                return {
                    ...prev,
                    isMoving: false,
                    playerPosition: actualEndPos,
                    message: isFrozenSnake ? "Don't worry, you are protected because you have shield" : `Reached square ${actualEndPos}`,
                    stats: isFrozenSnake ? { ...prev.stats, snakesAvoided: [...prev.stats.snakesAvoided, cell.label || `Snake at ${actualEndPos}`] } : prev.stats
                };
            });

            if (isFrozenSnake) {
                // Trigger pop-up reassurance after the movement finishes
                setTimeout(() => {
                    setGameState(p => ({
                        ...p,
                        activeEvent: { ...cell, isAlreadyFrozen: true },
                        currentScreen: 'event'
                    }));
                }, 400);
            }
        }
    };

    const handleEventContinue = () => {
        const event = gameState.activeEvent;
        if (!event) return;

        setGameState(prev => {
            let nextPos = prev.playerPosition;
            let currentFrozenSnakes = [...prev.frozenSnakes];

            if (event.type === 'snake') {
                // If they bought the shield just now, add this snake to frozen
                if (prev.shieldBoughtOnCurrentTurn && !currentFrozenSnakes.includes(event.id)) {
                    currentFrozenSnakes.push(event.id);
                }
            }

            const isOver = nextPos === BOARD_SIZE;
            if (isOver) audioService.playWin();

            return {
                ...prev,
                playerPosition: nextPos,
                activeEvent: undefined,
                currentScreen: isOver ? 'end' : 'game',
                isGameOver: isOver,
                hadShieldAtEnd: isOver ? prev.hasShield : false,
                frozenSnakes: currentFrozenSnakes,
                shieldBoughtOnCurrentTurn: false
            };
        });
    };

    const handleAddShield = () => {
        setGameState(prev => {
            const event = prev.activeEvent;
            let currentFrozenSnakes = [...prev.frozenSnakes];
            if (event && event.type === 'snake' && !currentFrozenSnakes.includes(event.id)) {
                currentFrozenSnakes.push(event.id);
            }
            return {
                ...prev,
                hasShield: true,
                activeEvent: undefined,
                currentScreen: 'game',
                frozenSnakes: currentFrozenSnakes,
                message: 'Term Shield added! Snake frozen.',
                shieldBoughtOnCurrentTurn: false // Reset here since we're closing
            };
        });
    };

    const handleLeadSubmit = (data: any) => {
        const payload = {
            ...data,
            hadShieldInGame: gameState.hadShieldAtEnd,
            finalPosition: gameState.playerPosition
        };
        if (onLeadSubmitted) onLeadSubmitted(payload);
        setGameState(prev => ({ ...prev, currentScreen: 'thank-you' }));
    };

    const handleBookingSubmit = (data: any) => {
        const payload = {
            ...data,
            hadShieldInGame: gameState.hadShieldAtEnd,
            finalPosition: gameState.playerPosition,
            isBookingRequest: true
        };
        if (onLeadSubmitted) onLeadSubmitted(payload);
        setGameState(prev => ({ ...prev, currentScreen: 'thank-you' }));
    };

    const resetGame = () => {
        setGameState(prev => ({
            playerPosition: 0,
            isGameOver: false,
            hasShield: false,
            lastDiceValue: 0,
            message: 'Roll the dice to move!',
            isMoving: false,
            currentScreen: 'welcome',
            isShieldOffer: false,
            gameHistory: [1],
            hadShieldAtEnd: false,
            // keep old player details intact or clear them? Usually we keep them if they replay immediately.
            playerName: prev.playerName,
            playerMobile: prev.playerMobile,
            frozenSnakes: [],
            stats: { snakesLanded: [], snakesAvoided: [], laddersClimbed: [] },
            shieldBoughtOnCurrentTurn: false
        }));
    };

    const handlePlayAgain = () => {
        setGameState(prev => ({
            playerPosition: 0,
            isGameOver: false,
            hasShield: false,
            lastDiceValue: 0,
            message: 'Roll the dice to move!',
            isMoving: false,
            currentScreen: 'game', // skip welcome
            isShieldOffer: false,
            gameHistory: [1],
            hadShieldAtEnd: false,
            playerName: prev.playerName,
            playerMobile: prev.playerMobile,
            frozenSnakes: [],
            stats: { snakesLanded: [], snakesAvoided: [], laddersClimbed: [] },
            shieldBoughtOnCurrentTurn: false
        }));
    };

    // Render logic
    switch (gameState.currentScreen) {
        case 'welcome':
            return (
                <WelcomeScreen
                    onStart={(data) => {
                        if (onLeadSubmitted) onLeadSubmitted({ ...data, stage: 'pre-game' });

                        // If the mode choice was made in the popup itself
                        if (data.isProtected !== undefined) {
                            setGameState(prev => ({
                                ...prev,
                                playerName: data.name,
                                playerMobile: data.mobile,
                                hasShield: data.isProtected!,
                                currentScreen: 'game'
                            }));
                            if (onGameStart) onGameStart();
                        } else {
                            // Fallback to old behavior
                            setGameState(prev => ({ ...prev, currentScreen: 'shield-choice', playerName: data.name, playerMobile: data.mobile }));
                        }
                    }}
                />
            );



        case 'game':
        case 'event':
            return (
                <>
                    <GameScreen
                        playerPosition={gameState.playerPosition}
                        hasShield={gameState.hasShield}
                        isMoving={gameState.isMoving}
                        lastDice={gameState.lastDiceValue}
                        message={gameState.message}
                        onRoll={handleRoll}
                        frozenSnakes={gameState.frozenSnakes}
                    />
                    {gameState.currentScreen === 'event' && gameState.activeEvent && (
                        <EventOverlay
                            event={gameState.activeEvent}
                            onContinue={handleEventContinue}
                            onAddShield={gameState.activeEvent.type === 'snake' ? handleAddShield : undefined}
                        />
                    )}
                </>
            );

        case 'end':
            return (
                <EndScreen
                    hasShield={gameState.hadShieldAtEnd}
                    playerName={gameState.playerName}
                    playerMobile={gameState.playerMobile}
                    onCTA={() => setGameState(prev => ({ ...prev, currentScreen: 'lead-capture' }))}
                    onPlayAgain={handlePlayAgain}
                    onBookingSubmit={handleBookingSubmit}
                    stats={gameState.stats}
                />
            );

        case 'lead-capture':
            return <LeadCaptureScreen onSubmit={handleLeadSubmit} />;

        case 'thank-you':
            return <ThankYouScreen onReplay={handlePlayAgain} playerName={gameState.playerName} />;

        default:
            return null;
    }
};

export default App;
