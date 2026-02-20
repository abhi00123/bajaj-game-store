import { memo } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { useConflicts } from '../hooks/useGameState.js';
import { isDropValid } from '../utils/validators.js';
import GridCell from './GridCell.jsx';

/**
 * 5×5 game board — light theme, matches reference photo.
 */
const GameBoard = memo(function GameBoard() {
    const { state, clearCell } = useGame();
    const conflicts = useConflicts();
    const { userGrid, prefilled, draggedItem } = state;

    if (!userGrid) return null;

    return (
        <div
            role="grid"
            aria-label="Retirement Sudoku 5x5 grid"
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 'clamp(0.3rem, 1.5vw, 0.5rem)',
                width: '100%',
                /* keep grid square so cells are always square */
                aspectRatio: '1 / 1',
            }}
        >
            {userGrid.map((row, r) =>
                row.map((val, c) => {
                    const key = `${r}-${c}`;
                    const isPrefillCell = prefilled.has(key);
                    const isConflict = conflicts.has(key);
                    const draggedPillarId = draggedItem?.pillarId ?? null;
                    const dropValid = draggedPillarId
                        ? isDropValid(userGrid, r, c, draggedPillarId)
                        : false;

                    return (
                        <GridCell
                            key={key}
                            row={r}
                            col={c}
                            value={val}
                            isPrefilled={isPrefillCell}
                            isConflict={isConflict}
                            draggedPillarId={draggedPillarId}
                            isDropValid={dropValid}
                            onClearCell={clearCell}
                        />
                    );
                })
            )}
        </div>
    );
});

export default GameBoard;
