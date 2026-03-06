import React, { useState } from 'react';
import { Trophy, Shield, AlertTriangle, Share2 } from 'lucide-react';
import LeadModal from '../modals/LeadModal';
interface EndScreenProps {
    hasShield: boolean;
    playerName?: string;
    playerMobile?: string;
    onCTA: () => void;
    onPlayAgain?: () => void;
    onBookingSubmit?: (data: any) => void;
    stats?: { snakesLanded: string[]; snakesAvoided: string[]; laddersClimbed: string[]; };
}

const T = {
    blue: '#0066B2',
    blueDark: '#004A80',
    blueLight: '#E8F1FB',
    orange: '#FF6600',
    orangeLight: '#FFF3EB',
    white: '#FFFFFF',
    text: '#1A2340',
    muted: '#64748B',
    border: '#DCE5F5',
    bgPage: '#F0F4FF',
    gold: '#F59E0B',
    goldLight: '#FFFBEB',
};

const EndScreen: React.FC<EndScreenProps> = ({ hasShield, playerName, playerMobile, onCTA, onPlayAgain, onBookingSubmit, stats }) => {
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [isStatsOpen, setIsStatsOpen] = useState(false);

    const handleShare = async () => {
        const appBaseUrl = (typeof window !== 'undefined')
            ? new URL((import.meta as any).env.BASE_URL || './', window.location.href).href
            : '/';

        const shareData = {
            title: 'Life Snakes & Ladders',
            text: 'Check out Life Snakes & Ladders! Play the game and discover how prepared you are for your family\'s future.',
            url: appBaseUrl
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback
            try {
                await navigator.clipboard.writeText(shareData.url);
                alert('Link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    return (
        <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(to bottom, #192b5e 0%, #11204a 100%)',
            display: 'flex', flexDirection: 'column',
            overflowX: 'hidden', overflowY: 'auto',
            alignItems: 'center', padding: '24px 20px 40px',
            color: T.white, position: 'relative'
        }}>
            {/* Top Right Share Icon */}
            <button onClick={handleShare} style={{
                position: 'absolute', top: 20, right: 20,
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: T.white, cursor: 'pointer', zIndex: 10
            }}>
                <Share2 size={16} />
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 24, marginTop: 8 }}>
                <p style={{ fontSize: 16, fontWeight: 900, color: '#FF7B00', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>
                    Hi {playerName || 'Username'}
                </p>
                <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
                    "{hasShield ? 'You Finished Strong — Because You Were Protected' : 'You Made It, But Luck Won\'t Always Help'}"
                </h1>
            </div>

            {/* Icon Graphic */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 28px'
            }}>
                {hasShield ? (
                    <Trophy size={64} color={T.white} />
                ) : (
                    <AlertTriangle size={64} color="#FF7B00" />
                )}
            </div>


            {/* Message Paragraph */}
            <p style={{ fontSize: 14, color: T.white, margin: '0 0 24px', lineHeight: 1.5, textAlign: 'center', maxWidth: 400, fontWeight: 600 }}>
                {hasShield
                    ? "Risks are part of life - Protection keeps your family future secure"
                    : "Luck may save you in a game, but real life needs protection"}
            </p>

            {/* Stats Dropdown */}
            {stats && (
                <div style={{ width: '100%', maxWidth: 400, marginBottom: 24, background: 'rgba(255,255,255,0.05)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                    <button
                        onClick={() => setIsStatsOpen(!isStatsOpen)}
                        style={{ width: '100%', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', color: T.white, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
                    >
                        <span>View Your Game Stats</span>
                        <span style={{ transform: isStatsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>▼</span>
                    </button>
                    <div style={{ height: isStatsOpen ? 'auto' : 0, overflow: 'hidden', transition: 'max-height 0.3s ease-out' }}>
                        <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                            {/* Snakes Avoided */}
                            <div style={{ background: 'rgba(56, 189, 248, 0.08)', borderRadius: 10, borderLeft: '4px solid #38BDF8', padding: '12px 14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: stats.snakesAvoided.length > 0 ? 8 : 0 }}>
                                    <span style={{ color: '#E0F2FE', fontSize: 14, fontWeight: 700 }}>🛡️ Snakes Avoided</span>
                                    <span style={{ color: '#bae6fd', fontSize: 16, fontWeight: 800 }}>{stats.snakesAvoided.length}</span>
                                </div>
                                {stats.snakesAvoided.length > 0 && (
                                    <ul style={{ margin: 0, padding: '0 0 0 18px', listStyle: 'disc' }}>
                                        {stats.snakesAvoided.map((name, i) => (
                                            <li key={i} style={{ color: '#bae6fd', fontSize: 12, lineHeight: 1.7, fontWeight: 500 }}>{name}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Snakes Bitten */}
                            <div style={{ background: 'rgba(239, 68, 68, 0.08)', borderRadius: 10, borderLeft: '4px solid #EF4444', padding: '12px 14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: stats.snakesLanded.length > 0 ? 8 : 0 }}>
                                    <span style={{ color: '#FEE2E2', fontSize: 14, fontWeight: 700 }}>🐍 Snakes Bitten</span>
                                    <span style={{ color: '#fca5a5', fontSize: 16, fontWeight: 800 }}>{stats.snakesLanded.length}</span>
                                </div>
                                {stats.snakesLanded.length > 0 && (
                                    <ul style={{ margin: 0, padding: '0 0 0 18px', listStyle: 'disc' }}>
                                        {stats.snakesLanded.map((name, i) => (
                                            <li key={i} style={{ color: '#fca5a5', fontSize: 12, lineHeight: 1.7, fontWeight: 500 }}>{name}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Ladders Climbed */}
                            <div style={{ background: 'rgba(245, 158, 11, 0.08)', borderRadius: 10, borderLeft: '4px solid #F59E0B', padding: '12px 14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: stats.laddersClimbed.length > 0 ? 8 : 0 }}>
                                    <span style={{ color: '#FEF3C7', fontSize: 14, fontWeight: 700 }}>🪜 Ladders Climbed</span>
                                    <span style={{ color: '#fde68a', fontSize: 16, fontWeight: 800 }}>{stats.laddersClimbed.length}</span>
                                </div>
                                {stats.laddersClimbed.length > 0 && (
                                    <ul style={{ margin: 0, padding: '0 0 0 18px', listStyle: 'disc' }}>
                                        {stats.laddersClimbed.map((name, i) => (
                                            <li key={i} style={{ color: '#fde68a', fontSize: 12, lineHeight: 1.7, fontWeight: 500 }}>{name}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Buttons Area */}
            <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* New Share Button replacing original CTA */}
                <button onClick={handleShare} style={{
                    width: '100%', padding: '15px 24px',
                    background: 'linear-gradient(135deg, #FF6600 0%, #E65C00 100%)',
                    color: '#fff', fontSize: 16, fontWeight: 800,
                    borderRadius: '999px', border: 'none', cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(255,102,0,0.3)',
                }}>
                    Share
                </button>

                {/* Subtext */}
                <p style={{ fontSize: 15, color: T.white, textAlign: 'center', margin: '4px 0 8px', lineHeight: 1.5, fontWeight: 600 }}>
                    {hasShield
                        ? "Just like in the game, the right protection can shield your family from life's uncertainties"
                        : "Don't leave your family's future to luck - secure it with the right life cover"}
                </p>

                {/* Call Now Button */}
                <button onClick={() => window.location.href = 'tel:18001234567'} style={{
                    width: '100%', padding: '15px 24px',
                    background: '#b8c2d1', // silver/light gray
                    color: '#1A2340', fontSize: 16, fontWeight: 800,
                    borderRadius: '999px', border: 'none', cursor: 'pointer',
                }}>
                    Call Now
                </button>

                {/* Book a Slot Button */}
                <button onClick={() => setShowBookingModal(true)} style={{
                    width: '100%', padding: '15px 24px',
                    background: '#1942b3', // dark blue
                    color: '#fff', fontSize: 15, fontWeight: 800,
                    borderRadius: '999px', border: 'none', cursor: 'pointer',
                }}>
                    Book a Slot
                </button>

                {/* Play Again text link */}
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <button onClick={onPlayAgain} style={{
                        background: 'none', border: 'none', color: '#fff',
                        fontSize: 14, fontWeight: 700, cursor: 'pointer',
                        textDecoration: 'none'
                    }}>
                        Play Again
                    </button>
                </div>
            </div>

            {showBookingModal && (
                <LeadModal
                    isBooking
                    defaultValues={{ name: playerName, mobile: playerMobile }}
                    onClose={() => setShowBookingModal(false)}
                    onSubmit={(data) => {
                        console.log("Booking submitted with data:", data);
                        setShowBookingModal(false);
                        if (onBookingSubmit) {
                            onBookingSubmit(data);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default EndScreen;
