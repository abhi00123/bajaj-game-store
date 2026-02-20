import { memo } from 'react';
import PillarBlock from './PillarBlock.jsx';
import { useGame } from '../context/GameContext.jsx';
import { GAME_PHASES } from '../context/gameReducer.js';

/**
 * Pillar selector tray — Simplified for Dark Theme.
 * Just renders the row of draggable blocks. Header is handled by parent.
 */
const BlockTray = memo(function BlockTray() {
    const { state } = useGame();
    const isPlaying = state.phase === GAME_PHASES.PLAYING;

    return (
        <div
            className="w-full flex justify-between items-stretch gap-2 pt-2"
            style={{
                touchAction: 'none', // Prevent scrolling while dragging
            }}
        >
            {state.availableBlocks.map((block) => (
                <PillarBlock
                    key={block.id}
                    pillar={block}
                    count={block.remaining}
                    disabled={!isPlaying}
                />
            ))}
        </div>
    );
});

export default BlockTray;
