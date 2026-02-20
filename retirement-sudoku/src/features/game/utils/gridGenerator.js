import { INCOME_PILLARS, GRID_SIZE, PREFILL_RATIO } from '../../../constants/game.js';

/**
 * Fisher-Yates shuffle algorithm.
 * @param {Array} arr
 * @returns {Array} new shuffled array
 */
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Generate a valid 5×5 Latin square using the INCOME_PILLARS ids.
 * Strategy: start from a base row and shift cyclically, then shuffle rows and columns.
 * @returns {string[][]} 5×5 grid of pillar ids
 */
export function generateValidGrid() {
    const ids = INCOME_PILLARS.map((p) => p.id);

    // Build a base Latin square by cyclic shifts
    const base = ids.map((_, rowIdx) =>
        ids.map((_, colIdx) => ids[(rowIdx + colIdx) % GRID_SIZE])
    );

    // Shuffle rows
    const rowOrder = shuffle([0, 1, 2, 3, 4]);
    const rowShuffled = rowOrder.map((r) => base[r]);

    // Shuffle columns
    const colOrder = shuffle([0, 1, 2, 3, 4]);
    const solution = rowShuffled.map((row) => colOrder.map((c) => row[c]));

    return solution;
}

/**
 * Given a solution grid, randomly prefill ~50% of cells.
 * Returns a grid where some cells are null (empty) and others are the pillar id.
 * Also returns a Set of "row-col" strings for prefilled cells.
 * @param {string[][]} solution
 * @returns {{ userGrid: (string|null)[][], prefilled: Set<string> }}
 */
export function buildPuzzleFromSolution(solution) {
    const totalCells = GRID_SIZE * GRID_SIZE;
    const prefilledCount = Math.ceil(totalCells * PREFILL_RATIO);

    // Create all cell indices and shuffle them
    const allIndices = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            allIndices.push([r, c]);
        }
    }
    const shuffledIndices = shuffle(allIndices);
    const prefilledIndices = shuffledIndices.slice(0, prefilledCount);

    const prefilledSet = new Set(prefilledIndices.map(([r, c]) => `${r}-${c}`));

    // Build userGrid: prefilled cells get the solution value, others null
    const userGrid = solution.map((row, r) =>
        row.map((val, c) => (prefilledSet.has(`${r}-${c}`) ? val : null))
    );

    return { userGrid, prefilled: prefilledSet };
}

/**
 * Generate a fresh puzzle from scratch.
 * @returns {{ solution: string[][], userGrid: (string|null)[][], prefilled: Set<string> }}
 */
export function generatePuzzle() {
    const solution = generateValidGrid();
    const { userGrid, prefilled } = buildPuzzleFromSolution(solution);
    return { solution, userGrid, prefilled };
}
