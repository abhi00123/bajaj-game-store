import { GRID_WIDTH } from '../constants/gridConfig';

export const clearCompletedLines = (grid) => {
    const clearedIndices = [];
    grid.forEach((row, idx) => {
        if (row.every(cell => cell.filled)) {
            clearedIndices.push(idx);
        }
    });

    const removeLines = (currentGrid) => {
        const newGrid = currentGrid.filter((_, idx) => !clearedIndices.includes(idx));
        while (newGrid.length < currentGrid.length) {
            newGrid.unshift(Array(GRID_WIDTH).fill({ filled: false, color: null }));
        }
        return { newGrid, linesCleared: clearedIndices.length };
    };

    return { linesCleared: clearedIndices.length, clearedIndices, removeLines };
};
