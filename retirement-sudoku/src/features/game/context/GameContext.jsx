import { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';
import { gameReducer, initialState, ACTIONS } from './gameReducer.js';
import { GAME_PHASES } from './gameReducer.js';

const GameContext = createContext(null);

export function GameProvider({ children }) {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const timerRef = useRef(null);

    // Manage countdown timer
    useEffect(() => {
        if (state.phase === GAME_PHASES.PLAYING) {
            timerRef.current = setInterval(() => {
                dispatch({ type: ACTIONS.TICK });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [state.phase]);

    const startGame = useCallback(() => {
        dispatch({ type: ACTIONS.START_GAME });
    }, []);

    const restartGame = useCallback(() => {
        dispatch({ type: ACTIONS.RESTART });
    }, []);

    const setDragged = useCallback((item) => {
        dispatch({ type: ACTIONS.SET_DRAGGED, payload: item });
    }, []);

    const clearDragged = useCallback(() => {
        dispatch({ type: ACTIONS.CLEAR_DRAGGED });
    }, []);

    const dropOnCell = useCallback((row, col, pillarId) => {
        dispatch({ type: ACTIONS.DROP_CELL, payload: { row, col, pillarId } });
    }, []);

    const clearCell = useCallback((row, col) => {
        dispatch({ type: ACTIONS.CLEAR_CELL, payload: { row, col } });
    }, []);

    const value = {
        state,
        startGame,
        restartGame,
        setDragged,
        clearDragged,
        dropOnCell,
        clearCell,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error('useGame must be used within GameProvider');
    return ctx;
}
