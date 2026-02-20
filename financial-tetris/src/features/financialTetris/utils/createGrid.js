import { GRID_WIDTH, GRID_HEIGHT } from '../constants/gridConfig';

export const createGrid = () =>
    Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill({ filled: false, color: null }));
