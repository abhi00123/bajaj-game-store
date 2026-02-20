import { useEffect } from 'react';
import { GAME_STATUS } from '../constants/gameConfig';

export const useKeyboardControls = (gameStatus, moveLeft, moveRight, moveDown, rotatePiece) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameStatus !== GAME_STATUS.PLAYING) return;

            switch (e.key) {
                case 'ArrowLeft':
                    moveLeft();
                    break;
                case 'ArrowRight':
                    moveRight();
                    break;
                case 'ArrowDown':
                    moveDown();
                    break;
                case 'ArrowUp':
                    rotatePiece();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameStatus, moveLeft, moveRight, moveDown, rotatePiece]);
};
