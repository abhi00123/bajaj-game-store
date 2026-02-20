// Game feature public API
export { GameProvider, useGame } from './context/GameContext.jsx';
export { GAME_PHASES, ACTIONS } from './context/gameReducer.js';
export { useTimer, useConflicts, useGrid } from './hooks/useGameState.js';
export { generatePuzzle, generateValidGrid } from './utils/gridGenerator.js';
export { isPuzzleComplete, isDropValid, getConflictCells } from './utils/validators.js';
export { default as GameBoard } from './components/GameBoard.jsx';
export { default as GameTimer } from './components/GameTimer.jsx';
export { default as BlockTray } from './components/BlockTray.jsx';
export { default as WinModal } from './components/WinModal.jsx';
export { default as TimeUpModal } from './components/TimeUpModal.jsx';
