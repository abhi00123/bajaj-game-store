import {
    DndContext,
    DragOverlay,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    closestCenter,
} from '@dnd-kit/core';
import { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useGame } from '../context/GameContext.jsx';
import { PILLAR_MAP } from '../../../constants/game.js';

/**
 * Ghost block shown while dragging.
 */
function DragGhost({ pillar }) {
    if (!pillar) return null;
    return (
        <div className={[
            'w-16 h-16 rounded-xl border-2 pointer-events-none',
            'flex flex-col items-center justify-center gap-1',
            'opacity-90 shadow-2xl scale-110',
            pillar.color,
            pillar.borderColor,
        ].join(' ')}>
            <span className="text-[1.5rem] leading-none">{pillar.emoji}</span>
            <span className={`text-[0.65rem] font-bold uppercase tracking-wider ${pillar.textColor}`}>
                {pillar.shortLabel}
            </span>
        </div>
    );
}

DragGhost.propTypes = {
    pillar: PropTypes.object,
};

DragGhost.defaultProps = {
    pillar: null,
};

/**
 * DnD context wrapper that wires drag events to game state.
 */
const DndGameContext = memo(function DndGameContext({ children }) {
    const { state, setDragged, clearDragged, dropOnCell } = useGame();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 4 },
        }),
        useSensor(KeyboardSensor)
    );

    const handleDragStart = useCallback((event) => {
        const { active } = event;
        const pillarId = active.data.current?.pillarId;
        if (pillarId) {
            setDragged({ pillarId, activeId: active.id });
        }
    }, [setDragged]);

    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;
        const pillarId = active.data.current?.pillarId;

        if (over && pillarId) {
            const { row, col } = over.data.current;
            dropOnCell(row, col, pillarId);
        } else {
            clearDragged();
        }
    }, [dropOnCell, clearDragged]);

    const handleDragCancel = useCallback(() => {
        clearDragged();
    }, [clearDragged]);

    const activePillar = state.draggedItem?.pillarId
        ? PILLAR_MAP[state.draggedItem.pillarId]
        : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            {children}
            <DragOverlay dropAnimation={null}>
                {activePillar ? <DragGhost pillar={activePillar} /> : null}
            </DragOverlay>
        </DndContext>
    );
});

export default DndGameContext;
