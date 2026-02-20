import { useState, useEffect, useCallback } from 'react';
import { GAME_DURATION, GAME_STATUS } from '../constants/gameConfig';

export const useGameTimer = (gameStatus, onTimeUp) => {
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

    useEffect(() => {
        let interval = null;

        if (gameStatus === GAME_STATUS.PLAYING && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            onTimeUp();
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [gameStatus, timeLeft, onTimeUp]);

    const resetTimer = useCallback(() => {
        setTimeLeft(GAME_DURATION);
    }, []);

    const addTime = useCallback((seconds) => {
        setTimeLeft((prev) => prev + seconds);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return { timeLeft, formatTime, resetTimer, addTime };
};
