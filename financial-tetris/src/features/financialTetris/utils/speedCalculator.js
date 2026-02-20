import { INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants/gameConfig';

export const calculateSpeed = (linesCleared) => {
    // Every 5 lines cleared, increase speed
    const level = Math.floor(linesCleared / 5);
    const speed = INITIAL_SPEED * Math.pow(SPEED_INCREMENT, level);
    return Math.max(speed, MIN_SPEED);
};
