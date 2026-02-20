import { memo, useState } from 'react';
import { useTimer } from '../hooks/useGameState.js';
import { GAME_DURATION } from '../../../constants/game.js';

const GAME_RULES = [
    { emoji: '🎯', text: 'Place each income pillar once per row & column.' },
    { emoji: '🚫', text: 'No duplicate pillars in any row or column.' },
    { emoji: '🔒', text: 'Pre-filled cells are locked — they cannot be changed.' },
    { emoji: '↩️', text: 'Double-tap a placed pillar to remove it.' },
    { emoji: '⏱️', text: 'Complete the board before time runs out!' },
];

/**
 * Info tooltip — pure CSS hover, no extra libs.
 */
function InfoTooltip() {
    const [visible, setVisible] = useState(false);

    return (
        <div
            style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onFocus={() => setVisible(true)}
            onBlur={() => setVisible(false)}
        >
            {/* ℹ icon button */}
            <button
                aria-label="Game rules"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '1.1rem',
                    height: '1.1rem',
                    borderRadius: '50%',
                    background: 'rgba(249,115,22,0.18)',
                    border: '1.5px solid rgba(249,115,22,0.6)',
                    color: '#f97316',
                    fontSize: '0.6rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    lineHeight: 1,
                    padding: 0,
                    flexShrink: 0,
                    transition: 'background 0.2s, border-color 0.2s',
                    outline: 'none',
                    boxShadow: visible ? '0 0 8px rgba(249,115,22,0.45)' : 'none',
                }}
            >
                i
            </button>

            {/* Tooltip card */}
            {visible && (
                <div
                    role="tooltip"
                    style={{
                        position: 'absolute',
                        // Place it above and to the right of the icon
                        bottom: '130%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999,
                        width: '13rem',
                        background: 'linear-gradient(135deg, #0d1b3e 0%, #1e3a5f 100%)',
                        border: '1.5px solid rgba(249,115,22,0.5)',
                        borderRadius: '0.85rem',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 16px rgba(249,115,22,0.15)',
                        padding: '0.7rem 0.8rem',
                        pointerEvents: 'none',
                        animation: 'tooltipFadeIn 0.18s ease',
                    }}
                >
                    {/* Arrow */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '-0.45rem',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '7px solid transparent',
                            borderRight: '7px solid transparent',
                            borderTop: '7px solid rgba(249,115,22,0.5)',
                        }}
                    />

                    {/* Title */}
                    <div
                        style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            color: '#f97316',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            marginBottom: '0.45rem',
                            borderBottom: '1px solid rgba(249,115,22,0.25)',
                            paddingBottom: '0.3rem',
                        }}
                    >
                        📋 How to Play
                    </div>

                    {/* Rules list */}
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {GAME_RULES.map((rule, i) => (
                            <li
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '0.4rem',
                                    fontSize: '0.58rem',
                                    color: '#cbd5e1',
                                    lineHeight: 1.35,
                                }}
                            >
                                <span style={{ fontSize: '0.7rem', flexShrink: 0 }}>{rule.emoji}</span>
                                <span>{rule.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

/**
 * Countdown timer — light theme version for white header bar.
 */
const GameTimer = memo(function GameTimer() {
    const { formatted, isWarning, timeRemaining } = useTimer();

    const pct = Math.max(0, timeRemaining / GAME_DURATION);
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - pct);

    const arcColor = isWarning ? '#ef4444' : '#1e3a5f';
    const textColor = isWarning ? '#ef4444' : '#1e3a5f';

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* Circular timer */}
            <div
                style={{
                    position: 'relative',
                    width: '3.25rem',
                    height: '3.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <svg
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        transform: 'rotate(-90deg)',
                    }}
                    viewBox="0 0 56 56"
                    aria-hidden="true"
                >
                    {/* Track */}
                    <circle
                        cx="28" cy="28" r={radius}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3.5"
                    />
                    {/* Progress arc */}
                    <circle
                        cx="28" cy="28" r={radius}
                        fill="none"
                        stroke={arcColor}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s ease' }}
                    />
                </svg>

                <span
                    aria-live="polite"
                    aria-atomic="true"
                    style={{
                        position: 'relative',
                        fontFamily: 'Outfit, Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        color: textColor,
                        tabularNums: true,
                        animation: isWarning ? 'timerWarn 0.8s ease-in-out infinite' : 'none',
                    }}
                >
                    {formatted}
                </span>
            </div>

            {/* Label + Info icon row */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                {/* "Time Left" + ℹ icon on the same row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ fontSize: '0.6rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                        Time Left
                    </span>
                    <InfoTooltip />
                </div>

                {isWarning && (
                    <span style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: 700 }}>
                        ⚠ Hurry!
                    </span>
                )}
            </div>
        </div>
    );
});

export default GameTimer;
