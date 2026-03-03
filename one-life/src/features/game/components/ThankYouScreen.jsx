import React from 'react';
import { motion } from 'framer-motion';

const ThankYouScreen = ({ leadName }) => {
    const firstName = leadName ? leadName.split(' ')[0] : '';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            style={{
                width: '100%',
                height: '100%',
                minHeight: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 24px',
                textAlign: 'center',
                overflow: 'hidden',
                background: 'linear-gradient(to bottom, #0d1b3e 0%, #1a3a6c 50%, #295599 100%)',
                fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
            }}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
            }}>
                {/* Large Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
                    style={{
                        fontSize: '48px',
                        fontWeight: 900,
                        color: '#ffffff',
                        letterSpacing: '0.12em',
                        lineHeight: 1.1,
                        textTransform: 'uppercase',
                        textShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    }}
                >
                    THANK YOU!
                </motion.h1>

                {/* Name */}
                {firstName && (
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{
                            fontSize: '30px',
                            fontWeight: 800,
                            color: 'rgba(255,255,255,0.9)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginTop: '4px',
                        }}
                    >
                        {firstName}
                    </motion.h2>
                )}

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    style={{
                        height: '1px',
                        width: '80px',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        margin: '24px auto',
                    }}
                />

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                    }}
                >
                    <p style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '18px',
                        fontWeight: 600,
                        letterSpacing: '0.03em',
                    }}>
                        Thank you for sharing your details.
                    </p>
                    <p style={{
                        color: 'rgba(255,255,255,0.75)',
                        fontSize: '16px',
                        fontWeight: 500,
                        letterSpacing: '0.03em',
                        lineHeight: 1.5,
                    }}>
                        Our Relationship Manager will reach out to you shortly.
                    </p>
                </motion.div>

                {/* Reassurance quote */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    style={{
                        marginTop: '32px',
                        paddingTop: '24px',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        maxWidth: '300px',
                    }}
                >
                    <p style={{
                        color: 'rgba(147, 197, 253, 0.6)',
                        fontSize: '14px',
                        fontWeight: 600,
                        lineHeight: 1.6,
                        fontStyle: 'italic',
                    }}>
                        "Because protecting the ones you love<br />
                        is the smartest decision you'll ever make."
                    </p>
                </motion.div>
            </div>

            {/* Bajaj branding */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                style={{
                    color: 'rgba(147, 197, 253, 0.3)',
                    fontSize: '10px',
                    fontWeight: 800,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    position: 'absolute',
                    bottom: '24px',
                }}
            >
                Bajaj Life Insurance
            </motion.p>
        </motion.div>
    );
};

export default ThankYouScreen;
