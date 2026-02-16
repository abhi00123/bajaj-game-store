import { Star } from "lucide-react";

export default function ScoreShield({ score }) {
    // 1. Ensure score is a number (not string)
    const numericScore = Number(score);

    // 2. Safety Check: Clamp score between 0 and 5
    // Default to 0 if score is invalid (NaN)
    const safeScore = Math.min(5, Math.max(0, isNaN(numericScore) ? 0 : numericScore));

    // Dynamic Glow Color based on score logic
    let glowColor = "rgba(255, 70, 70, 0.25)"; // 1-2 (Red)
    if (safeScore === 3) glowColor = "rgba(255, 165, 0, 0.25)"; // 3 (Amber)
    if (safeScore >= 4) glowColor = "rgba(0, 200, 100, 0.25)"; // 4-5 (Green)

    return (
        <div className="relative w-48 h-56 flex flex-col items-center justify-center">
            <svg
                viewBox="0 0 100 120"
                className="absolute inset-0 w-full h-full"
                style={{
                    filter: `drop-shadow(0 4px 6px rgba(0,0,0,0.25)) drop-shadow(0 0 15px ${glowColor})`,
                    overflow: 'visible'
                }}
            >
                <defs>
                    <linearGradient id="shieldBorder" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FF9A00" />
                        <stop offset="100%" stopColor="#FF6A00" />
                    </linearGradient>
                    <linearGradient id="shieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1E3A8A" />
                        <stop offset="100%" stopColor="#0F2A5F" />
                    </linearGradient>
                </defs>
                <path
                    d="M50 5 L95 25 V55 C95 85 50 115 50 115 C50 115 5 85 5 55 V25 L50 5 Z"
                    fill="url(#shieldBg)"
                    stroke="url(#shieldBorder)"
                    strokeWidth="3"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-2 gap-3 transform -translate-y-2">
                <div className="flex items-baseline text-white font-bold leading-none">
                    <span className="text-6xl tracking-tight">{safeScore}</span>
                    <span className="text-3xl opacity-90 ml-1">/5</span>
                </div>

                <div className="flex items-center gap-1.5">
                    {/* Dynamic Star Rendering */}
                    {[...Array(5)].map((_, index) => {
                        // Logic: If index < score, render filled star. Else render empty star.
                        // index is 0, 1, 2, 3, 4
                        // if score is 3:
                        // 0 < 3 (Filled)
                        // 1 < 3 (Filled)
                        // 2 < 3 (Filled)
                        // 3 < 3 (Empty)
                        // 4 < 3 (Empty)
                        const isFilled = index < safeScore;

                        return (
                            <Star
                                key={index}
                                size={18}
                                fill={isFilled ? "#FFB800" : "rgba(255,255,255,0.25)"}
                                stroke="none"
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
