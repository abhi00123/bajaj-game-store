import React from 'react';
import { motion } from 'framer-motion';

const TutorialOverlay = ({ onDismiss }) => {
    return (
        <motion.div
            className="absolute inset-0 z-[80] flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDismiss}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                borderRadius: '16px',
            }}
        >
            <div style={{ textAlign: 'center', padding: '0 32px', maxWidth: '320px' }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <p style={{ fontSize: '48px', marginBottom: '16px' }}>👆</p>
                    <h3 style={{
                        fontSize: '26px',
                        fontWeight: 900,
                        color: '#ffffff',
                        marginBottom: '12px',
                        letterSpacing: '0.02em',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    }}>How to Play</h3>
                    <p style={{
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '15px',
                        lineHeight: 1.6,
                        opacity: 0.95,
                        textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                    }}>
                        Tap <strong style={{ color: '#60A5FA' }}>left</strong> or <strong style={{ color: '#60A5FA' }}>right</strong> side of the screen to dodge falling risks.
                    </p>
                    <p style={{
                        color: '#94a3b8',
                        fontWeight: 600,
                        fontSize: '13px',
                        marginTop: '14px',
                    }}>
                        Or use ← → arrow keys on desktop
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{ marginTop: '28px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '30px' }}>❤️</span>
                        <span style={{ fontSize: '30px' }}>❤️</span>
                        <span style={{ fontSize: '30px' }}>❤️</span>
                    </div>
                    <p style={{
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '14px',
                        marginTop: '10px',
                        opacity: 0.85,
                    }}>
                        You have 3 lives. They regenerate after 5 seconds.
                    </p>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.5, 1] }}
                    transition={{ delay: 1, duration: 2, repeat: Infinity }}
                    style={{
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '14px',
                        marginTop: '32px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        textShadow: '0 0 10px rgba(96, 165, 250, 0.6)',
                    }}
                >
                    Tap anywhere to start
                </motion.p>
            </div>
        </motion.div>
    );
};

export default TutorialOverlay;
