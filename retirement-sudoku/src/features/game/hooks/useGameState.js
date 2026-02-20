import { useMemo } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { getConflictCells } from '../utils/validators.js';
import { WARNING_THRESHOLD } from '../../../constants/game.js';
import { GAME_PHASES } from '../context/gameReducer.js';

/**
 * Derived timer state for UI display.
 */
export function useTimer() {
    const { state } = useGame();

    return useMemo(() => {
        const { timeRemaining } = state;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        const isWarning = timeRemaining <= WARNING_THRESHOLD && timeRemaining > 0;
        const isPlaying = state.phase === GAME_PHASES.PLAYING;

        return { timeRemaining, formatted, isWarning, isPlaying };
    }, [state.timeRemaining, state.phase]);
}

/**
 * Derived conflict cells for visual feedback.
 */
export function useConflicts() {
    const { state } = useGame();

    return useMemo(() => {
        if (!state.userGrid) return new Set();
        return getConflictCells(state.userGrid);
    }, [state.userGrid]);
}

/**
 * Convenience for grid state.
 */
export function useGrid() {
    const { state } = useGame();
    return {
        userGrid: state.userGrid,
        prefilled: state.prefilled,
        solution: state.solution,
        availableBlocks: state.availableBlocks,
        draggedItem: state.draggedItem,
    };
}
