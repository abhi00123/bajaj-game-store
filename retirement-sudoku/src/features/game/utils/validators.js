import { GRID_SIZE } from '../../../constants/game.js';

/**
 * Validate a single row: returns true if all 5 values are unique and non-null.
 * @param {(string|null)[]} row
 * @returns {boolean}
 */
export function isRowValid(row) {
    if (row.some((v) => v === null)) return false;
    return new Set(row).size === GRID_SIZE;
}

/**
 * Validate a single column: returns true if all 5 values are unique and non-null.
 * @param {(string|null)[][]} grid
 * @param {number} colIndex
 * @returns {boolean}
 */
export function isColumnValid(grid, colIndex) {
    const col = grid.map((row) => row[colIndex]);
    if (col.some((v) => v === null)) return false;
    return new Set(col).size === GRID_SIZE;
}

/**
 * Check if a proposed value causes any conflict in the given row or column.
 * Used to give visual feedback before the drop.
 * @param {(string|null)[][]} grid
 * @param {number} row
 * @param {number} col
 * @param {string} value
 * @returns {boolean} true if no conflict (valid)
 */
export function isDropValid(grid, row, col, value) {
    // Check row (excluding current cell)
    const rowConflict = grid[row].some((v, c) => c !== col && v === value);
    if (rowConflict) return false;

    // Check column (excluding current cell)
    const colConflict = grid.some((r, ri) => ri !== row && r[col] === value);
    if (colConflict) return false;

    return true;
}

/**
 * Check if the entire puzzle is complete and valid.
 * @param {(string|null)[][]} grid
 * @returns {boolean}
 */
export function isPuzzleComplete(grid) {
    for (let r = 0; r < GRID_SIZE; r++) {
        if (!isRowValid(grid[r])) return false;
    }
    for (let c = 0; c < GRID_SIZE; c++) {
        if (!isColumnValid(grid, c)) return false;
    }
    return true;
}

/**
 * Get conflicting cells for highlighting.
 * Returns a Set of "row-col" strings that have conflicts.
 * @param {(string|null)[][]} grid
 * @returns {Set<string>}
 */
export function getConflictCells(grid) {
    const conflicts = new Set();

    for (let r = 0; r < GRID_SIZE; r++) {
        const rowVals = {};
        grid[r].forEach((val, c) => {
            if (val !== null) {
                if (rowVals[val] !== undefined) {
                    conflicts.add(`${r}-${rowVals[val]}`);
                    conflicts.add(`${r}-${c}`);
                } else {
                    rowVals[val] = c;
                }
            }
        });
    }

    for (let c = 0; c < GRID_SIZE; c++) {
        const colVals = {};
        grid.forEach((row, r) => {
            const val = row[c];
            if (val !== null) {
                if (colVals[val] !== undefined) {
                    conflicts.add(`${colVals[val]}-${c}`);
                    conflicts.add(`${r}-${c}`);
                } else {
                    colVals[val] = r;
                }
            }
        });
    }

    return conflicts;
}
